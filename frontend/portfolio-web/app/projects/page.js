import { FolderGit2 } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Projects from "@/components/Projects";
import { getProjects } from "@/lib/api";

export const metadata = {
  title: "Projects",
  description: "A selection of projects, including the technologies used to build each one.",
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <PageHeader icon={FolderGit2} title="Projects" />
      <Projects projects={projects} />
    </div>
  );
}
