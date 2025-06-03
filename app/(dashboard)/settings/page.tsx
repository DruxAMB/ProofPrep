"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { LogOut, Shield } from "lucide-react";
import { signOut } from "@/lib/actions/auth.action";
import { toast } from "sonner";

export default function SettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await signOut();
      toast.success("Logged out successfully");
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-white to-light-300 bg-clip-text text-transparent">
        Settings
      </h1>

      <div className="space-y-6">
        <Card className="border-dark-300/30 bg-dark-300/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Account Settings</CardTitle>
            <CardDescription>
              Manage your account settings and preferences
            </CardDescription>
          </CardHeader>
          <Separator className="bg-dark-300/30" />
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex flex-col">
                <h3 className="text-sm font-medium mb-2">Session</h3>
                <p className="text-light-300 text-xs mb-4">
                  Sign out from your current session
                </p>
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  size="sm"
                  className="w-full max-w-xs backdrop-blur-lg cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span
                        className="animate-spin mr-2 inline-block size-4 border-2 border-current border-t-transparent rounded-full"
                        aria-hidden="true"
                      ></span>
                      Logging out...
                    </>
                  ) : (
                    <>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-dark-300/30 bg-dark-300/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Security</CardTitle>
            <CardDescription>
              Manage your security settings
            </CardDescription>
          </CardHeader>
          <Separator className="bg-dark-300/30" />
          <CardContent className="pt-6">
            <div className="bg-gradient-to-br from-dark-300/50 to-dark-200/30 rounded-lg p-4 border border-dark-300/30">
              <div className="flex items-start space-x-4">
                <div className="size-10 rounded-full bg-dark-300/50 flex items-center justify-center flex-shrink-0">
                  <Shield className="h-5 w-5 text-primary-200" />
                </div>
                <div>
                  <h3 className="text-base font-medium mb-1">
                    Account Protection
                  </h3>
                  <p className="text-light-300 text-sm">
                    Your account is protected with Firebase Authentication. To change your password or update security settings, please use the Firebase authentication portal.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
