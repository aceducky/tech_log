import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { GitHubIcon } from "@/components/auth/github_icon";
import LogoutButton from "@/components/auth/logout_button";
import SessionManagement from "@/components/auth/sessions_management";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { requireSessionServer } from "@/lib/auth/require_session_server";

export default async function ProfilePage() {
  const { user, session } = await requireSessionServer();

  return (
    <div className="px-4 mb-10">
      <Button asChild variant="secondary">
        <Link href="/" className="sticky top-20 z-40 py-2 w-fit">
          <ArrowLeft /> Back to Home
        </Link>
      </Button>

      <div className="flex flex-col gap-6 max-w-md mx-auto mt-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl text-center">Profile</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-4">
            <p className="text-sm font-medium text-muted-foreground">
              Logged in as
            </p>
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
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl text-center">Sessions</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent>
            <SessionManagement currSessionToken={session.token} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
