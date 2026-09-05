"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme, COLOR_THEMES, type ColorTheme } from "@/components/theme-provider";

// Hex values here are metadata for rendering the swatches themselves (inline
// styles, since these are arbitrary per-theme colors Tailwind can't
// generate utilities for) - the actual page repaint comes entirely from
// setColorTheme flipping the `data-color-theme` attribute, which globals.css
// maps to the real --accent-primary/--accent-secondary variables. Keep this
// list in sync with the `[data-color-theme="..."]` blocks there.
const COLOR_THEME_META: Record<ColorTheme, { label: string; primary: string; secondary: string }> = {
  aurora: { label: "Aurora", primary: "#00f0ff", secondary: "#8b5cf6" },
  forest: { label: "Forest", primary: "#10b981", secondary: "#f59e0b" },
  sunset: { label: "Sunset", primary: "#fb7185", secondary: "#6366f1" },
  ocean: { label: "Ocean", primary: "#0ea5e9", secondary: "#f97316" },
  neon: { label: "Neon", primary: "#d946ef", secondary: "#a3e635" },
  royal: { label: "Royal", primary: "#facc15", secondary: "#7c3aed" },
};

function swatchGradient(theme: ColorTheme) {
  const { primary, secondary } = COLOR_THEME_META[theme];
  return `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`;
}

export function ColorThemePicker() {
  const { colorTheme, setColorTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const currentLabel = COLOR_THEME_META[colorTheme].label;

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Color theme: ${currentLabel}. Click to change.`}
        aria-expanded={open}
        className="glass-card flex h-10 w-10 items-center justify-center rounded-lg"
      >
        <span className="h-4 w-4 rounded-full" style={{ background: swatchGradient(colorTheme) }} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 p-2 glass-card rounded-xl shadow-2xl grid grid-cols-3 gap-2 z-50 w-42">
          {COLOR_THEMES.map((theme) => {
            const active = theme === colorTheme;
            return (
              <button
                key={theme}
                type="button"
                onClick={() => {
                  setColorTheme(theme);
                  setOpen(false);
                }}
                aria-label={COLOR_THEME_META[theme].label}
                aria-pressed={active}
                title={COLOR_THEME_META[theme].label}
                className={`h-8 w-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${
                  active ? "ring-2 ring-offset-2 ring-offset-bg ring-fg/60" : ""
                }`}
                style={{ background: swatchGradient(theme) }}
              >
                {active && (
                  <i className="fa-solid fa-check text-black text-xs drop-shadow" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
