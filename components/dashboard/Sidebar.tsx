"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { User, Wallet, CreditCard, Award, Settings, LogOut } from "lucide-react";
import { toast } from "sonner";
import { signOut } from "@/lib/actions/auth.action";
import { cn } from "@/lib/utils";

interface SidebarProps {
  user: {
    id?: string;
    name?: string;
    email?: string;
    profileImage?: string;
  } | null;
}

export default function Sidebar({ user }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
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

  const sidebarItems = [
    {
      title: "Account",
      items: [
        {
          name: "Profile",
          icon: <User className="h-4 w-4" />,
          href: "/dashboard/profile",
          active: pathname === "/dashboard/profile",
        },
        {
          name: "Wallet",
          icon: <Wallet className="h-4 w-4" />,
          href: "/dashboard/wallet",
          active: pathname === "/dashboard/wallet",
        },
        {
          name: "Settings",
          icon: <Settings className="h-4 w-4" />,
          href: "/dashboard/settings",
          active: pathname === "/dashboard/settings",
        },
      ],
    },
    {
      title: "Plan",
      items: [
        {
          name: "Usage",
          icon: <Award className="h-4 w-4" />,
          href: "/dashboard/usage",
          active: pathname === "/dashboard/usage",
        },
        {
          name: "Billing",
          icon: <CreditCard className="h-4 w-4" />,
          href: "/dashboard/billing",
          active: pathname === "/dashboard/billing",
        },
      ],
    },
  ];

  return (
    <div className="w-64 h-full bg-dark-300/30 border-r border-dark-300/50 flex flex-col">
      {/* User Profile Section */}
      <div className="p-4 border-b border-dark-300/50">
        <div className="flex items-center space-x-3">
          <div className="size-10 rounded-full bg-gradient-to-br from-primary-200/20 to-primary-100/40 flex items-center justify-center">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={user?.name || "User"}
                className="h-10 w-10 rounded-full"
              />
            ) : (
              <User className="h-5 w-5 text-primary-100" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-sm">{user?.name || "Guest"}</span>
            <span className="text-xs text-light-300 truncate max-w-[160px]">
              {user?.email || "Not signed in"}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto p-3 space-y-6">
        {sidebarItems.map((section) => (
          <div key={section.title} className="space-y-2">
            <h3 className="text-xs font-medium text-light-300 uppercase tracking-wider px-3">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
                    item.active
                      ? "bg-primary-200/10 text-primary-100"
                      : "text-light-200 hover:text-light-100 hover:bg-dark-200/50"
                  )}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Logout Button */}
      <div className="p-3 border-t border-dark-300/50">
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-dark-200/50 rounded-md transition-colors"
        >
          {isLoading ? (
            <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
          ) : (
            <LogOut className="h-4 w-4" />
          )}
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
