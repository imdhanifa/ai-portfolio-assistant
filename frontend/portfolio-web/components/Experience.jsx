export default function Experience({ experience }) {
  if (!experience || experience.length === 0) {
    return <p className="text-zinc-500 dark:text-zinc-400">Experience coming soon.</p>;
  }

  return (
    <ol className="space-y-8 border-l border-zinc-200 pl-6 dark:border-zinc-800">
      {experience.map((entry) => (
        <li key={`${entry.company}-${entry.role}`} className="relative">
          <span className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full bg-zinc-900 dark:bg-zinc-50" />
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
            {entry.role} · {entry.company}
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {entry.startDate} — {entry.endDate}
          </p>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{entry.description}</p>
          {entry.technologies?.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-2">
              {entry.technologies.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                >
                  {tech}
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ol>
  );
}
