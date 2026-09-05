import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Explicitly allows AI crawlers/agents (GPTBot, ClaudeBot, PerplexityBot,
// Google-Extended, etc.) alongside regular search engines - this is a
// portfolio meant to be found and cited by both, not content to protect
// from AI training/browsing.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
