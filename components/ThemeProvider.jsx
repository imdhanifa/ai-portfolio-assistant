"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";

/**
 * Wires up light/dark/system theming (next-themes): toggles a `.dark` class on <html>,
 * defaults to the OS preference ("system"), persists the user's explicit choice in
 * localStorage, and injects a pre-hydration script so there's no flash of the wrong theme.
 */
export default function ThemeProvider({ children }) {
  return (
    <NextThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemeProvider>
  );
}
