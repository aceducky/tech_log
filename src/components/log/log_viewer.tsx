import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  Home,
  Info,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { LogType } from "@/lib/dal/logs_dal";
import { logDateFormat } from "@/lib/utils";
import { LogMdRenderer } from "./log_md_renderer";
import LogOwnerVisibleActions from "./log_owner_visible_actions";
import PageViews from "./page_views";

type LogViewerProps = {
  log: LogType;
  isOwner?: boolean;
};

export default async function LogViewer({
  log,
  isOwner = false,
}: LogViewerProps) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
        <Link
          href="/logs"
          className="flex items-center hover:text-foreground transition-colors"
        >
          <Home className="h-4 w-4 mr-1" />
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">{log.title}</span>
      </nav>

      <div className="flex flex-col justify-between items-start mb-6">
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {log.title}
          </h1>

          <div className="flex justify-between flex-wrap w-full gap-4">
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                <span>
                  By{" "}
                  <span className="font-bold">
                    <Link href={`/u/${log.authorUsername}`}>
                      @{log.authorUsername}
                    </Link>
                  </span>{" "}
                  {log.authorName}
                </span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{logDateFormat(log.createdAt)}</span>
                {log.createdAt.toDateString() !==
                  log.updatedAt.toDateString() && (
                  <span className="flex items-center ml-1">
                    <Info className="w-4 h-4 mr-1" /> Updated on:
                    {logDateFormat(log.updatedAt)}
                  </span>
                )}
              </div>
              <PageViews logSlug={log.slug} />
            </div>

            <LogOwnerVisibleActions isOwner={isOwner} slug={log.slug} />
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          {log.coverImgUrl && (
            <div className="mb-8">
              <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden">
                <Image
                  src={log.coverImgUrl}
                  alt={`Image for ${log.title}`}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          )}
          <LogMdRenderer content={log.content} />
        </CardContent>
      </Card>

      <div className="mt-8 flex justify-between items-center">
        <Link href="/logs">
          <Button variant="outline">
            <ArrowLeft className="mr-2" /> Back to Logs
          </Button>
        </Link>

        <LogOwnerVisibleActions isOwner={isOwner} slug={log.slug} />
      </div>
    </div>
  );
}

export function LogViewerSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
        <div className="flex items-center">
          <Home className="h-4 w-4 mr-1" />
          Home
        </div>
        <ChevronRight className="h-4 w-4" />
        <Skeleton className="h-4 w-32" />
      </nav>

      <div className="flex flex-col justify-between items-start mb-6">
        <div className="flex-1 w-full">
          <Skeleton className="h-10 w-3/4 mb-4" />
          <div className="flex justify-between flex-wrap w-full gap-4">
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-5 w-28" />
              </div>
              <div className="flex items-center gap-1">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-5 w-24" />
              </div>
              <Skeleton className="h-5 w-16" />
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </CardContent>
      </Card>

      <div className="mt-8 flex justify-between items-center">
        <Button variant="outline" disabled>
          <ArrowLeft className="mr-2" /> Back to Logs
        </Button>
      </div>
    </div>
  );
}
