"use client";

import { useState } from 'react';
import { createCoin } from "@zoralabs/coins-sdk";
import { Hex, createWalletClient, createPublicClient, http, Address } from "viem";
import { base } from "viem/chains";
import { config } from "@/utils/client-config";
import { useAccount } from 'wagmi';
import { FeedbackData } from '@/types/feedback';

interface AddToWalletProps {
  feedback: FeedbackData;
}

export default function AddToWallet({ feedback }: AddToWalletProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  // Get wallet connection state and address
  const { address, isConnected } = useAccount();

  // Set up viem clients - only when address is available
  const publicClient = createPublicClient({
    chain: base,
    transport: http(config.baseRpc),
  });

  const walletClient = address ? createWalletClient({
    account: address as Hex,
    chain: base,
    transport: http(config.baseRpc),
  }) : null;

  const generateFeedbackImage = async () => {
    // Create canvas with higher resolution for better quality
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 900;
    const ctx = canvas.getContext('2d')!;

    // Set background with ProofPrep dark theme
    // Using the dark-100 color from the project's color palette
    ctx.fillStyle = '#0B0F19'; // dark-100 background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add subtle pattern overlay (similar to the app's pattern background)
    ctx.fillStyle = '#111827'; // dark-200
    for (let i = 0; i < canvas.width; i += 30) {
      for (let j = 0; j < canvas.height; j += 30) {
        if (Math.random() > 0.85) { // 15% of grid cells get a dot
          ctx.fillRect(i, j, 4, 4);
        }
      }
    }

    // Add gradient border using primary colors
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#00FFFF'); // primary-100
    gradient.addColorStop(0.5, '#00CCFF'); // primary-200
    gradient.addColorStop(1, '#9333EA'); // purple accent
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    // Add ProofPrep logo placeholder
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ProofPrep', 600, 80);

    // Add divider
    ctx.strokeStyle = '#374151'; // dark-300
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(300, 120);
    ctx.lineTo(900, 120);
    ctx.stroke();

    // Add heading
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Interview Feedback', 600, 180);

    // Add score with appropriate color based on score value
    const scoreColor = getScoreColor(feedback.score);
    ctx.fillStyle = scoreColor;
    ctx.font = 'bold 72px "Outfit", sans-serif';
    ctx.fillText(`${feedback.score}%`, 600, 280);

    // Add role and date
    ctx.fillStyle = '#9CA3AF'; // gray-400
    ctx.font = '32px "Outfit", sans-serif';
    ctx.fillText(`${feedback.role}`, 600, 340);
    ctx.font = '24px "Outfit", sans-serif';
    ctx.fillText(`${feedback.date}`, 600, 380);

    // Add divider
    ctx.strokeStyle = '#374151'; // dark-300
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(150, 420);
    ctx.lineTo(1050, 420);
    ctx.stroke();

    // Add strengths section
    ctx.fillStyle = '#10B981'; // green-500
    ctx.font = 'bold 36px "Outfit", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Strengths', 150, 480);

    // Add strengths list
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px "Outfit", sans-serif';
    feedback.strengths.slice(0, 3).forEach((strength, index) => {
      ctx.fillText(`• ${strength}`, 170, 530 + index * 40);
    });

    // Add areas for improvement
    ctx.fillStyle = '#FBBF24'; // yellow-400
    ctx.font = 'bold 36px "Outfit", sans-serif';
    ctx.fillText('Areas for Improvement', 150, 680);

    // Add areas list
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px "Outfit", sans-serif';
    feedback.areasForImprovement.slice(0, 3).forEach((area, index) => {
      ctx.fillText(`• ${area}`, 170, 730 + index * 40);
    });

    // Add footer
    ctx.fillStyle = '#9CA3AF'; // gray-400
    ctx.font = '18px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Verified on Base blockchain', 600, 860);

    // Helper function to get score color
    function getScoreColor(score: number): string {
      if (score >= 80) return '#10B981'; // green-500
      if (score >= 60) return '#FBBF24'; // yellow-400
      return '#EF4444'; // red-500
    }

    return new Promise<File>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(new File([blob!], 'proofprep-feedback.png', { type: 'image/png' }));
      }, 'image/png', 0.95); // Higher quality PNG
    });
  };

  async function addFeedbackToWallet() {
    try {
      // Check if wallet is connected
      if (!isConnected || !address) {
        setError('Please connect your wallet first');
        return;
      }
      
      // Check if wallet client is available
      if (!walletClient) {
        setError('Wallet client not initialized');
        return;
      }

      setIsLoading(true);
      setError(null);
      setTxHash(null);

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
        payoutRecipient: config.treasuryAddress as Address || address,
        platformReferrer: config.platformReferrer as Address,
        // No initialPurchaseWei since we're not sending ETH with the transaction
      };

      // Create the coin using Zora SDK
      try {
        const result = await createCoin(coinParams, walletClient, publicClient);
        console.log("Transaction hash:", result.hash);
        setTxHash(result.hash);

        // Wait for transaction confirmation as recommended in the docs
        const receipt = await publicClient.waitForTransactionReceipt({ hash: result.hash });
        console.log("Transaction confirmed:", receipt);
      } catch (txError: any) {
        // Handle specific transaction errors
        if (txError.message?.includes('user rejected')) {
          throw new Error('Transaction was rejected. Please approve the transaction in your wallet.');
        } else if (txError.message?.includes('insufficient funds')) {
          throw new Error('Insufficient funds to complete this transaction. Please add funds to your wallet.');
        } else {
          console.error('Transaction error:', txError);
          throw new Error(`Transaction failed: ${txError.message || 'Unknown error'}`);
        }
      }

    } catch (err) {
      console.error('Error adding feedback to wallet:', err);
      setError(err instanceof Error ? err.message : 'Failed to add feedback to wallet');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full space-y-4">
      {/* Show connect wallet message if not connected */}
      {!isConnected && (
        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 mb-4">
          <p className="text-blue-500 text-sm text-center">
            Please connect your wallet using the button above to add this feedback to your wallet.
          </p>
        </div>
      )}

      <button
        onClick={addFeedbackToWallet}
        disabled={isLoading || !isConnected}
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

      {txHash && !error && !isLoading && (
        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
          <p className="text-green-500 text-sm text-center">
            Successfully added to wallet!
            {imageUrl && (
              <a
                href={imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block underline hover:text-green-400 mt-1"
              >
                View Feedback Image
              </a>
            )}
            <a
              href={`https://basescan.org/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block underline hover:text-green-400 mt-1"
            >
              View Transaction
            </a>
          </p>
        </div>
      )}
    </div>
  );
}