import { ArrowRightIcon } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { auth } from "@/lib/auth";
import UserButton from "./auth/user_button";

export async function Navbar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <nav className="w-full border-b bg-secondary/30 backdrop-blur-xs sticky top-0 z-50">
      <div className="mx-auto flex h-16 items-center justify-between px-2 w-9/10">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            TechLog
          </Link>
        </div>
        <NavigationMenu>
          <NavigationMenuList className="flex items-center gap-2">
            <NavigationMenuItem>
              {session?.user ? (
                <UserButton
                  userImage={session.user.image}
                  userImageFallback={session.user.name?.[0]?.toLocaleUpperCase()}
                />
              ) : (
                <Button asChild className="group">
                  <Link href="/sign-in">
                    Get started
                    <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </Button>
              )}
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
}
