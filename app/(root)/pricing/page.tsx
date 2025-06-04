import { Metadata } from "next";
import PricingPlans from "@/components/pricing/PricingPlans";
import PublicLayout from "@/components/layouts/PublicLayout";

export const metadata: Metadata = {
  title: "ProofPrep - Pricing Plans",
  description: "Choose a plan to get started with ProofPrep for your interview preparation",};

export default function PricingPage() {
  return (
    <PublicLayout>
      <div className="root-layout">
        <div className="mt-6">
          <PricingPlans />
        </div>
      </div>
    </PublicLayout>
  );
}
