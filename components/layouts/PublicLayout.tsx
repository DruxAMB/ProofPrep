import { ReactNode } from 'react';
import Navbar from '@/components/nav/Navbar';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
