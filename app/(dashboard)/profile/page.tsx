import { getCurrentUser } from "@/lib/actions/auth.action";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User } from "lucide-react";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-white to-light-300 bg-clip-text text-transparent">
        Profile
      </h1>

      <Card className="border-dark-300/30 bg-dark-300/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">User Profile</CardTitle>
          <CardDescription>
            Your personal information
          </CardDescription>
        </CardHeader>
        <Separator className="bg-dark-300/30" />
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="size-16 rounded-full bg-gradient-to-br from-primary-200/20 to-primary-100/40 flex items-center justify-center">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user?.name || "User"}
                  className="h-16 w-16 rounded-full"
                />
              ) : (
                <User className="h-8 w-8 text-primary-100" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-medium">{user?.name || "Guest"}</h2>
              <p className="text-light-300">{user?.email || "Not signed in"}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-light-300 mb-1">Name</h3>
              <p className="text-base">{user?.name || "Not provided"}</p>
            </div>
            <Separator className="bg-dark-300/30" />
            <div>
              <h3 className="text-sm font-medium text-light-300 mb-1">Email</h3>
              <p className="text-base">{user?.email || "Not provided"}</p>
            </div>
            <Separator className="bg-dark-300/30" />
            <div>
              <h3 className="text-sm font-medium text-light-300 mb-1">User ID</h3>
              <p className="text-base font-mono text-sm">{user?.id || "Not available"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
