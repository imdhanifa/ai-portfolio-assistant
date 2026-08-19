import Resume from "@/components/Resume";

export const metadata = { title: "Resume | Portfolio" };

export default function ResumePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Resume</h1>
      <div className="mt-8">
        <Resume />
      </div>
    </div>
  );
}
