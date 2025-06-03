/**
 * CDP SDK configuration
 * Loads environment variables for the CDP SDK
 */

// Get environment variables with fallbacks
export const CDP_CONFIG = {
  apiKeyId: process.env.CDP_API_KEY_ID || '',
  apiKeySecret: process.env.CDP_API_KEY_SECRET || '',
  walletSecret: process.env.CDP_WALLET_SECRET || '',
};

// Validate configuration
export function validateCdpConfig() {
  const { apiKeyId, apiKeySecret, walletSecret } = CDP_CONFIG;
  
  if (!apiKeyId) {
    throw new Error('Missing CDP_API_KEY_ID environment variable');
  }
  
  if (!apiKeySecret) {
    throw new Error('Missing CDP_API_KEY_SECRET environment variable');
  }
  
  if (!walletSecret) {
    throw new Error('Missing CDP_WALLET_SECRET environment variable');
  }
  
  return true;
}
