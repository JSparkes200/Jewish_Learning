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
  const hydratedUser = useRef<string | null>(null);
  const inFlightHydrationUser = useRef<string | null>(null);

  const pushNow = useCallback(() => {
    if (!isSignedIn || !userId) return;
    if (pushTimer.current) {
      clearTimeout(pushTimer.current);
      pushTimer.current = null;
    }
    void pushProgressToCloud();
  }, [isSignedIn, userId]);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn || !userId) {
      hydratedUser.current = null;
      inFlightHydrationUser.current = null;
      markHydrated();
      return;
    }
    if (hydratedUser.current === userId) {
      markHydrated();
      pushNow();
      return;
    }
    if (inFlightHydrationUser.current === userId) return;

    inFlightHydrationUser.current = userId;
    const w = window as unknown as { hebrewLearnCloudReady?: boolean };
    w.hebrewLearnCloudReady = false;
    (async () => {
      let shouldSeedCloud = false;
      try {
        const pull = await pullProgressFromCloud("merge");
        shouldSeedCloud = pull.ok || pull.reason === "not-found";
      } catch {
        shouldSeedCloud = false;
      } finally {
        if (inFlightHydrationUser.current !== userId) return;
        hydratedUser.current = userId;
        inFlightHydrationUser.current = null;
        markHydrated();
        if (shouldSeedCloud) {
          pushNow();
        }
      }
    })();
  }, [isLoaded, isSignedIn, userId, pushNow]);

  const schedulePush = useCallback(() => {
    if (!isSignedIn || !userId) return;
    if (pushTimer.current) clearTimeout(pushTimer.current);
    pushTimer.current = setTimeout(() => {
      pushTimer.current = null;
      void pushProgressToCloud();
    }, 1000);
  }, [isSignedIn, userId]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onProgress = () => schedulePush();
    const onPageHide = () => pushNow();
    window.addEventListener(LEARN_PROGRESS_EVENT, onProgress);
    window.addEventListener("pagehide", onPageHide);
    return () => {
      window.removeEventListener(LEARN_PROGRESS_EVENT, onProgress);
      window.removeEventListener("pagehide", onPageHide);
      if (pushTimer.current) clearTimeout(pushTimer.current);
    };
  }, [pushNow, schedulePush]);

  return null;
}
