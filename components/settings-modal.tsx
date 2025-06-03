"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Settings,
  User,
  Wallet as WalletIcon,
  Shield,
  X,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/actions/auth.action";
import { WalletInfo } from "@/components/WalletInfo";

export function SettingsModal() {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<
    "profile" | "wallet" | "achievements"
  >("profile");
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Use a ref to prevent unnecessary re-renders
  const mountedRef = React.useRef(true);

  const handleLogout = async () => {
    if (!mountedRef.current) return;

    try {
      setIsLoading(true);
      await signOut();

      if (mountedRef.current) {
        setOpen(false);
        toast.success("Logged out successfully");
        router.push("/sign-in");
      }
    } catch (error) {
      console.error("Logout error:", error);
      if (mountedRef.current) {
        toast.error("Failed to log out. Please try again.");
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  // Cleanup effect
  React.useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-light-300 hover:text-light-100 hover:bg-dark-300/20 cursor-pointer"
        >
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[90vw] max-w-[410px] p-0 bg-gradient-to-b from-[#1a4a54]/95 to-[#08090D]/80 backdrop-blur-md border-primary-300/50 shadow-xl"
        align="end"
      >
        <div className="max-h-[80vh] overflow-y-auto">
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Settings</h2>
              <Button
                variant="ghost"
                size="icon"
                className="text-light-300 hover:text-light-100 hover:bg-dark-300/20"
                onClick={() => setOpen(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-2 mb-4 border-b border-dark-300/50 overflow-x-auto">
              <button
                onClick={() => setActiveTab("profile")}
                className={`px-4 py-2 font-medium transition-colors relative ${
                  activeTab === "profile"
                    ? "text-primary-200"
                    : "text-light-300 hover:text-light-100"
                }`}
              >
                <div className="flex items-center gap-2 cursor-pointer">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </div>
                {activeTab === "profile" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-200" />
                )}
              </button>

              <button
                onClick={() => setActiveTab("wallet")}
                className={`px-4 py-2 font-medium transition-colors relative ${
                  activeTab === "wallet"
                    ? "text-primary-200"
                    : "text-light-300 hover:text-light-100"
                }`}
              >
                <div className="flex items-center gap-2 cursor-pointer">
                  <WalletIcon className="h-4 w-4" />
                  <span>Wallet</span>
                </div>
                {activeTab === "wallet" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-200" />
                )}
              </button>

              <button
                onClick={() => setActiveTab("achievements")}
                className={`px-4 py-2 font-medium transition-colors relative ${
                  activeTab === "achievements"
                    ? "text-primary-200"
                    : "text-light-300 hover:text-light-100"
                }`}
              >
                <div className="flex items-center gap-2 cursor-pointer">
                  <Shield className="h-4 w-4" />
                  <span>Achievements</span>
                </div>
                {activeTab === "achievements" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-200" />
                )}
              </button>
            </div>

            {/* Tab Content */}
            <div className="space-y-4">
              {/* Profile Section */}
              {activeTab === "profile" && (
                <Card className="border-dark-300/30 bg-dark-300/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Profile Settings</CardTitle>
                    <CardDescription>
                      Manage your account settings and preferences
                    </CardDescription>
                  </CardHeader>
                  <Separator className="bg-dark-300/30" />
                  <CardContent className="pt-4">
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
                          className="w-full backdrop-blur-lg cursor-pointer"
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
              )}

              {/* Web3 Section */}
              {activeTab === "wallet" && (
                <Card className="border-dark-300/30 bg-dark-300/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Wallet</CardTitle>
                    <CardDescription>
                      Your ProofPrep wallet on Base Sepolia
                    </CardDescription>
                  </CardHeader>
                  <Separator className="bg-dark-300/30" />
                  <CardContent className="pt-4">
                    <WalletInfo />
                  </CardContent>
                </Card>
              )}

              {/* Achievements Section */}
              {activeTab === "achievements" && (
                <Card className="border-dark-300/30 bg-dark-300/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Achievements</CardTitle>
                    <CardDescription>
                      Mint your interview achievements as verifiable credentials
                      on Base
                    </CardDescription>
                  </CardHeader>
                  <Separator className="bg-dark-300/30" />
                  <CardContent className="pt-4">
                    <div className="bg-gradient-to-br from-dark-300/50 to-dark-200/30 rounded-lg p-4 border border-dark-300/30">
                      <div className="flex flex-col items-center text-center">
                        <div className="size-12 rounded-full bg-dark-300/50 flex items-center justify-center mb-3">
                          <WalletIcon className="h-6 w-6 text-primary-200" />
                        </div>
                        <h3 className="text-base font-medium mb-1">
                          Connect Your Wallet
                        </h3>
                        <p className="text-light-300 text-xs max-w-md">
                          Connect your wallet to mint your interview
                          achievements as verifiable credentials on Base. This
                          allows you to showcase your skills on-chain.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
