import { getPortfolioData } from "@/lib/api";
import { SITE_URL } from "@/lib/site";

// /llms.txt - the emerging convention (llmstxt.org) for giving AI agents and
// LLM-based crawlers (ChatGPT browsing, Claude, Perplexity, etc.) a clean,
// prose-free summary of a site's content. Built from the same live API data
// as the page itself (see lib/api.ts), so it can't drift out of sync with
// what a human visitor actually sees.
export const dynamic = "force-dynamic";

export async function GET() {
  const { profile, skills, projects, experience, education } = await getPortfolioData();
  const lines: string[] = [];

  lines.push(`# ${profile.name ?? "Portfolio"}`);
  if (profile.title) lines.push(`> ${profile.title}`);
  lines.push("");
  if (profile.summary) {
    lines.push(profile.summary);
    lines.push("");
  }

  const skillEntries = Object.entries(skills);
  if (skillEntries.length > 0) {
    lines.push("## Skills");
    for (const [category, items] of skillEntries) {
      if (items.length > 0) lines.push(`- **${category}**: ${items.join(", ")}`);
    }
    lines.push("");
  }

  if (experience.length > 0) {
    lines.push("## Experience");
    for (const job of experience) {
      lines.push(`- **${job.role}** at ${job.company}${job.location ? ` (${job.location})` : ""}`);
      if (job.description) lines.push(`  ${job.description}`);
    }
    lines.push("");
  }

  if (education.length > 0) {
    lines.push("## Education");
    for (const edu of education) {
      lines.push(`- ${edu.degree}${edu.field ? `, ${edu.field}` : ""} — ${edu.institution}`);
    }
    lines.push("");
  }

  if (projects.length > 0) {
    lines.push("## Projects");
    for (const project of projects) {
      lines.push(`- **${project.name}**${project.description ? `: ${project.description}` : ""}`);
    }
    lines.push("");
  }

  lines.push("## Links");
  lines.push(`- Website: ${SITE_URL}`);
  if (profile.email) lines.push(`- Email: ${profile.email}`);
  if (profile.phone) lines.push(`- Phone: ${profile.phone}`);
  if (profile.github) lines.push(`- GitHub: ${profile.github}`);
  if (profile.linkedin) lines.push(`- LinkedIn: ${profile.linkedin}`);
  if (profile.website) lines.push(`- Personal site: ${profile.website}`);

  return new Response(lines.join("\n") + "\n", {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
