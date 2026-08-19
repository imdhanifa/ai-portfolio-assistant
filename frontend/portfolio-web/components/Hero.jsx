import Link from "next/link";

export default function Hero({ profile }) {
  const name = profile?.name || "Your Name";
  const title = profile?.title || "Full Stack .NET Developer";
  const summary =
    profile?.summary ||
    "Building scalable web applications with .NET, AI, RAG, MCP and modern frontend technologies.";

  return (
    <section className="mx-auto max-w-5xl px-6 py-20 text-center sm:py-28">
      <p className="text-sm font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-500">
        {name}
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
        {title}
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
        {summary}
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/projects"
          className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          View Projects
        </Link>
        <Link
          href="/resume"
          className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
        >
          Download Resume
        </Link>
      </div>
    </section>
  );
}
