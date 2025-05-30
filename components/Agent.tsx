"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";
import { hasValidCredits, consumeCredits, consumeFreeSession } from "@/lib/actions/credit.action";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
  profileImage,
}: AgentProps) => {
  const router = useRouter();
  const { toast } = useToast(); // Get toast function from hook
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      console.log("speech start");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("speech end");
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      console.log("Error:", error);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
      console.log("handleGenerateFeedback");

      const { success, feedbackId: id } = await createFeedback({
        interviewId: interviewId!,
        userId: userId!,
        transcript: messages,
        feedbackId,
      });

      if (success && id) {
        router.push(`/interview/${interviewId}/feedback`);
      } else {
        console.log("Error saving feedback");
        router.push("/");
      }
    };

    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        router.push("/");
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, feedbackId, interviewId, router, type, userId]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    try {
      // Skip credit check if no userId (shouldn't happen with auth middleware)
      if (!userId) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to use the interview feature",
          variant: "destructive",
        });
        setCallStatus(CallStatus.INACTIVE);
        router.push("/sign-in?redirect=/interview");
        return;
      }

      // Determine required credits based on interview type
      const requiredCredits = type === "generate" ? 50 : 100; // 50 for generation, 100 for interview
      
      // Check if user has enough credits or free sessions
      const { valid, hasFreeSession } = await hasValidCredits(userId, requiredCredits);
      
      if (!valid) {
        toast({
          title: "Insufficient Credits",
          description: "You need more credits or a plan to use this feature. Please visit the pricing page.",
          variant: "destructive",
        });
        setCallStatus(CallStatus.INACTIVE);
        router.push("/pricing");
        return;
      }
      
      // Start the interview based on type
      if (type === "generate") {
        await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
          variableValues: {
            username: userName,
            userid: userId,
          },
        });
      } else {
        let formattedQuestions = "";
        if (questions) {
          formattedQuestions = questions
            .map((question) => `- ${question}`)
            .join("\n");
        }

        await vapi.start(interviewer, {
          variableValues: {
            questions: formattedQuestions,
          },
        });
      }
      
      // Successfully started - deduct credits or use free session
      if (hasFreeSession) {
        await consumeFreeSession(userId);
        toast({
          title: "Free Session Used",
          description: "You are using one of your free interview sessions.",
        });
      } else {
        // Calculate minutes based on credits (10 credits = 1 minute)
        const minutesUsed = requiredCredits / 10;
        const success = await consumeCredits(userId, interviewId || 'generated', requiredCredits, minutesUsed);
        
        if (success) {
          toast({
            title: "Credits Used",
            description: `${requiredCredits} credits have been deducted from your account.`,
          });
        }
      }
    } catch (error) {
      console.error("Failed to start call:", error);
      setCallStatus(CallStatus.INACTIVE);
      toast({
        title: "Error Starting Interview",
        description: "There was an error starting the interview. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  return (
    <>
      <div className="call-view">
        {/* AI Interviewer Card */}
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/interview.gif"
              alt="profile-image"
              width={100}
              height={100}
              className="object-cover"
              unoptimized
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>

        {/* User Profile Card */}
        <div className="card-border">
          <div className="card-content">
            <Image
              src={profileImage || "/user-avatar.png"}
              alt="profile-image"
              width={539}
              height={539}
              className="rounded-full object-cover size-[120px]"
            />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={lastMessage}
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100"
              )}
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center">
        {callStatus !== "ACTIVE" ? (
          <button 
            className="relative btn-call" 
            onClick={() => handleCall()}
            disabled={callStatus === CallStatus.CONNECTING}
          >
            {callStatus === CallStatus.CONNECTING ? (
              <>
                <span className="absolute animate-ping rounded-full opacity-75" />
                <span className="relative flex items-center">
                  <span className="animate-spin mr-2 inline-block size-4 border-2 border-current border-t-transparent rounded-full" aria-hidden="true"></span>
                  Connecting...
                </span>
              </>
            ) : (
              <span className="relative">
                {callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED
                  ? "Start"
                  : "Connecting..."}
              </span>
            )}
          </button>
        ) : (
          <button className="btn-disconnect" onClick={() => handleDisconnect()}>
            End
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;
