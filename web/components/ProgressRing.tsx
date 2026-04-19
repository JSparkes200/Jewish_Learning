"use client";

/**
 * SVG donut for course / skill summaries (nutrition-style progress at a glance).
 * Uses SVG filters and gradients to create a soft, 3D neumorphic floating effect.
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

  const colors = {
    sage: { start: "#7ba352", end: "#4a6830", shadow: "rgba(74, 104, 48, 0.45)" },
    amber: { start: "#e58a35", end: "#a65a15", shadow: "rgba(200, 112, 32, 0.45)" },
    rust: { start: "#a84a25", end: "#6b2a10", shadow: "rgba(139, 58, 26, 0.45)" },
  }[tone || "sage"];

  return (
    <div
      className="relative inline-flex flex-shrink-0 flex-col items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90 overflow-visible">
        <defs>
          <linearGradient id={`grad-${tone}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.start} />
            <stop offset="100%" stopColor={colors.end} />
          </linearGradient>
          <filter id={`shadow-${tone}`} x="-20%" y="-20%" width="140%" height="140%">
            {/* Main soft colored drop shadow */}
            <feDropShadow dx="3" dy="6" stdDeviation="5" floodColor={colors.shadow} />
            {/* Subtle top-left white highlight for the 3D tube effect */}
            <feDropShadow dx="-1" dy="-1" stdDeviation="1.5" floodColor="rgba(255,255,255,0.6)" />
          </filter>
        </defs>

        {/* Track Background */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          className="stroke-ink/5"
          strokeWidth={stroke}
        />

        {/* Progress Bar with Neumorphic 3D Effect */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#grad-${tone})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          style={{ filter: `url(#shadow-${tone})` }}
          className="transition-[stroke-dasharray] duration-1000 ease-out"
        />
      </svg>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-2 text-center">
        <span
          className={
            compact
              ? "text-xl font-bold tabular-nums leading-none text-ink"
              : "text-3xl font-bold tabular-nums leading-none text-ink"
          }
        >
          {label}
        </span>
        {sublabel ? (
          <span
            className={
              compact
                ? "mt-1 max-w-[5.5rem] text-[7px] font-bold uppercase leading-tight tracking-wide text-ink-muted"
                : "mt-1.5 max-w-[7rem] text-[9px] font-bold uppercase leading-tight tracking-wide text-ink-muted"
            }
          >
            {sublabel}
          </span>
        ) : null}
      </div>
    </div>
  );
}
