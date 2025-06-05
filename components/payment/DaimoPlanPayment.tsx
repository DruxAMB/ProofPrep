import { DaimoPayButton } from "@daimo/pay";
import { useToast } from "@/components/ui/use-toast";
import { purchaseCreditPlan } from "@/lib/actions/credit.action";
import { Address } from "viem"

interface DaimoPlanPaymentProps {
  userId: string;
  planId: string;
  planName: string;
  amount: string;
  walletAddress: Address;
  onSuccess?: () => void;
  onError?: () => void;
  isLoading?: boolean;
}

/**
 * DaimoPlanPayment component handles plan payments using Daimo Pay SDK
 */
export function DaimoPlanPayment({
  userId,
  planId,
  planName,
  amount,
  walletAddress,
  onSuccess,
  onError,
  isLoading = false,
}: DaimoPlanPaymentProps) {
  const { toast } = useToast();
  
  // Base USDC token address
  const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

  // Handle successful payment
  const handlePaymentCompleted = async (event: any) => {
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
      console.error("Error processing plan purchase:", error);
      toast({
        title: "Purchase Processing Failed",
        description:
          "Your payment was received but we couldn't process your plan. Our team will assist you shortly.",
        variant: "destructive",
      });
      
      if (onError) onError();
    }
  };

  // Handle payment failure
  const handlePaymentBounced = () => {
    toast({
      title: "Payment Failed",
      description: "Your payment could not be processed. Please try again.",
      variant: "destructive",
    });
    
    if (onError) onError();
  };

  if (isLoading) {
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

  // Create custom styled button that wraps the DaimoPayButton
  return (
    <div className="relative w-full">
      {/* Custom styled button to match app styling */}
      <button 
        className="w-full bg-primary-200 hover:bg-primary-200/90 text-dark-100 font-medium py-2.5 px-4 rounded"
      >
        Purchase {planName} Plan
      </button>
      
      {/* Position the DaimoPayButton over our custom button but make it transparent */}
      <div className="absolute inset-0 opacity-0 w-full h-full">
        <DaimoPayButton
          appId="pay-demo" // Replace with your actual Daimo app ID in production
          intent={`Purchase ${planName} Plan`}
          toAddress={walletAddress}
          toChain={8453} // Base mainnet
          toUnits={amount} // Amount in USDC
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
        />
      </div>
    </div>
  );
}
