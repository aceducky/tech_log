"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";
import { BetterAuthActionButton } from "./better_auth_action_button";

export default function OtherSessionsRevoker() {
  const router = useRouter();
  return (
    <BetterAuthActionButton
      variant="destructive"
      size="sm"
      action={async () =>
        await authClient.revokeOtherSessions(undefined, {
          onSuccess: () => {
            router.refresh();
          },
        })
      }
      successMessage="All other sessions have been revoked successfully"
    >
      <X />
      Revoke all other sessions
    </BetterAuthActionButton>
  );
}
