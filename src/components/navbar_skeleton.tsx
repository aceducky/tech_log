import { Skeleton } from "@/components/ui/skeleton";

export function NavbarSkeleton() {
  return (
    <>
      <Skeleton className="order-3 w-full md:order-0 md:max-w-md md:flex-1 h-10 rounded-full" />
      <div className="shrink-0">
        <Skeleton className="h-9 w-24" />
      </div>
    </>
  );
}
