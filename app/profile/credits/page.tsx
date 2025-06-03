import { Metadata } from "next";
import { redirect } from "next/navigation";
import CreditsDisplay from "@/components/credits/CreditsDisplay";
import { getCurrentUser } from "@/lib/actions/auth.action";

export const metadata: Metadata = {
  title: "ProofPrep - Credits Dashboard",
  description: "Manage your ProofPrep interview credits",
};

export default async function CreditsPage() {
  const user = await getCurrentUser();
  
  // Redirect to sign-in if user is not authenticated
  if (!user) {
    redirect("/");
  }
  
  return (
    <div className="root-layout">
      <div className="my-8 max-w-7xl mx-auto px-4 sm:px-6">
        <CreditsDisplay userId={user.id} />
      </div>
    </div>
  );
}
