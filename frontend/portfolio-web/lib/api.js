const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5290";

/**
 * Fetch JSON from the Portfolio.Api backend. Returns `fallback` (default null)
 * instead of throwing if the backend is unreachable or returns a non-2xx status —
 * keeps pages renderable during local dev before the API is running / deployed.
 */
async function getJson(path, fallback = null) {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      // Portfolio content changes rarely; revalidate periodically rather than
      // on every request.
      next: { revalidate: 300 },
    });
    if (!res.ok) return fallback;
    return await res.json();
  } catch {
    return fallback;
  }
}

export function getProfile() {
  return getJson("/api/profile");
}

export function getSkills() {
  return getJson("/api/skills");
}

export function getProjects() {
  return getJson("/api/projects", []);
}

export function getExperience() {
  return getJson("/api/experience", []);
}

/**
 * Send a message to the AI portfolio assistant. Throws on failure so the
 * caller (AIChat) can render an error state.
 */
export async function sendChatMessage(message) {
  const res = await fetch(`${API_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Chat request failed with status ${res.status}`);
  }

  return res.json();
}
