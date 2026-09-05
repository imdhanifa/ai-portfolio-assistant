"use client";

import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";

export type Mode = "system" | "light" | "dark";
export type ColorTheme = "aurora" | "forest" | "sunset" | "ocean" | "neon" | "royal";
type ResolvedMode = "light" | "dark";
type Listener = () => void;

export const COLOR_THEMES: ColorTheme[] = ["aurora", "forest", "sunset", "ocean", "neon", "royal"];
const DEFAULT_COLOR_THEME: ColorTheme = "aurora";

const MODE_KEY = "theme-mode";
const COLOR_KEY = "theme-color";

type ThemeContextValue = {
  mode: Mode;
  resolvedMode: ResolvedMode;
  setMode: (mode: Mode) => void;
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// A minimal external store backed directly by the DOM (<html class="dark">
// and <html data-color-theme="...">) plus localStorage - the source of
// truth is the DOM itself, so useSyncExternalStore can safely hand the
// server a neutral snapshot and resync to the real value right after
// hydration, with no effects/setState involved.
//
// This whole approach exists in place of next-themes: that library sets the
// initial theme via a <script> rendered from inside a client component,
// which React 19 flags ("Encountered a script tag while rendering React
// component"). The anti-flash script here instead lives as plain
// server-rendered markup in <head> (see layout.tsx), so it's never
// recreated by a client render and the warning doesn't apply.
let listeners: Listener[] = [];

function resolveMode(mode: Mode): ResolvedMode {
  if (mode === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return mode;
}

function getStoredMode(): Mode {
  try {
    const stored = localStorage.getItem(MODE_KEY);
    return stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
  } catch {
    return "system";
  }
}

function getStoredColorTheme(): ColorTheme {
  try {
    const stored = localStorage.getItem(COLOR_KEY);
    return (COLOR_THEMES as string[]).includes(stored ?? "")
      ? (stored as ColorTheme)
      : DEFAULT_COLOR_THEME;
  } catch {
    return DEFAULT_COLOR_THEME;
  }
}

function applyMode(mode: Mode) {
  const resolved = resolveMode(mode);
  document.documentElement.classList.toggle("dark", resolved === "dark");
  document.documentElement.style.colorScheme = resolved;
}

function applyColorTheme(theme: ColorTheme) {
  document.documentElement.setAttribute("data-color-theme", theme);
}

function getModeSnapshot(): Mode {
  return getStoredMode();
}

function getColorThemeSnapshot(): ColorTheme {
  return getStoredColorTheme();
}

function subscribe(listener: Listener) {
  listeners.push(listener);

  // While mode is "system", keep the applied class in sync if the OS
  // preference changes while the page is open.
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onSystemChange = () => {
    if (getStoredMode() === "system") applyMode("system");
    listener();
  };
  media.addEventListener("change", onSystemChange);

  return () => {
    listeners = listeners.filter((l) => l !== listener);
    media.removeEventListener("change", onSystemChange);
  };
}

function setMode(mode: Mode) {
  try {
    localStorage.setItem(MODE_KEY, mode);
  } catch {
    // Storage unavailable (private browsing, disabled storage) - the choice
    // just won't persist across visits.
  }
  applyMode(mode);
  listeners.forEach((l) => l());
}

function setColorTheme(theme: ColorTheme) {
  try {
    localStorage.setItem(COLOR_KEY, theme);
  } catch {
    // Same as above - non-fatal, just won't persist.
  }
  applyColorTheme(theme);
  listeners.forEach((l) => l());
}

export function ThemeProvider({
  children,
  defaultMode = "system",
  defaultColorTheme = DEFAULT_COLOR_THEME,
}: {
  children: ReactNode;
  defaultMode?: Mode;
  defaultColorTheme?: ColorTheme;
}) {
  const mode = useSyncExternalStore(subscribe, getModeSnapshot, () => defaultMode);
  const colorTheme = useSyncExternalStore(subscribe, getColorThemeSnapshot, () => defaultColorTheme);
  const resolvedMode = useSyncExternalStore(
    subscribe,
    () => resolveMode(mode),
    () => (defaultMode === "dark" ? "dark" : "light")
  );

  const value = useMemo<ThemeContextValue>(
    () => ({ mode, resolvedMode, setMode, colorTheme, setColorTheme }),
    [mode, resolvedMode, colorTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
