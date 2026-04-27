"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { LearnJourneyDetailModal } from "@/components/LearnJourneyDetailModal";
import { LearnJourneyPath } from "@/components/LearnJourneyPath";
import { buildLearnJourneyRows } from "@/lib/learn-journey-hub";
import type { LearnProgressState } from "@/lib/learn-progress";

export function LearnJourneyCarousel({
  progress,
  developerMode,
}: {
  progress: LearnProgressState;
  developerMode: boolean;
}) {
  const search = useSearchParams();
  const signParam = search.get("sign")?.trim() ?? null;

  const rows = useMemo(
    () => buildLearnJourneyRows(progress, developerMode),
    [progress, developerMode],
  );

  const [detailIdx, setDetailIdx] = useState<number | null>(null);

  const onSelectSign = useCallback(
    (idx: number) => {
      if (rows[idx]) setDetailIdx(idx);
    },
    [rows],
  );

  useEffect(() => {
    if (!signParam) return;
    const i = rows.findIndex((r) => r.cover.key === signParam);
    if (i >= 0) setDetailIdx(i);
  }, [signParam, rows]);

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
      <LearnJourneyPath
        key={progressKey}
        rows={rows}
        progress={progress}
        developerMode={developerMode}
        onSelectSign={onSelectSign}
        centerActionLabel="Open →"
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
