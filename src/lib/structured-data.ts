import type { Education, Experience, Profile, SkillCategories } from "@/types/api";
import { SITE_URL } from "@/lib/site";

// JSON-LD (schema.org) for the home page. This is what search engines use
// for rich results/knowledge panels, and what answer engines and AI
// crawlers (Perplexity, ChatGPT browsing, Google AI Overviews, etc.) lean on
// most heavily when summarizing "who is this person" style queries - far
// more reliably than parsing prose.
export function buildPersonJsonLd({
  profile,
  skills,
  experience,
  education,
}: {
  profile: Profile;
  skills: SkillCategories;
  experience: Experience[];
  education: Education[];
}) {
  const sameAs = [profile.github, profile.linkedin, profile.website].filter(
    (v): v is string => Boolean(v)
  );
  const knowsAbout = Array.from(new Set(Object.values(skills).flat()));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: profile.name,
        jobTitle: profile.title,
        description: profile.summary,
        url: SITE_URL,
        email: profile.email ? `mailto:${profile.email}` : undefined,
        telephone: profile.phone,
        sameAs: sameAs.length ? sameAs : undefined,
        knowsAbout: knowsAbout.length ? knowsAbout : undefined,
        worksFor: experience[0]
          ? { "@type": "Organization", name: experience[0].company }
          : undefined,
        alumniOf: education.length
          ? education.map((e) => ({ "@type": "CollegeOrUniversity", name: e.institution }))
          : undefined,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: profile.name ? `${profile.name} | Portfolio` : "Portfolio",
        description: profile.summary,
        publisher: { "@id": `${SITE_URL}/#person` },
      },
    ],
  };
}
