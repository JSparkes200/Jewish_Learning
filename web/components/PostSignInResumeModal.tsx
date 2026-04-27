"use client";

import { useAuth } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  getResumeLabel,
  getUniversalResumePath,
} from "@/lib/app-activity";
import { validateResumePath } from "@/lib/app-session.model";
import {
  LEARN_CLOUD_HYDRATED_EVENT,
  loadLearnProgress,
} from "@/lib/learn-progress";

/**
 * After a fresh sign-in (guest → signed in), offers to jump to the merged
 * “last place” once cloud backup has been applied.
 */
export function PostSignInResumeModal() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<{ path: string; label: string } | null>(
    null,
  );
  const prevSigned = useRef<boolean | null>(null);
  const dismissedThisSignIn = useRef(false);
  const signInToken = useRef(0);

  const tryOpen = useCallback(() => {
    if (dismissedThisSignIn.current) return;
    const p = loadLearnProgress();
    const path = getUniversalResumePath(p);
    if (!path) return;
    const v = validateResumePath(path);
    if (!v) return;
    const here = `${pathname}${typeof window !== "undefined" ? window.location.search : ""}`;
    if (v === here || v === pathname) {
      return;
    }
    const label = getResumeLabel(p) ?? "Last page";
    setTarget({ path: v, label });
    setOpen(true);
  }, [pathname]);

  useEffect(() => {
    if (!isLoaded) return;
    const was = prevSigned.current;
    if (isSignedIn && was === false) {
      signInToken.current += 1;
      dismissedThisSignIn.current = false;
      const tok = signInToken.current;
      const onReady = () => {
        if (signInToken.current !== tok) return;
        tryOpen();
      };
      const w = window as unknown as { hebrewLearnCloudReady?: boolean };
      if (w.hebrewLearnCloudReady) {
        queueMicrotask(onReady);
        prevSigned.current = isSignedIn;
        return;
      }
      window.addEventListener(LEARN_CLOUD_HYDRATED_EVENT, onReady, {
        once: true,
      });
      prevSigned.current = isSignedIn;
      return;
    }
    if (!isSignedIn) {
      dismissedThisSignIn.current = false;
    }
    prevSigned.current = isSignedIn;
  }, [isLoaded, isSignedIn, tryOpen]);

  const onContinue = useCallback(() => {
    if (target) router.push(target.path);
    dismissedThisSignIn.current = true;
    setOpen(false);
    setTarget(null);
  }, [router, target]);

  const onStay = useCallback(() => {
    dismissedThisSignIn.current = true;
    setOpen(false);
    setTarget(null);
  }, []);

  if (!isLoaded || !isSignedIn || !open || !target) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center bg-ink/40 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="post-signin-resume-title"
    >
      <div className="w-full max-w-sm rounded-2xl border border-ink/15 bg-parchment p-5 shadow-2xl">
        <h2
          id="post-signin-resume-title"
          className="font-label text-xs uppercase tracking-wide text-ink"
        >
          You’re signed in
        </h2>
        <p className="mt-2 text-sm text-ink-muted">
          Progress on this device is merged with your account when the server
          is configured. Continue where you left off?
        </p>
        <p className="mt-3 text-sm font-medium text-ink">{target.label}</p>
        <p className="mt-0.5 break-all text-[10px] text-ink-faint" title={target.path}>
          {target.path}
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onStay}
            className="btn-elevated-secondary sm:min-w-[7rem]"
          >
            Stay here
          </button>
          <button
            type="button"
            onClick={onContinue}
            className="btn-elevated-primary sm:min-w-[7rem]"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
