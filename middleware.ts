import { Address } from "viem";
import { paymentMiddleware, Network, Resource } from "x402-next";
import { facilitator } from "@coinbase/x402";

const facilitatorUrl = process.env.NEXT_PUBLIC_FACILITATOR_URL as Resource;
const payTo = process.env.RESOURCE_WALLET_ADDRESS as Address;
const network = process.env.NETWORK as Network;

export const middleware = paymentMiddleware(
  payTo,
  {
    "/interview": {
      price: "$1",
      network,
      config: {
        description: "Access to interview content",
      },
    },
  },
  facilitator
);

// Configure which paths the middleware should run on
export const config = {
  runtime: "nodejs",
  matcher: ["/interview/:path*"],
};