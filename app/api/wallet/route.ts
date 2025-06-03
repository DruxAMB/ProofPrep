import { NextRequest, NextResponse } from "next/server";
import { getEvmAccountFromId } from "@/lib/cdp";
import { auth } from "@/firebase/admin";

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
      return NextResponse.json(
        { error: "Invalid user ID" },
        { status: 401 }
      );
    }

    // Get wallet account from CDP
    const account = await getEvmAccountFromId(userId);

    // If no account exists, return empty response
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
