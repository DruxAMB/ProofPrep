// Client-side configuration
export const config = {
  pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL || "https://gateway.pinata.cloud",
  baseRpc: process.env.NEXT_PUBLIC_BASE_RPC || "https://base-rpc.publicnode.com",
  treasuryAddress: process.env.NEXT_PUBLIC_TREASURY_ADDRESS,
  platformReferrer: process.env.NEXT_PUBLIC_PLATFORM_REFERRER
};
