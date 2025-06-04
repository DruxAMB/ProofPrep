import { ReactNode } from 'react';
import Navbar from '@/components/nav/Navbar';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="pt-28"> {/* Add padding-top to account for fixed navbar with some extra space */}
        {children}
      </div>
    </>
  );
}
