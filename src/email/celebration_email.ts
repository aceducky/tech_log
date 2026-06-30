import { eq } from "drizzle-orm";
import { env } from "@/config/env";
import { db } from "@/db";
import { user } from "@/db/schemas/auth-schema";
import { type Log, logTable } from "@/db/schemas/log-schema";
import resend from ".";
import CelebrationTemplate from "./templates/celebration_template";

type SendCelebrationEmailProps = {
  logId: Log["id"];
  pageViews: number;
};
export default async function sendCelebrationEmail(
  props: SendCelebrationEmailProps,
) {
  const [row] = await db
    .select({
      email: user.email,
      userId: user.id,
      name: user.name,
      title: logTable.title,
    })
    .from(logTable)
    .innerJoin(user, eq(logTable.authorId, user.id))
    .where(eq(logTable.id, props.logId));

  if (!row) {
    console.error("Log not found");
    return;
  }
  const { userId, email, name, title } = row;

  if (!email) {
    console.log(
      "Email not found for user",
      userId,
      "skipping celebratory email",
    );
    return;
  }

  const logUrl = `https://techloggers.vercel.app/logs/${props.logId}`;

  const emailRes = await resend.emails.send({
    from: "TechLog <onboarding@resend.dev>",
    to: env.DEMO_RECEIVER_EMAIL,
    subject: `🎉Congrats, your log hit ${props.pageViews} views`,
    react: CelebrationTemplate({
      name,
      pageviews: props.pageViews,
      logTitle: title,
      logUrl,
    }),
  });
  if (emailRes.error) {
    console.error("Failed to send celebratory email.", {
      userId,
      logId: props.logId,
      pageViews: props.pageViews,
      error: emailRes.error,
    });
  } else {
    console.log("Successfully sent celebratory email.", {
      userId,
      logId: props.logId,
      pageViews: props.pageViews,
    });
  }
}
