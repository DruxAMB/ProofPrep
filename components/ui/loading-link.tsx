"use client";

import { useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LoadingLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: "default" | "destructive" | "secondary" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  loadingText?: string;
}

const LoadingLink = ({
  href,
  children,
  className,
  variant = "default",
  size = "default",
  loadingText,
}: LoadingLinkProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    router.push(href);
  };

  return (
    <Button
      className={cn(className)}
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <span className="animate-spin mr-2 inline-block size-4 border-2 border-current border-t-transparent rounded-full" aria-hidden="true"></span>
          {loadingText || "Loading..."}
        </>
      ) : (
        children
      )}
    </Button>
  );
};

export default LoadingLink;
