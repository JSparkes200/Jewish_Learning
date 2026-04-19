"use client";

/**
 * Course progress as an “open sefer” track: frosted glass folio with a center
 * binding, column rules, and wooden scroll rollers — reads like parchment
 * filling across the bet midrash shelf.
 */
export function YeshivaScrollProgressTrack({
  percent,
  sectionsDone,
  sectionsTotal,
}: {
  percent: number;
  sectionsDone: number;
  sectionsTotal: number;
}) {
  const p = Math.max(0, Math.min(100, Math.round(percent)));

  return (
    <div className="w-full space-y-2">
      <div className="flex items-baseline justify-between gap-2">
        <p className="font-label text-[8px] uppercase tracking-[0.22em] text-ink-muted">
          Along the shelf
        </p>
        <p className="font-hebrew text-[13px] leading-none text-ink/65" dir="rtl">
          מַסְלוּל הַקּוֹרְס
        </p>
      </div>

      <div
        role="progressbar"
        aria-valuenow={p}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Course sections ${sectionsDone} of ${sectionsTotal} complete, ${p} percent`}
      >
        <div className="flex items-stretch gap-0 sm:gap-0.5">
          <ScrollRoller align="left" />
          <div className="relative min-h-[3.25rem] flex-1 overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-b from-white/45 via-parchment-card/25 to-white/30 shadow-[inset_0_2px_14px_rgb(44_36_22_/_0.05)] backdrop-blur-xl">
            <div
              className="pointer-events-none absolute inset-y-2 left-1/2 z-20 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-ink/20 to-transparent"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-y-2 left-1/2 z-20 w-[3px] -translate-x-1/2 rounded-full bg-gradient-to-b from-ink/[0.08] via-ink/[0.14] to-ink/[0.08] shadow-[1px_0_0_rgb(255_255_255_/_0.4)]"
              aria-hidden
            />

            <div
              className="pointer-events-none absolute inset-0 opacity-[0.4]"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 11px,
                  rgb(44 36 22 / 0.055) 11px,
                  rgb(44 36 22 / 0.055) 12px
                )`,
              }}
              aria-hidden
            />

            <div
              className="absolute inset-y-0 left-0 overflow-hidden rounded-l-[0.85rem] sm:rounded-l-[0.95rem]"
              style={{ width: `${p}%` }}
            >
              <div
                className="absolute inset-0 opacity-[0.97]"
                style={{
                  backgroundImage: `linear-gradient(
                      108deg,
                      rgb(74 104 48 / 0.94) 0%,
                      rgb(93 125 63 / 0.9) 42%,
                      rgb(74 104 48 / 0.88) 100%
                    ),
                    repeating-linear-gradient(
                      90deg,
                      transparent,
                      transparent 10px,
                      rgb(255 255 255 / 0.11) 10px,
                      rgb(255 255 255 / 0.11) 11px
                    )`,
                }}
              />
              <div
                className="pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden"
                aria-hidden
              >
                <div className="absolute inset-y-0 w-[40%] -skew-x-12 motion-safe:animate-glass-shine bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              </div>
            </div>

            <div className="relative z-10 flex min-h-[3.25rem] items-center justify-between gap-3 px-3 py-2.5 sm:px-5">
              <div className="min-w-0">
                <p className="font-label text-[8px] uppercase tracking-[0.18em] text-ink/50">
                  Folios complete
                </p>
                <p className="mt-0.5 truncate text-sm font-semibold tabular-nums text-ink drop-shadow-[0_1px_0_rgb(255_255_255_/_0.35)]">
                  {sectionsDone}
                  <span className="text-xs font-normal text-ink-muted">
                    {" "}
                    / {sectionsTotal} sections
                  </span>
                </p>
              </div>
              <div className="shrink-0 rounded-xl border border-white/55 bg-white/35 px-2.5 py-1 shadow-sm backdrop-blur-md">
                <span className="text-base font-semibold tabular-nums text-ink sm:text-lg">
                  {p}%
                </span>
              </div>
            </div>
          </div>
          <ScrollRoller align="right" />
        </div>
      </div>
    </div>
  );
}

function ScrollRoller({ align }: { align: "left" | "right" }) {
  const shadow =
    align === "left"
      ? "2px 0 10px rgb(0 0 0 / 0.12), inset 0 1px 0 rgb(255 255 255 / 0.22)"
      : "-2px 0 10px rgb(0 0 0 / 0.12), inset 0 1px 0 rgb(255 255 255 / 0.22)";

  return (
    <div
      className="relative z-10 flex w-[0.65rem] shrink-0 flex-col justify-center sm:w-3"
      aria-hidden
    >
      <div
        className="h-[82%] min-h-[2.65rem] rounded-full ring-1 ring-white/40"
        style={{
          background:
            "linear-gradient(180deg, #7a5a32 0%, #4a341c 48%, #2a1d10 100%)",
          boxShadow: shadow,
        }}
      />
    </div>
  );
}
