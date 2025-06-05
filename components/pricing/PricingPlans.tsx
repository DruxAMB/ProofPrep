"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { purchaseCreditPlan } from "@/lib/actions/credit.action";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks";
import { DaimoPlanPayment } from "@/components/payment/DaimoPlanPayment";
import { fetchWalletAddress } from "@/lib/actions/wallet.action";
import { Address } from "viem";

type PurchaseStatus = "idle" | "processing" | "success" | "error";

interface PricingPlansProps {
  userId?: string;
}

const PricingPlans = ({ userId }: PricingPlansProps) => {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [purchaseStatus, setPurchaseStatus] = useState<PurchaseStatus>("idle");
  const [selectedPlan, setSelectedPlan] = useState<"standard" | "pro" | null>(
    null
  );
  const [walletAddress, setWalletAddress] = useState<Address | null>(null);
  const [isWalletLoading, setIsWalletLoading] = useState(false);

  // Fetch user wallet address when authenticated - only run once when userId is available
  useEffect(() => {
    // Create a flag to prevent multiple fetches
    let isMounted = true;
    
    const loadUserWalletAddress = async () => {
      if (!isAuthenticated || !userId || isWalletLoading) return;
      
      try {
        setIsWalletLoading(true);
        const address = await fetchWalletAddress(userId);
        
        // Only update state if the component is still mounted
        if (!isMounted) return;
        
        // Check if the address is a properly formatted Ethereum address (0x...)
        if (address && address.startsWith('0x')) {
          setWalletAddress(address as Address);
        } else {
          // Invalid address format
          setWalletAddress(null);
          toast({
            title: "Invalid Wallet",
            description: "Your wallet address is not in the correct format",
            variant: "destructive",
          });
        }
      } catch (error) {
        // Only update state if the component is still mounted
        if (!isMounted) return;
        
        console.error("Error fetching wallet address:", error);
        toast({
          title: "Error",
          description: "Failed to fetch your wallet address",
          variant: "destructive",
        });
      } finally {
        // Only update state if the component is still mounted
        if (!isMounted) return;
        setIsWalletLoading(false);
      }
    };
    
    loadUserWalletAddress();
    
    // Cleanup function to prevent state updates after unmounting
    return () => {
      isMounted = false;
    };
  }, [userId, isAuthenticated]); // Remove toast from dependencies
  // Redirect to sign-in for unauthenticated users
  const redirectToSignIn = () => {
    router.push(`/sign-in?redirect=/pricing`);
  };

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-20 px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-200/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
        <Badge className="mb-4 bg-primary-200/15 text-primary-200 hover:bg-primary-200/25 border-none px-3 py-1 text-sm font-medium">
          Pricing
        </Badge>
        <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white to-light-300 bg-clip-text text-transparent">
          Choose Your Plan
        </h2>
        <p className="text-light-300 text-lg max-w-2xl mx-auto leading-relaxed">
          Purchase credits to practice interviews and receive AI feedback.
          <span className="text-primary-200">No subscriptions</span>, pay only
          for what you need.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl relative z-10">
        {/* Standard Plan */}
        <Card className="border border-dark-300 bg-gradient-to-b from-dark-200/80 to-dark-200/60 backdrop-blur-lg transition-all duration-300 hover:border-primary-200/40 hover:shadow-xl hover:shadow-primary-200/5 group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-primary-200/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-white group-hover:text-primary-200/90 transition-colors duration-300">
              Standard Plan
            </CardTitle>
            <CardDescription className="text-light-300/90">
              Perfect for specific job interviews
            </CardDescription>
            <div className="mt-6 flex items-baseline">
              <span className="text-4xl font-bold bg-gradient-to-r from-white to-light-300 bg-clip-text text-transparent">
                $9
              </span>
              <span className="text-light-400 ml-2 text-sm">one-time</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <ul className="space-y-4">
              <PricingItem highlighted={false} emphasis>
                200 interview credits
              </PricingItem>
              <PricingItem>20 connected interview minutes</PricingItem>
              <PricingItem>2 free interview sessions</PricingItem>
              <PricingItem>Interview feedback</PricingItem>
              <PricingItem>Customized interview scenerios</PricingItem>
              <PricingItem>Chat Support</PricingItem>
            </ul>
          </CardContent>
          <CardFooter>
            {purchaseStatus === "success" && selectedPlan === "standard" ? (
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                disabled
              >
                Purchased!
              </Button>
            ) : isAuthenticated ? (
              <div className="w-full">
                {isWalletLoading ? (
                  <Button className="w-full" disabled>
                    <span
                      className="animate-spin mr-2 inline-block size-4 border-2 border-current border-t-transparent rounded-full"
                      aria-hidden="true"
                    ></span>
                    Loading wallet...
                  </Button>
                ) : walletAddress ? (
                  <DaimoPlanPayment
                    userId={userId || ''}
                    planId="standard-plan"
                    planName="Standard"
                    amount="9"
                    walletAddress={walletAddress}
                    onSuccess={() => {
                      setPurchaseStatus("success");
                      setSelectedPlan("standard");
                    }}
                    onError={() => {
                      setPurchaseStatus("error");
                      setSelectedPlan("standard");
                    }}
                  />
                ) : (
                  <Button
                    className="w-full bg-yellow-600 hover:bg-yellow-700"
                    disabled
                  >
                    Wallet address not available
                  </Button>
                )}
              </div>
            ) : (
              <Button
                className="w-full bg-primary-200 hover:bg-primary-200/90 text-dark-100 font-medium mt-2 py-6 relative overflow-hidden group/btn cursor-pointer"
                onClick={redirectToSignIn}
              >
                <span className="relative z-10 flex items-center justify-center">
                  Sign in to purchase
                  <span className="ml-2 group-hover/btn:translate-x-1 transition-transform duration-200">
                    &rarr;
                  </span>
                </span>
                <span className="absolute inset-0 bg-primary-200/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></span>
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Pro Plan */}
        <Card className="border border-primary-200/40 bg-gradient-to-b from-dark-200/90 to-dark-200/70 backdrop-blur-lg transition-all duration-300 hover:border-primary-200/60 hover:shadow-xl hover:shadow-primary-200/10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-primary-200/10 opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute top-0 right-0 z-10">
            <Badge className="bg-primary-200 text-dark-100 rounded-tl-none rounded-br-none rounded-tr-lg border-none font-medium px-3 py-1">
              Best Value
            </Badge>
          </div>
          {/* Glow effect */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-200/20 rounded-full blur-3xl"></div>

          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-white group-hover:text-primary-200/90 transition-colors duration-300">
              Pro Plan
            </CardTitle>
            <CardDescription className="text-light-300/90">
              For serious job seekers
            </CardDescription>
            <div className="mt-6 flex items-baseline">
              <span className="text-4xl font-bold bg-gradient-to-r from-primary-200/90 to-white bg-clip-text text-transparent">
                $49
              </span>
              <span className="text-light-400 ml-2 text-sm">one-time</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <ul className="space-y-4">
              <PricingItem>1000 interview credits</PricingItem>
              <PricingItem>100 connected interview minutes</PricingItem>
              <PricingItem>2 free interview sessions</PricingItem>
              <PricingItem>Interview feedback</PricingItem>
              <PricingItem>Customized interview scenerios</PricingItem>
              <PricingItem highlighted>Realtime chat with interviewer</PricingItem>
              <PricingItem highlighted>Detailed performance metrics</PricingItem>
              <PricingItem highlighted>Interview recording</PricingItem>
              <PricingItem>Chat Support</PricingItem>
            </ul>
          </CardContent>
          <CardFooter>
            {purchaseStatus === "success" && selectedPlan === "pro" ? (
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                disabled
              >
                Purchased!
              </Button>
            ) : isAuthenticated ? (
              <div className="w-full">
                {isWalletLoading ? (
                  <Button className="w-full" disabled>
                    <span
                      className="animate-spin mr-2 inline-block size-4 border-2 border-current border-t-transparent rounded-full"
                      aria-hidden="true"
                    ></span>
                    Loading wallet...
                  </Button>
                ) : walletAddress ? (
                  <DaimoPlanPayment
                    userId={userId || ''}
                    planId="pro-plan"
                    planName="Pro"
                    amount="39"
                    walletAddress={walletAddress}
                    onSuccess={() => {
                      setPurchaseStatus("success");
                      setSelectedPlan("pro");
                    }}
                    onError={() => {
                      setPurchaseStatus("error");
                      setSelectedPlan("pro");
                    }}
                  />
                ) : (
                  <Button
                    className="w-full bg-yellow-600 hover:bg-yellow-700"
                    disabled
                  >
                    Wallet address not available
                  </Button>
                )}
              </div>
            ) : (
              <Button
                className="w-full bg-primary-200 from-primary to-primary/80 hover:bg-primary-200/90 hover:to-primary/70 font-medium mt-2 py-6 relative overflow-hidden group/btn cursor-pointer"
                onClick={redirectToSignIn}
              >
                <span className="relative z-10 flex items-center justify-center">
                  Sign in to purchase
                  <span className="ml-2 group-hover/btn:translate-x-1 transition-transform duration-200">
                    &rarr;
                  </span>
                </span>
                <span className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></span>
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>

      <div className="mt-16 bg-gradient-to-r from-dark-300/40 to-dark-300/30 border border-dark-300/60 rounded-xl p-8 max-w-3xl w-full backdrop-blur-sm shadow-lg relative z-10">
        <div className="flex items-start gap-4 text-light-300">
          <AlertCircle className="h-6 w-6 text-primary-200 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-light-100 text-lg mb-2">
              How credits work
            </h3>
            <p className="text-base leading-relaxed">
              100 credits allows you to practice different interview sessions (up
              to 10 minutes). Choose from technical, behavioral, or mixed
              formats. Each session includes AI-powered feedback and performance
              analysis.{" "}
              <span className="text-primary-200/90 font-medium">
                Credits expire 2 months after purchase
              </span>
              , and you can purchase more at any time. Both plans include 2 free interview sessions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for consistent pricing item styling
const PricingItem = ({
  children,
  highlighted = false,
  emphasis = false,
}: {
  children: React.ReactNode;
  highlighted?: boolean;
  emphasis?: boolean;
}) => (
  <li className="flex items-center group/item">
    <Check
      className={`h-5 w-5 mr-3 flex-shrink-0 ${
        highlighted ? "text-primary-200" : "text-light-300/70"
      } group-hover/item:${
        highlighted ? "text-primary-200/90" : "text-light-300"
      } transition-colors duration-200`}
    />
    <span
      className={`${highlighted ? "text-light-100" : "text-light-300/90"} ${
        emphasis ? "font-medium text-base" : ""
      } group-hover/item:${
        highlighted ? "text-white" : "text-light-300"
      } transition-colors duration-200`}
    >
      {children}
    </span>
  </li>
);

export default PricingPlans;