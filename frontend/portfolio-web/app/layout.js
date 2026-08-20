import { Geist, Geist_Mono } from "next/font/google";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/BrandIcons";
import "./globals.css";
import Navbar from "@/components/Navbar";
import AIChat from "@/components/AIChat";
import ThemeProvider from "@/components/ThemeProvider";
import { getProfile } from "@/lib/api";
import { SITE_URL } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const FALLBACK_TITLE = "Portfolio | Full Stack .NET Developer";
const FALLBACK_DESCRIPTION =
  "Personal portfolio with an AI assistant that answers questions about skills, experience and projects using MCP.";

export async function generateMetadata() {
  const profile = await getProfile();
  const title = profile?.name && profile?.title ? `${profile.name} | ${profile.title}` : FALLBACK_TITLE;
  const description = profile?.summary || FALLBACK_DESCRIPTION;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s | ${profile?.name || "Portfolio"}`,
    },
    description,
    keywords: [".NET", "ASP.NET Core", "Next.js", "Full Stack Developer", "AI", "MCP", profile?.name].filter(
      Boolean,
    ),
    authors: profile?.name ? [{ name: profile.name, url: profile.website || SITE_URL }] : undefined,
    alternates: { canonical: "/" },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      url: SITE_URL,
      siteName: title,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function RootLayout({ children }) {
  const profile = await getProfile();

  const personJsonLd = profile && {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    description: profile.summary,
    email: profile.email,
    url: profile.website || SITE_URL,
    sameAs: [profile.github, profile.linkedin, profile.website].filter(Boolean),
  };

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
        {personJsonLd && (
          // Static JSON we built ourselves (not user input) - the project's eslint config
          // doesn't flag react/no-danger, so no suppression comment needed here.
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
          />
        )}
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>

          <footer className="border-t border-zinc-200 dark:border-zinc-800">
            <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
              <p className="text-sm text-zinc-500 dark:text-zinc-500">
                Built with Next.js, .NET 10, MCP and Grok.
              </p>
              <div className="flex items-center gap-4">
                {profile?.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="text-zinc-400 transition-colors hover:text-indigo-500 dark:text-zinc-600 dark:hover:text-indigo-400"
                  >
                    <GithubIcon size={18} />
                  </a>
                )}
                {profile?.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="text-zinc-400 transition-colors hover:text-indigo-500 dark:text-zinc-600 dark:hover:text-indigo-400"
                  >
                    <LinkedinIcon size={18} />
                  </a>
                )}
                {profile?.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    aria-label="Email"
                    className="text-zinc-400 transition-colors hover:text-indigo-500 dark:text-zinc-600 dark:hover:text-indigo-400"
                  >
                    <Mail size={18} />
                  </a>
                )}
              </div>
            </div>
          </footer>

          <AIChat />
        </ThemeProvider>
      </body>
    </html>
  );
}
