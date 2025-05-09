import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Page = async () => {
  const user = await getCurrentUser();

  return (
    <>
      <h3 className="capitalize text-xl md:text-2xl">Interview generation</h3>

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
