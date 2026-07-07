import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

type LogMdRendererProps = {
  content: string;
  classname?: string;
  showImages?: boolean;
};

export function LogMdRenderer({
  content,
  classname,
  showImages = true,
}: LogMdRendererProps) {
  return (
    <div
      className={cn(
        "prose prose-stone dark:prose-invert max-w-none",
        classname,
      )}
    >
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
            <ul className="mb-4 ml-6 list-disc text-foreground">{children}</ul>
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
          img: ({ src, alt }) => {
            if (!showImages) {
              return null;
            }
            return (
              // biome-ignore lint/performance/noImgElement: Standard img tag is necessary here as react-markdown cannot easily provide width/height for next/image
              <img
                src={src}
                alt={alt}
                className="rounded-lg max-w-full h-auto my-4"
              />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
