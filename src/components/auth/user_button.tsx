"use client";

import type { User } from "better-auth";
import { BookIcon, LogOutIcon, UserIcon } from "lucide-react";

import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth/auth-client";
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
      const { error } = await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            window.location.href = "/";
          },
        },
      });
      if (error) toast.error(error.message ?? "Logout failed");
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
            <Link href={`/user/${props.username}`}>
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
