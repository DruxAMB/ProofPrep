"use client";

import { useState } from "react";
import { Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { purchaseCreditPlan } from "@/lib/actions/credit.action";
import { useToast } from "@/components/ui/use-toast";

type PurchaseStatus = "idle" | "processing" | "success" | "error";

interface PricingPlansProps {
  userId: string;
}

const PricingPlans = ({ userId }: PricingPlansProps) => {
  const [purchaseStatus, setPurchaseStatus] = useState<PurchaseStatus>("idle");
  const [selectedPlan, setSelectedPlan] = useState<'standard' | 'pro' | null>(null);
  const { toast } = useToast();

  const handlePurchase = async (plan: 'standard' | 'pro') => {
    try {
      setSelectedPlan(plan);
      setPurchaseStatus('processing');

      // In a real implementation, this would redirect to a payment processor
      // For now, we'll just simulate a successful purchase after a short delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Call the server action to purchase the plan
      const planId = plan === 'standard' ? 'standard-plan' : 'pro-plan';
      const result = await purchaseCreditPlan(userId, planId);

      if (result) {
        setPurchaseStatus('success');
        toast({
          title: "Purchase Successful",
          description: `You have successfully purchased the ${plan} plan.`,
          variant: "default"
        });
      } else {
        throw new Error("Failed to purchase plan");
      }
    } catch (error) {
      console.error("Error purchasing plan:", error);
      setPurchaseStatus('error');
      toast({
        title: "Purchase Failed",
        description: "There was an error processing your purchase. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex flex-col items-center py-20 px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-200/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      
      <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
        <Badge className="mb-4 bg-primary-200/15 text-primary-300 hover:bg-primary-200/25 border-none px-3 py-1 text-sm font-medium">Pricing</Badge>
        <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white to-light-300 bg-clip-text text-transparent">
          Choose Your Plan
        </h2>
        <p className="text-light-300 text-lg max-w-2xl mx-auto leading-relaxed">
          Purchase credits to practice interviews and receive AI feedback. 
          <span className="text-primary-300">No subscriptions</span>, pay only for what you need.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl relative z-10">
        {/* Standard Plan */}
        <Card className="border border-dark-300 bg-gradient-to-b from-dark-200/80 to-dark-200/60 backdrop-blur-lg transition-all duration-300 hover:border-primary-300/40 hover:shadow-xl hover:shadow-primary-300/5 group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-primary-300/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-white group-hover:text-primary-300/90 transition-colors duration-300">Standard Plan</CardTitle>
            <CardDescription className="text-light-300/90">Perfect for specific job interviews</CardDescription>
            <div className="mt-6 flex items-baseline">
              <span className="text-4xl font-bold bg-gradient-to-r from-white to-light-300 bg-clip-text text-transparent">$29</span>
              <span className="text-light-400 ml-2 text-sm">one-time</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <ul className="space-y-4">
              <PricingItem highlighted={false} emphasis>5 interview credits</PricingItem>
              <PricingItem>30-45 min per interview</PricingItem>
              <PricingItem>Basic AI feedback</PricingItem>
              <PricingItem>Technical & behavioral questions</PricingItem>
              <PricingItem>Performance analytics</PricingItem>
            </ul>
          </CardContent>
          <CardFooter>
            {purchaseStatus === 'processing' && selectedPlan === 'standard' ? (
              <Button className="w-full" disabled>
                Processing...
              </Button>
            ) : purchaseStatus === 'success' && selectedPlan === 'standard' ? (
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700" disabled>
                Purchased!
              </Button>
            ) : purchaseStatus === 'error' && selectedPlan === 'standard' ? (
              <Button className="w-full bg-red-600 hover:bg-red-700" onClick={() => handlePurchase('standard')}>
                Try Again
              </Button>
            ) : (
              <Button 
                className="w-full bg-primary-200 hover:bg-primary-200/90 text-dark-100 font-medium mt-2 py-6 relative overflow-hidden group/btn cursor-pointer" 
                onClick={() => handlePurchase('standard')}
                disabled={purchaseStatus === 'processing'}
              >
                <span className="relative z-10 flex items-center justify-center">
                  {purchaseStatus === 'processing' ? (
                    <>
                      <span className="animate-spin mr-2 inline-block size-4 border-2 border-current border-t-transparent rounded-full" aria-hidden="true"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      Get Started
                      <span className="ml-2 group-hover/btn:translate-x-1 transition-transform duration-200">&rarr;</span>
                    </>
                  )}
                </span>
                <span className="absolute inset-0 bg-primary-200/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></span>
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Pro Plan */}
        <Card className="border border-primary-300/40 bg-gradient-to-b from-dark-200/90 to-dark-200/70 backdrop-blur-lg transition-all duration-300 hover:border-primary-300/60 hover:shadow-xl hover:shadow-primary-300/10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-primary-300/10 opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute top-0 right-0 z-10">
            <Badge className="bg-primary-200 text-dark-100 rounded-tl-none rounded-br-none rounded-tr-lg border-none font-medium px-3 py-1">
              Best Value
            </Badge>
          </div>
          {/* Glow effect */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-200/20 rounded-full blur-3xl"></div>
          
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-white group-hover:text-primary-300/90 transition-colors duration-300">Pro Plan</CardTitle>
            <CardDescription className="text-light-300/90">For serious job seekers</CardDescription>
            <div className="mt-6 flex items-baseline">
              <span className="text-4xl font-bold bg-gradient-to-r from-primary-300/90 to-white bg-clip-text text-transparent">$59</span>
              <span className="text-light-400 ml-2 text-sm">one-time</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <ul className="space-y-4">
              <PricingItem highlighted emphasis>12 interview credits</PricingItem>
              <PricingItem highlighted>30-45 min per interview</PricingItem>
              <PricingItem highlighted>Advanced AI feedback</PricingItem>
              <PricingItem highlighted>Customized interview scenarios</PricingItem>
              <PricingItem highlighted>Detailed performance metrics</PricingItem>
              <PricingItem highlighted>Interview recording feature</PricingItem>
            </ul>
          </CardContent>
          <CardFooter>
            {purchaseStatus === 'processing' && selectedPlan === 'pro' ? (
              <Button className="w-full" disabled>
                Processing...
              </Button>
            ) : purchaseStatus === 'success' && selectedPlan === 'pro' ? (
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700" disabled>
                Purchased!
              </Button>
            ) : purchaseStatus === 'error' && selectedPlan === 'pro' ? (
              <Button className="w-full bg-red-600 hover:bg-red-700" onClick={() => handlePurchase('pro')}>
                Try Again
              </Button>
            ) : (
              <Button 
                className="w-full bg-primary-200 hover:bg-primary-200/90 text-dark-100 font-medium mt-2 py-6 relative overflow-hidden group/btn cursor-pointer" 
                onClick={() => handlePurchase('pro')}
                disabled={purchaseStatus === 'processing'}
              >
                <span className="relative z-10 flex items-center justify-center">
                  {purchaseStatus === 'processing' ? (
                    <>
                      <span className="animate-spin mr-2 inline-block size-4 border-2 border-current border-t-transparent rounded-full" aria-hidden="true"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      Get Pro Access
                      <span className="ml-2 group-hover/btn:translate-x-1 transition-transform duration-200">&rarr;</span>
                    </>
                  )}
                </span>
                <span className="absolute inset-0 bg-primary-200/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></span>
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>

      <div className="mt-16 bg-gradient-to-r from-dark-300/40 to-dark-300/30 border border-dark-300/60 rounded-xl p-8 max-w-3xl w-full backdrop-blur-sm shadow-lg relative z-10">
        <div className="flex items-start gap-4 text-light-300">
          <AlertCircle className="h-6 w-6 text-primary-300 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-light-100 text-lg mb-2">How credits work</h3>
            <p className="text-base leading-relaxed">
              One credit allows you to practice one full interview session (up to 45 minutes). 
              Choose from technical, behavioral, or mixed formats. Each session includes AI-powered 
              feedback and performance analysis. <span className="text-primary-300/90 font-medium">Credits never expire</span>, and you can purchase more at any time.
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
  emphasis = false 
}: { 
  children: React.ReactNode; 
  highlighted?: boolean;
  emphasis?: boolean;
}) => (
  <li className="flex items-center group/item">
    <Check className={`h-5 w-5 mr-3 flex-shrink-0 ${highlighted ? 'text-primary-300' : 'text-light-300/70'} group-hover/item:${highlighted ? 'text-primary-300/90' : 'text-light-300'} transition-colors duration-200`} />
    <span className={`${highlighted ? 'text-light-100' : 'text-light-300/90'} ${emphasis ? 'font-medium text-base' : ''} group-hover/item:${highlighted ? 'text-white' : 'text-light-300'} transition-colors duration-200`}>
      {children}
    </span>
  </li>
);

export default PricingPlans;
