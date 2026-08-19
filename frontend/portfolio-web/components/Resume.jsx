export default function Resume() {
  return (
    <div className="flex flex-col items-center gap-6 rounded-xl border border-dashed border-zinc-300 p-10 text-center dark:border-zinc-700">
      <p className="text-zinc-600 dark:text-zinc-400">
        The resume PDF isn&apos;t uploaded yet. Drop it at{" "}
        <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm dark:bg-zinc-900">
          data/resume.pdf
        </code>{" "}
        and it will also power the AI assistant&apos;s answers via RAG.
      </p>
      <a
        href="/resume.pdf"
        className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        Download Resume
      </a>
    </div>
  );
}
