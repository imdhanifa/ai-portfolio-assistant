import { Download, FileText } from "lucide-react";

export default function Resume() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-200 p-10 text-center dark:border-zinc-800">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-linear-to-br from-indigo-400/20 to-purple-400/10 blur-3xl"
      />
      <div className="relative flex flex-col items-center gap-6">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
          <FileText size={24} />
        </span>
        <p className="max-w-md text-zinc-600 dark:text-zinc-400">
          Download the full resume as a PDF, or ask the AI assistant about specific skills,
          projects or experience.
        </p>
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full bg-linear-to-r from-indigo-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-transform hover:scale-105"
        >
          <Download size={16} />
          Download Resume
        </a>
      </div>
    </div>
  );
}
