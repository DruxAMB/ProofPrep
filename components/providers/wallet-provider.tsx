'use client';
 
import type { ReactNode } from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { baseSepolia } from 'wagmi/chains'; // add baseSepolia for testing 
 
export function Providers(props: { children: ReactNode }) {
  // Get the API key and remove any trailing semicolon
  const apiKey = process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY?.replace(';', '');
  
  return (
    <OnchainKitProvider
      apiKey={apiKey} 
      chain={baseSepolia} 
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