"use client";

import { Edit3 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

export default function WriteLogButton() {
  const pathname = usePathname();

  if (pathname === "/logs/create") return null;
  return (
    <Button asChild variant="secondary">
      <Link href="/logs/create">
        <Edit3 className="w-4 h-4" /> Write log
      </Link>
    </Button>
  );
}
