import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

export default function PageViewsBadge({
  pageViews,
  className,
}: {
  pageViews: number | string;
  className?: string;
}) {
  return (
    <Badge
      variant="secondary"
      className={cn("text-sm text-muted-foreground", className)}
      aria-label="page views"
    >
      <Eye className="h-4 w-4" />
      {pageViews} {pageViews === 1 ? "view" : "views"}
    </Badge>
  );
}
