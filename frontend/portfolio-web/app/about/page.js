import { getProfile } from "@/lib/api";

export const metadata = { title: "About | Portfolio" };

export default async function AboutPage() {
  const profile = await getProfile();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">About</h1>
      <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400">
        {profile?.summary ||
          "TODO: Full about-me text. This will come from profile.json / the resume once real content is added."}
      </p>
      {profile?.location && (
        <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-500">📍 {profile.location}</p>
      )}
    </div>
  );
}
