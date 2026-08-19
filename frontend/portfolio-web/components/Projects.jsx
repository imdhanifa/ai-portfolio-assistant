import { ExternalLink, FolderGit2 } from "lucide-react";

export default function Projects({ projects }) {
  if (!projects || projects.length === 0) {
    return <p className="text-zinc-500 dark:text-zinc-400">Projects coming soon.</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {projects.map((project) => (
        <article
          key={project.name}
          className="group relative flex flex-col overflow-hidden rounded-xl border border-zinc-200 p-5 transition-all hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/10 dark:border-zinc-800 dark:hover:border-indigo-800"
        >
          <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-linear-to-r from-indigo-500 to-purple-500 transition-transform duration-300 group-hover:scale-x-100" />

          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <FolderGit2 size={16} />
            </span>
            <h3 className="pt-1.5 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {project.name}
            </h3>
          </div>

          <p className="mt-3 flex-1 text-sm text-zinc-600 dark:text-zinc-400">
            {project.description}
          </p>

          {project.technologies?.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                >
                  {tech}
                </li>
              ))}
            </ul>
          )}

          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex w-fit items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              View project
              <ExternalLink size={14} />
            </a>
          )}
        </article>
      ))}
    </div>
  );
}
