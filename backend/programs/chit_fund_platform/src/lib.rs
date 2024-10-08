    use anchor_lang::prelude::*;
    use anchor_spl::token::{self, Token, Transfer};
    use spl_token::state::Account as SplTokenAccount;
    use anchor_lang::solana_program::program_pack::Pack;
    use std::hash::{Hash, Hasher};
    use std::collections::hash_map::DefaultHasher;

    declare_id!("7AEt2evGVZxnPxKHp2Nb5dNfPDPDdXJ9PexqtgdnHgF4");

    const MAX_PARTICIPANTS: usize = 100;
    const MAX_CYCLES: usize = 12;

    // USDC Mint Address on Solana (Mainnet)
    pub const USDC_MINT: Pubkey = pubkey!("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");

    #[program]
    pub mod chit_fund_platform {
        use super::*;

        pub fn initialize_chit_fund(
            ctx: Context<InitializeChitFund>,
            contribution_amount: u64,
            cycle_duration: i64,
            total_cycles: u64,
            collateral_requirement: u64,
            max_participants: u8,
            disbursement_schedule: Vec<u64>,
        ) -> Result<()> {
            require!(
                total_cycles as usize <= MAX_CYCLES,
                ChitFundError::ExceedsMaximumCycles
            );
            require!(
                disbursement_schedule.len() == total_cycles as usize,
                ChitFundError::InvalidDisbursementSchedule
            );
            require!(
                max_participants as usize <= MAX_PARTICIPANTS,
                ChitFundError::ExceedsMaximumParticipants
            );

            let chit_fund = &mut ctx.accounts.chit_fund;
            chit_fund.creator = ctx.accounts.creator.key();
            chit_fund.contribution_amount = contribution_amount;
            chit_fund.cycle_duration = cycle_duration;
            chit_fund.total_cycles = total_cycles;
            chit_fund.collateral_requirement = collateral_requirement;
            chit_fund.max_participants = max_participants;
            chit_fund.current_cycle = 0;
            chit_fund.is_active = true;
            chit_fund.participants = Vec::new();
            chit_fund.last_disbursement_time = Clock::get()?.unix_timestamp;
            chit_fund.disbursement_schedule = disbursement_schedule;

            emit!(ChitFundInitialized {
                chit_fund: chit_fund.key(),
                creator: chit_fund.creator,
                contribution_amount,
                total_cycles,
                max_participants,
            });

            Ok(())
        }

        pub fn join_chit_fund(ctx: Context<JoinChitFund>) -> Result<()> {
            let chit_fund = &mut ctx.accounts.chit_fund;
            let participant = &mut ctx.accounts.participant;

            require!(
                chit_fund.is_active,
                ChitFundError::ChitFundInactive
            );

            require!(
                chit_fund.participants.len() < chit_fund.max_participants as usize,
                ChitFundError::MaxParticipantsReached
            );

            participant.wallet = ctx.accounts.user.key();
            participant.chit_fund = chit_fund.key();
            participant.has_borrowed = false;
            participant.contributions = vec![false; chit_fund.total_cycles as usize];

            chit_fund.participants.push(ctx.accounts.user.key());

            // Verify the token account is using USDC mint
            let user_token_account = SplTokenAccount::unpack(&ctx.accounts.user_token_account.try_borrow_data()?)?;
            require!(
                user_token_account.mint == USDC_MINT,
                ChitFundError::InvalidContributionMint
            );

            // Transfer USDC collateral from user to the collateral vault
            let cpi_accounts = Transfer {
                from: ctx.accounts.user_token_account.to_account_info(),
                to: ctx.accounts.collateral_vault.to_account_info(),
                authority: ctx.accounts.user.to_account_info(),
            };
            let cpi_program = ctx.accounts.token_program.to_account_info();
            let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

            token::transfer(cpi_ctx, chit_fund.collateral_requirement)?;

            emit!(ParticipantJoined {
                chit_fund: chit_fund.key(),
                participant: participant.key(),
                wallet: participant.wallet,
            });

            Ok(())
        }

        pub fn make_contribution(ctx: Context<MakeContribution>) -> Result<()> {
            let chit_fund = &ctx.accounts.chit_fund;
            let participant = &mut ctx.accounts.participant;

            require!(
                chit_fund.is_active,
                ChitFundError::ChitFundInactive
            );

            require!(
                !participant.contributions[chit_fund.current_cycle as usize],
                ChitFundError::ContributionAlreadyMade
            );

            participant.contributions[chit_fund.current_cycle as usize] = true;

            // Transfer USDC contribution from user to the contribution vault
            let cpi_accounts = Transfer {
                from: ctx.accounts.user_token_account.to_account_info(),
                to: ctx.accounts.contribution_vault.to_account_info(),
                authority: ctx.accounts.user.to_account_info(),
            };
            let cpi_program = ctx.accounts.token_program.to_account_info();
            let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

            token::transfer(cpi_ctx, chit_fund.contribution_amount)?;

            emit!(ContributionMade {
                chit_fund: chit_fund.key(),
                participant: participant.key(),
                cycle: chit_fund.current_cycle,
                amount: chit_fund.contribution_amount,
            });

            Ok(())
        }

        pub fn disburse_funds(ctx: Context<DisburseFunds>) -> Result<()> {
            let chit_fund = &ctx.accounts.chit_fund;
            let borrower = &ctx.accounts.borrower;

            require!(
                chit_fund.is_active,
                ChitFundError::ChitFundInactive
            );

            let current_time = Clock::get()?.unix_timestamp;
            require!(
                current_time >= chit_fund.last_disbursement_time + chit_fund.cycle_duration,
                ChitFundError::CycleNotComplete
            );

            // Select a random borrower
            let random_seed = current_time.to_le_bytes();
            let participant_count = chit_fund.participants.len();
            require!(participant_count > 0, ChitFundError::ParticipantNotFound);
            let selected_borrower_index = select_random_borrower(&random_seed, participant_count);
            let selected_borrower_pubkey = chit_fund.participants[selected_borrower_index];

            // Verify that the provided borrower account matches the randomly selected one
            require!(
                borrower.wallet == selected_borrower_pubkey,
                ChitFundError::InvalidBorrowerAccount
            );

            require!(
                !borrower.has_borrowed,
                ChitFundError::AlreadyBorrowed
            );

            let disbursement_amount = chit_fund.disbursement_schedule
                .get(chit_fund.current_cycle as usize)
                .copied()
                .ok_or(ChitFundError::InvalidCycle)?;

            let seeds = &[
                b"chit_fund",
                chit_fund.creator.as_ref(),
                &[ctx.bumps.chit_fund],
            ];
            let signer = &[&seeds[..]];

            let cpi_accounts = Transfer {
                from: ctx.accounts.contribution_vault.to_account_info(),
                to: ctx.accounts.borrower_token_account.to_account_info(),
                authority: ctx.accounts.chit_fund.to_account_info(),
            };
            let cpi_program = ctx.accounts.token_program.to_account_info();
            let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);

            token::transfer(cpi_ctx, disbursement_amount)?;

            let chit_fund = &mut ctx.accounts.chit_fund;
            let borrower = &mut ctx.accounts.borrower;

            chit_fund.current_cycle += 1;
            chit_fund.last_disbursement_time = current_time;
            borrower.has_borrowed = true;

            if chit_fund.current_cycle == chit_fund.total_cycles {
                chit_fund.is_active = false;
            }

            emit!(FundsDisbursed {
                chit_fund: chit_fund.key(),
                borrower: borrower.key(),
                amount: disbursement_amount,
                cycle: chit_fund.current_cycle - 1,
            });

            Ok(())
        }

        pub fn emergency_request(ctx: Context<EmergencyRequest>) -> Result<()> {
            let chit_fund = &ctx.accounts.chit_fund;
            let participant = &ctx.accounts.participant;

            require!(
                chit_fund.is_active,
                ChitFundError::ChitFundInactive
            );

            require!(
                participant.contributions[chit_fund.current_cycle as usize],
                ChitFundError::PendingContributions
            );

            require!(
                !participant.has_borrowed,
                ChitFundError::AlreadyBorrowed
            );

            let disbursement_amount = chit_fund.disbursement_schedule
                .get(chit_fund.current_cycle as usize)
                .copied()
                .ok_or(ChitFundError::InvalidCycle)?;

            let seeds = &[
                b"chit_fund",
                chit_fund.creator.as_ref(),
                &[ctx.bumps.chit_fund],
            ];
            let signer = &[&seeds[..]];

            let cpi_accounts = Transfer {
                from: ctx.accounts.contribution_vault.to_account_info(),
                to: ctx.accounts.participant_token_account.to_account_info(),
                authority: ctx.accounts.chit_fund.to_account_info(),
            };
            let cpi_program = ctx.accounts.token_program.to_account_info();
            let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);

            token::transfer(cpi_ctx, disbursement_amount)?;

            let chit_fund = &mut ctx.accounts.chit_fund;
            let participant = &mut ctx.accounts.participant;

            chit_fund.current_cycle += 1;
            chit_fund.last_disbursement_time = Clock::get()?.unix_timestamp;
            participant.has_borrowed = true;

            if chit_fund.current_cycle == chit_fund.total_cycles {
                chit_fund.is_active = false;
            }

            emit!(EmergencyFundsDisbursed {
                chit_fund: chit_fund.key(),
                participant: participant.key(),
                amount: disbursement_amount,
                cycle: chit_fund.current_cycle - 1,
            });

            Ok(())
        }

        pub fn withdraw_collateral(ctx: Context<WithdrawCollateral>) -> Result<()> {
            let chit_fund = &ctx.accounts.chit_fund;

            require!(
                !chit_fund.is_active,
                ChitFundError::ChitFundActive
            );

            let seeds = &[
                b"chit_fund",
                chit_fund.creator.as_ref(),
                &[ctx.bumps.chit_fund],
            ];
            let signer = &[&seeds[..]];

            let cpi_accounts = Transfer {
                from: ctx.accounts.collateral_vault.to_account_info(),
                to: ctx.accounts.participant_token_account.to_account_info(),
                authority: chit_fund.to_account_info(),
            };
            let cpi_program = ctx.accounts.token_program.to_account_info();
            let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);

            token::transfer(cpi_ctx, chit_fund.collateral_requirement)?;

            emit!(CollateralWithdrawn {
                chit_fund: chit_fund.key(),
                participant: ctx.accounts.participant.key(),
                amount: chit_fund.collateral_requirement,
            });

            Ok(())
        }

        pub fn set_current_cycle(ctx: Context<SetCurrentCycle>, new_cycle: u64) -> Result<()> {
            require!(
                ctx.accounts.authority.key() == ctx.accounts.chit_fund.creator,
                ChitFundError::Unauthorized
            );
            ctx.accounts.chit_fund.current_cycle = new_cycle;
            Ok(())
        }
    }

    // Helper function to select a random borrower
    pub fn select_random_borrower(seed: &[u8], participant_count: usize) -> usize {
        let mut hasher = DefaultHasher::new();
        seed.hash(&mut hasher);
        let random_value = hasher.finish();
        if participant_count == 0 {
            0 // Avoid division by zero
        } else {
            (random_value as usize) % participant_count
        }
    }

    #[derive(Accounts)]
    #[instruction(
        contribution_amount: u64,
        cycle_duration: i64,
        total_cycles: u64,
        collateral_requirement: u64,
        max_participants: u8,
        disbursement_schedule: Vec<u64>
    )]
    pub struct InitializeChitFund<'info> {
        #[account(
            init,
            payer = creator,
            space = ChitFund::space(total_cycles as usize),
            seeds = [b"chit_fund", creator.key().as_ref()],
            bump
        )]
        pub chit_fund: Account<'info, ChitFund>,

        #[account(mut)]
        pub creator: Signer<'info>,

        pub system_program: Program<'info, System>,
        pub token_program: Program<'info, Token>,

        /// CHECK: This is safe because we check the address
        #[account(address = USDC_MINT)]
        pub usdc_mint: AccountInfo<'info>,
    }

    #[derive(Accounts)]
    pub struct JoinChitFund<'info> {
        #[account(mut)]
        pub chit_fund: Account<'info, ChitFund>,

        #[account(
            init,
            payer = user,
            space = Participant::space(&chit_fund),
            seeds = [b"participant", chit_fund.key().as_ref(), user.key().as_ref()],
            bump
        )]
        pub participant: Account<'info, Participant>,

        #[account(mut)]
        pub user: Signer<'info>,

        /// CHECK: We manually verify the token account
        #[account(mut)]
        pub user_token_account: AccountInfo<'info>,

        /// CHECK: We manually verify the token account
        #[account(mut)]
        pub collateral_vault: AccountInfo<'info>,

        pub token_program: Program<'info, Token>,
        pub system_program: Program<'info, System>,

        /// CHECK: This is safe because we check the address
        #[account(address = USDC_MINT)]
        pub usdc_mint: AccountInfo<'info>,
    }

    #[derive(Accounts)]
    pub struct MakeContribution<'info> {
        #[account(mut)]
        pub chit_fund: Account<'info, ChitFund>,

        #[account(mut, has_one = chit_fund)]
        pub participant: Account<'info, Participant>,

        #[account(mut)]
        pub user: Signer<'info>,

        /// CHECK: We manually verify the token account
        #[account(mut)]
        pub user_token_account: AccountInfo<'info>,

        /// CHECK: We manually verify the token account
        #[account(mut)]
        pub contribution_vault: AccountInfo<'info>,

        pub token_program: Program<'info, Token>,
    }

    #[derive(Accounts)]
    pub struct DisburseFunds<'info> {
        #[account(
            mut,
            seeds = [b"chit_fund", chit_fund.creator.as_ref()],
            bump
        )]
        pub chit_fund: Account<'info, ChitFund>,

        /// CHECK: We manually verify the token account
        #[account(mut)]
        pub contribution_vault: AccountInfo<'info>,

        /// CHECK: We manually verify the token account
        #[account(mut)]
        pub borrower_token_account: AccountInfo<'info>,

        #[account(mut, has_one = chit_fund)]
        pub borrower: Account<'info, Participant>,

        pub token_program: Program<'info, Token>,
    }

    #[derive(Accounts)]
    pub struct EmergencyRequest<'info> {
        #[account(
            mut,
            seeds = [b"chit_fund", chit_fund.creator.as_ref()],
            bump
        )]
        pub chit_fund: Account<'info, ChitFund>,

        #[account(mut, has_one = chit_fund)]
        pub participant: Account<'info, Participant>,

        #[account(mut)]
        pub user: Signer<'info>,

        /// CHECK: We manually verify the token account
        #[account(mut)]
        pub participant_token_account: AccountInfo<'info>,

        /// CHECK: We manually verify the token account
        #[account(mut)]
        pub contribution_vault: AccountInfo<'info>,

        pub token_program: Program<'info, Token>,
    }

    #[derive(Accounts)]
    pub struct WithdrawCollateral<'info> {
        #[account(
            mut,
            seeds = [b"chit_fund", chit_fund.creator.as_ref()],
            bump
        )]
        pub chit_fund: Account<'info, ChitFund>,

        #[account(mut, has_one = chit_fund)]
        pub participant: Account<'info, Participant>,

        /// CHECK: We manually verify the token account
        #[account(mut)]
        pub participant_token_account: AccountInfo<'info>,

        /// CHECK: We manually verify the token account
        #[account(mut)]
        pub collateral_vault: AccountInfo<'info>,

        pub token_program: Program<'info, Token>,
    }

    #[derive(Accounts)]
    pub struct SetCurrentCycle<'info> {
        #[account(mut)]
        pub chit_fund: Account<'info, ChitFund>,
        pub authority: Signer<'info>,
    }

    #[account]
    pub struct ChitFund {
        pub creator: Pubkey,
        pub contribution_amount: u64,
        pub cycle_duration: i64,
        pub total_cycles: u64,
        pub collateral_requirement: u64,
        pub current_cycle: u64,
        pub max_participants: u8,
        pub is_active: bool,
        pub participants: Vec<Pubkey>,
        pub last_disbursement_time: i64,
        pub disbursement_schedule: Vec<u64>,
    }

    impl ChitFund {
        pub fn space(total_cycles: usize) -> usize {
            8 + // discriminator
            32 + // creator
            8 + // contribution_amount
            8 + // cycle_duration
            8 + // total_cycles
            8 + // collateral_requirement
            8 + // current_cycle
            1 + // max_participants
            1 + // is_active
            4 + (MAX_PARTICIPANTS * 32) + // participants Vec
            8 + // last_disbursement_time
            4 + (total_cycles * 8) // disbursement_schedule Vec
        }
    }

    #[account]
    pub struct Participant {
        pub wallet: Pubkey,
        pub chit_fund: Pubkey,
        pub has_borrowed: bool,
        pub contributions: Vec<bool>,
    }

    impl Participant {
        pub fn space(chit_fund: &Account<ChitFund>) -> usize {
            8 + // discriminator
            32 + // wallet
            32 + // chit_fund
            1 + // has_borrowed
            4 + chit_fund.total_cycles as usize // contributions Vec
        }
    }

    #[error_code]
    pub enum ChitFundError {
        #[msg("Maximum number of participants reached.")]
        MaxParticipantsReached,
        #[msg("Insufficient collateral provided.")]
        InsufficientCollateral,
        #[msg("Contribution for this cycle has already been made.")]
        ContributionAlreadyMade,
        #[msg("Not all participants have made their contributions.")]
        PendingContributions,
        #[msg("Participant not found.")]
        ParticipantNotFound,
        #[msg("Invalid borrower account.")]
        InvalidBorrowerAccount,
        #[msg("The chit fund is not active.")]
        ChitFundInactive,
        #[msg("The chit fund is still active.")]
        ChitFundActive,
        #[msg("The cycle is not yet complete.")]
        CycleNotComplete,
        #[msg("Invalid Collateral Mint.")]
        InvalidCollateralMint,
        #[msg("Invalid Collateral Vault Owner.")]
        InvalidCollateralVaultOwner,
        #[msg("Invalid Contribution Mint.")]
        InvalidContributionMint,
        #[msg("Invalid Contribution Vault Owner.")]
        InvalidContributionVaultOwner,
        #[msg("Exceeds the maximum number of cycles.")]
        ExceedsMaximumCycles,
        #[msg("Invalid cycle for disbursement.")]
        InvalidCycle,
        #[msg("Participant has already borrowed.")]
        AlreadyBorrowed,
        #[msg("Unauthorized access.")]
        Unauthorized,
        #[msg("Invalid disbursement schedule.")]
        InvalidDisbursementSchedule,
        #[msg("Exceeds the maximum number of participants allowed.")]
        ExceedsMaximumParticipants,
    }

    #[event]
    pub struct ChitFundInitialized {
        pub chit_fund: Pubkey,
        pub creator: Pubkey,
        pub contribution_amount: u64,
        pub total_cycles: u64,
        pub max_participants: u8,
    }

    #[event]
    pub struct ParticipantJoined {
        pub chit_fund: Pubkey,
        pub participant: Pubkey,
        pub wallet: Pubkey,
    }

    #[event]
    pub struct ContributionMade {
        pub chit_fund: Pubkey,
        pub participant: Pubkey,
        pub cycle: u64,
        pub amount: u64,
    }

    #[event]
    pub struct FundsDisbursed {
        pub chit_fund: Pubkey,
        pub borrower: Pubkey,
        pub amount: u64,
        pub cycle: u64,
    }

    #[event]
    pub struct EmergencyFundsDisbursed {
        pub chit_fund: Pubkey,
        pub participant: Pubkey,
        pub amount: u64,
        pub cycle: u64,
    }

    #[event]
    pub struct CollateralWithdrawn {
        pub chit_fund: Pubkey,
        pub participant: Pubkey,
        pub amount: u64,
    }