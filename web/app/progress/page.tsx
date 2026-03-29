import { Hebrew } from "@/components/Hebrew";
import { ProgressPageClient } from "./ProgressPageClient";

export default function ProgressPage() {
  return (
    <div className="mx-auto max-w-lg">
      <Hebrew as="h1" className="mb-6 block text-2xl text-ink">
        הִתְקַדְמוּת
      </Hebrew>
      <ProgressPageClient />
    </div>
  );
}
