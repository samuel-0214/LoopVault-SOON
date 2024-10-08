import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { ChitFundPlatform } from "../target/types/chit_fund_platform";
import { expect } from "chai";
import {
  PublicKey,
  SystemProgram,
  Keypair,
  Transaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  MintLayout,
  createInitializeMintInstruction,
  getMinimumBalanceForRentExemptMint,
  getAssociatedTokenAddress,
  mintTo,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";

describe("chit_fund_platform", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.ChitFundPlatform as Program<ChitFundPlatform>;

  const walletKeypair = (provider.wallet as anchor.Wallet).payer;

  async function createMint(
    payer: Keypair,
    mintAuthority: PublicKey,
    decimals: number = 6
  ): Promise<PublicKey> {
    const mint = Keypair.generate();
    const lamports = await getMinimumBalanceForRentExemptMint(provider.connection);

    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: payer.publicKey,
        newAccountPubkey: mint.publicKey,
        space: MintLayout.span,
        lamports,
        programId: TOKEN_PROGRAM_ID,
      }),
      createInitializeMintInstruction(mint.publicKey, decimals, mintAuthority, null)
    );

    await provider.sendAndConfirm(transaction, [mint, payer]);

    return mint.publicKey;
  }

  async function createTokenAccount(
    mint: PublicKey,
    owner: PublicKey
  ): Promise<PublicKey> {
    return await getOrCreateAssociatedTokenAccount(
      provider.connection,
      walletKeypair,
      mint,
      owner
    ).then((account) => account.address);
  }

  async function mintTokens(
    mint: PublicKey,
    destination: PublicKey,
    amount: number,
    authority: Keypair
  ): Promise<void> {
    await mintTo(provider.connection, authority, mint, destination, authority.publicKey, amount);
  }

  let chitFundPDA: PublicKey;
  let chitFundBump: number;
  let contributionMint: PublicKey;
  let collateralVault: PublicKey;
  let user1: Keypair;
  let user2: Keypair;
  let user1ContributionAccount: PublicKey;
  let user2ContributionAccount: PublicKey;
  let user1CollateralAccount: PublicKey;
  let user2CollateralAccount: PublicKey;

  const TOTAL_CYCLES = 10;
  const CONTRIBUTION_AMOUNT = 1000 * 10 ** 6; // 1000 USDC with 6 decimals
  const COLLATERAL_AMOUNT = 500 * 10 ** 6; // 500 USDC with 6 decimals
  const MAX_PARTICIPANTS = 5;
  const CYCLE_DURATION = 1; // 1 second for testing
  const DISBURSEMENT_SCHEDULE = Array(TOTAL_CYCLES).fill(CONTRIBUTION_AMOUNT);

  before(async () => {
    user1 = Keypair.generate();
    user2 = Keypair.generate();

    // Airdrop SOL to users and wait for confirmation
    const airdropPromises = [user1, user2, walletKeypair].map(async (keypair) => {
      const signature = await provider.connection.requestAirdrop(
        keypair.publicKey,
        10 * LAMPORTS_PER_SOL
      );
      return provider.connection.confirmTransaction(signature);
    });
    await Promise.all(airdropPromises);

    contributionMint = await createMint(walletKeypair, walletKeypair.publicKey, 6);

    [chitFundPDA, chitFundBump] = await PublicKey.findProgramAddress(
      [Buffer.from("chit_fund"), walletKeypair.publicKey.toBuffer()],
      program.programId
    );

    collateralVault = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      walletKeypair,
      contributionMint,
      chitFundPDA,
      true
    ).then((account) => account.address);

    user1ContributionAccount = await createTokenAccount(contributionMint, user1.publicKey);
    user2ContributionAccount = await createTokenAccount(contributionMint, user2.publicKey);
    user1CollateralAccount = await createTokenAccount(contributionMint, user1.publicKey);
    user2CollateralAccount = await createTokenAccount(contributionMint, user2.publicKey);

    // Mint enough tokens for all cycles and collateral
    await mintTokens(contributionMint, user1ContributionAccount, CONTRIBUTION_AMOUNT * TOTAL_CYCLES, walletKeypair);
    await mintTokens(contributionMint, user2ContributionAccount, CONTRIBUTION_AMOUNT * TOTAL_CYCLES, walletKeypair);
    await mintTokens(contributionMint, user1CollateralAccount, COLLATERAL_AMOUNT, walletKeypair);
    await mintTokens(contributionMint, user2CollateralAccount, COLLATERAL_AMOUNT, walletKeypair);

    await program.methods
      .initializeChitFund(
        new anchor.BN(CONTRIBUTION_AMOUNT),
        new anchor.BN(CYCLE_DURATION),
        new anchor.BN(TOTAL_CYCLES),
        new anchor.BN(COLLATERAL_AMOUNT),
        MAX_PARTICIPANTS,
        DISBURSEMENT_SCHEDULE.map(amount => new anchor.BN(amount))
      )
      .accounts({
        chitFund: chitFundPDA,
        creator: walletKeypair.publicKey,
        collateralVault,
        systemProgram: SystemProgram.programId,
        usdcMint: contributionMint,
      })
      .signers([walletKeypair])
      .rpc();
  });

  it("Initializes a new Chit Fund", async () => {
    const chitFundAccount = await program.account.chitFund.fetch(chitFundPDA);
    expect(chitFundAccount.isActive).to.be.true;
    expect(chitFundAccount.collateralRequirement.toNumber()).to.equal(COLLATERAL_AMOUNT);
    expect(chitFundAccount.contributionAmount.toNumber()).to.equal(CONTRIBUTION_AMOUNT);
    expect(chitFundAccount.cycleDuration.toNumber()).to.equal(CYCLE_DURATION);
    expect(chitFundAccount.totalCycles.toNumber()).to.equal(TOTAL_CYCLES);
    expect(chitFundAccount.maxParticipants).to.equal(MAX_PARTICIPANTS);
    expect(chitFundAccount.currentCycle.toNumber()).to.equal(0);
    expect(chitFundAccount.participants).to.be.empty;
    expect(chitFundAccount.disbursementSchedule).to.have.lengthOf(TOTAL_CYCLES);
  });

  it("User1 joins the Chit Fund", async () => {
    const [participantPDA] = await PublicKey.findProgramAddress(
      [Buffer.from("participant"), chitFundPDA.toBuffer(), user1.publicKey.toBuffer()],
      program.programId
    );

    await program.methods
      .joinChitFund()
      .accounts({
        chitFund: chitFundPDA,
        participant: participantPDA,
        user: user1.publicKey,
        userTokenAccount: user1CollateralAccount,
        collateralVault,
        systemProgram: SystemProgram.programId,
        usdcMint: contributionMint,
      })
      .signers([user1])
      .rpc();

    const chitFundAccount = await program.account.chitFund.fetch(chitFundPDA);
    expect(chitFundAccount.participants).to.have.lengthOf(1);
    expect(chitFundAccount.participants[0].toBase58()).to.equal(user1.publicKey.toBase58());
  });

  it("User1 makes a contribution", async () => {
    const [participantPDA] = await PublicKey.findProgramAddress(
      [Buffer.from("participant"), chitFundPDA.toBuffer(), user1.publicKey.toBuffer()],
      program.programId
    );

    await program.methods
      .makeContribution()
      .accounts({
        chitFund: chitFundPDA,
        participant: participantPDA,
        user: user1.publicKey,
        userTokenAccount: user1ContributionAccount,
        contributionVault: collateralVault,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([user1])
      .rpc();

    const participantAccount = await program.account.participant.fetch(participantPDA);
    expect(participantAccount.contributions[0]).to.be.true;
  });
});