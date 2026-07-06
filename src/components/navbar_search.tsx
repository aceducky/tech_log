"use client";

import { SearchIcon, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type SubmitEvent, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function buildSearchHref(query: string) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return "/search";
  }

  const params = new URLSearchParams({ q: trimmedQuery });
  return `/search?${params.toString()}`;
}

export function NavbarSearch() {
  const pathname = usePathname();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const currentQuery =
    pathname === "/search" ? (searchParams.get("q") ?? "") : "";
  const [queryVal, setQueryVal] = useState(currentQuery);

  function navigateToSearch(nextQuery: string) {
    const href = buildSearchHref(nextQuery);

    router.push(href);
  }

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    navigateToSearch(queryVal);
  }

  function handleReset() {
    setQueryVal("");
    inputRef.current?.focus();
  }

  return (
    <form
      className="order-3 w-full md:order-0 md:max-w-md md:flex-1"
      onSubmit={handleSubmit}
    >
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          aria-label="Search logs"
          className="h-10 rounded-full pl-9 pr-20"
          name="q"
          onChange={(event) => setQueryVal(event.target.value)}
          placeholder="Search logs"
          type="search"
          ref={inputRef}
          value={queryVal}
        />
        <div className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {pathname === "/search" && queryVal ? (
            <Button
              aria-label="Clear search"
              className="shrink-0"
              onClick={handleReset}
              size="icon-sm"
              type="button"
              variant="secondary"
            >
              <X className="size-4" />
            </Button>
          ) : null}
          <Button
            aria-label="Search logs"
            className="shrink-0"
            size="icon-sm"
            type="submit"
            variant="secondary"
          >
            <SearchIcon className="size-4" />
          </Button>
        </div>
      </div>
    </form>
  );
}
