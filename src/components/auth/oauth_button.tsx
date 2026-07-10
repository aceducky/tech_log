"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth/auth-client";

import { BetterAuthActionButton } from "./better_auth_action_button";
import { GitHubIcon } from "./github_icon";

export function OAuthButton() {
  const [isPending, setIsPending] = useState(false);

  return (
    <BetterAuthActionButton
      variant="outline"
      className="w-4/5 h-10"
      disabled={isPending}
      action={async () => {
        setIsPending(true);
        const res = await authClient.signIn.social({
          provider: "github",
          callbackURL: "/logs",
        });
        return res;
      }}
    >
      <GitHubIcon className="mr-2 h-4 w-4" />
      Continue with Github
    </BetterAuthActionButton>
  );
}
