import Skills from "@/components/Skills";
import { getSkills } from "@/lib/api";

export const metadata = { title: "Skills | Portfolio" };

export default async function SkillsPage() {
  const skills = await getSkills();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Skills</h1>
      <div className="mt-8">
        <Skills skills={skills} />
      </div>
    </div>
  );
}
