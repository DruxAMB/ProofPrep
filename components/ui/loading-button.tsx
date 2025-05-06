"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, RefreshCw, ArrowRight, Plus, Trash, Edit, Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LoadingButtonProps {
  href: string;
  iconType: "arrowLeft" | "refreshCw" | "arrowRight" | "plus" | "trash" | "edit" | "check" | "x";
  text: string;
  variant?: "default" | "outline" | "destructive" | "secondary" | "ghost" | "link";
  className?: string;
  iconClassName?: string;
}

const LoadingButton = ({
  href,
  iconType,
  text,
  variant = "default",
  className = "",
  iconClassName = ""
}: LoadingButtonProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsLoading(true);
    router.push(href);
  };

  return (
    <Link href={href} onClick={handleClick} className="flex-1">
      <Button 
        variant={variant} 
        className={cn("w-full cursor-pointer", className)}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span className="animate-spin mr-2 inline-block size-4 border-2 border-current border-t-transparent rounded-full" aria-hidden="true"></span>
            <span className="font-medium">Loading...</span>
          </>
        ) : (
          <>
            {iconType === "arrowLeft" && <ArrowLeft className={cn("mr-2 h-4 w-4", iconClassName)} />}
            {iconType === "refreshCw" && <RefreshCw className={cn("mr-2 h-4 w-4", iconClassName)} />}
            {iconType === "arrowRight" && <ArrowRight className={cn("mr-2 h-4 w-4", iconClassName)} />}
            {iconType === "plus" && <Plus className={cn("mr-2 h-4 w-4", iconClassName)} />}
            {iconType === "trash" && <Trash className={cn("mr-2 h-4 w-4", iconClassName)} />}
            {iconType === "edit" && <Edit className={cn("mr-2 h-4 w-4", iconClassName)} />}
            {iconType === "check" && <Check className={cn("mr-2 h-4 w-4", iconClassName)} />}
            {iconType === "x" && <X className={cn("mr-2 h-4 w-4", iconClassName)} />}
            <span className="font-medium">{text}</span>
          </>
        )}
      </Button>
    </Link>
  );
};

export default LoadingButton;
