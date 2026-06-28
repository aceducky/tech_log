import { ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface LogCardProps {
  title: string;
  author: string;
  date: string;
  summary: string;
  href: string;
}

export function LogCard({ title, author, date, summary, href }: LogCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{author}.</span>
          <span>{date}</span>
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="py-0">
        <CardDescription>{summary}</CardDescription>
      </CardContent>
      <CardFooter>
        <Link
          href={href}
          className="text-blue-600 hover:underline text-sm font-medium w-fit flex items-center gap-1"
        >
          Read log <ArrowRight className="w-4 h-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}
