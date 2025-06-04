import { Metadata } from "next";
import PricingPlans from "@/components/pricing/PricingPlans";
import PublicLayout from "@/components/layouts/PublicLayout";
import { getCurrentUser } from "@/lib/actions/auth.action";

export const metadata: Metadata = {
  title: "ProofPrep - Pricing Plans",
  description: "Choose a plan to get started with ProofPrep for your interview preparation",
};

export default async function PricingPage() {
  // Get current user from server side
  const user = await getCurrentUser();
  
  return (
    <PublicLayout>
      <div className="root-layout">
        <div className="mt-6">
          <PricingPlans userId={user?.id} />
        </div>
      </div>
    </PublicLayout>
  );
}
