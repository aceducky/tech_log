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
import { ThemeToggle } from "./theme-toggle";
import { Skeleton } from "./ui/skeleton";

async function NavbarActions() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div>
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
    </div>
  );
}

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-secondary/30 backdrop-blur-xs">
      <div className="mx-auto flex min-h-16 w-9/10 flex-wrap items-center justify-between gap-3 px-2 py-3 md:flex-nowrap">
        <div className="flex shrink-0 items-center gap-2">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            TechLog
          </Link>
        </div>
        <Suspense fallback={<Skeleton className="h-10 w-96" />}>
          <NavbarSearch />
        </Suspense>
        <NavigationMenu className="shrink-0">
          <NavigationMenuList className="flex items-center gap-2">
            <NavigationMenuItem>
              <ThemeToggle />
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Suspense fallback={<Skeleton className="h-10 w-40" />}>
                <NavbarActions />
              </Suspense>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
}
