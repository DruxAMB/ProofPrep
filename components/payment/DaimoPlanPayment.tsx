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
  onSuccess?: () => void;
  onError?: () => void;
  isLoading?: boolean;
}

/**
 * DaimoPlanPayment component acts as a container for specific plan payment components
 */
export function DaimoPlanPayment(props: PlanPaymentProps & {
  planId: string;
  planName: string;
  amount: string;
}) {
  // Determine which component to render based on planId
  if (props.planId === "standard-plan") {
    return <StandardPlanPayment {...props} />;
  } else if (props.planId === "pro-plan") {
    return <ProPlanPayment {...props} />;
  }
  
  // Fallback for unknown plan types
  return (
    <button 
      className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2.5 px-4 rounded"
      disabled
    >
      Unknown plan type
    </button>
  );
}

/**
 * StandardPlanPayment component handles Standard plan payments
 */
function StandardPlanPayment({
  userId,
  walletAddress,
  onSuccess,
  onError,
  isLoading = false,
}: PlanPaymentProps) {
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);
  
  // Handle successful payment
  const handlePaymentCompleted = async (event: any) => {
    if (processing) return; // Prevent duplicate processing
    
    setProcessing(true);
    try {
      // Process the plan purchase in your system
      const result = await purchaseCreditPlan(userId, "standard-plan");
      
      if (result) {
        toast({
          title: "Payment Successful",
          description: "You have successfully purchased the Standard plan.",
          variant: "default",
        });
        
        if (onSuccess) onSuccess();
      } else {
        throw new Error("Failed to process plan purchase");
      }
    } catch (error) {
      console.error("Error processing Standard plan purchase:", error);
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
      description: "Your Standard plan payment could not be processed. Please try again.",
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

  return (
    <DaimoPayButton
      appId="pay-demo"
      intent="Purchase Standard Plan" // Fixed text for Standard plan
      toAddress={walletAddress}
      toChain={8453} // Base mainnet
      toUnits="1" // Amount for Standard plan (was 9, changed to 1 for testing)
      toToken={USDC_ADDRESS}
      closeOnSuccess
      mode="dark"
      theme="rounded"
      externalId={`${userId}-standard-plan-${Date.now()}`}
      metadata={{
        userId: userId,
        planId: "standard-plan",
        planName: "Standard"
      }}
      onPaymentCompleted={handlePaymentCompleted}
      onPaymentBounced={handlePaymentBounced}
      customTheme={{
        "--ck-accent-color": "#65bdcc",
        "--ck-accent-text-color": "#020808",
        "--ck-font-family": "'Outfit', sans-serif",
        "--ck-connectbutton-background": "#65bdcc",
        "--ck-connectbutton-hover-background": "#4a9caa",
        "--ck-body-background": "#272f33",
      }}
    />
  );
}

/**
 * ProPlanPayment component handles Pro plan payments
 */
function ProPlanPayment({
  userId,
  walletAddress,
  onSuccess,
  onError,
  isLoading = false,
}: PlanPaymentProps) {
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);
  
  // Handle successful payment
  const handlePaymentCompleted = async (event: any) => {
    if (processing) return; // Prevent duplicate processing
    
    setProcessing(true);
    try {
      // Process the plan purchase in your system
      const result = await purchaseCreditPlan(userId, "pro-plan");
      
      if (result) {
        toast({
          title: "Payment Successful",
          description: "You have successfully purchased the Pro plan.",
          variant: "default",
        });
        
        if (onSuccess) onSuccess();
      } else {
        throw new Error("Failed to process plan purchase");
      }
    } catch (error) {
      console.error("Error processing Pro plan purchase:", error);
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
      description: "Your Pro plan payment could not be processed. Please try again.",
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

  return (
    <DaimoPayButton
      appId="pay-demo"
      intent="Purchase Pro Plan" // Fixed text for Pro plan
      toAddress={walletAddress}
      toChain={8453} // Base mainnet
      toUnits="49" // Amount for Pro plan
      toToken={USDC_ADDRESS}
      closeOnSuccess
      mode="dark"
      theme="rounded"
      externalId={`${userId}-pro-plan-${Date.now()}`}
      metadata={{
        userId: userId,
        planId: "pro-plan",
        planName: "Pro"
      }}
      onPaymentCompleted={handlePaymentCompleted}
      onPaymentBounced={handlePaymentBounced}
      customTheme={{
        "--ck-accent-color": "#65bdcc",
        "--ck-accent-text-color": "#020808",
        "--ck-font-family": "'Outfit', sans-serif",
        "--ck-connectbutton-background": "#65bdcc",
        "--ck-connectbutton-hover-background": "#4a9caa",
        "--ck-body-background": "#272f33",
      }}
    />
  );
}
