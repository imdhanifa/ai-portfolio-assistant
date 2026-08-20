import Link from "next/link";
import { Mail, ArrowRight, FolderGit2, Briefcase, Layers } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/BrandIcons";
import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import { getProfile, getSkills, getProjects, getExperience } from "@/lib/api";

function StatCard({ icon: Icon, value, label }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-zinc-200 px-5 py-4 dark:border-zinc-800">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
        <Icon size={18} />
      </span>
      <div>
        <p className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{value}</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
      </div>
    </div>
  );
}

export default async function Home() {
  const [profile, skills, projects, experience] = await Promise.all([
    getProfile(),
    getSkills(),
    getProjects(),
    getExperience(),
  ]);

  const featuredProjects = (projects || []).slice(0, 2);
  const skillCount = Object.values(skills || {}).flat().length;

  return (
    <div className="mx-auto max-w-5xl px-6">
      <Hero profile={profile} />

      {(projects?.length > 0 || experience?.length > 0 || skillCount > 0) && (
        <section className="grid grid-cols-1 gap-4 pb-4 sm:grid-cols-3">
          <StatCard icon={FolderGit2} value={projects?.length ?? 0} label="Projects" />
          <StatCard icon={Briefcase} value={experience?.length ?? 0} label="Companies" />
          <StatCard icon={Layers} value={skillCount} label="Technologies" />
        </section>
      )}

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
            className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            View all
            <ArrowRight size={14} />
          </Link>
        </div>
        <div className="mt-6">
          <Projects projects={featuredProjects} />
        </div>
      </section>

      <section className="py-12">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Contact</h2>
        <p className="mt-4 flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
          <Mail size={16} />
          {profile?.email || "TODO: contact@example.com"}
        </p>
        <div className="mt-4 flex gap-4">
          {profile?.github && (
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400"
            >
              <GithubIcon size={16} />
              GitHub
            </a>
          )}
          {profile?.linkedin && (
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400"
            >
              <LinkedinIcon size={16} />
              LinkedIn
            </a>
          )}
        </div>
      </section>
    </div>
  );
}
