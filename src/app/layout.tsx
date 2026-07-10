import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { connection } from "next/server";
import { Suspense } from "react";
import { Toaster } from "sonner";
import { extractRouterConfig } from "uploadthing/server";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { coverImgFileRouter } from "./api/uploadthing/core";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TechLog",
  description:
    "Your space for documenting technical knowledge, troubleshooting steps, software discoveries, setup guides, reviews, everything that you want to log about technical things",
};

async function UTSSR() {
  await connection();
  return (
    <NextSSRPlugin routerConfig={extractRouterConfig(coverImgFileRouter)} />
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", jetbrainsMono.variable)}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense>
            <UTSSR />
          </Suspense>
          {children}
          <Toaster richColors={true} />
        </ThemeProvider>
      </body>
    </html>
  );
}
