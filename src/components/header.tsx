"use client";

import { useState } from "react";
import { ColorThemePicker } from "@/components/color-theme-picker";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-bg/80 border-b border-card-border">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <a href="#" className="text-2xl font-extrabold tracking-wider">
          MH<span className="text-accent">.info</span>
        </a>

        <nav className="hidden md:flex space-x-8 text-sm font-medium text-muted">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-accent transition-colors">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ColorThemePicker />
          <ThemeToggle />
          <a
            href="#contact"
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-black bg-gradient-to-r from-accent to-teal-400 rounded-lg shadow-lg hover:shadow-accent/20 hover:scale-105 transition-all"
          >
            Let&apos;s Talk
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            className="md:hidden glass-card flex h-10 w-10 items-center justify-center rounded-lg"
          >
            <i className={open ? "fa-solid fa-xmark" : "fa-solid fa-bars"} aria-hidden="true" />
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t border-card-border px-6 py-4 flex flex-col gap-4 text-sm font-medium text-muted">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="hover:text-accent transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
