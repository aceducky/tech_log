import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { LogWithAuthor } from "@/lib/dal/logs_dal";
import { logDateFormat } from "@/lib/utils";
import { LogMdRenderer } from "./log_md_renderer";

type LogCardProps = Omit<
  LogWithAuthor,
  "id" | "authorId" | "createdAt" | "pageViews" | "updatedAt" | "content"
> & {
  href: string;
  preview: string;
  createdAt: string | Date;
};
export function LogCard(props: LogCardProps) {
  return (
    <Card className="mx-2">
      <CardHeader className="pb-2">
        {props.coverImgUrl && (
          <div className="mb-8">
            <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden">
              <Image
                src={props.coverImgUrl}
                alt={`Image for ${props.title}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link
            href={`/user/${props.authorUsername}`}
            className="hover:underline hover:text-foreground transition-colors"
          >
            @{props.authorUsername}
          </Link>
          <span className="text-muted-foreground">{props.authorName}</span>
          <span>{logDateFormat(props.createdAt)}</span>
        </div>
        <CardTitle className="text-lg">{props.title}</CardTitle>
      </CardHeader>
      <CardContent className="py-0">
        <CardDescription>
          <LogMdRenderer content={props.preview} showImages={false} />
        </CardDescription>
      </CardContent>
      <CardFooter>
        <Link
          href={props.href}
          className="text-blue-600 hover:underline text-sm font-medium w-fit flex items-center gap-1"
        >
          Read log <ArrowRight className="w-4 h-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}

export function LogCardSkeleton() {
  return (
    <Card className="mx-2">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-7 w-3/4" />
      </CardHeader>
      <CardContent className="py-0">
        <CardDescription className="space-y-2 mb-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-4 w-[80%]" />
        </CardDescription>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-5 w-24" />
      </CardFooter>
    </Card>
  );
}
