import { Code2, Server, Layout, Database, Boxes, Sparkles, Cloud, Wrench } from "lucide-react";

const CATEGORIES = {
  languages: { label: "Languages", icon: Code2 },
  backend: { label: "Backend", icon: Server },
  frontend: { label: "Frontend", icon: Layout },
  database: { label: "Database", icon: Database },
  architecture: { label: "Architecture & Patterns", icon: Boxes },
  ai: { label: "AI", icon: Sparkles },
  devops: { label: "DevOps & Cloud", icon: Cloud },
  tools: { label: "Tools & IDEs", icon: Wrench },
};

export default function Skills({ skills }) {
  const entries = Object.entries(skills || {}).filter(([, items]) => items?.length);

  if (entries.length === 0) {
    return <p className="text-zinc-500 dark:text-zinc-400">Skills coming soon.</p>;
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {entries.map(([category, items]) => {
        const meta = CATEGORIES[category];
        const Icon = meta?.icon ?? Code2;

        return (
          <div
            key={category}
            className="group rounded-xl border border-zinc-200 p-5 transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/5 dark:border-zinc-800 dark:hover:border-indigo-800"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                <Icon size={16} />
              </span>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                {meta?.label ?? category}
              </h3>
            </div>
            <ul className="mt-4 flex flex-wrap gap-2">
              {items.map((skill) => (
                <li
                  key={skill}
                  className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700 transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-700 dark:bg-zinc-900 dark:text-zinc-300 dark:group-hover:bg-indigo-950/50 dark:group-hover:text-indigo-300"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
