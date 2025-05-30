import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { SettingsModal } from "@/components/settings-modal";

import { isAuthenticated } from "@/lib/actions/auth.action";

const Layout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/sign-in");

  return (
    <div className="root-layout">
      <nav className="flex items-center justify-between gap-2 rounded-full border-2 border-primary-200/50 p-2 px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="ProofPrep Logo" width={38} height={32} />
          <h2 className="text-primary-100">ProofPrep</h2>
        </Link>
        
        <SettingsModal />
      </nav>

      {children}
    </div>
  );
};

export default Layout;
