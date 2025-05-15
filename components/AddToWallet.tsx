"use client";

import { useState } from 'react';
import { createCoin } from "@zoralabs/coins-sdk";
import { Hex, createWalletClient, createPublicClient, http, Address } from "viem";
import { base } from "viem/chains";
import { config } from "@/utils/client-config";

interface AddToWalletProps {
  feedback: {
    id: string;
    role: string;
    score: number;
    strengths: string[];
    areasForImprovement: string[];
    date: string;
    userId: string;
  };
  userAddress: Address;
}

export default function AddToWallet({ feedback, userAddress }: AddToWalletProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Set up viem clients
  const publicClient = createPublicClient({
    chain: base,
    transport: http(config.baseRpc),
  });

  const walletClient = createWalletClient({
    account: userAddress as Hex,
    chain: base,
    transport: http(config.baseRpc),
  });

  const generateFeedbackImage = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d')!;

    // Set background
    ctx.fillStyle = '#0f0f0f';
    ctx.fillRect(0, 0, 800, 600);

    // Add gradient border
    const gradient = ctx.createLinearGradient(0, 0, 800, 0);
    gradient.addColorStop(0, '#00ffff');
    gradient.addColorStop(1, '#ff00ff');
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, 780, 580);

    // Set text styles
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';

    // Add content
    ctx.fillText(`ProofPrep Interview Feedback`, 400, 50);
    ctx.fillText(`Score: ${feedback.score}%`, 400, 100);
    
    ctx.font = '24px Arial';
    ctx.fillText(`Role: ${feedback.role}`, 400, 150);
    ctx.fillText(`Date: ${feedback.date}`, 400, 200);

    // Add strengths
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Strengths:', 50, 250);
    feedback.strengths.forEach((strength, index) => {
      ctx.fillText(`• ${strength}`, 70, 290 + index * 30);
    });

    // Add areas for improvement
    ctx.fillText('Areas for Improvement:', 50, 400);
    feedback.areasForImprovement.forEach((area, index) => {
      ctx.fillText(`• ${area}`, 70, 440 + index * 30);
    });

    return new Promise<File>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(new File([blob!], 'feedback.png', { type: 'image/png' }));
      }, 'image/png');
    });
  };

  async function addFeedbackToWallet() {
    try {
      setIsLoading(true);
      setError(null);

      // Generate and upload the feedback image
      const imageFile = await generateFeedbackImage();
      
      // Get authentication details from our API
      const authRequest = await fetch("/api/url");
      if (!authRequest.ok) {
        throw new Error('Failed to get Pinata authentication');
      }
      const { url: pinataUrl, jwt } = await authRequest.json();
      
      // Upload image directly to Pinata API
      const formData = new FormData();
      formData.append('file', imageFile);
      
      const uploadResponse = await fetch(pinataUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwt}`
        },
        body: formData
      });
      
      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image to IPFS');
      }
      
      const { IpfsHash } = await uploadResponse.json();
      // Use the gateway URL from config for better customization
      const gatewayUrl = process.env.NEXT_PUBLIC_GATEWAY_URL || "https://gateway.pinata.cloud";
      const imageUrl = `${gatewayUrl}/ipfs/${IpfsHash}`;
      setImageUrl(imageUrl);

      // Create metadata according to Zora's requirements
      const metadata = {
        name: `ProofPrep Interview Feedback - ${feedback.role}`,
        description: `Interview feedback for ${feedback.role} position. Score: ${feedback.score}%`,
        image: `ipfs://${IpfsHash}`, // Use IPFS URI format for metadata
        external_url: imageUrl, // Add external URL for better compatibility
        attributes: [ // Use attributes format for better compatibility
          { trait_type: "Role", value: feedback.role },
          { trait_type: "Score", value: feedback.score },
          { trait_type: "Date", value: feedback.date },
          { trait_type: "Type", value: "Interview Feedback" },
          { trait_type: "Issuer", value: "ProofPrep" }
        ],
        properties: {
          strengths: feedback.strengths,
          areasForImprovement: feedback.areasForImprovement
        }
      };

      // Use the same authentication for metadata upload
      // Convert metadata to Blob for upload
      const metadataBlob = new Blob([JSON.stringify(metadata)], {
        type: 'application/json'
      });
      
      // Create a File object from the Blob
      const metadataFile = new File([metadataBlob], 'metadata.json', {
        type: 'application/json'
      });
      
      // Upload metadata to Pinata
      const metadataFormData = new FormData();
      metadataFormData.append('file', metadataFile);
      
      const metadataResponse = await fetch(pinataUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwt}`
        },
        body: metadataFormData
      });

      if (!metadataResponse.ok) {
        throw new Error('Failed to upload metadata to IPFS');
      }

      const { IpfsHash: metadataHash } = await metadataResponse.json();
      const metadataUrl = `ipfs://${metadataHash}`;

      // Create coin parameters according to Zora SDK documentation
      const coinParams = {
        name: `ProofPrep ${feedback.role} Credential`,
        symbol: "PFP", // Symbol should be 3-5 characters
        uri: metadataUrl, // IPFS URI format as required by Zora
        payoutRecipient: config.treasuryAddress as Address || userAddress,
        platformReferrer: config.platformReferrer as Address,
        // No initialPurchaseWei since we're not sending ETH with the transaction
      };

      // Create the coin using Zora SDK
      const result = await createCoin(coinParams, walletClient, publicClient);
      console.log("Transaction hash:", result.hash);

      // Wait for transaction confirmation as recommended in the docs
      const receipt = await publicClient.waitForTransactionReceipt({ hash: result.hash });

    } catch (err) {
      console.error('Error adding feedback to wallet:', err);
      setError(err instanceof Error ? err.message : 'Failed to add feedback to wallet');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full space-y-4">
      <button
        onClick={addFeedbackToWallet}
        disabled={isLoading}
        className="w-full p-3 flex items-center justify-center gap-2 bg-primary-200 hover:bg-primary-100 text-dark-100 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
            Adding to Wallet...
          </>
        ) : (
          'Add to Wallet'
        )}
      </button>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-red-500 text-sm text-center">{error}</p>
        </div>
      )}

      {imageUrl && !error && !isLoading && (
        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
          <p className="text-green-500 text-sm text-center">
            Successfully added to wallet!
            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block underline hover:text-green-400 mt-1"
            >
              View Feedback Image
            </a>
          </p>
        </div>
      )}
    </div>
  );
}