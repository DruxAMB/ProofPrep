import { CdpClient, EvmServerAccount } from "@coinbase/cdp-sdk";
import { getWalletAddress, createWallet } from '@/lib/db/wallet';
import { GetOrCreateEvmAccountParams } from "@/types/cdp";
import { Address } from "viem";

// Initialize CDP client with environment variables
const cdpClient: CdpClient = new CdpClient({
  apiKeyId: process.env.CDP_API_KEY_ID,
  apiKeySecret: process.env.CDP_API_KEY_SECRET,
  walletSecret: process.env.CDP_WALLET_SECRET,
});

/**
 * Get or create an EVM account for a user
 * @param params Parameters containing the user's account ID
 * @returns EvmServerAccount object from CDP SDK
 */
export async function getOrCreateEvmAccountFromId(params: GetOrCreateEvmAccountParams): Promise<EvmServerAccount> {
  try {
    // Check if user already has a wallet
    const existingWallet = await getWalletAddress(params.accountId);
    
    if (existingWallet) {
      // Return the existing wallet
      return await cdpClient.evm.getAccount({ address: existingWallet.address as Address });
    }

    // Create new wallet only if user doesn't have one
    const evmAccount = await cdpClient.evm.createAccount();
    await createWallet(params.accountId, evmAccount.address);

    return evmAccount;
  } catch (error) {
    console.error("Error in getOrCreateEvmAccountFromId:", error);
    throw error;
  }
}

/**
 * Get an EVM account by address
 * @param address Wallet address to retrieve account for
 * @returns EvmServerAccount object
 */
export async function getEvmAccountFromAddress(address: Address): Promise<EvmServerAccount> {
  try {
    return await cdpClient.evm.getAccount({ address });
  } catch (error) {
    console.error("Error getting EVM account from address:", error);
    throw error;
  }
}

/**
 * Get an EVM account by user ID
 * @param userId User ID to retrieve account for
 * @returns EvmServerAccount object or null if not found
 */
export async function getEvmAccountFromId(userId: string): Promise<EvmServerAccount | null> {
  try {
    const walletRecord = await getWalletAddress(userId);
    
    if (!walletRecord) {
      return null;
    }
    
    return await cdpClient.evm.getAccount({ address: walletRecord.address as Address });
  } catch (error) {
    console.error("Error in getEvmAccountFromId:", error);
    throw error;
  }
}
