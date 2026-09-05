import type { Metadata } from "next";
import { Fira_Code, Inter } from "next/font/google";
import Script from "next/script";
import { ThemeProvider } from "@/components/theme-provider";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const firaCode = Fira_Code({ variable: "--font-fira-code", subsets: ["latin"] });

const DEFAULT_TITLE = "Mohamed Hanifa | Full Stack .NET & AI Developer";
const DEFAULT_DESCRIPTION =
  "Full Stack .NET Developer with 6+ years of experience engineering high-performance Web APIs, React/Angular frontends, and practical AI integrations.";

// Site-wide defaults. The home page (src/app/page.tsx) overrides title/
// description/openGraph/twitter with live values from the API via
// generateMetadata, so this mainly matters as a fallback and for anything
// that doesn't set its own metadata.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: DEFAULT_TITLE, template: `%s | ${SITE_NAME}` },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "Mohamed Hanifa",
    "Full Stack .NET Developer",
    ".NET Developer",
    "ASP.NET Core",
    "C# Developer",
    "React Developer",
    "Angular Developer",
    "Software Engineer",
    "Web API",
    "Microservices",
  ],
  authors: [{ name: "Mohamed Hanifa", url: SITE_URL }],
  creator: "Mohamed Hanifa",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "profile",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
};

// Sets the theme class + color-theme attribute on <html> before first
// paint, so there's no flash of the wrong theme. Uses next/script's
// `beforeInteractive` strategy - Next's documented mechanism for scripts
// that must run before hydration - which Next injects and manages outside
// normal React reconciliation. A plain hand-written <script> tag here still
// gets diffed like any other element, which is what trips React 19's
// "script tag rendered on the client" warning (the same warning
// next-themes' own approach used to trip). Storage keys and the default
// color theme must match theme-provider.tsx.
const THEME_INIT_SCRIPT = `(function(){try{var m=localStorage.getItem("theme-mode");var mode=(m==="light"||m==="dark"||m==="system")?m:"system";var resolved=mode==="system"?(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):mode;document.documentElement.classList.toggle("dark",resolved==="dark");document.documentElement.style.colorScheme=resolved;var c=localStorage.getItem("theme-color");var colors=["aurora","forest","sunset","ocean","neon","royal"];document.documentElement.setAttribute("data-color-theme",colors.indexOf(c)>-1?c:"aurora");}catch(e){}})();`;

// Chrome can fire `beforeinstallprompt` as soon as it finishes its
// installability check - which can happen before React hydrates and
// InstallPwaButton's own useEffect gets a chance to add its listener. The
// event fires once and isn't redispatched, so a late listener misses it
// silently (Chrome's own omnibox install icon still appears either way,
// since that's independent of page JS - only our custom button goes dark).
// Capturing it here, in a `beforeInteractive` script parsed before any
// hydration work starts, closes that race: whichever runs first, the
// listener or the event, `window.__bipEvent` ends up set and
// "bip-ready" tells InstallPwaButton to go read it.
const INSTALL_PROMPT_CAPTURE_SCRIPT = `(function(){window.addEventListener("beforeinstallprompt",function(e){e.preventDefault();window.__bipEvent=e;window.dispatchEvent(new Event("bip-ready"));});})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        <Script id="install-prompt-capture" strategy="beforeInteractive">
          {INSTALL_PROMPT_CAPTURE_SCRIPT}
        </Script>
      </head>
      <body
        className={`${inter.variable} ${firaCode.variable} bg-bg text-fg font-sans antialiased selection:bg-accent selection:text-black relative overflow-x-hidden`}
        // Some browser extensions (e.g. ColorZilla's `cz-shortcut-listen`)
        // inject attributes onto <body> before React hydrates. That's an
        // extension-caused DOM mutation, not an app bug - suppressed here
        // rather than on <html> so a real mismatch elsewhere still warns.
        suppressHydrationWarning
      >
        <ThemeProvider defaultMode="system" defaultColorTheme="aurora">
          {/* Ambient background glow, shared across the whole site rather than
              just the hero. `fixed inset-0` pins this to the viewport box
              itself, so the blurred blobs (positioned with negative offsets)
              can never widen the page's actual layout - which is what
              previously pushed fixed elements like the chat button off-screen
              on mobile. `overflow-hidden` clips them to that same box. */}
          <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
            <div className="glow-bg w-96 h-96 bg-accent top-0 -left-20" />
            <div className="glow-bg w-96 h-96 bg-accent-2 top-1/3 -right-20" />
          </div>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
