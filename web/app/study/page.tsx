import { Hebrew } from "@/components/Hebrew";
import { StudyPageClient } from "./StudyPageClient";

export default function StudyPage() {
  return (
    <div className="mx-auto max-w-lg">
      <Hebrew as="h1" className="mb-2 block text-2xl text-ink">
        חָזְרָה
      </Hebrew>
      <StudyPageClient />
    </div>
  );
}
