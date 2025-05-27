import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { ArrowLeft } from "lucide-react";
import LoadingLink from "@/components/ui/loading-link";
import Link from "next/link";

const Page = async () => {
  const user = await getCurrentUser();

  return (
    <>
      <div className="dark:hidden bg-black rounded-md px-4 py-1">
        <h3 className="text-xl font-medium text-white">Action Required</h3>
        <p className="text-white">
          To ensure all buttons work properly, please reload the page. You only
          need to do this once.{" "}
          <span>
            <Link href="/interview">
              <b>(Reload Page)</b>
            </Link>
          </span>
        </p>
      </div>
      <div className="flex items-center gap-4">
        <LoadingLink
          href="/"
          variant="ghost"
          size="icon"
          className="p-0 hover:opacity-80 hover:bg-transparent transition-opacity cursor-pointer"
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
