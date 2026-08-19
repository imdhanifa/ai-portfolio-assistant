import { Briefcase, MapPin } from "lucide-react";

export default function Experience({ experience }) {
  if (!experience || experience.length === 0) {
    return <p className="text-zinc-500 dark:text-zinc-400">Experience coming soon.</p>;
  }

  return (
    <ol className="relative space-y-10 border-l-2 border-zinc-200 pl-8 dark:border-zinc-800">
      {experience.map((entry) => (
        <li key={`${entry.company}-${entry.role}`} className="relative">
          <span className="absolute -left-10.25 flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-500/25">
            <Briefcase size={13} />
          </span>

          <div className="rounded-xl border border-zinc-200 p-5 transition-colors hover:border-indigo-300 dark:border-zinc-800 dark:hover:border-indigo-800">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
              {entry.role} · {entry.company}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-500 dark:text-zinc-400">
              <span>
                {entry.startDate} — {entry.endDate}
              </span>
              {entry.location && (
                <span className="flex items-center gap-1">
                  <MapPin size={12} />
                  {entry.location}
                </span>
              )}
            </div>
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">{entry.description}</p>
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
          </div>
        </li>
      ))}
    </ol>
  );
}
