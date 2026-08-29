"use client";
import { useEffect, useState } from "react";
import { incrementPageViews } from "@/app/actions/page_views";
import type { Log } from "@/db/schemas/log-schema";
import PageViewsBadge from "./page_views_badge";

type PageViewsProps = {
  logSlug: Log["slug"];
};

export default function PageViews({ logSlug }: PageViewsProps) {
  const [localPageViews, setLocalPageViews] = useState<number | "-">("-");
  useEffect(() => {
    async function incrementViews() {
      const res = await incrementPageViews(logSlug);
      if (res.error) {
        return;
      }
      setLocalPageViews(res.data);
    }
    incrementViews();
  }, [logSlug]);
  return <PageViewsBadge pageViews={localPageViews} />;
}
