'use client';

// import { ConnectButton } from './ConnectButton';
import AddToWallet from './AddToWallet';
import { FeedbackData } from '@/types/feedback';

interface FeedbackWalletProps {
  feedback: FeedbackData;
}

export function FeedbackWallet({ feedback }: FeedbackWalletProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      {/* <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Add to Wallet</h2>
        <p className="text-sm text-gray-400 mb-4">
          Connect your wallet to add this feedback as a credential to your wallet on Base.
        </p>
      </div>
      
      <ConnectButton /> */}
      <AddToWallet feedback={feedback} />
    </div>
  );
}
