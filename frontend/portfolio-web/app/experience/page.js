import Experience from "@/components/Experience";
import { getExperience } from "@/lib/api";

export const metadata = { title: "Experience | Portfolio" };

export default async function ExperiencePage() {
  const experience = await getExperience();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Experience</h1>
      <div className="mt-8">
        <Experience experience={experience} />
      </div>
    </div>
  );
}
