import "server-only";
import type {
  Education,
  Experience,
  Profile,
  Project,
  SkillCategories,
} from "@/types/api";
import {
  fallbackEducation,
  fallbackExperience,
  fallbackProfile,
  fallbackProjects,
  fallbackSkills,
} from "@/lib/fallback-data";

// Matches the `servers` entry in v1.json; override per-environment via
// NEXT_PUBLIC_API_URL (see .env.example).
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "https://portfolio-api.mugavai.co";

async function getJson<T>(path: string, fallback: T, revalidate = 60): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      next: {
        revalidate,
      },
    });

    if (!res.ok) {
      console.error(
        `API request failed: ${res.status} ${res.statusText} - ${url}`
      );

      return fallback;
    }

    return (await res.json()) as T;
  } catch (error) {
    console.error(`Failed to fetch API: ${url}`, error);

    return fallback;
  }
}

export const getProfile = () => getJson<Profile>("/api/profile", fallbackProfile);
export const getSkills = () => getJson<SkillCategories>("/api/skills", fallbackSkills);
export const getProjects = () => getJson<Project[]>("/api/projects", fallbackProjects);
export const getExperience = () =>
  getJson<Experience[]>("/api/experience", fallbackExperience);
export const getEducation = () =>
  getJson<Education[]>("/api/education", fallbackEducation);

export function resumePdfUrl(): string {
  return `${API_BASE_URL}/api/resume/pdf`;
}

export async function getPortfolioData() {
  const [profile, skills, projects, experience, education] = await Promise.all([
    getProfile(),
    getSkills(),
    getProjects(),
    getExperience(),
    getEducation(),
  ]);
  return { profile, skills, projects, experience, education };
}
