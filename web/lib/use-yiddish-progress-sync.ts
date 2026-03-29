"use client";

import { useCallback, useEffect, useState } from "react";
import {
  YIDDISH_PROGRESS_EVENT,
  YIDDISH_PROGRESS_KEY,
  createEmptyYiddishProgressState,
  loadYiddishProgress,
  type YiddishProgressState,
} from "@/lib/yiddish-progress";

export function useYiddishProgressSync() {
  const [progress, setProgress] = useState<YiddishProgressState>(() =>
    createEmptyYiddishProgressState(),
  );

  const sync = useCallback(() => {
    setProgress(loadYiddishProgress());
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener(YIDDISH_PROGRESS_EVENT, sync);
    const onStorage = (e: StorageEvent) => {
      if (e.key === YIDDISH_PROGRESS_KEY) sync();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(YIDDISH_PROGRESS_EVENT, sync);
      window.removeEventListener("storage", onStorage);
    };
  }, [sync]);

  return [progress, setProgress] as const;
}
