"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

// Not in lib.dom.d.ts yet - this is the standard shape Chromium browsers
// dispatch it with.
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isIos() {
  return typeof navigator !== "undefined" && /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari's own (non-standard) flag for "launched from home screen".
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

const noopSubscribe = () => () => {};

// Chrome only shows its own install UI (address-bar icon / mini-infobar)
// opportunistically, and it's easy to miss. This renders a persistent
// "Install app" control in the header - visible on every breakpoint - so
// there's always an obvious way in, and it disappears once the app is
// actually installed.
export function InstallPwaButton() {
  // We don't know standalone/installability until after mount - render
  // nothing on the server/first paint (same hydration-mismatch guard used by
  // ThemeToggle) rather than guessing and flipping.
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );

  // Lazy initializer, for the same reason as `installed` below: this only
  // ever matters once `mounted` is true (pre-mount we render null either
  // way), so reading a value that depends on the browser here can't create a
  // hydration mismatch. Picks up an event the beforeInteractive capture
  // script in layout.tsx already stashed before this component even mounted.
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(
    () =>
      (typeof window !== "undefined" &&
        (window as Window & { __bipEvent?: BeforeInstallPromptEvent }).__bipEvent) ||
      null
  );
  // Lazy initializer: only ever runs once per mount, in the browser (this
  // component renders null whenever `!mounted`, i.e. during SSR and the
  // hydration pass - see the return below - so there's nothing for this
  // initial value to mismatch against).
  const [installed, setInstalled] = useState(() => typeof window !== "undefined" && isStandalone());
  const [showIosTip, setShowIosTip] = useState(false);

  useEffect(() => {
    if (!mounted) return;

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    // An already-captured event is picked up by the lazy state initializer
    // above; this just covers the event arriving later than this effect.
    function onBipReady() {
      const captured = (window as Window & { __bipEvent?: BeforeInstallPromptEvent }).__bipEvent;
      if (captured) setDeferredPrompt(captured);
    }
    function onAppInstalled() {
      setInstalled(true);
      setDeferredPrompt(null);
    }

    window.addEventListener("bip-ready", onBipReady);
    window.addEventListener("appinstalled", onAppInstalled);
    return () => {
      window.removeEventListener("bip-ready", onBipReady);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, [mounted]);

  if (!mounted || installed) return null;
  // iOS Safari never fires beforeinstallprompt - show a tap-for-instructions
  // button there instead of hiding install entirely. Everywhere else, only
  // show once the browser has actually offered a real prompt to trigger.
  if (!deferredPrompt && !isIos()) return null;

  async function handleClick() {
    if (!deferredPrompt) {
      setShowIosTip((v) => !v);
      return;
    }
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleClick}
        aria-label="Install app"
        title="Install app"
        className="glass-card flex h-10 w-10 items-center justify-center rounded-lg hover:text-accent transition-colors"
      >
        <i className="fa-solid fa-arrow-down-to-bracket" aria-hidden="true" />
      </button>

      {showIosTip && (
        <div className="absolute right-0 top-12 z-50 w-56 rounded-xl glass-card border border-card-border p-3 text-xs text-muted shadow-xl">
          Tap <i className="fa-solid fa-arrow-up-from-bracket mx-1" aria-hidden="true" />{" "}
          &quot;Share&quot;, then &quot;Add to Home Screen&quot;.
        </div>
      )}
    </div>
  );
}
