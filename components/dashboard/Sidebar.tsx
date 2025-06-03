"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { User, Wallet, CreditCard, Award, Settings, LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import { toast } from "sonner";
import { signOut } from "@/lib/actions/auth.action";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Handle window resize to determine if mobile view
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    }; isMobile
    
    // Initial check
    checkIfMobile();
    
    // Add event listener
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  // Close mobile menu when navigating
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

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
      title: "",
      items: [
        {
          name: "Dashboard",
          icon: <LayoutDashboard className="h-4 w-4" />,
          href: "/",
          active: pathname === "/",
        },
      ],
    },
    {
      title: "Account",
      items: [
        {
          name: "Profile",
          icon: <User className="h-4 w-4" />,
          href: "/profile",
          active: pathname === "/profile",
        },
        {
          name: "Wallet",
          icon: <Wallet className="h-4 w-4" />,
          href: "/wallet",
          active: pathname === "/wallet",
        },
        {
          name: "Settings",
          icon: <Settings className="h-4 w-4" />,
          href: "/settings",
          active: pathname === "/settings",
        },
      ],
    },
    {
      title: "Plan",
      items: [
        {
          name: "Usage",
          icon: <Award className="h-4 w-4" />,
          href: "/usage",
          active: pathname === "/usage",
        },
        {
          name: "Billing",
          icon: <CreditCard className="h-4 w-4" />,
          href: "/billing",
          active: pathname === "/billing",
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-dark-300/50 hover:bg-dark-300/70 text-light-100 rounded-full cursor-pointer"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>
      
      {/* Sidebar - Desktop: fixed, Mobile: slide-in */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-40 bg-dark-300/80 backdrop-blur-sm border-r border-dark-300/50 flex flex-col",
          "transition-all duration-300 ease-in-out",
          "lg:w-64 lg:translate-x-0",
          "w-72 sm:w-80 lg:w-64",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
      {/* User Profile Section */}
      <div className="p-4 pt-16 lg:pt-4 border-b border-dark-300/50">
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
                    "flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors",
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
      <div className="p-3 border-t border-dark-300/50 mt-auto">
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="flex items-center justify-start gap-3 w-full px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-dark-200/50 rounded-lg transition-colors cursor-pointer"
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
      
      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Content padding for fixed sidebar */}
      <div className="lg:pl-64" />
    </>
  );
}
