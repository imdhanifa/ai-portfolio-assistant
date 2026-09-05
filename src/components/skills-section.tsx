import type { SkillCategories } from "@/types/api";

// Tailwind's build-time scanner needs full, literal class strings - it can't
// see through `${}` interpolation - so each category maps to a complete,
// pre-written set of classes rather than an assembled color name.
type CategoryStyle = { icon: string; iconWrap: string; tag: string };

const CYAN: CategoryStyle = {
  icon: "fa-server",
  iconWrap: "bg-accent/10 text-accent",
  tag: "bg-accent/5 text-accent",
};
const PURPLE: CategoryStyle = {
  icon: "fa-laptop-code",
  iconWrap: "bg-accent-2/10 text-accent-2",
  tag: "bg-accent-2/5 text-accent-2",
};
const TEAL: CategoryStyle = {
  icon: "fa-brain",
  iconWrap: "bg-teal-400/10 text-teal-400",
  tag: "bg-teal-400/5 text-teal-300",
};
const PALETTE = [CYAN, PURPLE, TEAL];

// Keys as returned by GET /api/skills (see src/lib/fallback-data.ts for a sample payload).
const CATEGORY_META: Record<string, { icon: string; style: CategoryStyle; title: string }> = {
  languages: { icon: "fa-code", style: CYAN, title: "Languages" },
  frontend: { icon: "fa-laptop-code", style: PURPLE, title: "Frontend" },
  backend: { icon: "fa-server", style: CYAN, title: "Backend" },
  packages: { icon: "fa-cubes", style: TEAL, title: "Packages & Libraries" },
  databases: { icon: "fa-database", style: TEAL, title: "Databases" },
  architecture: { icon: "fa-sitemap", style: PURPLE, title: "Architecture" },
  security: { icon: "fa-shield-halved", style: CYAN, title: "Security" },
  ai: { icon: "fa-brain", style: TEAL, title: "AI" },
  devOps: { icon: "fa-infinity", style: PURPLE, title: "DevOps" },
  hosting: { icon: "fa-cloud-arrow-up", style: CYAN, title: "Deployment & Hosting" },
  tools: { icon: "fa-toolbox", style: TEAL, title: "Development Tools" },
};

function humanize(key: string): string {
  return key
    .split(/[_\s]+/)
    .map((word) => (word.toLowerCase() === "and" ? "&" : word[0].toUpperCase() + word.slice(1)))
    .join(" ");
}

function metaFor(category: string, index: number) {
  const known = CATEGORY_META[category.toLowerCase()];
  if (known) return known;
  return { icon: "fa-code", style: PALETTE[index % PALETTE.length], title: humanize(category) };
}

export function SkillsSection({ skills }: { skills: SkillCategories }) {
  const groups = Object.entries(skills).filter(([, items]) => items.length > 0);
  if (groups.length === 0) return null;

  return (
    <section id="skills" className="max-w-7xl mx-auto px-6 py-20 border-t border-card-border">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl font-extrabold">Core Expertise</h2>
        <p className="text-muted mt-2">Comprehensive tech stack built over years in enterprise environments.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {groups.map(([category, items], index) => {
          const { icon, style, title } = metaFor(category, index);
          return (
            <div key={category} className="glass-card rounded-2xl p-8 transition-all">
              <div className={`w-12 h-12 rounded-xl ${style.iconWrap} flex items-center justify-center text-xl mb-6`}>
                <i className={`fa-solid ${icon}`} aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold mb-4">{title}</h3>
              <div className="flex flex-wrap gap-2">
                {items.map((skill) => (
                  <span key={skill} className={`px-3 py-1 rounded-lg text-xs font-mono ${style.tag}`}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
