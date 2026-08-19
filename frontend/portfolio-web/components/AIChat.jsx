"use client";

import { useState } from "react";
import ChatPanel from "@/components/ChatPanel";

/** Floating AI assistant button + popover, shown on every page via the root layout. */
export default function AIChat() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-3 h-128 w-88 max-w-[calc(100vw-2.5rem)] overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
          <ChatPanel />
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle AI assistant"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-900 text-2xl text-white shadow-xl transition-transform hover:scale-105 dark:bg-zinc-50"
      >
        {open ? "✕" : "🤖"}
      </button>
    </div>
  );
}
