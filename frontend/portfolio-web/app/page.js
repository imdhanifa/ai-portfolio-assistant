import Link from "next/link";
import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import { getProfile, getSkills, getProjects } from "@/lib/api";

export default async function Home() {
  const [profile, skills, projects] = await Promise.all([
    getProfile(),
    getSkills(),
    getProjects(),
  ]);

  const featuredProjects = (projects || []).slice(0, 2);

  return (
    <div className="mx-auto max-w-5xl px-6">
      <Hero profile={profile} />

      <section className="py-12">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Skills</h2>
        <div className="mt-6">
          <Skills skills={skills} />
        </div>
      </section>

      <section className="py-12">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Featured Projects
          </h2>
          <Link
            href="/projects"
            className="text-sm font-medium text-zinc-600 underline underline-offset-4 dark:text-zinc-400"
          >
            View all →
          </Link>
        </div>
        <div className="mt-6">
          <Projects projects={featuredProjects} />
        </div>
      </section>

      <section className="py-12">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Contact</h2>
        <p className="mt-4 text-zinc-600 dark:text-zinc-400">
          {profile?.email || "TODO: contact@example.com"}
        </p>
        <div className="mt-4 flex gap-4 text-sm font-medium">
          {profile?.github && (
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
              GitHub
            </a>
          )}
          {profile?.linkedin && (
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
              LinkedIn
            </a>
          )}
        </div>
      </section>
    </div>
  );
}
