"use client";

import { LogOut } from "lucide-react";

import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";
import { BetterAuthActionButton } from "./better_auth_action_button";

export default function LogoutButton() {
  const router = useRouter();
  const pathName = usePathname();
  return (
    <BetterAuthActionButton
      variant="destructive"
      action={async () =>
        await authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              if (pathName !== "/") router.replace("/");
              router.refresh();
            },
          },
        })
      }
    >
      <LogOut /> Logout
    </BetterAuthActionButton>
  );
}
