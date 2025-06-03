// app/loading.tsx
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-dark-100/80 backdrop-blur-sm">
      <LoadingSpinner size="lg" />
    </div>
  );
}
