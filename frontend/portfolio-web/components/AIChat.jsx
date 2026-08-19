"use client";

import { useState } from "react";
import { Sparkles, X } from "lucide-react";
import ChatPanel from "@/components/ChatPanel";

/** Floating AI assistant button + popover, shown on every page via the root layout. */
export default function AIChat() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="animate-fade-up mb-3 h-128 w-88 max-w-[calc(100vw-2.5rem)] overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl shadow-indigo-500/10 dark:border-zinc-800 dark:bg-zinc-950">
          <ChatPanel />
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle AI assistant"
        className={`flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-purple-500 text-white shadow-xl shadow-indigo-500/30 transition-transform hover:scale-105 ${open ? "" : "animate-glow-ring"}`}
      >
        {open ? <X size={22} /> : <Sparkles size={22} />}
      </button>
    </div>
  );
}
