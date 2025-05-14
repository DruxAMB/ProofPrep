import { redirect } from "next/navigation";

import Agent from "@/components/Agent";

import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import DisplayTechIcons from "@/components/DisplayTechIcons";
import { ArrowLeft } from "lucide-react";
import LoadingLink from "@/components/ui/loading-link";

const InterviewDetails = async ({ params }: RouteParams) => {
  const { id } = await params;

  const user = await getCurrentUser();

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id || '',
  });

  return (
    <>
      <div className="flex flex-row gap-1 justify-between">
        <div className="flex flex-row gap-1 md:gap-4 items-center">
          <div className="flex flex-row gap-4 items-center">
            <LoadingLink 
              href="/" 
              variant="ghost" 
              size="icon" 
              className="p-0 hover:opacity-80 hover:bg-transparent transition-opacity cursor-pointer"
              loadingText="o"
            >
              <ArrowLeft className="h-6 w-6 text-primary-200" />
            </LoadingLink>
            <h3 className="capitalize text-xl md:text-2xl">{interview.role} Interview</h3>
          </div>

          <DisplayTechIcons techStack={interview.techstack} />
        </div>

        <p className="bg-dark-200 px-4 py-2 rounded-lg h-fit">
          {interview.type}
        </p>
      </div>

      <Agent
        userName={user?.name || 'User'}
        userId={user?.id}
        interviewId={id}
        type="interview"
        questions={interview.questions}
        feedbackId={feedback?.id}
        profileImage={user?.profileImage}
      />
    </>
  );
};

export default InterviewDetails;
