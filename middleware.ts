import { Address } from "viem";
import { paymentMiddleware, type Network } from "x402-next";
import { facilitator } from "@coinbase/x402";
import { customPaywallHtml } from "./lib/cutomPaywall";

const payTo = process.env.RESOURCE_WALLET_ADDRESS as Address;
const network = process.env.NETWORK as Network;
const price = process.env.PRICE || "$1";

export const middleware = paymentMiddleware(
  payTo,
  {
    "/interview": {
      price,
      network,
      config: {
        description: "Access to interview content",
        customPaywallHtml: customPaywallHtml,
      },
    },
  },
  facilitator,
);

// Configure which paths the middleware should run on
export const config = {
  runtime: "nodejs",
  matcher: [
    // Only match the main interview page, not sub-pages
    "/interview",
  ],
};