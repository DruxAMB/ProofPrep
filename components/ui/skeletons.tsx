"use client";

import { cn } from "@/lib/utils";

// Base skeleton component with pulse animation
interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "h-5 w-full animate-pulse rounded-md bg-dark-300/50",
        className
      )}
    />
  );
}

// Profile page skeleton
export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-dark-300/50 animate-pulse" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
      
      {/* Content skeleton - card layout */}
      <div className="rounded-lg border border-dark-300/30 bg-dark-300/10 overflow-hidden">
        <div className="p-6 space-y-4">
          <Skeleton className="h-7 w-40" />
          <div className="space-y-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-5 w-5/6" />
          </div>
        </div>
        <div className="border-t border-dark-300/30 p-6 space-y-4">
          <Skeleton className="h-7 w-40" />
          <div className="space-y-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-2/3" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Wallet page skeleton
export function WalletSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <Skeleton className="h-8 w-32" />
      
      {/* Card skeleton */}
      <div className="rounded-lg border border-dark-300/30 bg-dark-300/10 overflow-hidden">
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="pt-4 border-t border-dark-300/30 mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-6 w-36" />
                <div className="h-6 w-6 rounded-full bg-dark-300/50 animate-pulse" />
              </div>
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-4 w-56 mt-3" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Settings page skeleton
export function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <Skeleton className="h-8 w-32" />
      
      {/* Two cards layout */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-dark-300/30 bg-dark-300/10 p-6 space-y-4">
          <Skeleton className="h-6 w-40" />
          <div className="space-y-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </div>
        
        <div className="rounded-lg border border-dark-300/30 bg-dark-300/10 p-6 space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="space-y-3">
            <Skeleton className="h-5 w-5/6" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-10 w-1/2 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Usage/Billing page skeleton
export function UsageBillingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <Skeleton className="h-8 w-32" />
      
      {/* Credits & usage card */}
      <div className="rounded-lg border border-dark-300/30 bg-dark-300/10 p-6 space-y-5">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-4 w-full rounded-full" />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-4 w-full rounded-full" />
        </div>
      </div>
      
      {/* Activity list */}
      <div className="rounded-lg border border-dark-300/30 bg-dark-300/10 p-6 space-y-4">
        <Skeleton className="h-6 w-40" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-start justify-between pb-4 border-b border-dark-300/30 last:border-b-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-dark-300/50 animate-pulse" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
              <div className="text-right space-y-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Dashboard skeleton
export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Hero card skeleton */}
      <div className="rounded-lg bg-dark-300/10 border border-dark-300/30 p-6 flex justify-between items-center">
        <div className="space-y-4 max-w-lg">
          <Skeleton className="h-8 w-4/5" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-10 w-40 rounded-md" />
        </div>
        <div className="h-64 w-64 rounded-lg bg-dark-300/50 animate-pulse hidden md:block" />
      </div>
      
      {/* Interviews section skeleton */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-7 w-32" />
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-32 rounded-md" />
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-lg border border-dark-300/30 bg-dark-300/10 p-5 space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-6 w-6 rounded-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
              <div className="flex space-x-2">
                <Skeleton className="h-8 w-20 rounded-full" />
                <Skeleton className="h-8 w-20 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
