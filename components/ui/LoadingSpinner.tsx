// components/ui/LoadingSpinner.tsx

const LoadingSpinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
  };

  return (
    <div className={`flex justify-center items-center h-full w-full`}>
      <div
        className={`animate-spin rounded-full ${sizeClasses[size]} border-t-2 border-b-2 border-primary-100`}
      ></div>
    </div>
  );
};

export default LoadingSpinner;
