/**
 * App-wide route recording + universal resume. Uses {@link LearnProgressState.appSession}
 * and falls back to foundation section resume.
 */

import { getNextLearnUp } from "@/lib/learn-next-up";
import {
  getFoundationResumePath,
  loadLearnProgress,
  saveLearnProgress,
  type LearnProgressState,
} from "@/lib/learn-progress";
import {
  reduceAppSession,
  validateResumePath,
  type AppSession,
} from "@/lib/app-session.model";
import type { YiddishProgressState } from "@/lib/yiddish-progress";

function sessionSnapshot(s: AppSession | undefined): string {
  return JSON.stringify(s ?? null);
}

/**
 * Call on client route changes (pathname). Records visit log + last resumable URL.
 */
export function recordNavigation(pathname: string): void {
  if (typeof window === "undefined") return;
  const search = window.location.search;
  const full = `${pathname}${search}`;
  const cur = loadLearnProgress();
  const nextSess = reduceAppSession(cur.appSession, full, pathname);
  if (sessionSnapshot(cur.appSession) === sessionSnapshot(nextSess)) return;
  saveLearnProgress({ ...cur, appSession: nextSess });
}

/**
 * Best URL to re-open: newest tracked in-app page, else a foundation section if available.
 */
export function getUniversalResumePath(progress: LearnProgressState): string | null {
  const lr = progress.appSession?.lastResume;
  if (lr?.path) {
    const v = validateResumePath(lr.path);
    if (v) return v;
  }
  return getFoundationResumePath(progress);
}

export function getResumeLabel(progress: LearnProgressState): string | null {
  const lr = progress.appSession?.lastResume;
  if (lr?.label && validateResumePath(lr.path)) return lr.label;
  const f = getFoundationResumePath(progress);
  if (f) {
    return "Foundation lesson (saved position)";
  }
  return null;
}

export type ContinueDestination = {
  href: string;
  label: string;
  source: "last" | "suggested";
  /** For shell / CTA: “Continue” when resuming a tracked page, else “Next up”. */
  actionLabel: "Continue" | "Next up";
  icon?: string;
};

/**
 * Single “where should Continue go?”: last tracked / foundation resume first,
 * then curriculum `getNextLearnUp`.
 */
export function getContinueDestination(
  progress: LearnProgressState,
  yiddish: YiddishProgressState,
): ContinueDestination {
  const last = getUniversalResumePath(progress);
  if (last) {
    return {
      href: last,
      label: getResumeLabel(progress) ?? "Where you left off",
      source: "last",
      actionLabel: "Continue",
      icon: "📌",
    };
  }
  const next = getNextLearnUp(progress, { yiddishProgress: yiddish });
  return {
    href: next.href,
    label: next.label,
    source: "suggested",
    actionLabel: "Next up",
    icon: next.icon,
  };
}
