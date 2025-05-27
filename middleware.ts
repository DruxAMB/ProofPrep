import { Address } from "viem";
import { paymentMiddleware, type Network } from "x402-next";
import { facilitator } from "@coinbase/x402";
import { customPaywallHtml } from "./lib/cutomPaywall";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const payTo = process.env.RESOURCE_WALLET_ADDRESS as Address;
const network = process.env.NETWORK as Network;
const price = process.env.PRICE || "$0.8";

const x402Handler = paymentMiddleware(
  payTo,
  {
    "/interview": {
      price,
      network,
      config: {
        description: "Access to interview content",
        customPaywallHtml: customPaywallHtml,
        maxTimeoutSeconds: 300, // 5 minutes for payment
      },
    },
  },
  facilitator,
);

export async function middleware(request: NextRequest) {
  const paymentCookie = request.cookies.get('x402-payment-verified');
  
  // If payment is verified via cookie, skip x402 middleware
  if (paymentCookie?.value === 'true') {
    return NextResponse.next();
  }

  // Run x402 middleware
  const response = await x402Handler(request as any);
  
  // If payment successful, set cookie
  if (response.status === 200) {
    const newResponse = NextResponse.next();
    newResponse.cookies.set('x402-payment-verified', 'true', {
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/interview',
    });
    return newResponse;
  }
  
  return response;
}

// Configure which paths the middleware should run on
export const config = {
  runtime: "nodejs",
  matcher: [
    // Match interview routes but exclude _next and api routes
    "/interview/:path*",
    "/((?!_next/|api/).*)interview(.*)"
  ],
};