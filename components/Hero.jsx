import Link from "next/link";
import { Download, Sparkles } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/BrandIcons";

function initials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Hero({ profile }) {
  const name = profile?.name || "MOHAMED HANIFA";
  const title = profile?.title || "Full Stack .NET Developer";
  const summary =
    profile?.summary ||
    "Building scalable web applications with .NET, AI, MCP and modern frontend technologies.";

  return (
    <section className="relative overflow-hidden">
      {/* Decorative gradient blobs — pure CSS, no images. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-96 w-xl -translate-x-1/2 rounded-full bg-linear-to-br from-indigo-400/30 via-purple-400/20 to-transparent blur-3xl dark:from-indigo-500/20 dark:via-purple-500/10"
      />

      <div className="relative mx-auto max-w-5xl px-6 py-20 text-center sm:py-28">
        <div className="animate-fade-up mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-purple-500 text-2xl font-bold text-white shadow-lg shadow-indigo-500/25">
          {initials(name)}
        </div>

        <p
          className="animate-fade-up mt-6 text-sm font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-500"
          style={{ animationDelay: "80ms" }}
        >
          {name}
        </p>
        <h1
          className="gradient-text animate-fade-up mt-3 text-4xl font-bold tracking-tight sm:text-5xl"
          style={{ animationDelay: "140ms" }}
        >
          {title}
        </h1>
        <p
          className="animate-fade-up mx-auto mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400"
          style={{ animationDelay: "200ms" }}
        >
          {summary}
        </p>

        <div
          className="animate-fade-up mt-10 flex flex-wrap items-center justify-center gap-4"
          style={{ animationDelay: "260ms" }}
        >
          <Link
            href="/projects"
            className="rounded-full bg-linear-to-r from-indigo-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-transform hover:scale-105"
          >
            View Projects
          </Link>
          <Link
            href="/resume"
            className="flex items-center gap-2 rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
          >
            <Download size={16} />
            Download Resume
          </Link>
          <Link
            href="/chat"
            className="flex items-center gap-2 rounded-full border border-indigo-300 px-6 py-3 text-sm font-semibold text-indigo-600 transition-colors hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-950/50"
          >
            <Sparkles size={16} />
            Ask My AI Assistant
          </Link>
        </div>

        {(profile?.github || profile?.linkedin) && (
          <div
            className="animate-fade-up mt-8 flex items-center justify-center gap-5"
            style={{ animationDelay: "320ms" }}
          >
            {profile?.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-zinc-400 transition-colors hover:text-indigo-500 dark:text-zinc-600 dark:hover:text-indigo-400"
              >
                <GithubIcon size={20} />
              </a>
            )}
            {profile?.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-zinc-400 transition-colors hover:text-indigo-500 dark:text-zinc-600 dark:hover:text-indigo-400"
              >
                <LinkedinIcon size={20} />
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
