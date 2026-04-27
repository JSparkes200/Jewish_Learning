import { Suspense } from "react";
import { LearnPageClient } from "./LearnPageClient";

export default function LearnPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-lg space-y-4 px-4 py-6">
          <div className="h-64 animate-pulse rounded-2xl border border-ink/10 bg-parchment-deep/30" />
        </div>
      }
    >
      <LearnPageClient />
    </Suspense>
  );
}
