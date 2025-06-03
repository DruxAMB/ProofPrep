import { getCurrentUser } from "@/lib/actions/auth.action";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import CreditsDisplay from "@/components/credits/CreditsDisplay";
import { getInterviewsByUserId } from "@/lib/actions/general.action";

export default async function UsagePage() {
  const user = await getCurrentUser();
  const userInterviews = user?.id ? await getInterviewsByUserId(user.id) : [];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-white to-light-300 bg-clip-text text-transparent">
        Usage
      </h1>

      {/* Credits Section */}
      <Card className="border-dark-300/30 bg-dark-300/20 mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Credits</CardTitle>
          <CardDescription>
            Your current credits and subscription status
          </CardDescription>
        </CardHeader>
        <Separator className="bg-dark-300/30" />
        <CardContent className="pt-6">
          {user?.id ? (
            <CreditsDisplay userId={user.id} />
          ) : (
            <div className="text-center py-6">
              <p className="text-light-300">Please sign in to view your credits</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Statistics */}
      <Card className="border-dark-300/30 bg-dark-300/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Usage Statistics</CardTitle>
          <CardDescription>
            Your interview and feature usage
          </CardDescription>
        </CardHeader>
        <Separator className="bg-dark-300/30" />
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Interviews Completed */}
            <div>
              <div className="flex justify-between mb-2">
                <h3 className="text-sm font-medium">Interviews Completed</h3>
                <span className="text-sm text-light-300">{userInterviews.length}</span>
              </div>
              <div className="space-y-1">
                <Progress value={Math.min(userInterviews.length * 10, 100)} className="h-2" />
                <p className="text-xs text-light-300">
                  {userInterviews.length > 0 
                    ? `You've completed ${userInterviews.length} interview${userInterviews.length > 1 ? 's' : ''}`
                    : "You haven't completed any interviews yet"}
                </p>
              </div>
            </div>

            {/* Monthly Usage */}
            <div>
              <div className="flex justify-between mb-2">
                <h3 className="text-sm font-medium">Monthly Usage</h3>
                <span className="text-sm text-light-300">Current Month</span>
              </div>
              <div className="bg-gradient-to-br from-dark-300/50 to-dark-200/30 rounded-lg p-4 border border-dark-300/30">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-light-300 text-xs mb-1">Interviews</p>
                    <p className="text-xl font-semibold">{userInterviews.length}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-light-300 text-xs mb-1">Credits Used</p>
                    <p className="text-xl font-semibold">-</p>
                  </div>
                  <div className="text-center">
                    <p className="text-light-300 text-xs mb-1">Feedback Generated</p>
                    <p className="text-xl font-semibold">{userInterviews.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
