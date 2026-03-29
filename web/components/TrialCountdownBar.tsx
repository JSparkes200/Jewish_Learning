"use client";

import { useEffect, useState } from "react";
import {
  TRIAL_SESSION_EVENT,
  formatTrialCountdown,
  getTrialRemainingMs,
  loadTrialSession,
} from "@/lib/trial-session";

/**
 * Slim countdown shown under the main header row while a local trial is active.
 */
export function TrialCountdownBar() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const bump = () => setTick((t) => t + 1);
    window.addEventListener(TRIAL_SESSION_EVENT, bump);
    const id = window.setInterval(bump, 1000);
    return () => {
      window.removeEventListener(TRIAL_SESSION_EVENT, bump);
      window.clearInterval(id);
    };
  }, []);

  const session = loadTrialSession();
  const remainingMs = getTrialRemainingMs(session);
  if (remainingMs <= 0) return null;

  return (
    <div
      className="border-b border-rust/25 bg-gradient-to-r from-rust/12 to-sage/15 px-4 py-1.5 text-center"
      role="status"
      aria-live="polite"
      aria-label={`Trial access ends in ${formatTrialCountdown(remainingMs)}`}
    >
      <span className="font-label text-[10px] font-semibold uppercase tracking-[0.16em] text-rust">
        Trial
      </span>
      <span className="mx-2 text-ink-muted">·</span>
      <span className="font-mono text-xs font-semibold tabular-nums text-ink">
        {formatTrialCountdown(remainingMs)} left
      </span>
    </div>
  );
}
