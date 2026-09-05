"use client";

import { useSyncExternalStore } from "react";
import { useTheme, type Mode } from "@/components/theme-provider";

const NEXT_MODE: Record<Mode, Mode> = { system: "light", light: "dark", dark: "system" };
const ICON: Record<Mode, string> = { system: "fa-desktop", light: "fa-sun", dark: "fa-moon" };
const LABEL: Record<Mode, string> = {
  system: "System theme",
  light: "Light theme",
  dark: "Dark theme",
};

const noopSubscribe = () => () => {};

/** Cycles system -> light -> dark -> system. Icon reflects the current *setting*, not the resolved theme. */
export function ThemeToggle() {
  const { mode, setMode } = useTheme();

  // Avoid a hydration mismatch: we don't know the persisted mode until
  // after mount, so render a stable placeholder on the server/first paint,
  // then flip to the real value once the client has taken over.
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );

  const current = mounted ? mode : "system";

  return (
    <button
      type="button"
      onClick={() => setMode(NEXT_MODE[current])}
      aria-label={`Theme: ${LABEL[current]}. Click to switch.`}
      title={LABEL[current]}
      className="glass-card flex h-10 w-10 items-center justify-center rounded-lg text-fg/80 hover:text-accent transition-colors"
    >
      {mounted ? (
        <i className={`fa-solid ${ICON[current]}`} aria-hidden="true" />
      ) : (
        <span className="block h-4 w-4" />
      )}
    </button>
  );
}
