import { db } from "@/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

/**
 * Get wallet address for a user from Firestore
 * @param userId User ID to find wallet for
 * @returns Wallet address object or null if not found
 */
export async function getWalletAddress(userId: string) {
  try {
    const walletDoc = await db.collection('wallet_addresses').where('user_id', '==', userId).limit(1).get();
    
    if (walletDoc.empty) {
      return null;
    }
    
    const walletData = walletDoc.docs[0].data();
    return {
      address: walletData.address
    };
  } catch (error) {
    console.error("Error fetching wallet address:", error);
    throw error;
  }
}

/**
 * Create a new wallet address for a user in Firestore
 * @param userId User ID to create wallet for
 * @param address Blockchain wallet address
 */
export async function createWallet(userId: string, address: string) {
  try {
    await db.collection('wallet_addresses').add({
      user_id: userId,
      address: address,
      network: 'base',
      created_at: FieldValue.serverTimestamp()
    });
  } catch (error) {
    console.error("Error creating wallet:", error);
    throw error;
  }
}

/**
 * Get a user's wallet address as a string
 * @param userId User ID to find wallet address for
 * @returns Wallet address string or null if not found
 */
export async function getUserWalletAddress(userId: string): Promise<string | null> {
  try {
    const walletData = await getWalletAddress(userId);
    return walletData?.address || null;
  } catch (error) {
    console.error("Error fetching user wallet address:", error);
    return null;
  }
}
