import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { GitHubIcon } from "@/components/auth/github_icon";
import LogoutButton from "@/components/auth/logout_button";
import SessionManagement from "@/components/auth/sessions_management";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { requireSessionServer } from "@/lib/auth/require_session_server";

async function ProfileDetails() {
  const { user } = await requireSessionServer();

  return (
    <div className="space-y-4 pt-4">
      <p className="text-sm font-medium text-muted-foreground">Logged in as</p>
      <div className="flex items-center gap-2.5">
        <GitHubIcon width="20" height="20" />
        <p className="font-semibold">@{user.username}</p>
      </div>
      <div className="text-sm text-muted-foreground space-y-0.5">
        <p>{user.email}</p>
        <p>{user.name}</p>
      </div>
      <div className="flex justify-center pt-1">
        <LogoutButton />
      </div>
    </div>
  );
}

async function ProfileSessions() {
  const { session } = await requireSessionServer();
  return (
    <div className="pt-4">
      <SessionManagement currSessionToken={session.token} />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <div className="px-4 mb-10">
      <Button asChild variant="secondary">
        <Link href="/" className="sticky top-20 z-40 py-2 w-fit">
          <ArrowLeft /> Back to Home
        </Link>
      </Button>

      <div className="flex flex-col gap-6 w-full max-w-md mx-auto mt-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl text-center">Profile</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent>
            <Suspense
              fallback={
                <div className="space-y-4 pt-4">
                  <Skeleton className="h-5 w-20" />
                  <div className="flex items-center gap-2.5">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                  <div className="space-y-0.5">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-5 w-28" />
                  </div>
                  <div className="flex justify-center pt-1">
                    <Skeleton className="h-9 w-24" />
                  </div>
                </div>
              }
            >
              <ProfileDetails />
            </Suspense>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl text-center">Sessions</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent>
            <Suspense
              fallback={
                <div className="space-y-4 pt-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              }
            >
              <ProfileSessions />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
