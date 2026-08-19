export default function Resume() {
  return (
    <div className="flex flex-col items-center gap-6 rounded-xl border border-zinc-200 p-10 text-center dark:border-zinc-800">
      <p className="text-zinc-600 dark:text-zinc-400">
        Download the full resume as a PDF, or ask the AI assistant about specific skills,
        projects or experience — its answers are grounded in this same document via RAG.
      </p>
      <a
        href="/resume.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        Download Resume
      </a>
    </div>
  );
}
