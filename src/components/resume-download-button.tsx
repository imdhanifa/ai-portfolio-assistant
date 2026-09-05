"use client";

import { useState } from "react";

// A plain <a href=resumeUrl target="_blank"> just opens the PDF in the
// browser's viewer, and a plain `download` attribute isn't reliably honored
// cross-origin (this points at the API's own origin, not this app) unless
// the server sends Content-Disposition: attachment. Fetching the bytes
// ourselves and saving them as a Blob forces an actual download regardless.
export function ResumeDownloadButton({
  href,
  fileName = "Resume.pdf",
}: {
  href: string;
  fileName?: string;
}) {
  const [downloading, setDownloading] = useState(false);

  async function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    if (downloading) return;
    setDownloading(true);

    try {
      const res = await fetch(href);
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      // Network/CORS failure - fall back to just opening the resource
      // directly; the browser (or the server's own headers) takes it from
      // there instead of leaving the button dead.
      window.open(href, "_blank", "noopener,noreferrer");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      aria-busy={downloading}
      className="inline-flex items-center px-8 py-4 text-base font-bold glass-card rounded-xl hover:-translate-y-0.5 transition-all"
    >
      {downloading ? "Downloading…" : "Download Resume"}{" "}
      <i
        className={`fa-solid ${downloading ? "fa-spinner fa-spin" : "fa-file-arrow-down"} ml-2`}
        aria-hidden="true"
      />
    </a>
  );
}
