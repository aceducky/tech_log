import { ArrowRightIcon } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { auth } from "@/lib/auth";
import UserButton from "./auth/user_button";
import WriteLogButton from "./log/write_log_button";
import { NavbarSearch } from "./navbar_search";

export async function Navbar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <>
      <Suspense
        fallback={
          <div className="order-3 w-full md:order-0 md:max-w-md md:flex-1" />
        }
      >
        <NavbarSearch />
      </Suspense>
      <NavigationMenu className="shrink-0">
        <NavigationMenuList className="flex items-center gap-2">
          <NavigationMenuItem>
            {session?.user ? (
              <div className="flex items-center gap-3">
                <WriteLogButton />
                <UserButton
                  userImage={session.user.image}
                  userImageFallback={session.user.name?.[0]?.toLocaleUpperCase()}
                  username={session.user.username}
                />
              </div>
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
    </>
  );
}
