"use client";

type Props = {
  showNikkud: boolean;
  onToggle: () => void;
  className?: string;
};

/**
 * Per-exercise switch: lesson default comes from props; user toggles for this screen only.
 */
export function NikkudExerciseToggle({
  showNikkud,
  onToggle,
  className = "",
}: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={showNikkud}
      aria-label={showNikkud ? "Vowel points shown; hide nikkud" : "Vowel points hidden; show nikkud"}
      onClick={onToggle}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-ink/15 bg-parchment/90 px-2 py-1 font-label text-[9px] uppercase tracking-wide text-ink-muted shadow-sm transition hover:bg-parchment-deep/50 ${className}`.trim()}
    >
      <span className="font-hebrew text-[11px] text-ink">ניקוד</span>
      <span
        className={`rounded px-1 py-0.5 tabular-nums ${
          showNikkud ? "bg-sage/20 text-sage" : "bg-ink/10 text-ink-faint"
        }`}
      >
        {showNikkud ? "On" : "Off"}
      </span>
    </button>
  );
}
