import { Edit, Trash } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { deleteLog } from "@/app/actions/logs_actions";
import type { Log } from "@/db/schemas/log-schema";
import { cn } from "@/lib/utils";
import { ActionButton } from "../ui/action-button";
import { Button } from "../ui/button";

type OwnerVisibleActionsProps = {
  isOwner: boolean;
  slug: Log["slug"];
  className?: string;
};

export default function LogOwnerVisibleActions({
  isOwner,
  slug,
  className,
}: OwnerVisibleActionsProps) {
  if (!isOwner) return null;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Link href={`/logs/edit/${slug}`}>
        <Button variant="outline">
          <Edit className="mr-2 h-4 w-4" />
          Edit Log
        </Button>
      </Link>

      <ActionButton
        variant="destructive"
        className="ml-2"
        requireAreYouSure
        areYouSureDescription="This will permanently delete this log. This action cannot be undone."
        action={async () => {
          "use server";
          const res = await deleteLog(slug);

          if (!res.error) redirect("/logs");

          return res;
        }}
      >
        <Trash className="mr-2 h-4 w-4" />
        Delete
      </ActionButton>
    </div>
  );
}
