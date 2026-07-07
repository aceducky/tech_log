"use client";

import { ArrowLeft, RotateCcw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight">
          Something went wrong!
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          {error.message ||
            "An unexpected error occurred while loading this page."}
        </p>
      </div>
      <div className=" flex flex-row gap-6 flex-wrap justify-center">
        <Button onClick={() => reset()} variant="default">
          <RotateCcw className="mr-2 h-4 w-4" /> Try again
        </Button>

        <Button asChild variant="secondary">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Return Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
