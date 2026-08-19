// Server Components (page.js files) fetch from inside this container, so they need a
// URL that resolves on the Docker network — e.g. API_INTERNAL_URL=http://portfolio-api:8080
// in docker-compose. Falls back to the public URL for local dev where both run on the
// host (`dotnet run` + `next dev` share localhost).
const SERVER_API_URL =
  process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5290";

// The browser fetches this directly, so it must be the externally reachable URL — never
// a container-internal hostname the browser can't resolve.
const CLIENT_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5290";

/**
 * Fetch JSON from the Portfolio.Api backend (server-side only - Server Components).
 * Returns `fallback` (default null) instead of throwing if the backend is unreachable
 * or returns a non-2xx status — keeps pages renderable during local dev before the API
 * is running / deployed.
 */
async function getJson(path, fallback = null) {
  try {
    // no-store (rather than a revalidate window) so these pages render dynamically, at
    // request time, instead of being statically pre-rendered during `docker build` -
    // where the API container doesn't exist yet and every fetch would fall back to
    // `fallback` and get baked into the static HTML for good (only ever refreshed after
    // the revalidate window next elapses AND a request comes in).
    const res = await fetch(`${SERVER_API_URL}${path}`, { cache: "no-store" });
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
 * Send a message to the AI portfolio assistant. Runs in the browser (called from
 * client components), so it uses the public API URL. Throws on failure so the caller
 * (ChatPanel) can render an error state.
 */
export async function sendChatMessage(message) {
  const res = await fetch(`${CLIENT_API_URL}/api/chat`, {
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
