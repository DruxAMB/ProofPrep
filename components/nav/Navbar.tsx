"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleGetStarted = () => {
    router.push("/sign-up");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 sm:px-6 lg:px-8 py-4 transition-all duration-500">
      <nav 
        className={`border border-primary-100/40 rounded-full backdrop-blur-md transition-all duration-500 w-full ${isScrolled ? 'max-w-[1000px] shadow-md' : 'max-w-[1400px]'}`}
      >
        <div className="px-5 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className={`font-bold transition-all duration-300 ${isScrolled ? 'text-lg' : 'text-xl'}`}>
          ProofPrep
        </Link>

        {/* Navigation Links - Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <Link 
            href="/#how-it-works" 
            className="text-light-100 hover:text-primary-200 transition-colors"
          >
            How It Works
          </Link>
          <Link 
            href="/careers" 
            className="text-light-100 hover:text-primary-200 transition-colors"
          >
            Careers
          </Link>
          <Link 
            href="/pricing" 
            className="text-light-100 hover:text-primary-200 transition-colors"
          >
            Pricing
          </Link>

          {/* Get Started button */}
          <Button 
            onClick={handleGetStarted}
            className={`ml-4 bg-primary-200 hover:bg-primary-100 text-dark-100 font-medium transition-all cursor-pointer ${isScrolled ? 'text-sm px-4 py-1' : 'px-5 py-2'}`}
          >
            Get Started
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <Button 
            onClick={handleGetStarted}
            className={`mr-2 bg-primary-200 hover:bg-primary-100 text-dark-100 font-medium transition-all cursor-pointer ${isScrolled ? 'text-sm px-3 py-1' : 'px-4 py-1.5'}`}
          >
            Get Started
          </Button>
          <button 
            className="p-2 rounded-md hover:bg-dark-300/30 transition-colors"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <div 
        className={`md:hidden absolute left-0 right-0 bg-dark-100/95 border border-primary-100/40 rounded-b-xl mx-4 backdrop-blur-md shadow-md px-4 py-4 transition-all duration-300 ${isMobileMenuOpen ? 'top-[4.5rem] opacity-100' : '-top-96 opacity-0 pointer-events-none'}`}
      >
        <div className="flex flex-col space-y-4">
          <Link 
            href="/#how-it-works" 
            className="text-light-100 hover:text-primary-200 transition-colors py-2 px-3 rounded-md hover:bg-dark-300/30"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            How It Works
          </Link>
          <Link 
            href="/careers" 
            className="text-light-100 hover:text-primary-200 transition-colors py-2 px-3 rounded-md hover:bg-dark-300/30"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Careers
          </Link>
          <Link 
            href="/pricing" 
            className="text-light-100 hover:text-primary-200 transition-colors py-2 px-3 rounded-md hover:bg-dark-300/30"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Pricing
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
