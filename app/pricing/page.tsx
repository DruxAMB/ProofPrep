import { Metadata } from "next";
import PricingPlans from "@/components/pricing/PricingPlans";

export const metadata: Metadata = {
  title: "ProofPrep - Pricing Plans",
  description: "Choose a plan to get started with ProofPrep for your interview preparation",};

export default function PricingPage() {
  return (
    <div className="root-layout">
      <div className="mt-6">
        <PricingPlans />
      </div>
    </div>
  );
}
