// Central site-wide constants for SEO/metadata. SITE_URL must be set to the
// real production domain once this is deployed (see .env.example) - search
// engines, social previews, and the JSON-LD structured data below all
// resolve relative URLs against it.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
  /\/$/,
  ""
);

export const SITE_NAME = "Mohamed Hanifa | Portfolio";
