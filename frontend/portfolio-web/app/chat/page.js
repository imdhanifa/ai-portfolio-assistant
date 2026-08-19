import { Sparkles } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ChatPanel from "@/components/ChatPanel";

export const metadata = {
  title: "AI Assistant",
  description:
    "Ask the AI portfolio assistant about skills, experience or projects — grounded in the resume via RAG and structured data via MCP.",
};

export default function ChatPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col px-6 py-16">
      <PageHeader
        icon={Sparkles}
        title="AI Assistant"
        subtitle="Ask about skills, experience or projects — answers are grounded in the resume (RAG) and structured portfolio data (MCP)."
      />
      <div className="h-144 overflow-hidden rounded-2xl border border-zinc-200 shadow-lg shadow-indigo-500/5 dark:border-zinc-800">
        <ChatPanel />
      </div>
    </div>
  );
}
