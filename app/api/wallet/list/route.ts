import { NextResponse } from 'next/server';
import { cdpClient } from '@/lib/cdp';

/**
 * GET handler for listing all wallet accounts
 * For development only - no auth check in this version
 */
export async function GET(request: Request) {
  try {
    // For development, we're skipping auth checks
    // In production, implement proper authentication here
    
    console.log('Starting CDP wallet listing...');
    let walletAddresses = [];
    
    // Get initial response
    let response = await cdpClient.evm.listAccounts();
    let walletCount = 0;
    
    // Paginate through all accounts using the example pattern
    while (true) {
      // Log each account address
      for (const account of response.accounts) {
        console.log('EVM account:', account.address);
        walletAddresses.push({
          address: account.address
        });
        walletCount++;
      }
      
      // Break if no more pages
      if (!response.nextPageToken) break;
      
      // Get next page
      console.log('Fetching next page with token:', response.nextPageToken);
      response = await cdpClient.evm.listAccounts({
        pageToken: response.nextPageToken
      });
    }
    
    console.log(`Total wallets found: ${walletCount}`);
    
    return NextResponse.json({ 
      wallets: walletAddresses, 
      count: walletCount 
    }, { status: 200 });
  } catch (error) {
    console.error('Error in wallet list API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wallet accounts' }, 
      { status: 500 }
    );
  }
}
