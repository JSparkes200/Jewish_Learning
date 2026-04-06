"use client";

import React, {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/** Parchment-friendly vertical gradients behind cards (shared with Library + Reading). */
const CARD_BACKGROUNDS = [
  "linear-gradient(165deg, #4a6830 0%, #2d4018 55%, #1a280f 100%)",
  "linear-gradient(165deg, #c87020 0%, #8b3a1a 55%, #5c2810 100%)",
  "linear-gradient(165deg, #5d7d3f 0%, #4a6830 50%, #2d4018 100%)",
  "linear-gradient(165deg, #6a1828 0%, #4a1018 55%, #2a080c 100%)",
  "linear-gradient(165deg, #8b3a1a 0%, #6a1828 50%, #3d0e14 100%)",
] as const;

const SLOT = [-2, -1, 0, 1, 2] as const;

const DRAG_THRESHOLD_PX = 40;

export type CoverFlowItem = {
  key: string;
  label: string;
  desc: string;
  /** Small uppercase line above title */
  category: string;
  iconSrc?: string;
  emoji?: string;
  /** Amber dot when exercises or practice are still “new”. */
  badgeDot?: boolean;
  /** Muted card (e.g. gated journey step). Still opens details when centered. */
  locked?: boolean;
};

export function CoverFlowCarousel({
  items,
  eyebrow,
  title,
  description,
  onActivateCenter,
  centerActionLabel = "Open ↗",
  prevAriaLabel = "Previous",
  nextAriaLabel = "Next",
  /** `minimal` hides the text header and floats arrows on the carousel (Reading page). */
  variant = "full",
  /** Shown in the track when `items` is empty (carousel chrome stays visible). */
  emptySlot,
  /** Snap the carousel so this item key is centered (e.g. Jewish-text category strip). */
  focusItemKey,
}: {
  items: readonly CoverFlowItem[];
  eyebrow?: string;
  title?: string;
  description?: ReactNode;
  /** Fires when the user activates the centered card (tap / enter). */
  onActivateCenter: (centerIndex: number) => void;
  centerActionLabel?: string;
  prevAriaLabel?: string;
  nextAriaLabel?: string;
  variant?: "full" | "minimal";
  emptySlot?: ReactNode;
  focusItemKey?: string | null;
}) {
  const [center, setCenter] = useState(0);
  const n = items.length;
  const dragStartX = useRef(0);
  const dragActive = useRef(false);

  useEffect(() => {
    if (n === 0) return;
    if (center >= n) setCenter(n - 1);
  }, [n, center]);

  useEffect(() => {
    if (n === 0 || !focusItemKey?.trim()) return;
    const idx = items.findIndex((it) => it.key === focusItemKey);
    if (idx >= 0) setCenter(idx);
  }, [focusItemKey, items, n]);

  const go = useCallback(
    (dir: -1 | 1) => {
      if (n === 0) return;
      setCenter((c) => (c + dir + n) % n);
    },
    [n],
  );

  const activateCenter = useCallback(() => {
    if (n === 0) return;
    onActivateCenter(center);
  }, [center, n, onActivateCenter]);

  const cards = useMemo(() => {
    if (n === 0) return [];
    return SLOT.map((d) => {
      const idx = (center + d + n) % n;
      const item = items[idx]!;
      return { d, idx, item };
    });
  }, [center, items, n]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragActive.current = true;
    dragStartX.current = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const endDrag = useCallback(
    (clientX: number) => {
      if (!dragActive.current) return;
      dragActive.current = false;
      const dx = clientX - dragStartX.current;
      if (Math.abs(dx) < DRAG_THRESHOLD_PX) return;
      if (dx > 0) go(-1);
      else go(1);
    },
    [go],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      endDrag(e.clientX);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        /* released */
      }
    },
    [endDrag],
  );

  const onPointerCancel = useCallback(() => {
    dragActive.current = false;
  }, []);

  const isMinimal = variant === "minimal";
  const isEmpty = n === 0;

  return (
    <div
      className={`surface-elevated overflow-hidden ${isMinimal ? "p-3 sm:p-4" : "p-4 sm:p-6"}`}
    >
      {!isMinimal ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {eyebrow ? (
              <p className="font-label text-[10px] uppercase tracking-[0.2em] text-sage">
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <h2 className="mt-1 text-lg font-medium text-ink">{title}</h2>
            ) : null}
            {description ? (
              <div className="mt-1 max-w-xl text-xs text-ink-muted">{description}</div>
            ) : null}
          </div>
          <div className="flex gap-2 self-end sm:self-start">
            <button
              type="button"
              disabled={isEmpty}
              onClick={() => go(-1)}
              className="btn-elevated-secondary min-w-[3rem] py-2 disabled:pointer-events-none disabled:opacity-40"
              aria-label={prevAriaLabel}
            >
              ←
            </button>
            <button
              type="button"
              disabled={isEmpty}
              onClick={() => go(1)}
              className="btn-elevated-secondary min-w-[3rem] py-2 disabled:pointer-events-none disabled:opacity-40"
              aria-label={nextAriaLabel}
            >
              →
            </button>
          </div>
        </div>
      ) : null}

      <div className="relative">
        {isMinimal ? (
          <>
            <button
              type="button"
              disabled={isEmpty}
              onClick={() => go(-1)}
              className="btn-elevated-secondary absolute left-0 top-1/2 z-20 min-w-[2.75rem] -translate-y-1/2 py-2 disabled:pointer-events-none disabled:opacity-40 sm:left-1"
              aria-label={prevAriaLabel}
            >
              ←
            </button>
            <button
              type="button"
              disabled={isEmpty}
              onClick={() => go(1)}
              className="btn-elevated-secondary absolute right-0 top-1/2 z-20 min-w-[2.75rem] -translate-y-1/2 py-2 disabled:pointer-events-none disabled:opacity-40 sm:right-1"
              aria-label={nextAriaLabel}
            >
              →
            </button>
          </>
        ) : null}

        <div
          className={`relative mx-auto flex h-[min(58vw,380px)] max-w-full touch-pan-y items-center justify-center overflow-visible sm:h-[400px] ${
            isEmpty
              ? "cursor-default"
              : "cursor-grab active:cursor-grabbing"
          } ${
            isMinimal
              ? "mt-1 px-2 sm:px-12"
              : "mt-10 px-10 sm:px-16"
          }`}
        style={{ perspective: 1100 }}
        onPointerDown={(e) => {
          if (isEmpty) return;
          if ((e.target as HTMLElement).closest("[data-carousel-card]")) return;
          onPointerDown(e);
        }}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
          role="presentation"
        >
          <div
            className="relative h-[240px] w-[min(78vw,200px)] sm:h-[280px] sm:w-[220px]"
            style={{ transformStyle: "preserve-3d" }}
          >
          {isEmpty ? (
            <div
              className="absolute left-1/2 top-1/2 flex h-full w-full max-w-[220px] -translate-x-1/2 -translate-y-1/2 flex-col justify-center"
              role="status"
              aria-live="polite"
            >
              <div className="flex min-h-[220px] flex-col justify-center rounded-2xl border-2 border-dashed border-ink/18 bg-gradient-to-b from-parchment-deep/50 to-parchment-deep/25 p-4 text-center shadow-inner sm:min-h-[260px]">
                {emptySlot ?? (
                  <p className="text-sm text-ink-muted">Nothing to show yet.</p>
                )}
              </div>
            </div>
          ) : null}
          {!isEmpty
            ? cards.map(({ d, idx, item }) => {
            const abs = Math.abs(d);
            const tx = d * 118;
            const tz = -abs * 52;
            const ry = -d * 24;
            const sc = 1 - abs * 0.085;
            const opacity = abs > 2 ? 0 : 1 - abs * 0.14;
            const gated = item.locked === true;
            return (
              <button
                key={`${item.key}-${idx}`}
                type="button"
                data-carousel-card
                onClick={() => {
                  if (d === 0) activateCenter();
                  else setCenter(idx);
                }}
                className="absolute left-1/2 top-1/2 flex h-full w-full flex-col overflow-visible rounded-2xl border border-white/25 p-4 pb-3 text-left shadow-elevated-lg outline-none transition-[transform,opacity] duration-300 ease-out ring-sage/40 focus-visible:ring-2"
                style={{
                  transform: `translate(-50%, -50%) translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) scale(${sc})`,
                  zIndex: 20 - abs,
                  opacity,
                  background: CARD_BACKGROUNDS[idx % CARD_BACKGROUNDS.length],
                  pointerEvents: opacity < 0.05 ? "none" : "auto",
                }}
              >
                {/* Badge sits inside the card (not on the page background); ink on parchment so letters aren’t washed out */}
                <span
                  className={`pointer-events-none absolute left-1/2 top-[26%] z-20 w-[4.75rem] -translate-x-1/2 -translate-y-1/2 ${
                    d === 0 ? "scale-100" : "scale-[0.92]"
                  } transition-transform`}
                  aria-hidden
                >
                  {item.badgeDot ? (
                    <span
                      className="absolute -right-0.5 -top-0.5 z-20 h-2.5 w-2.5 rounded-full bg-amber shadow-sm ring-2 ring-parchment-card"
                      title="Exercises or practice not finished yet"
                    />
                  ) : null}
                  {item.iconSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element -- static SVGs from /public
                    <img
                      src={item.iconSrc}
                      alt=""
                      width={76}
                      height={76}
                      className="h-16 w-16 rounded-2xl border-2 border-ink/20 bg-parchment-card object-contain p-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.35)]"
                    />
                  ) : (
                    <span className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-ink/22 bg-parchment-card font-hebrew text-[2rem] font-semibold leading-none text-ink shadow-[0_4px_16px_rgba(0,0,0,0.35)]">
                      {item.emoji ?? "📖"}
                    </span>
                  )}
                </span>
                <div
                  className={`mt-auto flex min-h-0 flex-col text-left text-white transition-[filter] ${
                    gated ? "brightness-[0.78] saturate-[0.7]" : ""
                  }`}
                >
                  <span className="font-label text-[10px] uppercase tracking-[0.15em] text-white/80">
                    {item.category}
                  </span>
                  <span className="mt-1 font-label text-base font-semibold leading-tight tracking-wide">
                    {item.label}
                  </span>
                  <span className="mt-2 line-clamp-3 text-[11px] leading-snug text-white/85">
                    {item.desc}
                  </span>
                  {d === 0 ? (
                    <span className="mt-3 inline-flex items-center gap-1 font-label text-[9px] uppercase tracking-wide text-white/90">
                      {gated ? "Details →" : centerActionLabel}
                    </span>
                  ) : (
                    <span className="mt-3 font-label text-[9px] uppercase tracking-wide text-white/70">
                      Tap to focus
                    </span>
                  )}
                </div>
              </button>
            );
          })
            : null}
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-[11px] text-ink-faint" aria-live="polite">
        {isEmpty ? (
          <span className="text-ink-muted">No items · empty shelf</span>
        ) : (
          <>
            <span className="font-medium text-ink-muted">
              {items[center]?.label}
            </span>
            {" · "}
            {center + 1} / {n}
          </>
        )}
      </p>
    </div>
  );
}
