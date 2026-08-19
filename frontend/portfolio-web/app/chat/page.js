import ChatPanel from "@/components/ChatPanel";

export const metadata = { title: "AI Assistant | Portfolio" };

export default function ChatPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col px-6 py-16">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">AI Assistant</h1>
      <p className="mt-3 text-zinc-600 dark:text-zinc-400">
        Ask about skills, experience or projects — answers are grounded in the resume (RAG)
        and structured portfolio data (MCP).
      </p>
      <div className="mt-8 h-[36rem] overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
        <ChatPanel />
      </div>
    </div>
  );
}
