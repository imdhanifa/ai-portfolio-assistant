import type { Profile } from "@/types/api";
import { resumePdfUrl } from "@/lib/api";
import { ResumeDownloadButton } from "@/components/resume-download-button";

export function Footer({ profile }: { profile: Profile }) {
  return (
    <footer id="contact" className="border-t border-card-border bg-bg/50 py-16">
      <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
        <h2 className="text-3xl font-extrabold">Let&apos;s Work Together</h2>
        <p className="text-muted max-w-xl mx-auto">
          Currently open to Senior .NET Developer roles, high-impact consulting, or AI integration engineering.
        </p>
        {profile.location && (
          <p className="text-sm text-muted/70 flex items-center justify-center gap-1.5">
            <i className="fa-solid fa-location-dot text-xs" aria-hidden="true" />
            {profile.location}
          </p>
        )}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center px-8 py-4 text-base font-bold text-black bg-gradient-to-r from-accent to-accent-2 rounded-xl shadow-lg hover:shadow-accent/20 hover:scale-105 transition-all"
            >
              Send Email <i className="fa-solid fa-envelope ml-2" aria-hidden="true" />
            </a>
          )}
          <ResumeDownloadButton
            href={resumePdfUrl()}
            fileName={profile.name ? `${profile.name.replace(/\s+/g, "-")}-Resume.pdf` : "Resume.pdf"}
          />
        </div>
        <div className="flex justify-center space-x-6 pt-6 text-muted">
          {profile.phone && (
            <a href={`tel:${profile.phone.replace(/\s+/g, "")}`} className="hover:text-accent text-xl transition-colors" aria-label="Call">
              <i className="fa-solid fa-phone" aria-hidden="true" />
            </a>
          )}
          {profile.github && (
            <a href={profile.github} target="_blank" rel="noreferrer" className="hover:text-accent text-xl transition-colors" aria-label="GitHub">
              <i className="fa-brands fa-github" aria-hidden="true" />
            </a>
          )}
          {profile.linkedin && (
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="hover:text-accent text-xl transition-colors" aria-label="LinkedIn">
              <i className="fa-brands fa-linkedin" aria-hidden="true" />
            </a>
          )}
          {profile.website && (
            <a href={profile.website} target="_blank" rel="noreferrer" className="hover:text-accent text-xl transition-colors" aria-label="Personal website">
              <i className="fa-solid fa-globe" aria-hidden="true" />
            </a>
          )}
        </div>
        <p className="text-xs text-muted/70 pt-8">
          © {new Date().getFullYear()} {profile.name ?? "Mohamed Hanifa"}. Built with Next.js &amp; Tailwind CSS.
        </p>
      </div>
    </footer>
  );
}
