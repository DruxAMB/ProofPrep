import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";
import Dashboard from "@/components/dashboard/Dashboard";
import LandingPage from "@/components/landing/LandingPage";

async function Home() {
  // Check authentication status
  const user = await getCurrentUser();
  const isAuthenticated = !!user;

  // Only fetch interviews if user is authenticated and has an ID
  const userInterviews = user?.id ? await getInterviewsByUserId(user.id) : [];
  const allInterviews = user?.id
    ? await getLatestInterviews({ userId: user.id })
    : [];

  // Render Dashboard for authenticated users, LandingPage for non-authenticated users
  return isAuthenticated ? (
    <Dashboard 
      user={user} 
      userInterviews={userInterviews} 
      allInterviews={allInterviews}
    />
  ) : (
    <LandingPage />
  );
}

export default Home;
