"use client";

import { useCallback, useEffect, useState } from "react";
import {
  LEARN_PROGRESS_EVENT,
  LEARN_PROGRESS_KEY,
  createEmptyLearnProgressState,
  loadLearnProgress,
  type LearnProgressState,
} from "@/lib/learn-progress";

export type LearnProgressSyncDeps = {
  /** Re-run initial load when the learner navigates (e.g. section route). */
  level?: number;
  sectionId?: string;
};

/**
 * Hydration-safe progress state: empty on first paint, then synced from
 * `localStorage`. Listens to {@link LEARN_PROGRESS_EVENT} (same tab) and
 * `storage` (other tabs / windows) for {@link LEARN_PROGRESS_KEY}.
 */
export function useLearnProgressSync(deps?: LearnProgressSyncDeps) {
  const [progress, setProgress] = useState<LearnProgressState>(() =>
    createEmptyLearnProgressState(),
  );

  const sync = useCallback(() => {
    setProgress(loadLearnProgress());
  }, []);

  const depKey = JSON.stringify({
    level: deps?.level,
    sectionId: deps?.sectionId,
  });

  useEffect(() => {
    sync();
    window.addEventListener(LEARN_PROGRESS_EVENT, sync);
    const onStorage = (e: StorageEvent) => {
      if (e.key === LEARN_PROGRESS_KEY) sync();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(LEARN_PROGRESS_EVENT, sync);
      window.removeEventListener("storage", onStorage);
    };
  }, [sync, depKey]);

  return [progress, setProgress] as const;
}
