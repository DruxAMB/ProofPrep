'use client';
 
import type { ReactNode } from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base } from 'wagmi/chains';
 
export function Providers(props: { children: ReactNode }) {
  
  return (
    <OnchainKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY} 
      chain={base} 
      config={{
        appearance: {
          name: 'ProofPrep',
          logo: 'https://proofprep.vercel.app/favicon.ico',
          mode: 'auto',
          theme: 'default',
        },
      }}
    >
      {props.children}
    </OnchainKitProvider>
  );
}