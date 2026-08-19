"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Sparkles, Send, Trash2 } from "lucide-react";
import { sendChatMessage } from "@/lib/api";

const SUGGESTED_QUESTIONS = [
  "What .NET technologies do you use?",
  "Tell me about your projects.",
  "What AI experience do you have?",
];

const MAX_MESSAGE_LENGTH = 2000;

/**
 * The chat UI itself: message list, input, loading/error states, suggested
 * questions, clear conversation. Used both inline (full /chat page) and
 * inside the floating AIChat widget.
 */
export default function ChatPanel() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function submitMessage(text) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setError(null);
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    setLoading(true);

    try {
      const response = await sendChatMessage(trimmed);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.answer, sources: response.sources },
      ]);
    } catch {
      setError("Something went wrong reaching the assistant. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    submitMessage(input);
  }

  function handleClear() {
    setMessages([]);
    setError(null);
  }

  return (
    <div className="flex h-full flex-col bg-white dark:bg-zinc-950">
      <div className="flex items-center justify-between bg-linear-to-r from-indigo-500 to-purple-500 px-4 py-3 text-white">
        <h2 className="flex items-center gap-1.5 text-sm font-semibold">
          <Sparkles size={15} />
          AI Portfolio Assistant
        </h2>
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear conversation"
          className="text-white/80 transition-colors hover:text-white"
        >
          <Trash2 size={15} />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
        {messages.length === 0 && (
          <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
            <p>Hi! I can answer questions about my skills, experience and projects.</p>
            <p className="font-medium text-zinc-700 dark:text-zinc-300">Try asking:</p>
            <div className="flex flex-col gap-2">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => submitMessage(q)}
                  className="rounded-xl border border-zinc-200 px-3 py-2 text-left text-zinc-700 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-indigo-800 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-300"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
              m.role === "user"
                ? "ml-auto bg-linear-to-br from-indigo-500 to-purple-500 text-white"
                : "bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
            }`}
          >
            <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-pre:my-2">
              <ReactMarkdown>{m.content}</ReactMarkdown>
            </div>
            {m.sources?.length > 0 && (
              <p className="mt-1 text-xs opacity-70">Sources: {m.sources.join(", ")}</p>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex w-fit items-center gap-1 rounded-2xl bg-zinc-100 px-4 py-3 dark:bg-zinc-900">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400" />
          </div>
        )}

        {error && (
          <div className="rounded-2xl bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {error}
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 border-t border-zinc-200 p-3 dark:border-zinc-800"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value.slice(0, MAX_MESSAGE_LENGTH))}
          placeholder="Ask a question..."
          className="flex-1 rounded-full border border-zinc-300 bg-transparent px-4 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          aria-label="Send"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-purple-500 text-white transition-transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}
