"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const router = useRouter();
  
  const handleGetStarted = () => {
    router.push("/sign-up");
  };

  return (
    <nav className="flex items-center justify-between gap-2 rounded-full border-2 border-primary-200/50 p-2 px-4 mb-6">
      {/* Logo and brand */}
      <Link href="/" className="flex items-center gap-2">
        <Image src="/logo.svg" alt="ProofPrep Logo" width={38} height={32} />
        <h2 className="text-primary-100">ProofPrep</h2>
      </Link>

      {/* Navigation links */}
      <div className="hidden md:flex items-center space-x-6">
        <Link 
          href="/#how-it-works" 
          className="text-light-100 hover:text-primary-100 transition-colors"
        >
          How it Works
        </Link>
        <Link 
          href="/careers" 
          className="text-light-100 hover:text-primary-100 transition-colors"
        >
          Careers
        </Link>
        <Link 
          href="/pricing" 
          className="text-light-100 hover:text-primary-100 transition-colors"
        >
          Pricing
        </Link>
      </div>

      {/* Get Started button */}
      <Button 
        onClick={handleGetStarted}
        className="bg-primary-200 hover:bg-primary-100 text-dark-100 font-medium transition-colors"
      >
        Get Started
      </Button>
    </nav>
  );
}
