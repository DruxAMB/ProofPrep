import { ReactNode } from "react";

const Layout = async ({ children }: { children: ReactNode }) => {
  return (
    <div className="root-layout max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {children}
    </div>
  );
};

export default Layout;
