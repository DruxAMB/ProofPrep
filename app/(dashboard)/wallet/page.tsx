import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { WalletInfo } from "@/components/WalletInfo";

export default async function WalletPage() {

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-white to-light-300 bg-clip-text text-transparent">
        Wallet
      </h1>

      <Card className="border-dark-300/30 bg-dark-300/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Your Wallet</CardTitle>
          <CardDescription>
            Your ProofPrep wallet on Base
          </CardDescription>
        </CardHeader>
        <Separator className="bg-dark-300/30" />
        <CardContent className="pt-6">
          <WalletInfo />
        </CardContent>
      </Card>
    </div>
  );
}
