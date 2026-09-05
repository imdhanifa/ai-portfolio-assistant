// Types mirroring / extending the shapes exposed by Portfolio.Api (v1.json).
// The OpenAPI spec only documents 200 responses without a body schema for the
// Portfolio-tagged endpoints, so these shapes are the contract this frontend
// expects the API to return. Every field the UI actually renders is optional
// so a partial/evolving API response never breaks a page.

export interface StatItem {
  label: string;
  value: string;
}

export interface Profile {
  name?: string;
  title?: string;
  tagline?: string;
  summary?: string;
  yearsExperience?: number;
  availability?: string;
  email?: string;
  phone?: string;
  github?: string;
  linkedin?: string;
  website?: string;
  location?: string;
  resumeUrl?: string;
  stats?: StatItem[];
}

// GET /api/skills returns a dictionary keyed by category (e.g. "frontend",
// "packages_and_libraries"), each holding a flat list of skill names - not
// an array of {name, category} records.
export type SkillCategories = Record<string, string[]>;

export interface Project {
  id?: string | number;
  name: string;
  description?: string;
  technologies?: string[];
  link?: string;
}

export interface Experience {
  id?: string | number;
  company: string;
  role: string;
  location?: string;
  startDate?: string;
  endDate?: string | null;
  current?: boolean;
  description?: string;
  technologies?: string[];
}

export interface Education {
  id?: string | number;
  institution: string;
  degree: string;
  field?: string;
  startDate?: string;
  endDate?: string | null;
  description?: string;
}

// --- Generated from the OpenAPI ChatRequest / ChatResponse / ProblemDetails schemas ---

export interface ChatRequest {
  message: string;
  conversationId?: string | null;
}

export interface ChatResponse {
  answer: string;
  sources?: string[];
}

export interface ProblemDetails {
  type?: string | null;
  title?: string | null;
  status?: number | string | null;
  detail?: string | null;
  instance?: string | null;
}
