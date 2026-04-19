"use client";

import { useAppShell } from "@/components/AppShell";

type Props = {
  className?: string;
  /** Smaller label on tight toolbars */
  compact?: boolean;
};

/**
 * Opens the same Ask the Rabbi sheet as the app shell, using the Hebrew cue
 * the active drill registered via `setRabbiAskContext`. If none is set, the
 * modal still opens with guidance (same as legacy header flow).
 */
export function ExerciseAskRabbiButton({
  className = "",
  compact = false,
}: Props) {
  const { openAskRabbiModal } = useAppShell();

  return (
    <button
      type="button"
      onClick={() => openAskRabbiModal()}
      className={`shrink-0 rounded-full border border-sage/35 bg-parchment/95 px-3 py-1.5 font-label uppercase tracking-wide text-sage shadow-sm transition hover:border-sage/50 hover:bg-sage/10 ${compact ? "text-[8px]" : "text-[9px]"} ${className}`.trim()}
      title="Deeper notes, grammar, and examples for the Hebrew on this exercise"
    >
      Ask the Rabbi
    </button>
  );
}
