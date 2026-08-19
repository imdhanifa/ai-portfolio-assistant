export default function Projects({ projects }) {
  if (!projects || projects.length === 0) {
    return <p className="text-zinc-500 dark:text-zinc-400">Projects coming soon.</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {projects.map((project) => (
        <article
          key={project.name}
          className="flex flex-col rounded-xl border border-zinc-200 p-5 dark:border-zinc-800"
        >
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {project.name}
          </h3>
          <p className="mt-2 flex-1 text-sm text-zinc-600 dark:text-zinc-400">
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
              className="mt-4 text-sm font-medium text-zinc-900 underline underline-offset-4 dark:text-zinc-50"
            >
              View project →
            </a>
          )}
        </article>
      ))}
    </div>
  );
}
