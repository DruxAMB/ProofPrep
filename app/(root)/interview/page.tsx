import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const Page = async () => {
  const user = await getCurrentUser();

  return (
    <>
      <div className="flex items-center gap-4">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <ArrowLeft className="h-6 w-6 text-primary-200" />
        </Link>
        <h3 className="capitalize text-xl md:text-2xl">Interview generation</h3>
      </div>

      <Agent
        userName={user?.name || "User"}
        userId={user?.id}
        profileImage={user?.profileImage}
        type="generate"
      />
    </>
  );
};

export default Page;
