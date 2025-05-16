'use client';

import { Wallet, ConnectWallet } from '@coinbase/onchainkit/wallet';
import { Avatar, Name } from '@coinbase/onchainkit/identity';

export function ConnectButton() {
  return (
    <div className="flex justify-end mb-4">
      <Wallet>
        <ConnectWallet 
          className="flex items-center gap-2 px-4 py-2 bg-primary-200 hover:bg-primary-100 text-dark-100 rounded-xl font-medium transition-colors"
          disconnectedLabel="Connect Wallet"
        >
          <Avatar className="h-5 w-5" />
          <Name />
        </ConnectWallet>
      </Wallet>
    </div>
  );
}
