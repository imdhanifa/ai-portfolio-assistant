"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const LINKS = [
  { href: "/about", label: "About" },
  { href: "/skills", label: "Skills" },
  { href: "/experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/resume", label: "Resume" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/75 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/75">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-1.5 font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          <Sparkles size={18} className="text-indigo-500" />
          Portfolio
        </Link>

        <ul className="hidden gap-1 text-sm font-medium text-zinc-600 dark:text-zinc-400 sm:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="rounded-full px-3 py-1.5 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 sm:flex">
          <ThemeToggle />
          <Link
            href="/chat"
            className="flex items-center gap-1.5 rounded-full bg-linear-to-r from-indigo-500 to-purple-500 px-4 py-1.5 text-sm font-semibold text-white shadow-sm shadow-indigo-500/25 transition-transform hover:scale-105"
          >
            <Sparkles size={14} />
            Ask AI
          </Link>
        </div>

        <div className="flex items-center gap-1 sm:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="flex h-8 w-8 items-center justify-center text-zinc-700 dark:text-zinc-300"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {open && (
        <ul className="flex flex-col gap-1 border-t border-zinc-200 px-6 py-3 text-sm font-medium text-zinc-600 dark:border-zinc-800 dark:text-zinc-400 sm:hidden">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-2 py-2 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/chat"
              onClick={() => setOpen(false)}
              className="mt-1 flex items-center gap-1.5 rounded-lg bg-linear-to-r from-indigo-500 to-purple-500 px-2 py-2 font-semibold text-white"
            >
              <Sparkles size={14} />
              Ask AI
            </Link>
          </li>
        </ul>
      )}
    </header>
  );
}
