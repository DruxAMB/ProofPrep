"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Wallet } from "@coinbase/onchainkit/wallet";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  
  // This would be updated when the wallet connection status changes
  // For now, we're using a placeholder
  
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <ArrowLeft className="h-6 w-6 text-primary-200" />
        </Link>
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-dark-200 mb-6">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "account" 
              ? "text-primary-200 border-b-2 border-primary-200" 
              : "text-light-300 hover:text-light-100"
          }`}
          onClick={() => setActiveTab("account")}
        >
          Account
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "web3" 
              ? "text-primary-200 border-b-2 border-primary-200" 
              : "text-light-300 hover:text-light-100"
          }`}
          onClick={() => setActiveTab("web3")}
        >
          Web3
        </button>
      </div>
      
      {/* Account Settings */}
      {activeTab === "account" && (
        <div className="space-y-6">
          <div className="card-border p-6 rounded-xl bg-dark-200/30 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            <p className="text-light-300 mb-4">
              Manage your account settings and preferences.
            </p>
            
            {/* Profile settings would go here */}
            <div className="space-y-4">
              <p className="text-light-200">Profile settings coming soon...</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Web3 Settings */}
      {activeTab === "web3" && (
        <div className="space-y-6">
          <div className="card-border p-6 rounded-xl bg-dark-200/30 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-4">Wallet Connection</h2>
            <p className="text-light-300 mb-4">
              Connect your wallet to access Web3 features on Base, including verifiable credentials.
            </p>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Status</h3>
                <p className="text-light-300 text-sm">
                  Connect your wallet to access Web3 features
                </p>
              </div>
              <Wallet />
            </div>
          </div>
          
          {isConnected && (
            <div className="card-border p-6 rounded-xl bg-dark-200/30 backdrop-blur-sm">
              <h2 className="text-xl font-semibold mb-4">Premium Access</h2>
              <p className="text-light-300 mb-4">
                Upgrade to premium to access exclusive interview types and features.
              </p>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Status</h3>
                  <p className="text-light-300 text-sm">
                    {isPremiumUser ? 'Active' : 'Not active'}
                  </p>
                </div>
                {!isPremiumUser && (
                  <Button className="bg-primary-200 hover:bg-primary-100 text-dark-100">
                    Upgrade to Premium
                  </Button>
                )}
              </div>
            </div>
          )}
          
          <div className="card-border p-6 rounded-xl bg-dark-200/30 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-4">Interview Achievements</h2>
            <p className="text-light-300 mb-4">
              Your interview achievements can be minted as verifiable credentials on Base.
            </p>
            
            {isConnected ? (
              <div className="text-light-200">
                <p>You can mint your achievements from the interview feedback page.</p>
              </div>
            ) : (
              <div className="text-light-300">
                <p>Connect your wallet to mint interview achievements.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
