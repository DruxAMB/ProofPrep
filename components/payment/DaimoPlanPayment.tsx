import { DaimoPayButton } from "@daimo/pay";
import { useToast } from "@/components/ui/use-toast";
import { purchaseCreditPlan } from "@/lib/actions/credit.action";
import { Address } from "viem";
import { useState } from "react";

// Base USDC token address for Base mainnet
const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

interface PlanPaymentProps {
  userId: string;
  walletAddress: Address;
  planId: string;
  planName: string;
  amount: string;
  onSuccess?: () => void;
  onError?: () => void;
  isLoading?: boolean;
}

/**
 * DaimoPlanPayment component handles plan payments using Daimo Pay SDK
 * Simplified to use a single component for all plan types
 */
export function DaimoPlanPayment({
  userId,
  walletAddress,
  planId,
  planName,
  amount,
  onSuccess,
  onError,
  isLoading = false,
}: PlanPaymentProps) {
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);

  // Handle successful payment
  const handlePaymentCompleted = async () => {
    if (processing) return; // Prevent duplicate processing
    
    setProcessing(true);
    try {
      // Process the plan purchase in your system
      const result = await purchaseCreditPlan(userId, planId);
      
      if (result) {
        toast({
          title: "Payment Successful",
          description: `You have successfully purchased the ${planName} plan.`,
          variant: "default",
        });
        
        if (onSuccess) onSuccess();
      } else {
        throw new Error("Failed to process plan purchase");
      }
    } catch (error) {
      console.error(`Error processing ${planName} plan purchase:`, error);
      toast({
        title: "Purchase Processing Failed",
        description:
          "Your payment was received but we couldn't process your plan. Our team will assist you shortly.",
        variant: "destructive",
      });
      
      if (onError) onError();
    } finally {
      setProcessing(false);
    }
  };

  // Handle payment failure
  const handlePaymentBounced = () => {
    toast({
      title: "Payment Failed",
      description: `Your ${planName} plan payment could not be processed. Please try again.`,
      variant: "destructive",
    });
    
    if (onError) onError();
  };

  if (isLoading || processing) {
    return (
      <div className="flex justify-center items-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!walletAddress) {
    return (
      <button 
        className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-4 rounded"
        disabled
      >
        Wallet address not found
      </button>
    );
  }
  
  // Validate planId
  if (planId !== "standard-plan" && planId !== "pro-plan") {
    return (
      <button 
        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2.5 px-4 rounded"
        disabled
      >
        Unknown plan type
      </button>
    );
  }

  // Return the appropriate Daimo Pay button with dynamic text based on the plan props
  return (
    <DaimoPayButton
      appId="pay-demo"
      intent={`Purchase ${planName} Plan`}
      toAddress={walletAddress}
      toChain={8453} // Base mainnet
      toUnits={amount} // Dynamic amount based on the plan
      toToken={USDC_ADDRESS}
      closeOnSuccess
      mode="dark"
      theme="rounded"
      externalId={`${userId}-${planId}-${Date.now()}`}
      metadata={{
        userId: userId,
        planId: planId,
        planName: planName
      }}
      onPaymentCompleted={handlePaymentCompleted}
      onPaymentBounced={handlePaymentBounced}
      customTheme={{
        // Global theme
        "--ck-accent-color": "#65bdcc", // primary-200 from globals.css
        "--ck-accent-text-color": "#020808", // dark-100 from globals.css
        "--ck-font-family": "'Outfit', sans-serif", // Outfit font from layout
        "--ck-body-color": "#d9f2f6", // light-100 from globals.css
        "--ck-border-radius": "0.625rem", // --radius from globals.css
        
        // Connect button styling
        "--ck-connectbutton-font-size": "1rem",
        "--ck-connectbutton-border-radius": "0.625rem",
        "--ck-connectbutton-color": "#020808", // dark-100 - text color
        "--ck-connectbutton-background": "#65bdcc", // primary-200 from globals.css
        "--ck-connectbutton-box-shadow": "none",
        
        // Hover state
        "--ck-connectbutton-hover-color": "#020808", // dark-100
        "--ck-connectbutton-hover-background": "#4a9caa", // light-600 from globals.css
        "--ck-connectbutton-hover-box-shadow": "0 2px 8px rgba(0, 0, 0, 0.2)",
        
        // Active state (when pressed)
        "--ck-connectbutton-active-color": "#020808",
        "--ck-connectbutton-active-background": "#2a5c66", // light-800 from globals.css
        "--ck-connectbutton-active-box-shadow": "inset 0 1px 2px rgba(0, 0, 0, 0.1)",
        
        // Modal styling
        "--ck-overlay-background": "rgba(0, 0, 0, 0.7)", // Dark overlay with transparency
        "--ck-overlay-backdrop-filter": "blur(5px)", // Subtle blur effect
        "--ck-modal-box-shadow": "0 10px 25px rgba(0, 0, 0, 0.3)", // Subtle shadow for depth
        "--ck-body-background": "#272f33", // dark-200 from globals.css
        "--ck-body-background-transparent": "rgba(39, 47, 51, 0.95)", // dark-200 with transparency
        "--ck-body-background-secondary": "#243339", // dark-300 from globals.css
        "--ck-body-background-secondary-hover-background": "#2a5c66", // light-800 from globals.css
        "--ck-body-background-secondary-hover-outline": "#4a9caa", // light-600 from globals.css
        "--ck-body-background-tertiary": "#1c282d", // Slightly darker than dark-300
      }}
    />
  );
}
