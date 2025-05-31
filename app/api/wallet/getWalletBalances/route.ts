import { NextResponse } from 'next/server';
import { getWalletBalances } from '@/utils/api';

export async function GET(request: Request) {
  try {
    // Extract walletId from the URL params
    const { searchParams } = new URL(request.url);
    const walletId = searchParams.get('walletId');
    
    if (!walletId) {
      return NextResponse.json(
        { error: 'walletId is required' },
        { status: 400 }
      );
    }
    
    const response = await getWalletBalances(walletId);
    
    // Handle the structured error response from the utility function
    if (response.error) {
      return NextResponse.json(
        { error: response.error.message },
        { status: response.error.status }
      );
    }
    
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error getting wallet balances:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get wallet balances' },
      { status: 500 }
    );
  }
}
