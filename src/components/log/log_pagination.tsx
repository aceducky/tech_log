import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  buildLogsHref,
  getPaginationItems,
  type LogsSearchParams,
  type LogsSort,
} from "@/lib/dal/logs_dal";

type LogSortControlsProps = {
  sort: LogsSort;
  query?: LogsSearchParams["query"];
  basePath: string;
};
type LogPaginationProps = LogSortControlsProps & {
  currentPage: number;
  totalPages: number;
};
export function LogSortControls({
  sort,
  query = "",
  basePath,
}: LogSortControlsProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 text-sm">
        <Link
          href={buildLogsHref(basePath, { page: 1, sort: "latest", query })}
          className={
            sort === "latest"
              ? "font-medium text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }
        >
          Latest
        </Link>

        <span className="text-muted-foreground">/</span>

        <Link
          href={buildLogsHref(basePath, { page: 1, sort: "oldest", query })}
          className={
            sort === "oldest"
              ? "font-medium text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }
        >
          Oldest
        </Link>
      </div>
    </div>
  );
}

export function LogPagination({
  currentPage,
  totalPages,
  sort,
  query = "",
  basePath,
}: LogPaginationProps) {
  if (totalPages <= 1) return null;

  const items = getPaginationItems(currentPage, totalPages);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={buildLogsHref(basePath, {
              page: currentPage > 1 ? currentPage - 1 : 1,
              sort,
              query,
            })}
            className={
              currentPage === 1 ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>

        {items.map((item, index) => {
          if (item === "ellipsis") {
            return (
              <PaginationItem
                key={`ellipsis-${
                  // biome-ignore lint/suspicious/noArrayIndexKey: not needed for pagination
                  index
                }`}
              >
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={item}>
              <PaginationLink
                href={buildLogsHref(basePath, { page: item, sort, query })}
                isActive={item === currentPage}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            href={buildLogsHref(basePath, {
              page: currentPage < totalPages ? currentPage + 1 : totalPages,
              sort,
              query,
            })}
            className={
              currentPage === totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
