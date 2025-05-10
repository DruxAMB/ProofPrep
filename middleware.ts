import { Address } from "viem";
import { paymentMiddleware, Network } from "x402-next";
import { facilitator } from "@coinbase/x402";

const payTo = process.env.RESOURCE_WALLET_ADDRESS as Address;
const network = process.env.NETWORK as Network;

export const middleware = paymentMiddleware(
  payTo,
  {
    "/interview": {
      price: "$1",
      network,
      config: {
        description: "Access to ProofPrep interview practice sessions",
        // customPaywallHtml: ""
      },
    },
  },
  facilitator,
);

// Configure which paths the middleware should run on
export const config = {
  matcher: ["/interview/:path*"],
};
