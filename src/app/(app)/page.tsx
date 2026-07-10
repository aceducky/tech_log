import { ArrowRight, Database, Search, Terminal } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: Terminal,
    title: "Markdown Native",
    description:
      "Designed for developers. Write your troubleshooting steps exactly as you would in your terminal or IDE.",
  },
  {
    icon: Search,
    title: "Searchable History",
    description:
      "Quickly search through your past logs to find that specific command or configuration flag you wrote down months ago.",
  },
  {
    icon: Database,
    title: "Permanent Logger",
    description:
      "Your knowledge isn't meant to decay in Slack threads. A personal repository of your technical journey.",
  },
];

// Raw markdown source shown as-is in the mock editor panel.
const logContent = `# Fixing phantom errors after pulling master

Pulled the latest \`master\` branch locally after a large PR merge, but the dev server kept throwing weird module resolution errors. Checked \`git diff\` against the other branch, no differences in the code. The local cache folders were holding onto stale dependencies.

## For Linux/macOS
\`\`\`bash
rm -rf .next node_modules
\`\`\`

## For Windows
\`\`\`pwsh
Remove-Item -Recurse -Force .next, node_modules
\`\`\`

## Reinstall
\`\`\`sh
pnpm install
\`\`\`
`;

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen -mt-16 pt-16">
      {/* Hero Section */}
      <section className="px-6 py-24 md:py-32 max-w-5xl mx-auto flex flex-col items-center text-center gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="group text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-tight cursor-default">
          The{" "}
          <span className="shimmer shimmer-once shimmer-duration-6000 shimmer-color-primary/10 shimmer-spread-10">
            Logger
          </span>{" "}
          for <br className="hidden md:block" />
          <span className="text-muted-foreground">Engineering Context</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
          A clean, focused record of your architecture deep-dives and
          troubleshooting history. The technical journey usually left behind in
          forgotten configs and old Slack threads.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
          <Button
            asChild
            size="lg"
            className="group rounded-md font-medium px-8 h-12"
          >
            <Link href="/logs">
              Explore Logs{" "}
              <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-md font-medium px-8 h-12 bg-background"
          >
            <Link href="/logs/create">Start Writing</Link>
          </Button>
        </div>
      </section>

      {/* Value Prop Section */}
      <section className="px-6 py-20 bg-muted/30 border-y border-border">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map(({ icon: Icon, title, description }) => (
            <Card
              key={title}
              className="bg-background border-border/50 shadow-sm transition-colors hover:border-primary/40"
            >
              <CardHeader>
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-muted/40 mb-4">
                  <Icon className="w-5 h-5 text-foreground" />
                </div>
                <CardTitle>{title}</CardTitle>
                <CardDescription className="text-base mt-2">
                  {description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Mock Editor Section */}
      <section className="px-6 py-24 max-w-5xl mx-auto w-full text-center flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          Focus on the content.
        </h2>
        <p className="text-muted-foreground text-lg max-w-xl mb-12">
          A simple, clean interface to ensure a high signal-to-noise ratio for
          your technical documentation.
        </p>

        <div className="w-full max-w-3xl border border-border rounded-xl bg-card text-left overflow-hidden shadow-xl">
          <div className="flex items-center gap-2 px-4 py-3 bg-muted border-b border-border">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <pre className="p-6 md:p-8 text-sm md:text-[15px] leading-relaxed overflow-x-auto whitespace-pre-wrap text-foreground/80">
            <code>{logContent}</code>
          </pre>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="px-6 py-20 border-t border-border">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-6">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Remember something?
          </h2>
          <Button
            asChild
            size="lg"
            className="group rounded-md font-medium px-8 h-12"
          >
            <Link href="/logs/create">
              Start Writing{" "}
              <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
