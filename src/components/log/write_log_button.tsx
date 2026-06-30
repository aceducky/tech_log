"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

export default function WriteLogButton() {
  const pathname = usePathname();

  if (pathname === "/logs/create") return null;
  return (
    <Button asChild variant="secondary">
      <Link href="/logs/create">Write log</Link>
    </Button>
  );
}
