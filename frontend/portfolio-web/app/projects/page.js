import Projects from "@/components/Projects";
import { getProjects } from "@/lib/api";

export const metadata = { title: "Projects | Portfolio" };

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Projects</h1>
      <div className="mt-8">
        <Projects projects={projects} />
      </div>
    </div>
  );
}
