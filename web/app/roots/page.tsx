import { Suspense } from "react";
import { RootsPageClient } from "./RootsPageClient";

export const metadata = {
  title: "Word roots",
  description: "Hebrew shoresh families and graduated root drill.",
};

export default function RootsPage() {
  return (
    <Suspense
      fallback={
        <p className="text-sm text-ink-muted">Loading roots study…</p>
      }
    >
      <RootsPageClient />
    </Suspense>
  );
}
