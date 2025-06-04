'use server'

import { db } from "@/firebase/admin";

/**
 * Server action to get a user's wallet address
 */
export async function fetchWalletAddress(userId: string): Promise<string | null> {
  try {
    if (!userId) return null;
    
    const walletDoc = await db.collection('wallet_addresses').where('user_id', '==', userId).limit(1).get();
    
    if (walletDoc.empty) {
      return null;
    }
    
    const walletData = walletDoc.docs[0].data();
    return walletData.address || null;
  } catch (error) {
    console.error("Error fetching wallet address:", error);
    return null;
  }
}
