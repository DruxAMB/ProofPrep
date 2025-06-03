import Image from "next/image";
import LoadingLink from "@/components/ui/loading-link";
import InterviewCard from "@/components/InterviewCard";
import CreditsDisplay from "@/components/credits/CreditsDisplay";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Sidebar from "@/components/dashboard/Sidebar";

// Adding a basic Interview type - you may already have this defined elsewhere
interface Interview {
  id: string;
  role: string;
  type: string;
  techstack: string[];
  createdAt: string;
}

interface DashboardProps {
  user: {
    id?: string;
    name?: string;
    email?: string;
    profileImage?: string;
  } | null;
  userInterviews: Interview[];
  allInterviews: Interview[];
}

const Dashboard = ({ user, userInterviews, allInterviews }: DashboardProps) => {
  const hasPastInterviews = (userInterviews && userInterviews.length > 0) || false;
  const hasUpcomingInterviews = (allInterviews && allInterviews.length > 0) || false;

  return (
    <div className="min-h-screen">
      {/* Sidebar */}
      <Sidebar user={user} />
      
      {/* Main Content */}
      <div className="lg:pl-[300px] p-6 pt-16 lg:pt-6">
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Nail Every Interview with AI Practice & Instant Feedback</h2>
          <p className="text-lg">
            Practice Real Questions. Get Instant Feedback. Land the Job.
          </p>

          <LoadingLink
            href="/interview"
            className="btn-primary max-sm:w-full"
            loadingText="Loading Interview..."
          >
            Start an Interview
          </LoadingLink>
        </div>

        <Image
          src="/robot.gif"
          alt="robo-dude"
          width={400}
          height={400}
          className="max-sm:hidden"
          unoptimized
        />
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <Tabs defaultValue="your-interviews" className="w-full">
          <div className="md:flex items-center justify-between mb-4">
            <h2>Interviews</h2>
            <TabsList>
              <TabsTrigger value="your-interviews" className="cursor-pointer">Your Interviews</TabsTrigger>
              <TabsTrigger value="take-interviews" className="cursor-pointer">Take Interviews</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="your-interviews" className="w-full">
            <div className="interviews-section">
              {hasPastInterviews ? (
                userInterviews?.map((interview) => (
                  <InterviewCard
                    key={interview.id}
                    userId={user?.id}
                    interviewId={interview.id}
                    role={interview.role}
                    type={interview.type}
                    techstack={interview.techstack}
                    createdAt={interview.createdAt}
                  />
                ))
              ) : (
                <div className="card-border w-full p-8 text-center">
                  <p className="text-lg">You haven&apos;t taken any interviews yet</p>
                  <p className="text-light-400 mt-2">Start an interview to practice your skills</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="take-interviews" className="w-full">
            <div className="interviews-section">
              {hasUpcomingInterviews ? (
                allInterviews?.map((interview) => (
                  <InterviewCard
                    key={interview.id}
                    userId={user?.id}
                    interviewId={interview.id}
                    role={interview.role}
                    type={interview.type}
                    techstack={interview.techstack}
                    createdAt={interview.createdAt}
                  />
                ))
              ) : (
                <div className="card-border w-full p-8 text-center">
                  <p className="text-lg">There are no interviews available</p>
                  <p className="text-light-400 mt-2">Check back later for new interview opportunities</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </section>
      </div>
    </div>
  );
};

export default Dashboard;
