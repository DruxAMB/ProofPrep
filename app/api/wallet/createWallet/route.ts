import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import jwt from 'jsonwebtoken';

const API_BASE_URL = 'https://api.cdp.coinbase.com/platform/v2';

// Function to generate JWT token with proper PEM-formatted key
const generateJWT = (walletSecret: string, keyName: string): string => {
  // Format the private key as PEM if it's not already
  let privateKey = walletSecret;
  
  // If the key doesn't start with the PEM header, add it
  if (!privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
    // Try to decode from base64 if needed
    try {
      // Remove any URL encoding first
      const decodedSecret = decodeURIComponent(walletSecret);
      
      // Format as PEM
      privateKey = `-----BEGIN PRIVATE KEY-----\n${decodedSecret}\n-----END PRIVATE KEY-----`;
      console.log('Formatted private key:', privateKey);
    } catch (error) {
      console.error('Error formatting private key:', error);
      throw new Error('Invalid private key format');
    }
  }
  
  const payload = {
    sub: keyName,
    iss: 'cdp',
    nbf: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 120, // Token valid for 2 minutes
  };

  const header = {
    alg: 'ES256',
    kid: keyName,
  };

  try {
    return jwt.sign(payload, privateKey, { algorithm: 'ES256' });
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
    const { networkId, walletSecret, keyName } = body;

    if (!networkId || !walletSecret || !keyName) {
      return NextResponse.json({ error: 'Network ID, Wallet Secret, and Key Name are required' }, { status: 400 });
    }

    // Generate JWT token using wallet secret
    const jwtToken = generateJWT(walletSecret, keyName);
    
    // Log the token for debugging
    console.log('Generated JWT Token for wallet creation:', jwtToken);

    const response = await axios.post(
      `${API_BASE_URL}/wallets`,
      {
        wallet: {
          network_id: networkId,
          use_server_signer: false, // Optional: Set to true for Coinbase-managed wallets
        },
      },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json({
      wallet: response.data,
      _debug: {
        tokenUsed: jwtToken.substring(0, 10) + '...' // Only return first 10 chars for security
      }
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error creating wallet:', error.response?.data || error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}