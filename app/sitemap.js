import { SITE_URL } from "@/lib/site";

const ROUTES = ["", "/about", "/skills", "/experience", "/projects", "/resume", "/chat"];

export default function sitemap() {
  const lastModified = new Date();

  return ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
