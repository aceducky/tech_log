import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  Edit,
  Home,
  Trash,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { deleteLog } from "@/app/actions/logs";
import { ActionButton } from "@/components/ui/action-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { LogWithAuthor } from "@/lib/dal";

type LogViewerProps = {
  log: LogWithAuthor;
  isOwner?: boolean;
  pageviews?: number | null;
};

export default async function LogViewer({
  log,
  isOwner = false,
}: LogViewerProps) {
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
        <Link
          href="/"
          className="flex items-center hover:text-foreground transition-colors"
        >
          <Home className="h-4 w-4 mr-1" />
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">{log.title}</span>
      </nav>

      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {log.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              <span>
                By <span className="font-bold">@{log.authorUsername}</span>{" "}
                {log.authorName}
              </span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{formatDate(log.createdAt)}</span>
            </div>
          </div>
        </div>

        {isOwner && (
          <div className="ml-4 flex items-center gap-2">
            <Link href={`/logs/edit/${log.id}`} className="cursor-pointer">
              <Button variant="outline" className="cursor-pointer">
                <Edit className="h-4 w-4 mr-2" />
                Edit Log
              </Button>
            </Link>

            <ActionButton
              variant="destructive"
              className="ml-2 cursor-pointer"
              requireAreYouSure
              areYouSureDescription="This will permanently delete this log. This action cannot be undone."
              action={async () => {
                "use server";
                const res = await deleteLog(log.id);
                if (!res.error) redirect("/");
                return res;
              }}
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </ActionButton>
          </div>
        )}
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

          <div className="prose prose-stone dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSanitize]}
              components={{
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold mt-8 mb-4 text-foreground">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-semibold mt-6 mb-3 text-foreground">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-semibold mt-4 mb-2 text-foreground">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="mb-4 text-foreground leading-7">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="mb-4 ml-6 list-disc text-foreground">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="mb-4 ml-6 list-decimal text-foreground">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="mb-1 text-foreground">{children}</li>
                ),
                code: ({ children, className }) => {
                  const isInline = !className;
                  return isInline ? (
                    <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground">
                      {children}
                    </code>
                  ) : (
                    <code className={className}>{children}</code>
                  );
                },
                pre: ({ children }) => (
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4 text-sm">
                    {children}
                  </pre>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-muted-foreground pl-4 italic my-4 text-muted-foreground">
                    {children}
                  </blockquote>
                ),
                a: ({ children, href }) => (
                  <a
                    href={href}
                    className="text-primary hover:underline font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto mb-4">
                    <table className="min-w-full border-collapse border border-border">
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="border border-border bg-muted px-4 py-2 text-left font-semibold">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border border-border px-4 py-2">{children}</td>
                ),
              }}
            >
              {log.content}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 flex justify-between items-center">
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2" /> Back to Logs
          </Button>
        </Link>

        {isOwner && (
          <div className="flex items-center gap-2">
            <Link href={`/logs/edit/${log.id}`} className="cursor-pointer">
              <Button className="cursor-pointer">
                <Edit className="h-4 w-4 mr-2" />
                Edit This Log
              </Button>
            </Link>

            <ActionButton
              variant="destructive"
              className="cursor-pointer"
              requireAreYouSure
              areYouSureDescription="This will permanently delete this log. This action cannot be undone."
              action={async () => {
                "use server";
                const res = await deleteLog(log.id);
                if (!res.error) redirect("/");
                return res;
              }}
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </ActionButton>
          </div>
        )}
      </div>
    </div>
  );
}
