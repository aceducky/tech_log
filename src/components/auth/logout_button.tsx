"use client";

import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/actions/logout_action";
import { ActionButton } from "../ui/action-button";

export default function LogoutButton() {
  return (
    <ActionButton
      variant="destructive"
      action={async () => await logoutAction()}
    >
      <LogOut /> Logout
    </ActionButton>
  );
}
