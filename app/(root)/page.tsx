import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";
import Dashboard from "@/components/dashboard/Dashboard";

async function Home() {
  const user = await getCurrentUser();

  // Only fetch interviews if user is authenticated and has an ID
  const userInterviews = user?.id ? await getInterviewsByUserId(user.id) : [];
  const allInterviews = user?.id
    ? await getLatestInterviews({ userId: user.id })
    : [];

  return (
    <Dashboard 
      user={user} 
      userInterviews={userInterviews} 
      allInterviews={allInterviews}
    />
  );
}

export default Home;
