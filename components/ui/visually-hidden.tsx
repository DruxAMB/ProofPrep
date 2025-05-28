import React from "react";
import { cn } from "@/lib/utils";

interface VisuallyHiddenProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * VisuallyHidden component
 * Hides content visually while keeping it accessible to screen readers
 */
export function VisuallyHidden({ 
  children, 
  className 
}: VisuallyHiddenProps) {
  return (
    <span
      className={cn(
        "absolute h-px w-px p-0 overflow-hidden whitespace-nowrap border-0",
        "clip-0 m-[-1px]",
        className
      )}
    >
      {children}
    </span>
  );
}
