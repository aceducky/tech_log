import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

export function Navbar() {
  return (
    <nav className="w-full border-b bg-secondary/30 backdrop-blur-xs sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            TechLog
          </Link>
        </div>
        <NavigationMenu>
          <NavigationMenuList className="flex items-center gap-2">
            <NavigationMenuItem>
              <Button asChild className="group">
                <Link href="/signin">
                  Get started
                  <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
}
