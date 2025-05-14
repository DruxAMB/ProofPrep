import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { ArrowLeft } from "lucide-react";
import LoadingLink from "@/components/ui/loading-link";

const Page = async () => {
  const user = await getCurrentUser();

  return (
    <>
      <div className="flex items-center gap-4">
        <LoadingLink 
          href="/" 
          variant="ghost" 
          size="icon" 
          className="p-0 hover:opacity-80 hover:bg-transparent transition-opacity"
          loadingText="o"
        >
          <ArrowLeft className="h-6 w-6 text-primary-200" />
        </LoadingLink>
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
