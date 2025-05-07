"use client";

import * as React from "react";
import { ArrowLeft, User, Wallet as WalletIcon, Bell, Shield, Brush, Globe } from "lucide-react";
import Link from "next/link";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownBasename, 
  WalletDropdownFundLink, 
  WalletDropdownLink, 
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance, 
} from '@coinbase/onchainkit/identity';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState<'profile' | 'wallet' | 'achievements'>('profile');
  
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header with back button */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="hover:opacity-80 transition-opacity bg-dark-200/50 p-2 rounded-full">
            <ArrowLeft className="h-5 w-5 text-primary-200" />
          </Link>
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex space-x-2 mb-8 border-b border-dark-300/50 overflow-x-auto">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-3 font-medium transition-colors relative ${activeTab === 'profile' ? 'text-primary-200' : 'text-light-300 hover:text-light-100'}`}
        >
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </div>
          {activeTab === 'profile' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-200" />
          )}
        </button>
        
        <button
          onClick={() => setActiveTab('wallet')}
          className={`px-4 py-3 font-medium transition-colors relative ${activeTab === 'wallet' ? 'text-primary-200' : 'text-light-300 hover:text-light-100'}`}
        >
          <div className="flex items-center gap-2">
            <WalletIcon className="h-4 w-4" />
            <span>Wallet</span>
          </div>
          {activeTab === 'wallet' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-200" />
          )}
        </button>
        
        <button
          onClick={() => setActiveTab('achievements')}
          className={`px-4 py-3 font-medium transition-colors relative ${activeTab === 'achievements' ? 'text-primary-200' : 'text-light-300 hover:text-light-100'}`}
        >
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Achievements</span>
          </div>
          {activeTab === 'achievements' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-200" />
          )}
        </button>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        
        {/* Main Content */}
        <div className="space-y-8">
          {/* Profile Section */}
          {activeTab === 'profile' && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Manage your account settings and preferences
                </CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-center p-8">
                    <div className="text-center">
                      <div className="size-24 rounded-full bg-gradient-to-br from-primary-200/20 to-primary-100/40 mx-auto flex items-center justify-center mb-4">
                        <User className="h-10 w-10 text-primary-100" />
                      </div>
                      <p className="text-light-200 text-lg font-medium">Profile settings coming soon</p>
                      <p className="text-light-300 text-sm mt-1">Customize your profile and preferences</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Web3 Section */}
          {activeTab === 'wallet' && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Wallet Connection</CardTitle>
                <CardDescription>
                  Connect your wallet to access Web3 features on Base
                </CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Connection Status</h3>
                    <p className="text-light-300 text-sm mt-1">
                      Connect your wallet to access Web3 features
                    </p>
                  </div> 
                  <div className="min-w-[180px] flex justify-end">
                    <Wallet>
                      <ConnectWallet className='btn-primary' disconnectedLabel='Connect'>
                        <Avatar className="h-6 w-6" />
                        <Name className="text-dark-100"/>
                      </ConnectWallet>
                      <WalletDropdown>
                        <Identity
                          className="px-4 pt-3 pb-2 hover:bg-primary-200/80"
                          hasCopyAddressOnClick
                        >
                          <Avatar />
                          <Name />
                          <Address />
                          <EthBalance />
                        </Identity>
                        <WalletDropdownLink
                          className='hover:bg-primary-200/80'
                          icon="wallet"
                          href="https://keys.coinbase.com"
                        >
                          Wallet
                        </WalletDropdownLink>
                        <WalletDropdownDisconnect className='hover:bg-primary-200/80' />
                      </WalletDropdown>
                    </Wallet>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Achievements Section */}
          {activeTab === 'achievements' && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Interview Achievements</CardTitle>
                <CardDescription>
                  Mint your interview achievements as verifiable credentials on Base
                </CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <div className="bg-gradient-to-br from-dark-300/50 to-dark-200/30 rounded-lg p-6 border border-dark-300/30">
                  <div className="flex flex-col items-center text-center">
                    <div className="size-16 rounded-full bg-dark-300/50 flex items-center justify-center mb-4">
                      <WalletIcon className="h-8 w-8 text-primary-200" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Connect Your Wallet</h3>
                    <p className="text-light-300 text-sm max-w-md">
                      Connect your wallet to mint your interview achievements as verifiable credentials on Base. This allows you to showcase your skills on-chain.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
