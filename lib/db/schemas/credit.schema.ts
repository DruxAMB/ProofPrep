import { z } from "zod";

// Zod schema for credit plans
export const creditPlanSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  credits: z.number(),
  minutesPerCredit: z.number(),
  features: z.array(z.string()),
  isHighlighted: z.boolean().optional()
});

// Zod schema for user credits
export const userCreditSchema = z.object({
  id: z.string(),
  userId: z.string(),
  totalCredits: z.number(),
  remainingCredits: z.number(),
  planType: z.enum(["standard", "pro"]),
  totalMinutes: z.number(),
  minutesUsed: z.number(),
  purchaseDate: z.date(),
  expirationDate: z.date(), // When credits expire (2 months from purchase)
  freeSessionsRemaining: z.number() // Track free sessions
});

// Zod schema for credit activity
export const creditActivitySchema = z.object({
  id: z.string(),
  userId: z.string(),
  activityType: z.enum(["interview", "purchase", "system"]),
  title: z.string(),
  description: z.string(),
  creditsChange: z.number(),
  minutesUsed: z.number().optional(),
  interviewId: z.string().optional(),
  timestamp: z.date()
});

// Credit plan defaults
export const defaultCreditPlans = [
  {
    id: "standard-plan",
    name: "Standard Plan",
    price: 9,
    credits: 200,
    minutesPerCredit: 0.1, // 10 minutes per 100 credits
    features: [
      "200 interview credits",
      "20 connected interview minutes",
      "2 free interview sessions",
      "Interview feedback",
      "Customized interview scenarios",
      "Chat Support"
    ],
    isHighlighted: false
  },
  {
    id: "pro-plan",
    name: "Pro Plan",
    price: 49,
    credits: 1000,
    minutesPerCredit: 0.1, // 10 minutes per 100 credits
    features: [
      "1000 interview credits",
      "100 connected interview minutes",
      "2 free interview sessions", 
      "Interview feedback",
      "Customized interview scenarios",
      "Realtime chat with interviewer",
      "Detailed performance metrics",
      "Interview recording",
      "Chat Support"
    ],
    isHighlighted: true
  }
];
