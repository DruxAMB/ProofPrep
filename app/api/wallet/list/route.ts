import { NextResponse } from 'next/server';
import { cdpClient } from '@/lib/cdp';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';

// USDC contract address on Base
const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

// Create viem public client for Base mainnet
const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

/**
 * GET handler for listing all wallet accounts
 * For development, this endpoint is accessible to everyone
 * TODO: Add admin-only authentication before production
 */
export async function GET() {
  try {
    // Authentication check removed for development
    // Will add proper admin-only authentication later
    
    console.log('Starting CDP wallet listing...');
    const walletAddresses = [];
    let totalBalance = BigInt(0);
    
    // Get initial response
    let response = await cdpClient.evm.listAccounts();
    let walletCount = 0;
    
    // Paginate through all accounts using the example pattern
    while (true) {
      // Process each account
      for (const account of response.accounts) {
        // console.log('EVM account:', account.address);
        
        // Get USDC balance for this address using viem
        try {
          // Read balance using ERC20 balanceOf function
          const balance = await publicClient.readContract({
            address: USDC_ADDRESS,
            abi: [
              {
                name: 'balanceOf',
                type: 'function',
                stateMutability: 'view',
                inputs: [{ name: 'account', type: 'address' }],
                outputs: [{ name: 'balance', type: 'uint256' }],
              },
            ],
            functionName: 'balanceOf',
            args: [account.address],
          });
          
          // USDC has 6 decimal places (not 18 like ETH)
          totalBalance += balance;
          
          walletAddresses.push({
            address: account.address,
            balance: balance.toString()
          });
        } catch (error) {
          console.error(`Error getting balance for ${account.address}:`, error);
          walletAddresses.push({
            address: account.address,
            balance: '0'
          });
        }
        
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
    console.log(`Total USDC balance: ${totalBalance}`);
    
    // Convert to USDC for easier reading (1 USDC = 10^6 units)
    const totalBalanceInUSDC = Number(totalBalance) / 10**6;
    
    return NextResponse.json({ 
      wallets: walletAddresses, 
      count: walletCount,
      totalBalance: totalBalance.toString(),
      totalBalanceInUSDC,
      tokenSymbol: 'USDC'
    }, { status: 200 });
  } catch (error) {
    console.error('Error in wallet list API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wallet accounts' }, 
      { status: 500 }
    );
  }
}
