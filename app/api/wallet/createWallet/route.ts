import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import jwt from 'jsonwebtoken';

const API_BASE_URL = 'https://api.cdp.coinbase.com/platform/v2';

// Function to generate JWT token for Coinbase API
const generateJWT = (walletSecret: string, keyName: string): string => {
  // Format the private key as PEM if it's not already
  let privateKey = walletSecret;
  
  // If the key doesn't start with the PEM header, add it
  if (!privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
    try {
      // Remove any URL encoding first
      const decodedSecret = decodeURIComponent(walletSecret);
      
      // Format as PEM - ensuring proper line breaks for PKCS8 format
      privateKey = `-----BEGIN PRIVATE KEY-----
${decodedSecret}
-----END PRIVATE KEY-----`;
      console.log('Formatted private key:', privateKey);
    } catch (error) {
      console.error('Error formatting private key:', error);
      throw new Error('Invalid private key format');
    }
  }
  
  // Prepare payload exactly as required by Coinbase
  const payload = {
    sub: keyName.trim(), // Ensure no leading/trailing spaces
    iss: 'cdp',
    nbf: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 120, // Token valid for 2 minutes
    iat: Math.floor(Date.now() / 1000), // Include issued at time
  };

  // Specific header format for Coinbase
  const header = {
    alg: 'ES256',
    typ: 'JWT',
    kid: keyName.trim(), // Must match exactly with what Coinbase has registered
  };

  try {
    // Sign with explicit algorithm and headers
    return jwt.sign(payload, privateKey, { 
      algorithm: 'ES256',
      header: header // Explicitly include the header
    });
  } catch (error) {
    console.error('JWT signing error:', error);
    throw error;
  }
};

// Debug endpoint to just generate and view the token
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletSecret = searchParams.get('walletSecret');
    const keyName = searchParams.get('keyName');
    
    if (!walletSecret || !keyName) {
      return NextResponse.json({ 
        error: 'walletSecret and keyName are required as query parameters',
        example: '/api/wallet/createWallet?walletSecret=your_secret&keyName=your_key'
      }, { status: 400 });
    }
    
    // Generate JWT token for inspection
    const jwtToken = generateJWT(walletSecret, keyName);
    
    // Log the token to console for server-side viewing
    console.log('Generated JWT Token:', jwtToken);
    
    // Return the token in the response for client viewing
    return NextResponse.json({ 
      token: jwtToken,
      decodedHeader: jwt.decode(jwtToken, { complete: true })?.header,
      decodedPayload: jwt.decode(jwtToken)
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error generating token:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json(); // Parse the request body
    const { networkId = 'base-sepolia' } = body;
    
    // Use environment variables by default
    const walletSecret = process.env.CDP_WALLET_SECRET;
    const keyName = process.env.NEXT_PUBLIC_CDP_API_KEY_ID;
    
    if (!walletSecret || !keyName) {
      return NextResponse.json({ 
        error: 'Environment variables CDP_WALLET_SECRET and NEXT_PUBLIC_CDP_API_KEY_ID are required' 
      }, { status: 500 });
    }

    // Generate JWT token using wallet secret from environment
    const jwtToken = generateJWT(walletSecret, keyName);
    
    // Log the token for debugging (only first 20 chars for security)
    console.log('Generated JWT Token for wallet creation:', jwtToken.substring(0, 20) + '...');

    // Create the wallet with the exact payload format specified by Coinbase
    const response = await axios.post(
      `${API_BASE_URL}/wallets`,
      {
        wallet: {
          network_id: networkId,
          use_server_signer: false,
          // Optional: Add wallet name and metadata
          name: `ProofPrep Wallet ${new Date().toISOString()}`,
          metadata: {
            app: 'ProofPrep',
            createdAt: new Date().toISOString()
          }
        }
      },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json({
      success: true,
      wallet: response.data,
      _debug: {
        tokenUsed: jwtToken.substring(0, 10) + '...' // Only return first 10 chars for security
      }
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error creating wallet:', error.response?.data || error.message);
    const errorResponse = {
      success: false,
      error: error.message,
      details: error.response?.data || null
    };
    return NextResponse.json(errorResponse, { status: error.response?.status || 500 });
  }
}