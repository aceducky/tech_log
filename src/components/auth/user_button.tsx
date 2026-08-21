"use client";

import type { User } from "better-auth";
import { BookIcon, LogOutIcon, UserIcon } from "lucide-react";

import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";
import { logoutAction } from "@/app/actions/logout_action";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export type UserButtonProps = {
  userImage: User["image"];
  userImageFallback: string;
  username: string;
};

export default function UserButton(props: UserButtonProps) {
  const [isLoggingOut, startLogout] = useTransition();

  const handleLogOut = async () => {
    startLogout(async () => {
      const logOutRes = await logoutAction();
      if (logOutRes.error) toast.error(logOutRes.message);
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={props.userImage ?? undefined} />
          <AvatarFallback>
            {props.userImageFallback?.[0]?.toLocaleUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/profile">
              <UserIcon />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/u/${props.username}`}>
              <BookIcon />
              My Logs
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            variant="destructive"
            disabled={isLoggingOut}
            onSelect={async (e) => {
              e.preventDefault();
              await handleLogOut();
            }}
          >
            <LogOutIcon />
            Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
