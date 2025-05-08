import dayjs from "dayjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Star, Calendar, Award, TrendingUp, AlertTriangle } from "lucide-react";

import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { cn } from "@/lib/utils";
import LoadingButton from "@/components/ui/loading-button";

// Helper function to get score color class based on score value
const getScoreColorClass = (score: number) => {
  if (score >= 80) return "text-green-500";
  if (score >= 60) return "text-yellow-500";
  return "text-red-500";
};

// Helper function to get progress bar width and color based on score
const getProgressStyle = (score: number) => {
  const width = `${score}%`;
  let colorClass = "bg-red-500";
  
  if (score >= 80) colorClass = "bg-green-500";
  else if (score >= 60) colorClass = "bg-yellow-500";
  
  return { width, colorClass };
};

const Feedback = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id || '',
  });

  const totalScore = feedback?.totalScore || 0;
  const { width: totalScoreWidth, colorClass: totalScoreColor } = getProgressStyle(totalScore);
  const formattedDate = feedback?.createdAt
    ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")
    : "N/A";

  return (
    <section className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <ArrowLeft className="h-6 w-6 text-primary-200" />
        </Link>
        <h1 className="text-3xl font-bold">
          <span className="capitalize">{interview.role}</span> Interview Feedback
        </h1>
      </div>
      
      {/* Summary Card */}
      <div className="card-border p-6 rounded-xl bg-dark-200/30 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          {/* Score Section */}
          <div className="flex-1 flex flex-col items-center justify-center p-4 bg-dark-300/50 rounded-lg">
            <div className="text-6xl font-bold mb-2 flex items-baseline">
              <span className={getScoreColorClass(totalScore)}>{totalScore}</span>
              <span className="text-light-400 text-xl">/100</span>
            </div>
            <div className="w-full h-3 bg-dark-100 rounded-full overflow-hidden mt-2">
              <div 
                className={`h-full rounded-full ${totalScoreColor}`} 
                style={{ width: totalScoreWidth }}
              ></div>
            </div>
            <p className="text-light-300 mt-3 text-center">Overall Performance</p>
          </div>
          
          {/* Interview Details */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary-200" />
              <span className="text-light-200">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary-200" />
              <span className="text-light-200 capitalize">{interview.type} Interview</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary-200" />
              <span className="text-light-200">{interview.techstack.join(", ")}</span>
            </div>
          </div>
        </div>
        
        {/* Final Assessment */}
        <div className="mt-6 p-4 bg-dark-300/30 rounded-lg border-l-4 border-primary-200">
          <p className="text-light-100 italic">&ldquo;{feedback?.finalAssessment}&rdquo;</p>
        </div>
      </div>
      
      {/* Category Scores */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary-200" />
          Performance Breakdown
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {feedback?.categoryScores?.map((category, index) => {
            const { width, colorClass } = getProgressStyle(category.score);
            return (
              <div key={index} className="card-border p-4 rounded-lg bg-dark-200/30">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{category.name}</h3>
                  <span className={cn("font-bold", getScoreColorClass(category.score))}>
                    {category.score}/100
                  </span>
                </div>
                <div className="w-full h-2 bg-dark-100 rounded-full overflow-hidden mb-3">
                  <div 
                    className={`h-full rounded-full ${colorClass}`} 
                    style={{ width }}
                  ></div>
                </div>
                <p className="text-light-300 text-sm">{category.comment}</p>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Strengths and Areas for Improvement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="card-border p-5 rounded-xl bg-dark-200/30 backdrop-blur-sm">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-green-500" />
            Strengths
          </h3>
          <ul className="space-y-3">
            {feedback?.strengths?.map((strength, index) => (
              <li key={index} className="flex gap-2">
                <span className="text-green-500 font-bold">•</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Areas for Improvement */}
        <div className="card-border p-5 rounded-xl bg-dark-200/30 backdrop-blur-sm">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Areas for Improvement
          </h3>
          <ul className="space-y-3">
            {feedback?.areasForImprovement?.map((area, index) => (
              <li key={index} className="flex gap-2">
                <span className="text-yellow-500 font-bold">•</span>
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <LoadingButton 
          href="/"
          iconType="arrowLeft"
          text="Back to Dashboard"
          variant="outline"
          className="group hover:bg-dark-200/50"
          iconClassName="text-primary-200 group-hover:text-primary-100"
        />
        
        <LoadingButton 
          href={`/interview/${id}`}
          iconType="refreshCw"
          text="Retake Interview"
          className="bg-primary-200 hover:bg-primary-100 text-dark-100"
        />
      </div>
    </section>
  );
};

export default Feedback;