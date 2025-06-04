"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { Address } from "viem";

// Define the wallet account type
interface WalletAccount {
  address: Address;
  balance: string;
}

interface WalletListResponse {
  wallets: WalletAccount[];
  count: number;
  totalBalance: string;
  totalBalanceInUSDC: number;
  tokenSymbol: string;
}

export default function WalletAdminPage() {
  const router = useRouter();
  const [wallets, setWallets] = useState<WalletAccount[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalBalanceInUSDC, setTotalBalanceInUSDC] = useState(0);
  const [tokenSymbol, setTokenSymbol] = useState('USDC');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Function to format USDC balance for display
  const formatUSDCBalance = (balanceUnits: string) => {
    // Convert USDC units (10^6) to USDC
    const balanceUSDC = Number(balanceUnits) / 10**6;
    return balanceUSDC.toFixed(2); // Show 2 decimal places for USD currency
  };
  
  // Function to copy wallet address to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add toast notification here
  };
  
  // For development, we're making this page accessible to everyone
  // TODO: Add proper admin-only check before production
  useEffect(() => {
    // Set isAdmin to true for development
    setIsAdmin(true);
    // Fetch wallet data without authentication token
    fetchWallets();
  }, []);
  
  // Function to fetch wallets
  const fetchWallets = async () => {
    setIsLoading(true);
    setError(null);
    
    try {      
      const response = await fetch('/api/wallet/list');
      
      if (!response.ok) {
        throw new Error(`Error fetching wallets: ${response.statusText}`);
      }
      
      const data: WalletListResponse = await response.json();
      setWallets(data.wallets || []);
      setTotalCount(data.count || 0);
      setTotalBalanceInUSDC(data.totalBalanceInUSDC || 0);
      setTokenSymbol(data.tokenSymbol || 'USDC');
      
    } catch (err) {
      console.error('Error fetching wallets:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch wallets');
    } finally {
      setIsLoading(false);
    }
  };
  
  // We don't need this effect anymore since we handle fetching in the checkAdminStatus effect
  // Keeping the useEffect dependency array empty to avoid warnings
  useEffect(() => {}, []);
  
  // Format date string
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Wallet Administration</h1>
        <Button 
          onClick={() => router.push('/admin')}
          variant="outline"
          className="ml-4"
        >
          Back to Admin
        </Button>
      </div>
      
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-md p-4 mb-6">
          <p className="text-red-100">{error}</p>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-300"></div>
        </div>
      ) : (
        <>
          {/* Total balance card */}
          <div className="mb-6 p-6 bg-dark-200/60 backdrop-blur-sm rounded-lg border border-dark-300/80 shadow-lg">
            <h3 className="text-xl font-semibold text-primary-200 mb-2">Total Balance</h3>
            <p className="text-3xl font-bold text-light-100">${totalBalanceInUSDC.toFixed(2)} {tokenSymbol}</p>
            <p className="text-sm text-light-400 mt-2">Across {totalCount} wallet addresses</p>
          </div>

          {/* Wallets table */}
          <div className="bg-dark-200/40 backdrop-blur-sm rounded-lg border border-dark-300 overflow-hidden shadow-md">
            <table className="min-w-full divide-y divide-dark-300">
              <thead className="bg-dark-300/30">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-light-400 uppercase tracking-wider">
                    Wallet Address
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-light-400 uppercase tracking-wider">
                    Balance (USDC)
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-light-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-300/50">
                {wallets.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-light-400">
                      No wallets found
                    </td>
                  </tr>
                ) : (
                  wallets.map((wallet, index) => (
                    <tr key={index} className="hover:bg-dark-300/20 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                        {`${wallet.address.slice(0, 10)}...${wallet.address.slice(-6)}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-light-200">
                        {formatUSDCBalance(wallet.balance)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Button 
                          onClick={() => copyToClipboard(wallet.address)}
                          size="sm"
                          variant="ghost"
                          className="flex items-center gap-1 text-light-300 hover:text-primary-200"
                        >
                          <Copy size={14} />
                          Copy
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Wallet count information */}
          {wallets.length > 0 && (
            <div className="mt-6 text-sm text-light-400 text-center">
              Total Wallets: {totalCount}
            </div>
          )}
        </>
      )}
    </div>
  );
}
