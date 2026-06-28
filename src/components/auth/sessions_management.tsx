import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Separator } from "../ui/separator";
import OtherSessionsRevoker from "./other_sessions_revoker";
import SessionCard from "./session_card";

export default async function SessionManagement({
  currSessionToken,
}: {
  currSessionToken: string;
}) {
  const sessions = await auth.api.listSessions({ headers: await headers() });
  const currSession = sessions.find(
    (session) => session.token === currSessionToken,
  );
  const otherSessions = sessions.filter(
    (session) => session.token !== currSessionToken,
  );
  return (
    <div className="flex flex-col gap-5">
      <div>
        {currSession && (
          <SessionCard session={currSession} currSession={currSession} />
        )}
      </div>
      <Separator />
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">
          Other sessions
        </h3>
        {otherSessions.length === 0 ? (
          <p className="text-sm text-center text-muted-foreground py-2">
            No other sessions found
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex justify-center">
              <OtherSessionsRevoker />
            </div>
            <div className="flex flex-col gap-2">
              {otherSessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  currSession={currSession}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
