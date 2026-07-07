import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

export default function PageViewsBadge({
  pageviews,
  classname,
}: {
  pageviews: number | string;
  classname?: string;
}) {
  return (
    <Badge
      variant="secondary"
      className={cn("text-sm text-muted-foreground", classname)}
      aria-label="page views"
    >
      <Eye className="h-4 w-4" />
      {pageviews} {pageviews === 1 ? "view" : "views"}
    </Badge>
  );
}
