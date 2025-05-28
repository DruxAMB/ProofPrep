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
    <div className="flex flex-col items-center py-16 px-4">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Badge className="mb-4 bg-primary-300/10 text-primary-300 hover:bg-primary-300/20 border-none">Pricing</Badge>
        <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
        <p className="text-light-300 text-lg max-w-2xl mx-auto">
          Purchase credits to practice interviews and receive AI feedback. No subscriptions, pay only for what you need.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        {/* Standard Plan */}
        <Card className="border border-dark-300 bg-dark-200/60 backdrop-blur-sm transition-all duration-300 hover:border-primary-300/30 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Standard Plan</CardTitle>
            <CardDescription className="text-light-300">Perfect for specific job interviews</CardDescription>
            <div className="mt-4 flex items-baseline">
              <span className="text-3xl font-bold">$29</span>
              <span className="text-light-400 ml-2">one-time</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              <PricingItem>5 interview credits</PricingItem>
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
                className="w-full bg-primary-300 hover:bg-primary-300/90" 
                onClick={() => handlePurchase('standard')}
                disabled={purchaseStatus === 'processing'}
              >
                {purchaseStatus === 'processing' ? (
                  <>
                    <span className="animate-spin mr-2 inline-block size-4 border-2 border-current border-t-transparent rounded-full" aria-hidden="true"></span>
                    Processing...
                  </>
                ) : "Get Started"}
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Pro Plan */}
        <Card className="border border-primary-300/30 bg-dark-200/60 backdrop-blur-sm transition-all duration-300 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0">
            <Badge className="bg-primary-300 text-dark-100 rounded-tl-none rounded-br-none rounded-tr-lg border-none font-medium">
              Best Value
            </Badge>
          </div>
          <CardHeader>
            <CardTitle className="text-2xl">Pro Plan</CardTitle>
            <CardDescription className="text-light-300">For serious job seekers</CardDescription>
            <div className="mt-4 flex items-baseline">
              <span className="text-3xl font-bold">$59</span>
              <span className="text-light-400 ml-2">one-time</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              <PricingItem highlighted>12 interview credits</PricingItem>
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
                className="w-full bg-primary-300 hover:bg-primary-300/90" 
                onClick={() => handlePurchase('pro')}
                disabled={purchaseStatus === 'processing'}
              >
                {purchaseStatus === 'processing' ? (
                  <>
                    <span className="animate-spin mr-2 inline-block size-4 border-2 border-current border-t-transparent rounded-full" aria-hidden="true"></span>
                    Processing...
                  </>
                ) : "Get Pro Access"}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>

      <div className="mt-12 bg-dark-300/30 border border-dark-300 rounded-lg p-6 max-w-3xl w-full">
        <div className="flex items-start gap-3 text-light-300">
          <AlertCircle className="h-5 w-5 text-primary-300 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-light-100 mb-1">How credits work</h3>
            <p className="text-sm">
              One credit allows you to practice one full interview session (up to 45 minutes). 
              Choose from technical, behavioral, or mixed formats. Each session includes AI-powered 
              feedback and performance analysis. Credits never expire, and you can purchase more at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for consistent pricing item styling
const PricingItem = ({ children, highlighted = false }: { children: React.ReactNode; highlighted?: boolean }) => (
  <li className="flex items-center">
    <Check className={`h-5 w-5 mr-2 flex-shrink-0 ${highlighted ? 'text-primary-300' : 'text-light-300'}`} />
    <span className={`${highlighted ? 'text-light-100' : 'text-light-300'}`}>{children}</span>
  </li>
);

export default PricingPlans;
