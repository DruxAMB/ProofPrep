import { getCurrentUser } from "@/lib/actions/auth.action";
import Sidebar from "@/components/dashboard/Sidebar";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // Protect dashboard routes - redirect to sign-in if not authenticated
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen">
      {/* Sidebar */}
      <Sidebar user={user} />
      
      {/* Main Content */}
      <div className="lg:pl-64 p-6 pt-16 lg:pt-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
