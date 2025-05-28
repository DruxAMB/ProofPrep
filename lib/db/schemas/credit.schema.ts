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
  purchaseDate: z.date()
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
    id: "standard",
    name: "Standard Plan",
    price: 29,
    credits: 5,
    minutesPerCredit: 45,
    features: [
      "5 interview credits",
      "30-45 min per interview",
      "Basic AI feedback",
      "Technical & behavioral questions",
      "Performance analytics"
    ],
    isHighlighted: false
  },
  {
    id: "pro",
    name: "Pro Plan",
    price: 59,
    credits: 12,
    minutesPerCredit: 45,
    features: [
      "12 interview credits",
      "30-45 min per interview",
      "Advanced AI feedback",
      "Customized interview scenarios",
      "Detailed performance metrics",
      "Interview recording feature"
    ],
    isHighlighted: true
  }
];
