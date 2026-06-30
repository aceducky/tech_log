"use client";
import { useEffect, useState } from "react";
import { incrementPageViews } from "@/app/actions/page_views";
import type { Log } from "@/db/schemas/log-schema";
import PageViewsBadge from "./page_views_badge";

type PageViewsProps = {
  logId: Log["id"];
};

export default function PageViews({ logId }: PageViewsProps) {
  const [localPageViews, setLocalPageViews] = useState<number | "-">("-");
  useEffect(() => {
    async function incrementViews() {
      const res = await incrementPageViews(logId);
      if (res.error) {
        return;
      }
      setLocalPageViews(res.data ?? "-");
    }
    incrementViews();
  }, [logId]);
  return <PageViewsBadge pageviews={localPageViews} />;
}
