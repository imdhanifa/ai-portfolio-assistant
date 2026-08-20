import { FileText } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Resume from "@/components/Resume";

export const metadata = {
  title: "Resume",
  description: "Download the full resume as a PDF.",
};

export default function ResumePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <PageHeader icon={FileText} title="Resume" />
      <Resume />
    </div>
  );
}
