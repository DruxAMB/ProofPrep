"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Loader2, Copy, CheckCircle } from "lucide-react";
import { toast } from "sonner";

/**
 * WalletInfo component displays the user's wallet address and balance
 * Uses the CDP SDK to retrieve wallet information
 */
export function WalletInfo() {
  const { user } = useAuth();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Fetch wallet address and balance when component mounts
  useEffect(() => {
    async function fetchWalletInfo() {
      if (!user?.uid) {
        console.log('No user ID available');
        setIsLoading(false);
        return;
      }
      
      console.log(`Fetching wallet info for user: ${user.uid}`);
      
      try {
        // Fetch wallet address from server
        const url = `/api/wallet?userId=${user.uid}`;
        console.log(`Making request to: ${url}`);
        const response = await fetch(url);
        
        console.log(`Response status: ${response.status}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`API error response: ${errorText}`);
          throw new Error(`Failed to fetch wallet info: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Wallet API response:', data);
        
        if (data.address) {
          console.log(`Setting wallet address: ${data.address}`);
          setWalletAddress(data.address);
          setBalance(data.balance || "0.0");
        } else {
          console.log('No wallet address in response');
        }
      } catch (error) {
        console.error("Error fetching wallet info:", error);
        toast.error("Could not load wallet information");
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchWalletInfo();
  }, [user?.uid]);

  // Copy wallet address to clipboard
  const copyToClipboard = () => {
    if (!walletAddress) return;
    
    navigator.clipboard.writeText(walletAddress)
      .then(() => {
        setCopied(true);
        toast.success("Address copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        toast.error("Failed to copy address");
      });
  };

  // Format wallet address for display (0x1234...5678)
  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-dark-300/50 rounded-md">
        <Loader2 className="h-4 w-4 animate-spin text-primary-200" />
        <span className="text-sm">Loading wallet...</span>
      </div>
    );
  }

  if (!walletAddress) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-dark-300/50 rounded-md">
        <span className="text-sm text-light-300">No wallet found</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2 px-3 py-2 bg-dark-300/50 rounded-md">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{formatAddress(walletAddress)}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full hover:bg-dark-200/50"
            onClick={copyToClipboard}
          >
            {copied ? (
              <CheckCircle className="h-3 w-3 text-green-500" />
            ) : (
              <Copy className="h-3 w-3 text-light-300" />
            )}
            <span className="sr-only">Copy address</span>
          </Button>
        </div>
        <div className="text-xs font-medium text-primary-200">
          {balance} ETH
        </div>
      </div>
      <div className="text-xs text-light-300 px-1">
        Your wallet is managed by ProofPrep on Base Sepolia
      </div>
    </div>
  );
}
