"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CoverFlowCarousel } from "@/components/CoverFlowCarousel";
import { LearnJourneyDetailModal } from "@/components/LearnJourneyDetailModal";
import { buildLearnJourneyRows } from "@/lib/learn-journey-hub";
import type { LearnProgressState } from "@/lib/learn-progress";

export function LearnJourneyCarousel({
  progress,
  developerMode,
}: {
  progress: LearnProgressState;
  developerMode: boolean;
}) {
  const rows = useMemo(
    () => buildLearnJourneyRows(progress, developerMode),
    [progress, developerMode],
  );

  const items = useMemo(() => rows.map((r) => r.cover), [rows]);

  const [detailIdx, setDetailIdx] = useState<number | null>(null);

  const onActivateCenter = useCallback(
    (idx: number) => {
      if (rows[idx]) setDetailIdx(idx);
    },
    [rows],
  );

  useEffect(() => {
    if (detailIdx == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDetailIdx(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [detailIdx]);

  const progressKey = `${progress.activeLevel}-${Object.keys(progress.completedSections).length}-${progress.bridgeModulePassed ? 1 : 0}-${Object.keys(progress.specialtyTierPassed ?? {}).length}`;

  return (
    <>
      <CoverFlowCarousel
        key={progressKey}
        variant="minimal"
        items={items}
        onActivateCenter={onActivateCenter}
        centerActionLabel="Open →"
        prevAriaLabel="Previous step"
        nextAriaLabel="Next step"
      />
      {detailIdx != null && rows[detailIdx] ? (
        <LearnJourneyDetailModal
          slot={rows[detailIdx]!.slot}
          progress={progress}
          developerMode={developerMode}
          onClose={() => setDetailIdx(null)}
        />
      ) : null}
    </>
  );
}
