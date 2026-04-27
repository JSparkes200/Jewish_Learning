import type { Metadata } from "next";
import { FundraisingPath } from "@/components/FundraisingPath";
import { sampleFundraisingMilestones } from "@/data/sampleFundraisingMilestones";

export const metadata: Metadata = {
  title: "Fundraising path",
  description: "Winding progress path with milestone markers (demo).",
  robots: { index: false, follow: false },
};

/**
 * Full-viewport area for the path demo: path stays the main visual, centered
 * within the app shell’s content column.
 */
export default function FundraisingPathDemoPage() {
  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center bg-gradient-to-b from-slate-100/90 to-amber-50/40 px-3 py-8 md:px-6 md:py-12">
      <FundraisingPath
        milestones={sampleFundraisingMilestones}
        title="Community campaign"
        className="w-full"
      />
    </div>
  );
}
