"use client";

import type { Session } from "better-auth";
import { Monitor, Smartphone, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { UAParser } from "ua-parser-js";
import { authClient } from "@/lib/auth/auth-client";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BetterAuthActionButton } from "./better_auth_action_button";

type SessionCardProps = {
  session: Session;
  currSession?: Session;
};

function getBrowserInformation(userAgentInfo: UAParser.IResult | null) {
  if (userAgentInfo == null) return "Unknown Device";
  if (userAgentInfo.browser.name == null && userAgentInfo.os.name == null) {
    return "Unknown Device";
  }

  if (userAgentInfo.browser.name == null) return userAgentInfo.os.name;
  if (userAgentInfo.os.name == null) return userAgentInfo.browser.name;

  return `${userAgentInfo.browser.name}, ${userAgentInfo.os.name}`;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function SessionCard({
  session,
  currSession,
}: SessionCardProps) {
  const router = useRouter();
  const isCurrSession = session.token === currSession?.token;
  const userAgentInfo = session.userAgent ? UAParser(session.userAgent) : null;
  return (
    <Card size="sm">
      <CardHeader className="flex justify-between items-center pb-0">
        <CardTitle className="text-sm font-semibold">
          {getBrowserInformation(userAgentInfo)}
        </CardTitle>
        {isCurrSession && (
          <Badge variant="secondary" className="text-xs">
            Current Session
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2.5">
            {userAgentInfo?.device.type === "mobile" ? (
              <Smartphone className="size-4 shrink-0 text-muted-foreground" />
            ) : (
              <Monitor className="size-4 shrink-0 text-muted-foreground" />
            )}
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">
                Created: {formatDate(session.createdAt)}
              </p>
              <p className="text-xs text-muted-foreground">
                Expires: {formatDate(session.expiresAt)}
              </p>
            </div>
          </div>
          {!isCurrSession && (
            <BetterAuthActionButton
              className="mx-auto w-1/2"
              variant="destructive"
              size="sm"
              action={async () =>
                await authClient.revokeSession(
                  { token: session.token },
                  {
                    onSuccess: () => router.refresh(),
                  },
                )
              }
              successMessage="Session revoked"
            >
              <Trash2 className="size-3.5" /> Revoke session
            </BetterAuthActionButton>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
