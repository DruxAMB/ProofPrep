import { NextRequest, NextResponse } from "next/server";
import { getEvmAccountFromId, getOrCreateEvmAccountFromId } from "@/lib/cdp";
import { auth } from "@/firebase/admin";
import { getWalletAddress } from "@/lib/db/wallet";

/**
 * API route to get wallet information for a user
 * @route GET /api/wallet
 */
export async function GET(request: NextRequest) {
  try {
    // Get userId from query params
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Verify the user exists in Firebase
    try {
      await auth.getUser(userId);
    } catch (error) {
      console.error(`User ${userId} not found in Firebase`, error);
      return NextResponse.json(
        { error: "Invalid user ID" },
        { status: 401 }
      );
    }

    // Get wallet account from CDP
    // console.log(`Attempting to get wallet for user ID: ${userId}`);
    
    // Check if user has a wallet address in the database
    const walletRecord = await getWalletAddress(userId);
    // console.log('Wallet record from database:', walletRecord);
    
    let account;
    
    // If no wallet exists, create one
    if (!walletRecord) {
      console.log(`No wallet found for user ${userId}, creating a new one...`);
      try {
        account = await getOrCreateEvmAccountFromId({ accountId: userId });
        console.log(`Created new wallet with address ${account.address} for user ${userId}`);
      } catch (error) {
        console.error(`Error creating wallet for user ${userId}:`, error);
        return NextResponse.json(
          { error: "Failed to create wallet" },
          { status: 500 }
        );
      }
    } else {
      // Get existing wallet
      account = await getEvmAccountFromId(userId);
    }

    // If no account exists after creation attempt, return empty wallet info
    if (!account) {
      return NextResponse.json({ address: null, balance: "0.0" });
    }

    // // Get balance for the wallet address
    // const balance = await getBalanceForAddress(account.address);

    return NextResponse.json({
      address: account.address,
      // balance,
    });
  } catch (error) {
    console.error("Error in wallet API route:", error);
    return NextResponse.json(
      { error: "Failed to retrieve wallet information" },
      { status: 500 }
    );
  }
}
