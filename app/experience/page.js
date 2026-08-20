import { Briefcase } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Experience from "@/components/Experience";
import { getExperience } from "@/lib/api";

export const metadata = {
  title: "Experience",
  description: "Professional work history and roles.",
};

export default async function ExperiencePage() {
  const experience = await getExperience();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <PageHeader icon={Briefcase} title="Experience" />
      <Experience experience={experience} />
    </div>
  );
}
