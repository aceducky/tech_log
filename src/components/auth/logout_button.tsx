"use client";

import { LogOut } from "lucide-react";

import { authClient } from "@/lib/auth/auth-client";
import { BetterAuthActionButton } from "./better_auth_action_button";

export default function LogoutButton() {
  return (
    <BetterAuthActionButton
      variant="destructive"
      action={async () =>
        await authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              window.location.href = "/";
            },
          },
        })
      }
    >
      <LogOut /> Logout
    </BetterAuthActionButton>
  );
}
