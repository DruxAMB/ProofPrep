'use client';

export function ConnectButton() {
  return (
    <div className="flex justify-end mb-4">
      <button 
        className="flex items-center gap-2 px-4 py-2 bg-primary-200 hover:bg-primary-100 text-dark-100 rounded-xl font-medium transition-colors"
      >
        Connect
      </button>
    </div>
  );
}
