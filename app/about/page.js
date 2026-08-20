import { User, MapPin } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { getProfile } from "@/lib/api";

export const metadata = {
  title: "About",
  description: "Background, focus areas and how to get in touch.",
};

export default async function AboutPage() {
  const profile = await getProfile();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <PageHeader icon={User} title="About" />
      <p className="text-lg text-zinc-600 dark:text-zinc-400">
        {profile?.summary ||
          "TODO: Full about-me text. This will come from profile.json / the resume once real content is added."}
      </p>
      {profile?.location && (
        <p className="mt-4 flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-500">
          <MapPin size={14} />
          {profile.location}
        </p>
      )}
    </div>
  );
}
