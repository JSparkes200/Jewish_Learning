import type { ReactNode } from "react";

/** Same coordinate system as the SVG `viewBox` (see `PATH_VIEWBOX`). */
export type FundraisingMilestone = {
  amount: number;
  label: string;
  description: string;
  position: { x: number; y: number };
};

const PATH_VIEWBOX = { width: 1000, height: 500 } as const;

/**
 * A wide S-shaped curve: left → right, rises, then dips, then rises again to the end.
 * Same coordinate space as milestone `position` values.
 */
const FUNDRAISING_PATH_D =
  "M 20 360 " +
  "C 120 80 280 40 450 200 " +
  "C 550 300 500 450 700 400 " +
  "C 820 370 900 200 960 100 " +
  "C 978 60 990 50 1000 40";

const ICONS: readonly ReactNode[] = [
  <path key="f" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />,
  <g key="t" className="fill-none stroke-[2.5] stroke-current">
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="3" />
  </g>,
  <path key="h" d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 6.5 7-6.5" />,
  <path key="s" d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2z" />,
  <path
    key="c"
    d="M20 6L9 17l-5-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
  />,
  <g key="g" className="fill-none stroke-[2.5] stroke-current">
    <path d="M4 20h16" />
    <path d="M6 16l6-6 3 3 6-6" />
  </g>,
];

function formatAmount(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`.replace(".0M", "M");
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}k`;
  return `$${n.toLocaleString("en-US")}`;
}

function MilestoneIcon({ index, className }: { index: number; className?: string }) {
  const child = ICONS[index % ICONS.length];
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="0"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden
    >
      {child}
    </svg>
  );
}

type FundraisingPathProps = {
  milestones: readonly FundraisingMilestone[];
  /** Shown in the header; optional. */
  title?: string;
  className?: string;
};

/**
 * Winding progress path (SVG) with optional milestone callouts. Responsive:
 * the SVG scales to the width of the container; height is controlled by
 * `aspectRatio` in Tailwind.
 */
export function FundraisingPath({
  milestones,
  title = "Campaign milestones",
  className = "",
}: FundraisingPathProps) {
  const vb = `0 0 ${PATH_VIEWBOX.width} ${PATH_VIEWBOX.height}`;

  return (
    <div
      className={`w-full max-w-6xl mx-auto flex flex-col gap-4 md:gap-6 ${className}`}
    >
      {title ? (
        <h2 className="text-center font-label text-2xl font-semibold tracking-tight text-slate-800 md:text-3xl">
          {title}
        </h2>
      ) : null}

      <div
        className="relative w-full overflow-visible rounded-2xl border border-slate-200/80 bg-gradient-to-b from-amber-50/90 via-white to-sky-50/80 px-2 py-4 shadow-sm sm:px-4 md:px-6 md:py-8"
        style={{ aspectRatio: `${PATH_VIEWBOX.width} / ${PATH_VIEWBOX.height}` }}
      >
        <svg
          viewBox={vb}
          className="h-full w-full"
          role="img"
          aria-label="Fundraising path with milestone markers"
          preserveAspectRatio="xMidYMid meet"
        >
          <title>{title}</title>
          <defs>
            <linearGradient id="fundraisingPathStroke" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.95" />
              <stop offset="45%" stopColor="#8b5cf6" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.95" />
            </linearGradient>
            <filter id="pathGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="markerShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="1" stdDeviation="1.2" floodOpacity="0.18" />
            </filter>
          </defs>

          {/* Wider track (background) */}
          <path
            d={FUNDRAISING_PATH_D}
            fill="none"
            stroke="#e0f2fe"
            strokeWidth="20"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="hidden sm:block"
            aria-hidden
          />

          <path
            d={FUNDRAISING_PATH_D}
            fill="none"
            stroke="url(#fundraisingPathStroke)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#pathGlow)"
          />

          {milestones.map((m, i) => {
            const { x, y } = m.position;
            return (
              <g
                key={`${m.label}-${i}`}
                transform={`translate(${x},${y})`}
                className="text-slate-800"
                filter="url(#markerShadow)"
              >
                <circle r="20" className="fill-white stroke-2 stroke-sky-500/60" />
                <foreignObject x="-64" y="-100" width="128" height="90" className="pointer-events-none">
                  <div className="flex flex-col items-center text-center">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-sky-500 text-white">
                      <MilestoneIcon index={i} className="h-4 w-4" />
                    </span>
                    <span className="mt-1.5 line-clamp-2 font-label text-xs font-bold leading-tight text-slate-800">
                      {m.label}
                    </span>
                    <span className="mt-0.5 font-mono text-[11px] font-semibold tabular-nums text-amber-700">
                      {formatAmount(m.amount)}
                    </span>
                  </div>
                </foreignObject>
                <foreignObject x="-100" y="30" width="200" height="80" className="pointer-events-none">
                  <p className="text-center font-label text-xs leading-snug text-slate-600 line-clamp-3">
                    {m.description}
                  </p>
                </foreignObject>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

export { PATH_VIEWBOX, FUNDRAISING_PATH_D };
