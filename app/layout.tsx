import { Toaster } from "sonner";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Providers } from '@/components/providers/wallet-provider';
import "./globals.css";
// import '@coinbase/onchainkit/styles.css';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: "ProofPrep",
  description: "An AI-powered platform for preparing for mock interviews",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${outfit.className} antialiased pattern`}>
        <Providers>
            {children}
            <Toaster />
        </Providers>
      </body>
    </html>
  );
}
