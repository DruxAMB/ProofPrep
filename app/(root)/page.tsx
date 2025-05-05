import Image from "next/image";

import LoadingLink from "@/components/ui/loading-link";
import InterviewCard from "@/components/InterviewCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";

async function Home() {
  const user = await getCurrentUser();

  // Only fetch interviews if user is authenticated and has an ID
  const userInterviews = user?.id ? await getInterviewsByUserId(user.id) : [];
  const allInterview = user?.id
    ? await getLatestInterviews({ userId: user.id })
    : [];

  const hasPastInterviews =
    (userInterviews && userInterviews.length > 0) || false;
  const hasUpcomingInterviews =
    (allInterview && allInterview.length > 0) || false;

  return (
    <>
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
        />
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <Tabs defaultValue="your-interviews" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <h2>Interviews</h2>
            <TabsList>
              <TabsTrigger value="your-interviews">Your Interviews</TabsTrigger>
              <TabsTrigger value="take-interviews">Take Interviews</TabsTrigger>
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
                allInterview?.map((interview) => (
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
    </>
  );
}

export default Home;
