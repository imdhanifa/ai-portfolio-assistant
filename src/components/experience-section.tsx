import type { Education, Experience } from "@/types/api";

function formatRange(start?: string, end?: string | null, current?: boolean) {
  // "YYYY" (education dates) stays a bare year; "YYYY-MM" (experience dates)
  // gets a month - new Date("YYYY") would otherwise fabricate a January.
  const fmt = (d?: string) => {
    if (!d) return "";
    if (/^\d{4}$/.test(d)) return d;
    return new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short" });
  };
  const startLabel = fmt(start);
  const endLabel = current ? "Present" : end ? fmt(end) : startLabel ? "Present" : "";
  if (!startLabel && !endLabel) return null;
  return [startLabel, endLabel].filter(Boolean).join(" — ");
}

export function ExperienceSection({
  experience,
  education,
}: {
  experience: Experience[];
  education: Education[];
}) {
  if (experience.length === 0 && education.length === 0) return null;

  // Give work experience the full width when there's no education to pair it with.
  const soloColumn = experience.length > 0 && education.length === 0;

  return (
    <section id="experience" className="max-w-7xl mx-auto px-6 py-20 border-t border-card-border">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl font-extrabold">Experience &amp; Education</h2>
        <p className="text-muted mt-2">Where the last several years were spent.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {experience.length > 0 && (
          <div className={`space-y-6 ${soloColumn ? "lg:col-span-2 lg:max-w-3xl lg:mx-auto" : ""}`}>
            <h3 className="text-lg font-bold text-accent uppercase tracking-wide flex items-center gap-2">
              <i className="fa-solid fa-briefcase" aria-hidden="true" /> Work Experience
            </h3>
            <ol className="space-y-6 border-l border-card-border pl-6">
              {experience.map((job) => {
                const range = formatRange(job.startDate, job.endDate, job.current);
                return (
                  <li key={job.id ?? `${job.company}-${job.role}`} className="relative glass-card rounded-2xl p-6">
                    <span className="absolute -left-[27px] top-7 w-3 h-3 rounded-full bg-accent" />
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h4 className="font-bold">{job.role}</h4>
                      {range && <span className="text-xs text-muted font-mono">{range}</span>}
                    </div>
                    <p className="text-sm text-accent">
                      {job.company}
                      {job.location ? ` · ${job.location}` : ""}
                    </p>
                    {job.description && (
                      <p className="text-sm text-muted mt-2 leading-relaxed">{job.description}</p>
                    )}
                    {job.technologies && job.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-card-border">
                        {job.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 rounded-lg bg-accent/5 text-xs text-muted font-mono"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        )}

        {education.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-accent-2 uppercase tracking-wide flex items-center gap-2">
              <i className="fa-solid fa-graduation-cap" aria-hidden="true" /> Education
            </h3>
            <ol className="space-y-6 border-l border-card-border pl-6">
              {education.map((edu) => {
                const range = formatRange(edu.startDate, edu.endDate);
                return (
                  <li key={edu.id ?? `${edu.institution}-${edu.degree}`} className="relative glass-card rounded-2xl p-6">
                    <span className="absolute -left-[27px] top-7 w-3 h-3 rounded-full bg-accent-2" />
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h4 className="font-bold">
                        {edu.degree}
                        {edu.field ? `, ${edu.field}` : ""}
                      </h4>
                      {range && <span className="text-xs text-muted font-mono">{range}</span>}
                    </div>
                    <p className="text-sm text-accent-2">{edu.institution}</p>
                    {edu.description && (
                      <p className="text-sm text-muted mt-2 leading-relaxed">{edu.description}</p>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
}
