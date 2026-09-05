"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { sendChatMessage } from "@/lib/chat-client";

// The assistant's answers come back as Markdown (bold, lists, links) - these
// overrides keep that readable inside a narrow chat bubble instead of using
// react-markdown's default block spacing, which is sized for full-page prose.
const markdownComponents: Components = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-accent underline underline-offset-2 hover:opacity-80"
    >
      {children}
    </a>
  ),
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  ul: ({ children }) => <ul className="mb-2 last:mb-0 ml-4 list-disc space-y-1">{children}</ul>,
  ol: ({ children }) => <ol className="mb-2 last:mb-0 ml-4 list-decimal space-y-1">{children}</ol>,
  li: ({ children }) => <li>{children}</li>,
  code: ({ children }) => (
    <code className="rounded bg-black/10 px-1 py-0.5 font-mono text-xs">{children}</code>
  ),
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "error";
  content: string;
};

const WELCOME: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content: "Hi! Ask me anything about Mohamed's experience, skills, or projects.",
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const conversationId = useRef<string>(
    typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : undefined!
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", content: text }]);
    setInput("");
    setSending(true);

    const { data, error } = await sendChatMessage({
      message: text,
      conversationId: conversationId.current ?? null,
    });

    setMessages((prev) => [
      ...prev,
      error
        ? { id: crypto.randomUUID(), role: "error", content: error }
        : { id: crypto.randomUUID(), role: "assistant", content: data!.answer },
    ]);
    setSending(false);
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-4 w-[min(22rem,calc(100vw-3rem))] h-[28rem] glass-card rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-card-border bg-accent/5">
            <div className="flex items-center gap-2 text-sm font-bold">
              <i className="fa-solid fa-robot text-accent" aria-hidden="true" />
              Ask about Mohamed
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="text-muted hover:text-accent"
            >
              <i className="fa-solid fa-xmark" aria-hidden="true" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 text-sm">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`max-w-[85%] rounded-xl px-3.5 py-2.5 leading-relaxed ${
                  m.role === "user"
                    ? "ml-auto bg-gradient-to-r from-accent to-accent-2 text-black font-medium"
                    : m.role === "error"
                      ? "bg-red-500/10 text-red-400 border border-red-500/30"
                      : "bg-accent/5 text-fg border border-card-border"
                }`}
              >
                {m.role === "assistant" ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                    {m.content}
                  </ReactMarkdown>
                ) : (
                  m.content
                )}
              </div>
            ))}
            {sending && (
              <div className="bg-accent/5 border border-card-border text-muted rounded-xl px-3.5 py-2.5 w-fit text-xs">
                <i className="fa-solid fa-ellipsis fa-fade" aria-hidden="true" /> thinking…
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="border-t border-card-border p-3 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message…"
              className="flex-1 bg-transparent border border-card-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent/50"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              aria-label="Send message"
              className="px-3.5 rounded-lg bg-gradient-to-r from-accent to-accent-2 text-black font-bold disabled:opacity-40"
            >
              <i className="fa-solid fa-paper-plane" aria-hidden="true" />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="h-14 w-14 rounded-full bg-gradient-to-r from-accent to-accent-2 text-black text-xl shadow-lg shadow-accent/20 hover:scale-105 transition-all flex items-center justify-center ml-auto"
      >
        <i className={open ? "fa-solid fa-xmark" : "fa-solid fa-comment-dots"} aria-hidden="true" />
      </button>
    </div>
  );
}
