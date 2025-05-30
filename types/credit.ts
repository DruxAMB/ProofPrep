export type PlanType = "standard" | "pro";

export interface UserCredit {
  id: string;
  userId: string;
  totalCredits: number;
  remainingCredits: number;
  planType: PlanType;
  totalMinutes: number; // Total minutes available based on plan
  minutesUsed: number; // Minutes consumed in interviews
  purchaseDate: Date;
  expirationDate: Date; // When credits expire (2 months from purchase)
  freeSessionsRemaining: number; // Number of free sessions available
}

export interface CreditActivity {
  id: string;
  userId: string;
  activityType: "interview" | "purchase" | "system";
  title: string;
  description: string;
  creditsChange: number;
  minutesUsed?: number;
  interviewId?: string;
  timestamp: Date;
}

export interface CreditPlan {
  id: string;
  name: string;
  price: number;
  credits: number;
  minutesPerCredit: number;
  features: string[];
  isHighlighted?: boolean;
}
