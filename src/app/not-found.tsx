import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="m-auto flex max-w-2xl flex-col items-center justify-center gap-y-4 overflow-hidden">
      <h2 className="text-2xl font-bold">Not Found</h2>
      <p>Could not find requested resource</p>
      <Button asChild>
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" /> Return Home
        </Link>
      </Button>
    </div>
  );
}
