"use client";

/**
 * SVG donut for course / skill summaries (nutrition-style progress at a glance).
 */
export function ProgressRing({
  percent,
  size = 132,
  stroke = 12,
  tone = "sage",
  label,
  sublabel,
  compact,
}: {
  percent: number;
  size?: number;
  stroke?: number;
  tone?: "sage" | "amber" | "rust";
  label: string;
  sublabel?: string;
  /** Smaller center type for skill grid cells */
  compact?: boolean;
}) {
  const p = Math.max(0, Math.min(100, percent));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (p / 100) * c;

  const strokeColor =
    tone === "amber"
      ? "#c87020"
      : tone === "rust"
        ? "#8b3a1a"
        : "#4a6830";

  return (
    <div
      className="relative inline-flex flex-shrink-0 flex-col items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        className="-rotate-90"
        aria-hidden
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          className="stroke-parchment-deep/50"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={strokeColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          className="drop-shadow-sm transition-[stroke-dasharray] duration-500 ease-out"
        />
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-2 text-center">
        <span
          className={
            compact
              ? "text-sm font-semibold tabular-nums leading-none text-ink"
              : "text-xl font-semibold tabular-nums leading-none text-ink"
          }
        >
          {label}
        </span>
        {sublabel ? (
          <span
            className={
              compact
                ? "mt-0.5 max-w-[5.5rem] text-[7px] font-label uppercase leading-tight tracking-wide text-ink-faint"
                : "mt-1 max-w-[7rem] text-[9px] font-label uppercase leading-tight tracking-wide text-ink-faint"
            }
          >
            {sublabel}
          </span>
        ) : null}
      </div>
    </div>
  );
}
