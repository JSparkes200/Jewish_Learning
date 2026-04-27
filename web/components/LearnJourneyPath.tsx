"use client";

import { animate, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { LetterCard } from "@/components/LetterCard";
import { COURSE_LEVELS } from "@/data/course";
import {
  getJourneyPathState,
  type LearnJourneyRow,
} from "@/lib/learn-journey-hub";
import type { LearnProgressState } from "@/lib/learn-progress";

const TAU = Math.PI * 2;
/** Overall carousel + card size multiplier vs original design. */
const LAYOUT_SCALE = 1.2;
/** Tall narrow “case” cards (mezuza / plaque proportion). */
const CARD_WIDTH_PX = 140;
const CARD_HEIGHT_PX = 260;
const CARD_W = `min(${CARD_WIDTH_PX}px, calc(100vw - 2.5rem))`;
const MIRROR_X = -1;
const RING_R = Math.round(240 * LAYOUT_SCALE);
const RING_B = Math.round(110 * LAYOUT_SCALE);
const PERSPECTIVE_PX = Math.round(1500 * LAYOUT_SCALE);
/** Capped so faces never twist away from the viewer; keeps type readable. */
const YAW_CAP_DEG = 28;
const YAW_FOLLOW = 0.38;
const TILT_X_CAP_DEG = 3.5;
const SCALE_MAX = 0.9;
const SCALE_MIN = 0.4;
const CENTER_STEEP = 1.75;
/** Narrow band just *outside* the center card; strength 0..1. (+20% when `LAYOUT_SCALE` is 1.2) */
const CENTER_EDGE_BAND = Math.round(32 * LAYOUT_SCALE);
const EDGE_MAX_STEP = 0.032;
const FRONT_COS = 0.1;
const WHEEL_X = 0.0044;
const WHEEL_Y = 0.0032;
const DRAG_SX = 0.016;
const DRAG_SY = 0.009;
/** Front-of-ring (depth) for focus styling on the `li`. */
const FRONT_SPOT_U = 0.93;
const FRONT_SPOT_SCALE = 1.04;
/**
 * Extra `translateZ` (px) toward the viewer, scaled by `dFront` (0..1), so `translateZ` gaps
 * match perceived depth. Paint order of `li` children is sorted by `u` (see `depthOrder`) so
 * DOM order matches 3D without relying on 2D `z-index` (which can fight `preserve-3d`).
 */
const DEPTH_Z_PULL_PX = 260;
/** Near-integer window for the front card “in slot” (Sifria / library hero). */
const AT_SWAY_SLOT_EPS = 0.5;

const SIGN_GLOSS =
  "cursor-pointer select-none " +
  "active:scale-[0.99] " +
  "before:pointer-events-none before:absolute before:inset-0 before:content-[''] before:rounded-2xl " +
  "before:bg-gradient-to-br before:from-white/25 before:via-white/0 before:to-transparent " +
  "after:pointer-events-none after:absolute after:inset-[1px] after:content-[''] after:rounded-[0.9rem] " +
  "transition-transform duration-200";

type Props = {
  rows: readonly LearnJourneyRow[];
  progress: LearnProgressState;
  developerMode: boolean;
  onSelectSign: (index: number) => void;
  centerActionLabel?: string;
};

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

function clampNum(x: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, x));
}

/** Nearest `float` that brings card *i* to the front, minimal spin from *current*. */
function nearestFloatToCard(
  i: number,
  current: number,
  n: number,
): number {
  if (n <= 0) return 0;
  return i + n * Math.round((current - i) / n);
}

/**
 * `u` in [0,1] — screen-space “closeness” (1 = at front, 0 = back). Same as 0.5(1 + cos(ang)).
 */
function ringU(i: number, floatIndex: number, n: number): number {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  const ang = (TAU * (i - floatIndex)) / n;
  return 0.5 * (1 + Math.cos(ang));
}

/**
 * Shortest wrapped distance in index units on the ring: how far stop `i` is from
 * the continuous float position (for tie breaks when `u` is equal or nearly so).
 */
function circMinIndexDist(i: number, f: number, n: number): number {
  if (n <= 0) return 0;
  let d = f - i;
  d = d - n * Math.round(d / n);
  return Math.abs(d);
}

/**
 * Full-ring carousel: n cards on a closed circle. `floatIndex` is unbounded; angle for
 * card *i* is TAU * (i − float) / n (loops, last meets first behind the front).
 */
export function LearnJourneyPath({
  rows,
  progress,
  developerMode,
  onSelectSign,
  centerActionLabel = "Open →",
}: Props) {
  const id = useId();
  const reduceMotion = useReducedMotion() ?? false;
  const { currentStopIndex } = getJourneyPathState(
    [...rows],
    progress,
    developerMode,
  );

  const n = rows.length;

  const [floatIndex, setFloatIndex] = useState(
    currentStopIndex,
  );
  const floatRef = useRef(floatIndex);
  const snapControlRef = useRef<ReturnType<typeof animate> | null>(null);
  const snapTRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const edgeRafRef = useRef<number | null>(null);
  const edgeRef = useRef({ l: 0, r: 0 });

  useEffect(() => {
    floatRef.current = floatIndex;
  }, [floatIndex]);

  const runSnap = useCallback(
    (to?: number) => {
      if (n <= 0) return;
      if (n === 1) {
        const z = 0;
        floatRef.current = z;
        setFloatIndex(z);
        return;
      }
      if (reduceMotion) {
        const t = to ?? Math.round(floatRef.current);
        floatRef.current = t;
        setFloatIndex(t);
        return;
      }
      snapControlRef.current?.stop();
      const target = to ?? Math.round(floatRef.current);
      snapControlRef.current = animate(floatRef.current, target, {
        type: "spring",
        stiffness: 360,
        damping: 32,
        mass: 0.65,
        onUpdate: (v) => {
          floatRef.current = v;
          setFloatIndex(v);
        },
        onComplete: () => {
          const r = Math.round(floatRef.current);
          floatRef.current = r;
          setFloatIndex(r);
        },
      });
    },
    [n, reduceMotion],
  );

  const scheduleSnap = useCallback(() => {
    if (snapTRef.current) clearTimeout(snapTRef.current);
    snapTRef.current = setTimeout(() => {
      runSnap();
    }, reduceMotion ? 0 : 140);
  }, [reduceMotion, runSnap]);

  useEffect(
    () => () => {
      if (snapTRef.current) clearTimeout(snapTRef.current);
      snapControlRef.current?.stop();
    },
    [],
  );

  useEffect(() => {
    if (n === 0) return;
    if (currentStopIndex < 0 || currentStopIndex > n - 1) return;
    const t = nearestFloatToCard(
      currentStopIndex,
      floatRef.current,
      n,
    );
    runSnap(t);
  }, [currentStopIndex, n, runSnap]);

  // Wheel: loop without clamp; period n
  useEffect(() => {
    if (n <= 1) return;
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return;
      e.preventDefault();
      snapControlRef.current?.stop();
      // Scroll left (negative deltaX) → same as left edge: negative d; scroll right = positive d
      const d =
        e.deltaX * WHEEL_X + e.deltaY * WHEEL_Y + e.deltaZ * 0.0014;
      const next = floatRef.current + d;
      floatRef.current = next;
      setFloatIndex(next);
      scheduleSnap();
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [n, scheduleSnap]);

  // Drag
  useEffect(() => {
    if (n <= 1) return;
    const el = stageRef.current;
    if (!el) return;

    let active: number | null = null;
    let lastX = 0;
    let lastY = 0;

    const onMove = (e: PointerEvent) => {
      if (active == null || e.pointerId !== active) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      // Drag right / left → same as horizontal scroll (no mirror flip on X)
      const d = DRAG_SX * dx - DRAG_SY * dy;
      const next = floatRef.current + d;
      floatRef.current = next;
      setFloatIndex(next);
      scheduleSnap();
    };

    const end = (e: PointerEvent) => {
      if (active == null || e.pointerId !== active) return;
      active = null;
      window.removeEventListener("pointermove", onMove, true);
      window.removeEventListener("pointerup", end, true);
      window.removeEventListener("pointercancel", end, true);
      try {
        if (el.hasPointerCapture(e.pointerId)) {
          el.releasePointerCapture(e.pointerId);
        }
      } catch {
        /* */
      }
      scheduleSnap();
    };

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      // Let clicks on a card complete on the same target; capture would retarget
      // pointerup to the stage and suppress the card's onClick.
      const raw = e.target;
      const from =
        raw instanceof Element
          ? raw
          : raw instanceof Node
            ? (raw.parentElement ?? null)
            : null;
      if (from?.closest?.("[data-journey-card]")) return;

      snapControlRef.current?.stop();
      active = e.pointerId;
      lastX = e.clientX;
      lastY = e.clientY;
      el.setPointerCapture(e.pointerId);
      window.addEventListener("pointermove", onMove, { passive: true, capture: true });
      window.addEventListener("pointerup", end, { capture: true });
      window.addEventListener("pointercancel", end, { capture: true });
    };

    el.addEventListener("pointerdown", onDown, { capture: true });
    return () => {
      el.removeEventListener("pointerdown", onDown, { capture: true });
      window.removeEventListener("pointermove", onMove, true);
      window.removeEventListener("pointerup", end, true);
      window.removeEventListener("pointercancel", end, true);
    };
  }, [n, scheduleSnap]);

  // Edge hover: auto-rotate in narrow bands just *outside* the center card
  useEffect(() => {
    if (n <= 1) return;
    const el = stageRef.current;
    if (!el) return;

    const step = () => {
      const t = edgeRef.current.r - edgeRef.current.l;
      if (Math.abs(t) < 0.01) {
        edgeRafRef.current = null;
        scheduleSnap();
        return;
      }
      const d = t * EDGE_MAX_STEP;
      const next = floatRef.current + d;
      floatRef.current = next;
      setFloatIndex(next);
      edgeRafRef.current = requestAnimationFrame(step);
    };

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const w = r.width;
      if (w <= 0) return;
      const x = e.clientX - r.left;
      const vw = typeof window !== "undefined" ? window.innerWidth : w;
      // Mirrors CARD_W
      const cardW = Math.min(CARD_WIDTH_PX, Math.max(0, vw - 40));
      const cx = w / 2;
      const half = cardW / 2;
      const b = CENTER_EDGE_BAND;
      const leftStart = cx - half - b;
      const leftCard = cx - half;
      const rightCard = cx + half;
      const rightEnd = cx + half + b;
      let l = 0;
      let rgt = 0;
      if (x >= leftStart && x <= leftCard) {
        l = 1 - (x - leftStart) / b;
      }
      if (x >= rightCard && x <= rightEnd) {
        rgt = (x - rightCard) / b;
      }
      l = clampNum(l, 0, 1);
      rgt = clampNum(rgt, 0, 1);
      edgeRef.current = { l, r: rgt };
      if (l > 0.02 || rgt > 0.02) {
        snapControlRef.current?.stop();
      }
      if (edgeRafRef.current == null && (l > 0.02 || rgt > 0.02)) {
        edgeRafRef.current = requestAnimationFrame(step);
      }
    };

    const onLeave = () => {
      edgeRef.current = { l: 0, r: 0 };
      if (edgeRafRef.current != null) {
        cancelAnimationFrame(edgeRafRef.current);
        edgeRafRef.current = null;
      }
      scheduleSnap();
    };

    el.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      if (edgeRafRef.current != null) {
        cancelAnimationFrame(edgeRafRef.current);
      }
    };
  }, [n, scheduleSnap]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (n <= 0) return;
      let dir = 0;
      if (e.key === "ArrowDown" || e.key === "PageDown") dir = 1;
      if (e.key === "ArrowUp" || e.key === "PageUp") dir = -1;
      if (dir === 0) return;
      e.preventDefault();
      if (n === 1) return;
      const t = Math.round(floatRef.current) + dir;
      runSnap(t);
    },
    [n, runSnap],
  );

  if (n === 0) {
    return (
      <div className="surface-elevated overflow-hidden p-4 sm:p-6">
        <p className="text-sm text-ink-muted" role="status">
          No journey steps yet.
        </p>
      </div>
    );
  }

  const frontIdx = n === 0 ? 0 : mod(Math.round(floatIndex), n);

  /**
   * Paint order: DOM order = back → front. Without this, 2D `z-index` (and 5000 “hero”
   * boosts) often overrides true `translateZ` under `preserve-3d`, so a thin side card
   * can cover a nearer one. Sorting by `u` and tie-breaking by ring distance to `floatIndex`
   * keeps stacking consistent with 3D depth.
   */
  const depthOrder = useMemo(() => {
    if (n <= 0) return [] as number[];
    const items = Array.from({ length: n }, (_, i) => {
      const u = ringU(i, floatIndex, n);
      const circ = circMinIndexDist(i, floatIndex, n);
      return { i, u, circ };
    });
    items.sort((a, b) => a.u - b.u || b.circ - a.circ);
    return items.map((x) => x.i);
  }, [n, floatIndex]);

  return (
    <div
      className="overflow-x-visible overflow-y-visible bg-transparent px-0 py-1 sm:py-2"
      aria-labelledby={id + "-l"}
    >
      <p className="sr-only" id={id + "-l"}>
        A circular path of steps. Move the pointer just outside the left or right edge of
        the front card, scroll, or drag to rotate; arrow keys to step. The front card is in
        focus.
      </p>

      <div className="relative z-0 mx-auto w-full max-w-full overflow-x-visible overflow-y-visible bg-transparent">
        <div
          ref={stageRef}
          data-journey-wheel
          role="listbox"
          tabIndex={0}
          className="relative z-0 mx-auto h-[min(42vh,372px)] w-full max-w-full cursor-grab select-none touch-none overscroll-y-contain rounded-2xl border border-ink/12 bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-sage/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent active:cursor-grabbing sm:h-[min(44vh,392px)]"
          aria-label="Journey path wheel"
          aria-activedescendant={id + "-opt-" + frontIdx}
          onKeyDown={onKeyDown}
          style={{
            perspective: PERSPECTIVE_PX,
            perspectiveOrigin: "50% 50%",
          }}
        >
          <ul
            className="absolute inset-0 m-0 list-none bg-transparent p-0 [transform-style:preserve-3d] overflow-visible"
            style={{ transformStyle: "preserve-3d" }}
          >
            {depthOrder.map((i) => {
              const row = rows[i];
              const isCurrent = i === currentStopIndex;
              const showCenterSway =
                i === frontIdx &&
                Math.abs(floatIndex - Math.round(floatIndex)) <
                  AT_SWAY_SLOT_EPS;
              const ang =
                n > 1 ? (TAU * (i - floatIndex)) / n : 0;
              const x = n > 1 ? MIRROR_X * RING_R * Math.sin(ang) : 0;
              const ringZ = n > 1 ? RING_B * (Math.cos(ang) - 1) : 0;
              const u = ringU(i, floatIndex, n);
              const centerness = Math.pow(
                Math.max(0, Math.min(1, u)),
                CENTER_STEEP,
              );
              const isFrontSpot = u >= FRONT_SPOT_U;
              const baseScale =
                SCALE_MIN +
                (SCALE_MAX - SCALE_MIN) * (0.2 + 0.8 * centerness);
              const scale = clampNum(
                baseScale * (isFrontSpot ? FRONT_SPOT_SCALE : 1),
                0.36,
                1.08,
              );
              const angDeg = (ang * 180) / Math.PI;
              const rotateYdeg = clampNum(
                angDeg * YAW_FOLLOW,
                -YAW_CAP_DEG,
                YAW_CAP_DEG,
              );
              const rotateXdeg = clampNum(
                -Math.sin(ang) * TILT_X_CAP_DEG * 1.2,
                -TILT_X_CAP_DEG,
                TILT_X_CAP_DEG,
              );
              const dFront = u;
              /** Ring depth + monotonic Z pull: separates layers in 3D so overlapping regions don’t z-fight. */
              const zScene = ringZ + DEPTH_Z_PULL_PX * dFront;
              const backFace = dFront < FRONT_COS;
              /** Opaque faces + no frosted blur (see LetterCard classes) — avoids “glass” bleed between overlapping cards. */
              const liOpacity = backFace ? 0.1 : 1;
              const levelN = row.slot.kind === "level" ? row.slot.n : null;
              const levelMeta =
                levelN == null
                  ? undefined
                  : COURSE_LEVELS.find((L) => L.n === levelN);
              const { cover } = row;
              /** Near center slot: zero ring pitch/yaw so only the outer `motion` sway adds yaw. */
              const settleInFront = showCenterSway;
              const yawOnRing =
                n > 1 && settleInFront ? 0 : rotateYdeg;
              const pitchOnRing =
                n > 1 && settleInFront ? 0 : rotateXdeg;
              return (
                <li
                  key={cover.key}
                  id={id + "-opt-" + i}
                  data-journey-idx={i}
                  role="option"
                  aria-selected={i === frontIdx}
                  className="absolute left-1/2 top-1/2 m-0 p-0 [transform-style:preserve-3d]"
                  style={{
                    width: CARD_W,
                    minHeight: CARD_HEIGHT_PX,
                    transform: [
                      "translate3d(-50%, -50%, 0)",
                      `translate3d(${x.toFixed(2)}px, 0, ${zScene.toFixed(2)}px)`,
                      `rotateY(${yawOnRing.toFixed(2)}deg)`,
                      `rotateX(${pitchOnRing.toFixed(2)}deg)`,
                      `scale(${scale.toFixed(3)})`,
                    ].join(" "),
                    transformOrigin: "50% 60%",
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    pointerEvents: backFace || liOpacity < 0.12 ? "none" : "auto",
                    opacity: backFace ? 0.1 : liOpacity,
                    visibility: backFace ? "hidden" : "visible",
                    transition: reduceMotion
                      ? "opacity 0.2s ease"
                      : "transform 0.38s cubic-bezier(0.22, 0.8, 0.28, 1), opacity 0.3s ease",
                  }}
                >
                  <motion.div
                    className="w-full rounded-2xl [transform-style:preserve-3d]"
                    style={{
                      transformStyle: "preserve-3d",
                      transformPerspective: 1200,
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                    }}
                    initial={{ rotateY: 0 }}
                    animate={
                      reduceMotion
                        ? {
                            y: 0,
                            z: 0,
                            rotateX: 0,
                            scale: 1,
                            rotateY: 0,
                            rotateZ: 0,
                          }
                        : showCenterSway
                          ? {
                              rotateX: [-3, 3],
                              rotateY: [-5, 5],
                              y: 0,
                              z: 40,
                              rotateZ: 0,
                              scale: 1,
                            }
                          : i === frontIdx
                            ? {
                                y: 0,
                                z: 0,
                                rotateX: 0,
                                scale: 1,
                                rotateY: 0,
                                rotateZ: 0,
                              }
                            : {
                                y: 0,
                                z: 0,
                                rotateX: 0,
                                scale: 1,
                                rotateY: 0,
                                rotateZ: [0, 0.18, 0, -0.14, 0],
                              }
                    }
                    transition={
                      reduceMotion
                        ? { duration: 0.2 }
                        : showCenterSway
                          ? {
                              duration: 3,
                              repeat: Infinity,
                              repeatType: "reverse",
                              ease: "easeInOut",
                            }
                          : i === frontIdx
                            ? {
                                duration: 0.32,
                                ease: "easeOut",
                              }
                            : {
                                duration: 4.8 + (i % 4) * 0.4,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: (i * 0.11) % 1.2,
                              }
                    }
                  >
                    <motion.div
                      className={[
                        "w-full overflow-hidden rounded-2xl [transform-style:preserve-3d]",
                        isFrontSpot ? "bg-parchment-card" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      style={{
                        transformOrigin: "50% 60%",
                        transformStyle: "preserve-3d",
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        boxShadow: showCenterSway
                          ? "14px 18px 0 rgba(20,12,6,0.26), 6px 8px 0 rgba(20,12,6,0.14)"
                          : "none",
                      }}
                      whileHover={
                        showCenterSway
                          ? undefined
                          : reduceMotion
                            ? undefined
                            : { scale: 1.02 }
                      }
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                    <div
                      className="w-full [transform-style:preserve-3d]"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                    <LetterCard
                      data-journey-card=""
                      letter={levelMeta}
                      disableParallax
                      inert={backFace}
                      onClick={() => {
                        const t = nearestFloatToCard(
                          i,
                          floatRef.current,
                          n,
                        );
                        runSnap(t);
                        onSelectSign(i);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          const t = nearestFloatToCard(
                            i,
                            floatRef.current,
                            n,
                          );
                          runSnap(t);
                          onSelectSign(i);
                        }
                      }}
                      role="button"
                      tabIndex={backFace || liOpacity < 0.12 ? -1 : 0}
                      className={[
                        "relative w-full min-w-0 p-3 text-left sm:p-3.5 subpixel-antialiased [text-rendering:optimizeLegibility] ![will-change:auto]",
                        SIGN_GLOSS,
                        isFrontSpot
                          ? "!bg-parchment-card !backdrop-blur-none before:hidden after:shadow-[inset_0_0_0_1px_rgba(44,36,22,0.05)] ring-1 ring-inset ring-white/55"
                          : "!bg-parchment-card !backdrop-blur-none ring-1 ring-inset ring-white/40",
                        isCurrent
                          ? "ring-2 ring-sage/55 ring-offset-2 ring-offset-parchment-card/80"
                          : "outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 focus-visible:ring-offset-parchment-card/60",
                        cover.locked ? "opacity-60" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      aria-label={
                        !levelMeta
                          ? `${cover.label}. ${cover.desc}`
                          : undefined
                      }
                    >
                      <div className="relative z-[1] flex gap-2 pt-5 sm:gap-2.5 sm:pt-6">
                        <span
                          className="shrink-0 font-hebrew text-2xl leading-none sm:text-3xl"
                          aria-hidden
                        >
                          {cover.emoji}
                        </span>
                        <div className="min-w-0 flex-1 text-left">
                          <p className="font-label text-[8.5px] uppercase leading-tight tracking-[0.12em] text-ink-muted sm:text-[10px] sm:tracking-[0.15em]">
                            {cover.category}
                          </p>
                          <p className="mt-0.5 line-clamp-2 text-xs font-semibold text-ink sm:text-sm">
                            {cover.label}
                          </p>
                          <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-ink-muted sm:line-clamp-3 sm:text-xs">
                            {cover.desc}
                          </p>
                          {isCurrent ? (
                            <p className="mt-1.5 font-label text-[8.5px] uppercase leading-tight tracking-wide text-sage sm:mt-2 sm:text-[10px]">
                              {centerActionLabel} current focus
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </LetterCard>
                    </div>
                    </motion.div>
                  </motion.div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
