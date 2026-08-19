const CATEGORY_LABELS = {
  backend: "Backend",
  frontend: "Frontend",
  database: "Database",
  ai: "AI",
  devops: "DevOps",
};

export default function Skills({ skills }) {
  const entries = Object.entries(skills || {}).filter(([, items]) => items?.length);

  if (entries.length === 0) {
    return <p className="text-zinc-500 dark:text-zinc-400">Skills coming soon.</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {entries.map(([category, items]) => (
        <div
          key={category}
          className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800"
        >
          <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            {CATEGORY_LABELS[category] || category}
          </h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {items.map((skill) => (
              <li
                key={skill}
                className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
              >
                {skill}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
