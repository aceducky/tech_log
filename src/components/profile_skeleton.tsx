import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

export function ProfileSkeleton() {
  return (
    <div className="px-4 mb-10">
      <Skeleton className="h-9 w-36" />

      <div className="flex flex-col gap-6 max-w-md mx-auto mt-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl text-center">Profile</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-20" />
            <div className="flex items-center gap-2.5">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-28" />
            </div>
            <div className="flex justify-center pt-1">
              <Skeleton className="h-9 w-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl text-center">Sessions</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
