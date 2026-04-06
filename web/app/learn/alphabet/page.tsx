import { Suspense } from "react";
import { WordDetailEnrichmentServer } from "@/components/WordDetailEnrichment.server";
import { AlphabetPageClient } from "./AlphabetPageClient";

export default function AlphabetPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <Suspense
        fallback={
          <p className="mb-4 text-xs text-ink-faint" aria-hidden>
            Loading sample context…
          </p>
        }
      >
        <WordDetailEnrichmentServer he="שָׁלוֹם" />
      </Suspense>
      <AlphabetPageClient />
    </div>
  );
}
