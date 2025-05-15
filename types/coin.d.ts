interface CreateCoinArgs {
    name: string;             // The name of the coin (e.g., "My Awesome Coin")
    symbol: string;           // The trading symbol for the coin (e.g., "MAC")
    uri: string;              // Metadata URI (an IPFS URI is recommended)
    owners?: Address[];       // Optional array of owner addresses, defaults to [payoutRecipient]
    tickLower?: number;       // Optional tick lower for Uniswap V3 pool, defaults to -199200
    payoutRecipient: Address; // Address that receives creator earnings
    platformReferrer?: Address; // Optional platform referrer address, earns referral fees
    initialPurchaseWei?: bigint; // Optional initial purchase amount in wei
  }