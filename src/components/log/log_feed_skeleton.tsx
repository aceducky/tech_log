import { Skeleton } from "@/components/ui/skeleton";
import { LogCardSkeleton } from "./log_card";

export function LogFeedSkeleton() {
  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-sm">
          <Skeleton className="h-5 w-12" />
          <span className="text-muted-foreground">/</span>
          <Skeleton className="h-5 w-12" />
        </div>
        <Skeleton className="h-5 w-24" />
      </div>

      <LogCardSkeleton />
      <LogCardSkeleton />
      <LogCardSkeleton />
    </>
  );
}
