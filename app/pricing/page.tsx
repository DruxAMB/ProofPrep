import { Metadata } from "next";
import { redirect } from "next/navigation";
import PricingPlans from "@/components/pricing/PricingPlans";
import { getCurrentUser } from "@/lib/actions/auth.action";

export const metadata: Metadata = {
  title: "ProofPrep - Pricing Plans",
  description: "Choose a plan to get started with ProofPrep for your interview preparation",
};

export default async function PricingPage() {
  const user = await getCurrentUser();
  
  // Redirect to sign-in if user is not authenticated
  if (!user) {
    redirect("/sign-in");
  }
  
  return (
    <div className="root-layout">
      <div className="mt-6">
        <PricingPlans userId={user.id} />
      </div>
    </div>
  );
}
