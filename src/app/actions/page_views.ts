"use server";

import { generateId } from "better-auth";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { db } from "@/db";
import type { Log } from "@/db/schemas/log-schema";
import { logSlugSchema, logTable } from "@/db/schemas/log-schema";
import { logViewsTable } from "@/db/schemas/log-views-schema";
import sendCelebrationEmail from "@/email/celebration_email";
import { getCurrentSession } from "@/lib/auth/get_current_session";
import { Err, Ok, type Result } from "@/lib/result";

const milestones = new Set([10, 50, 100, 1_000, 10_000, 100_000]);

export async function incrementPageViews(
  incomingSlug: Log["slug"],
): Promise<Result<number>> {
  const validatedSlug = logSlugSchema.safeParse(incomingSlug);

  if (!validatedSlug.success) {
    return Err({ message: "Invalid log slug" });
  }

  const slug = validatedSlug.data;

  try {
    const [log] = await db
      .select({ id: logTable.id })
      .from(logTable)
      .where(eq(logTable.slug, slug))
      .limit(1);

    if (!log) {
      return Err({ message: "Log not found" });
    }

    const logId = log.id;
    const session = await getCurrentSession();
    let viewerKey: string;
    if (session?.user.id) {
      viewerKey = session.user.id;
    } else {
      const cookieStore = await cookies();
      viewerKey = cookieStore.get("viewer-key")?.value || "";
    }

    if (!viewerKey) {
      viewerKey = generateId();
      const cookieStore = await cookies();
      cookieStore.set("viewer-key", viewerKey, {
        maxAge: 60 * 60 * 24 * 365,
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV?.toLowerCase() === "production",
      });
    }

    await db
      .insert(logViewsTable)
      .values({ logId, viewerKey })
      .onConflictDoNothing();

    const count = await db.$count(
      logViewsTable,
      eq(logViewsTable.logId, logId),
    );

    const currViews = count;

    if (milestones.has(currViews)) {
      sendCelebrationEmail({ logId, pageViews: currViews });
    }

    return Ok({ data: currViews });
  } catch (e) {
    console.warn("could not increment page view", e);
    return Err({ message: "could not increment page view" });
  }
}
