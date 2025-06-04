import { cdpClient } from "./index";

/**
 * Lists all wallet addresses created with our CDP secret key
 * This follows the exact pagination pattern from the CDP SDK example
 */
export async function listAllWalletAddresses() {
  console.log('Listing all wallet addresses from CDP...');
  
  try {
    // Get initial response
    let response = await cdpClient.evm.listAccounts();
    let walletCount = 0;
    
    // Paginate through all accounts using the example pattern
    while (true) {
      // Log each account address
      for (const account of response.accounts) {
        console.log('EVM account:', account.address);
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
  } catch (error) {
    console.error('Error listing wallet addresses:', error);
    throw error;
  }
}
