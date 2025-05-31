import { NextResponse } from 'next/server';
import { listWallets } from '@/utils/api';

export async function GET(request: Request) {
  try {
    // Extract cursor from the URL params if present
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get('cursor') || undefined;
    
    const response = await listWallets(cursor);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error listing wallets:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to list wallets' },
      { status: 500 }
    );
  }
}
