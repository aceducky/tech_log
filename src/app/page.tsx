import { LogCard } from "@/components/log_card";

export default function Home() {
  return (
    <div>
      <main className="max-w-2xl mx-auto mt-10 flex flex-col gap-6">
        <LogCard
          title="Installing VS Code Extensions in Antigravity IDE"
          author="zephyr"
          date="Mar 2026"
          summary="Antigravity uses the Open VSX registry, which has a different selection than the VS Code marketplace. This guide covers how to find, download, and manually install .vsix files to get the extensions you want."
          href="#"
        />
        <LogCard
          title="Request Validation Middleware in Express with Zod"
          author="maddox"
          date="Jan 2026"
          summary="Build a reusable validation middleware that parses and type-narrows req.body using Zod schemas. Covers error formatting, 422 responses, and keeping route handlers clean."
          href="#"
        />
        <LogCard
          title="Bluetooth Device Not Connecting on Windows? Here's How to Fix It"
          author="rinna"
          date="Feb 2026"
          summary="A step-by-step guide to getting your Bluetooth device working on Windows. Covers driver setup and the Bluetooth support service."
          href="#"
        />
        <LogCard
          title="The Python Toolchain Got a Lot Simpler With uv"
          author="callum"
          date="Apr 2026"
          summary="uv handles packages, virtual environments, Python versions, and project management in one fast tool. A practical guide to getting started and what you can drop from your workflow."
          href="#"
        />
      </main>
    </div>
  );
}
