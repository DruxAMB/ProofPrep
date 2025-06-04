import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { CreditCard, Package, History } from "lucide-react";
import LoadingLink from "@/components/ui/loading-link";

export default async function BillingPage() {

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-white to-light-300 bg-clip-text text-transparent">
        Billing
      </h1>

      {/* Current Plan */}
      <Card className="border-dark-300/30 bg-dark-300/20 mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Current Plan</CardTitle>
          <CardDescription>
            Your subscription plan and details
          </CardDescription>
        </CardHeader>
        <Separator className="bg-dark-300/30" />
        <CardContent className="pt-6">
          <div className="bg-gradient-to-br from-dark-300/50 to-dark-200/30 rounded-lg p-6 border border-dark-300/30">
            <div className="flex items-start space-x-4">
              <div className="size-12 rounded-full bg-dark-300/50 flex items-center justify-center flex-shrink-0">
                <Package className="h-6 w-6 text-primary-200" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium mb-1">Free Plan</h3>
                    <p className="text-light-300 text-sm mb-4">
                      Basic access to interview practice
                    </p>
                  </div>
                  <span className="bg-primary-200/20 text-primary-100 text-xs px-2 py-1 rounded-full">
                    Active
                  </span>
                </div>
                
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-light-300">Monthly credits</span>
                    <span>5 credits</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-light-300">Interview types</span>
                    <span>Basic</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-light-300">AI feedback</span>
                    <span>Limited</span>
                  </div>
                </div>
                
                <LoadingLink
                  href="/pricing"
                  className="btn-primary w-full text-center"
                  loadingText="Loading Plans..."
                >
                  Upgrade Plan
                </LoadingLink>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card className="border-dark-300/30 bg-dark-300/20 mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Payment Methods</CardTitle>
          <CardDescription>
            Manage your payment methods
          </CardDescription>
        </CardHeader>
        <Separator className="bg-dark-300/30" />
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="size-16 rounded-full bg-dark-300/50 flex items-center justify-center mx-auto mb-4">
              <CreditCard className="h-8 w-8 text-light-300" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Payment Methods</h3>
            <p className="text-light-300 text-sm mb-6 max-w-md mx-auto">
              You don&apos;t have any payment methods set up yet. Add a payment method to upgrade to a premium plan.
            </p>
            <Button variant="outline" className="border-primary-200/30 hover:bg-primary-200/10">
              Add Payment Method
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Credit History */}
      <Card className="border-dark-300/30 bg-dark-300/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Credit History</CardTitle>
          <CardDescription>
            Your credit usage and transaction history
          </CardDescription>
        </CardHeader>
        <Separator className="bg-dark-300/30" />
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="size-16 rounded-full bg-dark-300/50 flex items-center justify-center mx-auto mb-4">
              <History className="h-8 w-8 text-light-300" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Transaction History</h3>
            <p className="text-light-300 text-sm max-w-md mx-auto">
              Your credit usage and transaction history will appear here once you start using the platform.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
