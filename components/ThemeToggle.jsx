"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";

const NEXT_THEME = { system: "light", light: "dark", dark: "system" };
const ICON = { system: Monitor, light: Sun, dark: Moon };
const LABEL = { system: "System theme", light: "Light theme", dark: "Dark theme" };

function noopSubscribe() {
  return () => {};
}

/**
 * True only once mounted on the client. Same purpose as the common "mounted" useEffect
 * flag (theme is unknown until after hydration, to avoid a server/client mismatch), but
 * via useSyncExternalStore instead of calling setState from an effect body.
 */
function useHasMounted() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/** Cycles system -> light -> dark -> system. Icon reflects the current *setting*, not the resolved theme. */
export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useHasMounted();

  const current = mounted ? (theme ?? "system") : "system";
  const Icon = ICON[current] ?? Monitor;

  return (
    <button
      type="button"
      onClick={() => setTheme(NEXT_THEME[current])}
      aria-label={`Theme: ${LABEL[current]}. Click to switch.`}
      title={LABEL[current]}
      className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
    >
      {mounted && <Icon size={16} />}
    </button>
  );
}
