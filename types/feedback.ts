export interface FeedbackData {
  id: string;
  role: string;
  score: number;
  strengths: string[];
  areasForImprovement: string[];
  date: string;
  userId: string;
}
