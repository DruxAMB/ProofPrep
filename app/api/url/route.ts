import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Simply return the Pinata API endpoint and JWT
    // No need to make a request to Pinata first
    return NextResponse.json({ 
      url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
      jwt: process.env.PINATA_JWT
    }, { status: 200 });
  } catch (error) {
    console.error('Error creating upload URL:', error);
    return NextResponse.json({ error: "Failed to create upload URL" }, { status: 500 });
  }
}