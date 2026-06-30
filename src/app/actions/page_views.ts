"use server";

import { redis } from "@/cache";
import type { Log } from "@/db/schemas/log-schema";
import sendCelebrationEmail from "@/email/celebration_email";
import { Err, Ok, type Result } from "@/lib/result";

const LOG_PAGE_VIEWS_KEY_PREFIX = "log_page_views";

const milestones = new Set([10, 50, 100, 1_000, 10_000, 100_000]);

const keyFor = (id: Log["id"]) => `${LOG_PAGE_VIEWS_KEY_PREFIX}:${id}`;

export async function incrementPageViews(
  logId: Log["id"],
): Promise<Result<number>> {
  try {
    const logKey = keyFor(logId);
    const inc = await redis.incr(logKey);

    if (milestones.has(inc)) {
      sendCelebrationEmail({ logId, pageViews: inc });
    }

    return Ok({ data: inc });
  } catch (e) {
    console.error("Couldn't increment log page view", e);
    return Err({ message: "Couldn't increment log page view" });
  }
}
