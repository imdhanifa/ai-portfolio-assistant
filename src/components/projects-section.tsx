import type { Project } from "@/types/api";

export function ProjectsSection({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;

  return (
    <section id="projects" className="max-w-7xl mx-auto px-6 py-20 border-t border-card-border">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl font-extrabold">Featured Projects</h2>
        <p className="text-muted mt-2">Enterprise platforms built for scalability and performance.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {projects.map((project) => {
          const isGithubLink = project.link?.includes("github.com");
          return (
            <div
              key={project.id ?? project.name}
              className="glass-card rounded-2xl p-8 flex flex-col justify-between transition-all"
            >
              <div>
                <h3 className="text-2xl font-bold mb-3">{project.name}</h3>
                {project.description && (
                  <p className="text-muted text-sm leading-relaxed mb-6">{project.description}</p>
                )}
              </div>

              <div className="flex flex-wrap gap-2 pt-4 border-t border-card-border">
                {(project.technologies ?? []).map((tech) => (
                  <span key={tech} className="px-3 py-1 rounded-lg bg-accent/5 text-xs text-muted font-mono">
                    {tech}
                  </span>
                ))}
              </div>

              {project.link && (
                <div className="pt-4 text-sm font-medium">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-accent hover:underline"
                  >
                    {isGithubLink ? "View on GitHub" : "View project"}{" "}
                    <i
                      className={isGithubLink ? "fa-brands fa-github ml-1" : "fa-solid fa-arrow-up-right-from-square ml-1 text-xs"}
                      aria-hidden="true"
                    />
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
