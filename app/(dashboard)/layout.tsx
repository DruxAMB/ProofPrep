import { getCurrentUser } from "@/lib/actions/auth.action";
import Sidebar from "@/components/dashboard/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen">
      {/* Sidebar */}
      <Sidebar user={user} />
      
      {/* Main Content */}
      <div className="md:pl-64 p-6 pt-16 md:pt-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
