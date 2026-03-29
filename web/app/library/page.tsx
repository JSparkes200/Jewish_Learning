import { Hebrew } from "@/components/Hebrew";
import { LibraryPageClient } from "./LibraryPageClient";

export default function LibraryPage() {
  return (
    <div className="mx-auto max-w-lg">
      <Hebrew as="h1" className="mb-4 block text-2xl text-ink">
        סִפְרִיָּה
      </Hebrew>
      <LibraryPageClient />
    </div>
  );
}
