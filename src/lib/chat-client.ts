"use client";

import type { ChatRequest, ChatResponse } from "@/types/api";

// NEXT_PUBLIC_* vars are inlined at build time, so this is safe to read
// from the browser. Kept separate from lib/api.ts (which is server-only)
// since the chat widget calls the API directly from the client.
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "https://localhost:7103";

export async function sendChatMessage(
  body: ChatRequest
): Promise<{ data?: ChatResponse; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/Chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const problem = await res.json().catch(() => null);
      return {
        error: problem?.detail || problem?.title || `Request failed (${res.status})`,
      };
    }
    return { data: (await res.json()) as ChatResponse };
  } catch {
    return { error: "Couldn't reach the chat service. Is the API running?" };
  }
}
