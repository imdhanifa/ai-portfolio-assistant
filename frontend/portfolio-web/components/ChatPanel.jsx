"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
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
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          🤖 AI Portfolio Assistant
        </h2>
        <button
          type="button"
          onClick={handleClear}
          className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          Clear
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
        {messages.length === 0 && (
          <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
            <p>Hi! I can answer questions about my skills, experience and projects.</p>
            <p className="font-medium text-zinc-700 dark:text-zinc-300">Try asking:</p>
            <ul className="space-y-1.5">
              {SUGGESTED_QUESTIONS.map((q) => (
                <li key={q}>
                  <button
                    type="button"
                    onClick={() => submitMessage(q)}
                    className="text-left text-zinc-900 underline underline-offset-4 hover:text-zinc-600 dark:text-zinc-50 dark:hover:text-zinc-300"
                  >
                    {q}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
              m.role === "user"
                ? "ml-auto bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                : "bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
            }`}
          >
            <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-pre:my-2">
              <ReactMarkdown>{m.content}</ReactMarkdown>
            </div>
            {m.sources?.length > 0 && (
              <p className="mt-1 text-xs opacity-60">Sources: {m.sources.join(", ")}</p>
            )}
          </div>
        ))}

        {loading && (
          <div className="w-fit rounded-2xl bg-zinc-100 px-3 py-2 text-sm text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
            Thinking…
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
          className="flex-1 rounded-full border border-zinc-300 bg-transparent px-4 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40 dark:bg-zinc-50 dark:text-zinc-900"
        >
          Send
        </button>
      </form>
    </div>
  );
}
