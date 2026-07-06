import Link from "next/link";
import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { NavbarSkeleton } from "@/components/navbar_skeleton";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b bg-secondary/30 backdrop-blur-xs">
        <div className="mx-auto flex min-h-16 w-9/10 flex-wrap items-center justify-between gap-3 px-2 py-3 md:flex-nowrap">
          <div className="flex shrink-0 items-center gap-2">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              TechLog
            </Link>
          </div>
          <Suspense fallback={<NavbarSkeleton />}>
            <Navbar />
          </Suspense>
        </div>
      </nav>
      {children}
    </>
  );
}
