import { createCoin } from "@zoralabs/coins-sdk";
import { Hex, createWalletClient, createPublicClient, http, Address } from "viem";
import { base } from "viem/chains";
 
// Set up viem clients
const publicClient = createPublicClient({
  chain: base,
  transport: http("https://base-rpc.publicnode.com"),
});
 
const walletClient = createWalletClient({
  account: "0xaf59B12ea11914A0373ffbb13FF8b03F8537C599" as Hex,
  chain: base,
  transport: http("https://base-rpc.publicnode.com"),
});
 
// Define coin parameters
const coinParams = {
  name: "ProofPrep Credential",
  symbol: "PFP",
  uri: "ipfs://bafybeigoxzqzbnxsn35vq7lls3ljxdcwjafxvbvkivprsodzrptpiguysy",
  payoutRecipient: "0xaf59B12ea11914A0373ffbb13FF8b03F8537C599" as Address,
  platformReferrer: "0xaf59B12ea11914A0373ffbb13FF8b03F8537C599" as Address, // Optional
//   initialPurchaseWei: 0n, // Optional: Initial amount to purchase in Wei
};
 
// Create the coin
async function createMyCoin() {
  try {
    const result = await createCoin(coinParams, walletClient, publicClient);
    
    console.log("Transaction hash:", result.hash);
    console.log("Coin address:", result.address);
    console.log("Deployment details:", result.deployment);
    
    return result;
  } catch (error) {
    console.error("Error creating coin:", error);
    throw error;
  }
}