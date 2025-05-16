"use client";

import { useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface LoadingLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: "default" | "destructive" | "secondary" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  loadingText?: string;
}

export function LoadingLink({
  href,
  children,
  className,
  variant = "default",
  size = "default",
  loadingText = "Loading...",
}: LoadingLinkProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    router.push(href);
  };

  return (
    <Button
      asChild={!isLoading}
      className={cn(className)}
      variant={variant}
      size={size}
      onClick={isLoading ? undefined : handleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="flex items-center">
          <span className="animate-spin mr-2 inline-block size-4 border-2 border-current border-t-transparent rounded-full" aria-hidden="true"></span>
          <span>{loadingText}</span>
        </div>
      ) : (
        <Link href={href}>{children}</Link>
      )}
    </Button>
  );
}

export default LoadingLink;
