"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Clock, BarChart3, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { getUserCredits, getUserCreditActivity } from "@/lib/actions/credit.action";
import { UserCredit, CreditActivity } from "@/types/credit";

interface CreditsDisplayProps {
  userId: string;
}

const CreditsDisplay = ({ userId }: CreditsDisplayProps) => {
  const [userCredits, setUserCredits] = useState<UserCredit | null>(null);
  const [activities, setActivities] = useState<CreditActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Calculate some derived values
  const percentCreditsRemaining = userCredits 
    ? Math.round((userCredits.remainingCredits / userCredits.totalCredits) * 100)
    : 0;
    
  const percentMinutesUsed = userCredits 
    ? Math.round((userCredits.minutesUsed / userCredits.totalMinutes) * 100)
    : 0;
    
  // Count interviews from activities
  const interviewsCompleted = activities
    .filter(activity => activity.activityType === "interview").length;
  
  // Load user credits and activity
  useEffect(() => {
    const loadCreditsData = async () => {
      try {
        setLoading(true);
        
        // Fetch user credits
        const credits = await getUserCredits(userId);
        if (credits) {
          setUserCredits(credits);
        }
        
        // Fetch credit activity
        const activityData = await getUserCreditActivity(userId);
        setActivities(activityData);
        
        setLoading(false);
      } catch (err) {
        console.error("Error loading credits data:", err);
        setError("Failed to load credits data. Please try again.");
        setLoading(false);
      }
    };
    
    if (userId) {
      loadCreditsData();
    }
  }, [userId]);
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
        <div>
          <h3 className="text-2xl font-semibold mb-1">Your Credits</h3>
          <p className="text-light-300">Manage your interview credits and usage</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-primary-300 hover:bg-primary-300/90">
              <Plus className="h-4 w-4" />
              <span>Buy More Credits</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-dark-100 border-dark-300">
            <DialogHeader>
              <DialogTitle>Buy More Credits</DialogTitle>
              <DialogDescription>
                Choose a plan to continue practicing interviews.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-center mb-6">
                You&apos;ll be redirected to our secure payment page to complete your purchase.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = "/pricing"}
                  className="border-dark-300 hover:border-primary-300 hover:text-primary-300"
                >
                  Standard Plan
                  <span className="ml-auto font-semibold">$29</span>
                </Button>
                <Button 
                  className="bg-primary-300 hover:bg-primary-300/90 text-dark-100"
                  onClick={() => window.location.href = "/pricing"}
                >
                  Pro Plan
                  <span className="ml-auto font-semibold">$59</span>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Credits Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-dark-300 bg-dark-200/80 backdrop-blur-sm overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium flex justify-between">
              <span>Remaining Credits</span>
              <span className="text-primary-300 font-semibold">
                {userCredits?.remainingCredits || 0}/{userCredits?.totalCredits || 0}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress 
                value={percentCreditsRemaining} 
                className="h-2 bg-dark-300"
              />
              
              <div className={`text-sm ${percentCreditsRemaining < 30 ? 'text-red-400' : 'text-light-300'}`}>
                {percentCreditsRemaining < 30 
                  ? "Running low on credits! Consider purchasing more."
                  : `You have enough credits for ${userCredits?.remainingCredits || 0} more interview minutes.`
                }
              </div>
              
              {/* Expiration notice */}
              {userCredits?.expirationDate && (
                <div className="text-sm text-amber-400/90 flex items-center gap-1 mt-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>
                    Credits expire on {new Date(userCredits?.expirationDate).toLocaleDateString()}
                  </span>
                </div>
              )}
              
              {/* Free sessions notice */}
              {(userCredits?.freeSessionsRemaining ?? 0) > 0 && (
                <div className="text-sm text-emerald-400/90 flex items-center gap-1 mt-1">
                  <span className="font-medium">
                    {userCredits?.freeSessionsRemaining} free {userCredits?.freeSessionsRemaining === 1 ? 'session' : 'sessions'} remaining
                  </span>
                </div>
              )}
              
              {percentCreditsRemaining < 30 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="mt-2 w-full border-dark-300 hover:border-primary-300 hover:bg-dark-300/30"
                  onClick={() => window.location.href = "/pricing"}
                >
                  <span>Get More Credits</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-dark-300 bg-dark-200/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium flex justify-between">
              <span>Time Used</span>
              <span className="text-light-300 font-medium">
                {userCredits?.minutesUsed || 0}/{userCredits?.totalMinutes || 0} mins
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress 
                value={percentMinutesUsed} 
                className="h-2 bg-dark-300" 
              />
              
              <div className="flex items-center justify-between text-sm text-light-300">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-blue-500" />
                  <span>Avg. {userCredits ? Math.round(userCredits.minutesUsed / Math.max(1, interviewsCompleted)) : 0} mins/interview</span>
                </div>
                <span>{userCredits ? (userCredits.totalMinutes - userCredits.minutesUsed) : 0} mins remaining</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-dark-300 bg-dark-200/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">Account Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-light-300">Current Plan</dt>
                <dd className="font-semibold">{userCredits?.planType === "standard" ? "Standard" : "Pro"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-light-300">Interviews Completed</dt>
                <dd className="font-semibold">{interviewsCompleted}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-light-300">Purchased On</dt>
                <dd className="font-semibold">{userCredits?.purchaseDate ? new Date(userCredits.purchaseDate).toLocaleDateString() : "N/A"}</dd>
              </div>
              <div className="pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-dark-300 hover:border-primary-300 hover:bg-dark-300/30"
                  onClick={() => window.location.href = "/profile/history"}
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  <span>View Interview History</span>
                </Button>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <Card className="border-dark-300 bg-dark-200/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-300"></div>
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-8 text-light-400">
              <p>No activity yet. Start using ProofPrep to see your activity here.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {activities.map((activity) => (
              <div 
                key={activity.id}
                className="flex items-start justify-between pb-4 border-b border-dark-300 last:border-0 last:pb-0"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${activityTypeStyles[activity.activityType]}`}>
                    {activityIcon(activity.activityType)}
                  </div>
                  <div>
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-light-400">{activity.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-light-300">{
                    new Date(activity.timestamp).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })
                  }</p>
                  {activity.creditsChange && (
                    <p className={`font-medium ${activity.creditsChange > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {activity.creditsChange > 0 ? '+' : ''}{activity.creditsChange} {Math.abs(activity.creditsChange) === 1 ? 'credit' : 'credits'}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Style configurations for the activity types
const activityTypeStyles: Record<string, string> = {
  interview: "bg-blue-500/20 text-blue-500",
  purchase: "bg-emerald-500/20 text-emerald-500",
  system: "bg-amber-500/20 text-amber-500",
};

// Icon for different activity types
const activityIcon = (type: string) => {
  switch (type) {
    case 'interview':
      return <Clock className="h-4 w-4" />;
    case 'purchase':
      return <Plus className="h-4 w-4" />;
    case 'system':
      return <BarChart3 className="h-4 w-4" />;
    default:
      return null;
  }
};



export default CreditsDisplay;
