/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/chit_fund_platform.json`.
 */
export type ChitFundPlatform = {
  "address": "7AEt2evGVZxnPxKHp2Nb5dNfPDPDdXJ9PexqtgdnHgF4",
  "metadata": {
    "name": "chitFundPlatform",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "disburseFunds",
      "discriminator": [
        45,
        215,
        174,
        182,
        93,
        186,
        217,
        68
      ],
      "accounts": [
        {
          "name": "chitFund",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  104,
                  105,
                  116,
                  95,
                  102,
                  117,
                  110,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "chit_fund.creator",
                "account": "chitFund"
              }
            ]
          },
          "relations": [
            "borrower"
          ]
        },
        {
          "name": "contributionVault",
          "writable": true
        },
        {
          "name": "borrowerTokenAccount",
          "writable": true
        },
        {
          "name": "borrower",
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": []
    },
    {
      "name": "emergencyRequest",
      "discriminator": [
        57,
        164,
        95,
        109,
        43,
        117,
        155,
        117
      ],
      "accounts": [
        {
          "name": "chitFund",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  104,
                  105,
                  116,
                  95,
                  102,
                  117,
                  110,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "chit_fund.creator",
                "account": "chitFund"
              }
            ]
          },
          "relations": [
            "participant"
          ]
        },
        {
          "name": "participant",
          "writable": true
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "participantTokenAccount",
          "writable": true
        },
        {
          "name": "contributionVault",
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": []
    },
    {
      "name": "initializeChitFund",
      "discriminator": [
        139,
        11,
        202,
        47,
        72,
        140,
        116,
        156
      ],
      "accounts": [
        {
          "name": "chitFund",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  104,
                  105,
                  116,
                  95,
                  102,
                  117,
                  110,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "creator"
              }
            ]
          }
        },
        {
          "name": "creator",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "usdcMint",
          "address": "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
        }
      ],
      "args": [
        {
          "name": "contributionAmount",
          "type": "u64"
        },
        {
          "name": "cycleDuration",
          "type": "i64"
        },
        {
          "name": "totalCycles",
          "type": "u64"
        },
        {
          "name": "collateralRequirement",
          "type": "u64"
        },
        {
          "name": "maxParticipants",
          "type": "u8"
        },
        {
          "name": "disbursementSchedule",
          "type": {
            "vec": "u64"
          }
        }
      ]
    },
    {
      "name": "joinChitFund",
      "discriminator": [
        213,
        43,
        139,
        99,
        65,
        251,
        177,
        6
      ],
      "accounts": [
        {
          "name": "chitFund",
          "writable": true
        },
        {
          "name": "participant",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  97,
                  114,
                  116,
                  105,
                  99,
                  105,
                  112,
                  97,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "chitFund"
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "userTokenAccount",
          "writable": true
        },
        {
          "name": "collateralVault",
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "usdcMint",
          "address": "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
        }
      ],
      "args": []
    },
    {
      "name": "makeContribution",
      "discriminator": [
        2,
        33,
        6,
        104,
        211,
        177,
        128,
        109
      ],
      "accounts": [
        {
          "name": "chitFund",
          "writable": true,
          "relations": [
            "participant"
          ]
        },
        {
          "name": "participant",
          "writable": true
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "userTokenAccount",
          "writable": true
        },
        {
          "name": "contributionVault",
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": []
    },
    {
      "name": "setCurrentCycle",
      "discriminator": [
        160,
        60,
        245,
        227,
        19,
        234,
        114,
        128
      ],
      "accounts": [
        {
          "name": "chitFund",
          "writable": true
        },
        {
          "name": "authority",
          "signer": true
        }
      ],
      "args": [
        {
          "name": "newCycle",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdrawCollateral",
      "discriminator": [
        115,
        135,
        168,
        106,
        139,
        214,
        138,
        150
      ],
      "accounts": [
        {
          "name": "chitFund",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  104,
                  105,
                  116,
                  95,
                  102,
                  117,
                  110,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "chit_fund.creator",
                "account": "chitFund"
              }
            ]
          },
          "relations": [
            "participant"
          ]
        },
        {
          "name": "participant",
          "writable": true
        },
        {
          "name": "participantTokenAccount",
          "writable": true
        },
        {
          "name": "collateralVault",
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "chitFund",
      "discriminator": [
        76,
        35,
        196,
        131,
        178,
        61,
        223,
        197
      ]
    },
    {
      "name": "participant",
      "discriminator": [
        32,
        142,
        108,
        79,
        247,
        179,
        54,
        6
      ]
    }
  ],
  "events": [
    {
      "name": "chitFundInitialized",
      "discriminator": [
        221,
        201,
        235,
        227,
        234,
        194,
        211,
        168
      ]
    },
    {
      "name": "collateralWithdrawn",
      "discriminator": [
        51,
        224,
        133,
        106,
        74,
        173,
        72,
        82
      ]
    },
    {
      "name": "contributionMade",
      "discriminator": [
        81,
        218,
        72,
        109,
        93,
        96,
        131,
        199
      ]
    },
    {
      "name": "emergencyFundsDisbursed",
      "discriminator": [
        238,
        122,
        121,
        243,
        210,
        189,
        121,
        85
      ]
    },
    {
      "name": "fundsDisbursed",
      "discriminator": [
        96,
        15,
        142,
        196,
        147,
        229,
        222,
        54
      ]
    },
    {
      "name": "participantJoined",
      "discriminator": [
        48,
        182,
        206,
        15,
        56,
        181,
        24,
        253
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "maxParticipantsReached",
      "msg": "Maximum number of participants reached."
    },
    {
      "code": 6001,
      "name": "insufficientCollateral",
      "msg": "Insufficient collateral provided."
    },
    {
      "code": 6002,
      "name": "contributionAlreadyMade",
      "msg": "Contribution for this cycle has already been made."
    },
    {
      "code": 6003,
      "name": "pendingContributions",
      "msg": "Not all participants have made their contributions."
    },
    {
      "code": 6004,
      "name": "participantNotFound",
      "msg": "Participant not found."
    },
    {
      "code": 6005,
      "name": "invalidBorrowerAccount",
      "msg": "Invalid borrower account."
    },
    {
      "code": 6006,
      "name": "chitFundInactive",
      "msg": "The chit fund is not active."
    },
    {
      "code": 6007,
      "name": "chitFundActive",
      "msg": "The chit fund is still active."
    },
    {
      "code": 6008,
      "name": "cycleNotComplete",
      "msg": "The cycle is not yet complete."
    },
    {
      "code": 6009,
      "name": "invalidCollateralMint",
      "msg": "Invalid Collateral Mint."
    },
    {
      "code": 6010,
      "name": "invalidCollateralVaultOwner",
      "msg": "Invalid Collateral Vault Owner."
    },
    {
      "code": 6011,
      "name": "invalidContributionMint",
      "msg": "Invalid Contribution Mint."
    },
    {
      "code": 6012,
      "name": "invalidContributionVaultOwner",
      "msg": "Invalid Contribution Vault Owner."
    },
    {
      "code": 6013,
      "name": "exceedsMaximumCycles",
      "msg": "Exceeds the maximum number of cycles."
    },
    {
      "code": 6014,
      "name": "invalidCycle",
      "msg": "Invalid cycle for disbursement."
    },
    {
      "code": 6015,
      "name": "alreadyBorrowed",
      "msg": "Participant has already borrowed."
    },
    {
      "code": 6016,
      "name": "unauthorized",
      "msg": "Unauthorized access."
    },
    {
      "code": 6017,
      "name": "invalidDisbursementSchedule",
      "msg": "Invalid disbursement schedule."
    },
    {
      "code": 6018,
      "name": "exceedsMaximumParticipants",
      "msg": "Exceeds the maximum number of participants allowed."
    }
  ],
  "types": [
    {
      "name": "chitFund",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "contributionAmount",
            "type": "u64"
          },
          {
            "name": "cycleDuration",
            "type": "i64"
          },
          {
            "name": "totalCycles",
            "type": "u64"
          },
          {
            "name": "collateralRequirement",
            "type": "u64"
          },
          {
            "name": "currentCycle",
            "type": "u64"
          },
          {
            "name": "maxParticipants",
            "type": "u8"
          },
          {
            "name": "isActive",
            "type": "bool"
          },
          {
            "name": "participants",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "lastDisbursementTime",
            "type": "i64"
          },
          {
            "name": "disbursementSchedule",
            "type": {
              "vec": "u64"
            }
          }
        ]
      }
    },
    {
      "name": "chitFundInitialized",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "chitFund",
            "type": "pubkey"
          },
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "contributionAmount",
            "type": "u64"
          },
          {
            "name": "totalCycles",
            "type": "u64"
          },
          {
            "name": "maxParticipants",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "collateralWithdrawn",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "chitFund",
            "type": "pubkey"
          },
          {
            "name": "participant",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "contributionMade",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "chitFund",
            "type": "pubkey"
          },
          {
            "name": "participant",
            "type": "pubkey"
          },
          {
            "name": "cycle",
            "type": "u64"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "emergencyFundsDisbursed",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "chitFund",
            "type": "pubkey"
          },
          {
            "name": "participant",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "cycle",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "fundsDisbursed",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "chitFund",
            "type": "pubkey"
          },
          {
            "name": "borrower",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "cycle",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "participant",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "wallet",
            "type": "pubkey"
          },
          {
            "name": "chitFund",
            "type": "pubkey"
          },
          {
            "name": "hasBorrowed",
            "type": "bool"
          },
          {
            "name": "contributions",
            "type": {
              "vec": "bool"
            }
          }
        ]
      }
    },
    {
      "name": "participantJoined",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "chitFund",
            "type": "pubkey"
          },
          {
            "name": "participant",
            "type": "pubkey"
          },
          {
            "name": "wallet",
            "type": "pubkey"
          }
        ]
      }
    }
  ]
};
