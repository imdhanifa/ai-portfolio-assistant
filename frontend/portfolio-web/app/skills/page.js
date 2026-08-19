import { Sparkles } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Skills from "@/components/Skills";
import { getSkills } from "@/lib/api";

export const metadata = {
  title: "Skills",
  description: "Technical skills across backend, frontend, databases, architecture, AI and DevOps.",
};

export default async function SkillsPage() {
  const skills = await getSkills();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <PageHeader icon={Sparkles} title="Skills" />
      <Skills skills={skills} />
    </div>
  );
}
