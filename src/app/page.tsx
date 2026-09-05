import type { Metadata, ResolvingMetadata } from "next";
import { ChatWidget } from "@/components/chat-widget";
import { ExperienceSection } from "@/components/experience-section";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { ProjectsSection } from "@/components/projects-section";
import { SkillsSection } from "@/components/skills-section";
import { getPortfolioData, getProfile } from "@/lib/api";
import { SITE_URL } from "@/lib/site";
import { buildPersonJsonLd } from "@/lib/structured-data";

// Data is fetched fresh on every request from Portfolio.Api (see lib/api.ts);
// disable full route caching so edits made through the API show up without
// a redeploy.
export const dynamic = "force-dynamic";

// Overrides the site-wide defaults in layout.tsx with the live profile from
// the API, so title/description/social previews stay accurate without a
// redeploy. Next dedupes the getProfile() fetch against the one in Home()
// below - it isn't a second network round-trip.
//
// Note: Next.js does NOT deep-merge nested `openGraph`/`twitter` objects
// across layout -> page - a page-level object entirely replaces the
// parent's. Reading `parent` and spreading its resolved openGraph/twitter
// is what keeps type/siteName/locale/card from layout.tsx instead of
// silently reverting to Next's own defaults.
export async function generateMetadata(
  _props: unknown,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const [profile, parentMeta] = await Promise.all([getProfile(), parent]);
  const title =
    profile.name && profile.title ? `${profile.name} | ${profile.title}` : undefined;
  const description = profile.summary;

  return {
    title,
    description,
    openGraph: { ...parentMeta.openGraph, title, description, url: SITE_URL },
    twitter: { ...parentMeta.twitter, title, description },
  };
}

export default async function Home() {
  const { profile, skills, projects, experience, education } = await getPortfolioData();
  const personJsonLd = buildPersonJsonLd({ profile, skills, experience, education });

  return (
    <>
      {/* Structured data for search engines, featured snippets, and AI
          crawlers/agents - see src/lib/structured-data.ts. This is the
          official Next.js pattern for JSON-LD (a plain script tag in a
          Server Component); it's inert data (type="application/ld+json"),
          never executed as JS. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <Header />
      <main>
        <Hero profile={profile} />
        <SkillsSection skills={skills} />
        <ProjectsSection projects={projects} />
        <ExperienceSection experience={experience} education={education} />
      </main>
      <Footer profile={profile} />
      <ChatWidget />
    </>
  );
}
