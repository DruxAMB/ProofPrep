'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ReloadModal() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Check if we just came from a payment
    const checkPaymentStatus = async () => {
      try {
        const response = await fetch('/interview');
        if (response.status === 200) {
          // Check if user has already reloaded
          const hasReloaded = localStorage.getItem('has_reloaded_after_payment');
          if (!hasReloaded) {
            setShowModal(true);
          }
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      }
    };
    
    checkPaymentStatus();
  }, []);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-dark-300 border border-dark-200 rounded-xl p-6 max-w-md w-full mx-4 space-y-4">
        <h3 className="text-xl font-medium text-light-100">Action Required</h3>
        <p className="text-light-200">
          To ensure all buttons work properly, please reload the page. You only need to do this once.
        </p>
        <div className="flex gap-4 justify-end pt-2">
          {/* Using a link to reload since buttons might not work */}
          <Link 
            href="/interview"
            className="px-4 py-2 bg-primary-200 hover:bg-primary-100 text-dark-100 rounded-lg font-medium transition-colors"
            onClick={() => localStorage.setItem('has_reloaded_after_payment', 'true')}
          >
            Reload Page
          </Link>
          <Link 
            href="#"
            className="px-4 py-2 text-light-200 hover:text-light-100"
            onClick={() => {
              setShowModal(false);
              localStorage.setItem('has_reloaded_after_payment', 'true');
            }}
          >
            Done Before
          </Link>
        </div>
      </div>
    </div>
  );
}
