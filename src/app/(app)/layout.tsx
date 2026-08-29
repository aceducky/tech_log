import { AskAiShell } from "@/components/ask_ai_shell";
import { Navbar } from "@/components/navbar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AskAiShell navbar={<Navbar />}>{children}</AskAiShell>;
}
