import { z } from "zod";

/**
 * Wallet schema for CDP SDK integration
 * Stores wallet addresses associated with user accounts
 */
export const walletAddressSchema = z.object({
  id: z.string(),              // Unique identifier for this wallet record
  userId: z.string(),          // Firebase user ID
  address: z.string(),         // EVM wallet address (0x...)
  network: z.string(),         // Blockchain network (e.g., "base-sepolia")
  createdAt: z.date(),         // When the wallet was created
  lastUsedAt: z.date().optional(),  // Last time this wallet was used
  isActive: z.boolean().default(true),  // Whether this wallet is active
  metadata: z.record(z.string(), z.any()).optional()  // Additional metadata
});

// Type definition derived from schema
export type WalletAddress = z.infer<typeof walletAddressSchema>;

/**
 * Transaction schema for tracking user transactions
 */
export const transactionSchema = z.object({
  id: z.string(),              // Unique identifier for this transaction
  userId: z.string(),          // Firebase user ID
  walletId: z.string(),        // ID of the wallet used
  transactionHash: z.string(), // Blockchain transaction hash
  amount: z.string(),          // Transaction amount (as string to preserve precision)
  token: z.string(),           // Token symbol (e.g., "eth", "usdc")
  type: z.enum(["payment", "receipt", "mint", "other"]),  // Transaction type
  status: z.enum(["pending", "confirmed", "failed"]),     // Transaction status
  timestamp: z.date(),         // When the transaction was initiated
  confirmationTime: z.date().optional(),  // When the transaction was confirmed
  metadata: z.record(z.string(), z.any()).optional()  // Additional metadata
});

// Type definition derived from schema
export type Transaction = z.infer<typeof transactionSchema>;
