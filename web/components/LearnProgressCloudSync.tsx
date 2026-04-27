"use client";

import { useAuth } from "@clerk/nextjs";
import { useCallback, useEffect, useRef } from "react";
import {
  pullProgressFromCloud,
  pushProgressToCloud,
} from "@/lib/cloud-progress-client";
import {
  LEARN_CLOUD_HYDRATED_EVENT,
  LEARN_PROGRESS_EVENT,
} from "@/lib/learn-progress";

const SESSION_KEY = "hebrew-cloud-pulled-uid:";

function markHydrated() {
  if (typeof window === "undefined") return;
  (window as unknown as { hebrewLearnCloudReady?: boolean }).hebrewLearnCloudReady =
    true;
  window.dispatchEvent(new Event(LEARN_CLOUD_HYDRATED_EVENT));
}

/**
 * Merges server Learn progress into `localStorage` once per sign-in (when KV is
 * configured), debounced cloud upload after each local save, and signals when
 * hydration is done so `/learn` can resume to the right section.
 */
export function LearnProgressCloudSync() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const pushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn || !userId) {
      markHydrated();
      return;
    }
    const k = SESSION_KEY + userId;
    if (sessionStorage.getItem(k)) {
      markHydrated();
      return;
    }
    const w = window as unknown as { hebrewLearnCloudReady?: boolean };
    w.hebrewLearnCloudReady = false;
    (async () => {
      try {
        await pullProgressFromCloud("merge");
      } finally {
        sessionStorage.setItem(k, "1");
        markHydrated();
      }
    })();
  }, [isLoaded, isSignedIn, userId]);

  const schedulePush = useCallback(() => {
    if (!isSignedIn) return;
    if (pushTimer.current) clearTimeout(pushTimer.current);
    pushTimer.current = setTimeout(() => {
      pushTimer.current = null;
      void pushProgressToCloud();
    }, 2500);
  }, [isSignedIn]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onProgress = () => schedulePush();
    window.addEventListener(LEARN_PROGRESS_EVENT, onProgress);
    return () => {
      window.removeEventListener(LEARN_PROGRESS_EVENT, onProgress);
      if (pushTimer.current) clearTimeout(pushTimer.current);
    };
  }, [schedulePush]);

  return null;
}
