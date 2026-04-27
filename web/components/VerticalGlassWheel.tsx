"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
} from "framer-motion";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const MEZUZAH_TEXTURE = "/mezuzah-parchment-texture.jpg";

const CARD_BACKGROUNDS = [
  "linear-gradient(165deg, #4a6830 0%, #2d4018 55%, #1a280f 100%)",
  "linear-gradient(165deg, #c87020 0%, #8b3a1a 55%, #5c2810 100%)",
  "linear-gradient(165deg, #5d7d3f 0%, #4a6830 50%, #2d4018 100%)",
  "linear-gradient(165deg, #6a1828 0%, #4a1018 55%, #2a080c 100%)",
  "linear-gradient(165deg, #8b3a1a 0%, #6a1828 50%, #3d0e14 100%)",
] as const;

const CYLINDER_RADIUS_PX = 104;
const DIAL_PERSPECTIVE = 1000;
const WHEEL_SENSITIVITY = 0.055;
/** Touch drag in px → same angle units as wheel delta (iOS has no `wheel` on finger drag). */
const TOUCH_PAN_SENSITIVITY = 0.35;
const SNAP_IDLE_MS = 130;
const WHEEL_ACTIVE_EDGE_FRACTION = 0.16;
const SPRING = { stiffness: 320, damping: 32, mass: 0.75 };

const TRENCH_H = "min(40vh,216px)";

const mod = (a: number, b: number) => ((a % b) + b) % b;

export type WheelItem = {
  key: string;
  label: string;
  desc: string;
  category: string;
  iconSrc?: string;
  emoji?: string;
  locked?: boolean;
};

export type VerticalGlassWheelVariant = "column" | "header";

const DEFAULT_RAIL_CLASS =
  "relative flex w-[4.5rem] shrink-0 flex-col justify-start sm:w-20";

export function VerticalGlassWheel({
  items,
  onActivate,
  actionLabel = "Open →",
  variant = "column",
  defaultBodyOpen,
  hideCap = false,
  /** Overrides default narrow mezuzah rail width (use `w-full` inside a fixed-width parent). */
  railClassName,
}: {
  items: readonly WheelItem[];
  onActivate: (index: number) => void;
  actionLabel?: string;
  variant?: VerticalGlassWheelVariant;
  /** `column`: default open (home). `header`: default closed (floating hub). */
  defaultBodyOpen?: boolean;
  /** If true, the top cap (with the Shin) is not rendered, and the wheel cannot be toggled. */
  hideCap?: boolean;
  railClassName?: string;
}) {
  const pathname = usePathname();
  const resolvedDefaultOpen =
    defaultBodyOpen ?? (variant === "column");

  const n = items.length;
  const stepDeg = n <= 1 ? 0 : 360 / n;
  const initialIdx = 0;
  const initialAngle = 0;

  const [activeIndex, setActiveIndex] = useState(initialIdx);
  const [bodyOpen, setBodyOpen] = useState(resolvedDefaultOpen);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoverPreviewIndex, setHoverPreviewIndex] = useState<number | null>(
    null,
  );
  const hoverClearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const trenchRef = useRef<HTMLDivElement>(null);
  const touchLastY = useRef<number | null>(null);
  const touchMagnitude = useRef(0);
  const touchSuppressClick = useRef(false);
  const snapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [layoutDesktop, setLayoutDesktop] = useState(true);
  useLayoutEffect(() => {
    setLayoutDesktop(window.matchMedia("(min-width: 640px)").matches);
  }, []);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const sync = () => setLayoutDesktop(mq.matches);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const angleTarget = useMotionValue(initialAngle);
  const smoothAngle = useSpring(angleTarget, SPRING);
  const groupRotateX = useTransform(smoothAngle, (v) => -v);

  const snapToNearest = useCallback(() => {
    if (n <= 1 || stepDeg === 0) return;
    const v = angleTarget.get();
    const snapped = Math.round(v / stepDeg) * stepDeg;
    angleTarget.set(snapped);
  }, [angleTarget, n, stepDeg]);

  const scheduleSnap = useCallback(() => {
    if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
    snapTimerRef.current = setTimeout(() => {
      snapTimerRef.current = null;
      snapToNearest();
    }, SNAP_IDLE_MS);
  }, [snapToNearest]);

  useMotionValueEvent(smoothAngle, "change", (v) => {
    if (n <= 1 || stepDeg === 0) return;
    const idx = mod(Math.round(v / stepDeg), n);
    setActiveIndex(idx);
  });

  useEffect(() => {
    if (n === 0) return;
  }, [n, stepDeg, angleTarget]);

  useEffect(() => {
    return () => {
      if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
      if (hoverClearTimerRef.current) clearTimeout(hoverClearTimerRef.current);
    };
  }, []);

  /** Close floating hub when navigating. */
  useEffect(() => {
    if (variant === "header") {
      setBodyOpen(false);
      setIsExpanded(false);
    }
  }, [pathname, variant]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent | TouchEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsExpanded(false);
        if (variant === "header") setBodyOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [variant]);

  const applyWheelDelta = useCallback(
    (deltaY: number) => {
      if (n <= 1) return;
      const next = angleTarget.get() + deltaY * WHEEL_SENSITIVITY;
      angleTarget.set(next);
      scheduleSnap();
    },
    [angleTarget, n, scheduleSnap],
  );

  useEffect(() => {
    const el = trenchRef.current;
    if (!el || n <= 1) return;
    const onWheelNative = (e: WheelEvent) => {
      const rect = el.getBoundingClientRect();
      if (rect.height <= 1) return;
      const relY = (e.clientY - rect.top) / rect.height;
      const edge = WHEEL_ACTIVE_EDGE_FRACTION;
      const inEndZone = relY <= edge || relY >= 1 - edge;
      if (!inEndZone) return;

      e.preventDefault();
      applyWheelDelta(e.deltaY);
    };
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) {
        touchLastY.current = null;
        return;
      }
      touchLastY.current = e.touches[0]!.clientY;
      touchMagnitude.current = 0;
      touchSuppressClick.current = false;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (touchLastY.current == null || e.touches.length !== 1) return;
      const y = e.touches[0]!.clientY;
      const dy = y - touchLastY.current;
      touchLastY.current = y;
      touchMagnitude.current += Math.abs(dy);
      if (touchMagnitude.current > 10) {
        touchSuppressClick.current = true;
        e.preventDefault();
      }
      applyWheelDelta(dy * TOUCH_PAN_SENSITIVITY);
      scheduleSnap();
    };
    const onTouchEnd = () => {
      touchLastY.current = null;
      if (touchMagnitude.current <= 10) {
        touchSuppressClick.current = false;
      }
    };
    el.addEventListener("wheel", onWheelNative, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    el.addEventListener("touchcancel", onTouchEnd);
    return () => {
      el.removeEventListener("wheel", onWheelNative);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [applyWheelDelta, n, bodyOpen, scheduleSnap]);

  const rotateToIndex = useCallback(
    (idx: number) => {
      if (n <= 0) return;
      const clamped = mod(idx, n);
      setActiveIndex(clamped);
      const currentV = angleTarget.get();
      const currentIdx = mod(Math.round(currentV / stepDeg), n);
      let diff = clamped - currentIdx;
      if (diff > n / 2) diff -= n;
      if (diff < -n / 2) diff += n;
      angleTarget.set(currentV + diff * stepDeg);
    },
    [angleTarget, n, stepDeg],
  );

  const openExpandedAtIndex = useCallback(
    (idx: number) => {
      if (n <= 0 || !bodyOpen) return;
      setHoverPreviewIndex(null);
      if (hoverClearTimerRef.current) {
        clearTimeout(hoverClearTimerRef.current);
        hoverClearTimerRef.current = null;
      }
      rotateToIndex(idx);
      setIsExpanded(true);
    },
    [n, bodyOpen, rotateToIndex],
  );

  const scheduleClearHoverPreview = useCallback(() => {
    if (hoverClearTimerRef.current) clearTimeout(hoverClearTimerRef.current);
    hoverClearTimerRef.current = setTimeout(() => {
      hoverClearTimerRef.current = null;
      setHoverPreviewIndex(null);
    }, 120);
  }, []);

  const cancelClearHoverPreview = useCallback(() => {
    if (hoverClearTimerRef.current) {
      clearTimeout(hoverClearTimerRef.current);
      hoverClearTimerRef.current = null;
    }
  }, []);

  const yOffsetPercent = useMemo(
    () => (n > 1 ? (activeIndex / (n - 1)) * 100 : 50),
    [activeIndex, n],
  );

  const toggleBody = useCallback(() => {
    setBodyOpen((o) => !o);
    setIsExpanded(false);
    setHoverPreviewIndex(null);
  }, []);

  const parchmentShellStyle = {
    backgroundColor: "#e8dcc8",
    backgroundImage: `
      linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(0,0,0,0.06) 100%),
      url(${MEZUZAH_TEXTURE})
    `,
    backgroundBlendMode: "normal, normal" as const,
    backgroundPosition: "center, center 52%",
    backgroundSize: "100% 100%, 220% auto",
  };

  const capTextureStyle = {
    backgroundImage: `
      linear-gradient(180deg, rgba(255,255,255,0.42) 0%, rgba(0,0,0,0.04) 100%),
      url(${MEZUZAH_TEXTURE})
    `,
    backgroundSize: "cover, cover",
    backgroundPosition: "center, center top",
    boxShadow: `
      inset 0 3px 0 rgba(255,255,255,0.55),
      inset 0 -10px 16px rgba(0,0,0,0.12),
      0 2px 0 rgba(0,0,0,0.15)
    `,
  };

  const trenchBlock = bodyOpen ? (
    <div
      ref={trenchRef}
      className={`relative w-full shrink-0 overflow-hidden rounded-b-[38px] bg-[#1a120c]/38 shadow-[inset_0_6px_16px_rgba(0,0,0,0.42),inset_0_-6px_16px_rgba(0,0,0,0.42)] ${
        variant === "header"
          ? "rounded-t-none border-t border-[#4a3a2c]/25"
          : hideCap
            ? "rounded-t-[38px]"
            : ""
      }`}
      style={{
        height: `calc(${TRENCH_H})`,
        perspective: DIAL_PERSPECTIVE,
        perspectiveOrigin: "50% 50%",
        touchAction: "none",
      }}
    >
      <div className="absolute inset-0 flex max-[420px]:scale-[0.9] min-[421px]:scale-100 items-center justify-center">
        <motion.div
          className="relative"
          style={{
            width: 0,
            height: 0,
            transformStyle: "preserve-3d",
            rotateX: groupRotateX,
          }}
        >
          {items.map((item, idx) => {
            const isSelected = activeIndex === idx;
            const rawDist = Math.abs(idx - activeIndex);
            const dist = Math.min(rawDist, n - rawDist);
            const opacity = Math.max(0.12, 1 - dist * 0.22);
            const z = n - dist;

            return (
              <div
                key={item.key}
                className="absolute left-0 top-0"
                style={{
                  width: 56,
                  height: 56,
                  marginLeft: -28,
                  marginTop: -28,
                  transform: `rotateX(${idx * stepDeg}deg) translateZ(${CYLINDER_RADIUS_PX}px)`,
                  transformStyle: "preserve-3d",
                  opacity,
                  zIndex: z,
                  pointerEvents: opacity < 0.35 ? "none" : "auto",
                }}
              >
                <button
                  type="button"
                  aria-haspopup="dialog"
                  aria-expanded={isExpanded && activeIndex === idx}
                  onMouseEnter={() => {
                    if (isExpanded) return;
                    cancelClearHoverPreview();
                    setHoverPreviewIndex(idx);
                    rotateToIndex(idx);
                  }}
                  onMouseLeave={() => {
                    if (isExpanded) return;
                    scheduleClearHoverPreview();
                  }}
                  onClick={() => {
                    if (touchSuppressClick.current) {
                      touchSuppressClick.current = false;
                      return;
                    }
                    openExpandedAtIndex(idx);
                  }}
                  className={`group relative flex h-12 w-12 items-center justify-center rounded-full border-2 transition-[box-shadow,border-color,background-color,transform] duration-300 sm:h-14 sm:w-14 ${
                    isSelected
                      ? "border-[#5c4a3a] bg-[#faf7f2] shadow-[inset_0_2px_0_rgba(255,255,255,0.92),inset_0_-4px_8px_rgba(55,48,40,0.2),0_5px_10px_rgba(0,0,0,0.32),0_2px_3px_rgba(255,255,255,0.45)] hover:bg-[#fcfbf8]"
                      : "border-[#5c4a3a] bg-[#f4e8d4] shadow-[inset_0_2px_0_rgba(255,255,255,0.75),inset_0_-5px_10px_rgba(60,40,25,0.22),0_4px_8px_rgba(0,0,0,0.28),0_1px_0_rgba(255,255,255,0.5)] hover:bg-[#faf3e6] hover:shadow-[inset_0_2px_0_rgba(255,255,255,0.85),inset_0_-5px_10px_rgba(60,40,25,0.18),0_5px_12px_rgba(0,0,0,0.32)]"
                  }`}
                >
                  <span className="text-xl drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)] sm:text-2xl">
                    {item.emoji}
                  </span>
                </button>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  ) : null;

  if (n === 0) {
    return (
      <div ref={containerRef} className="text-sm text-ink-muted">
        No hubs
      </div>
    );
  }

  const isMerged = variant === "column" && bodyOpen;

  const capCornerClasses = isMerged
    ? "rounded-t-2xl rounded-b-none"
    : "rounded-2xl";

  const capBorderClasses = isMerged
    ? "border-b-0 pb-[3px]"
    : "border-b-[3px] border-b-[#3d2f24]/45";

  return (
    <div
      ref={containerRef}
      className={railClassName ?? DEFAULT_RAIL_CLASS}
    >
      <div className="relative z-20 flex w-full flex-col overflow-visible">
        <div
          className={`relative z-20 flex w-full flex-col overflow-visible border border-[#5c4a3a]/45 shadow-[12px_14px_36px_rgba(45,35,25,0.28),inset_0_2px_0_rgba(255,255,255,0.35)] ${
            hideCap
              ? "rounded-[38px]"
              : isMerged
                ? "rounded-t-2xl rounded-b-[38px]"
                : "rounded-2xl"
          }`}
          style={parchmentShellStyle}
        >
          {!hideCap && (
            <button
              type="button"
              id="mezuzah-cap"
              aria-expanded={bodyOpen}
              aria-controls="mezuzah-dial"
              onClick={toggleBody}
              className={`relative box-border flex h-[5rem] min-h-[5rem] max-h-[5rem] w-full shrink-0 items-center justify-center overflow-hidden border-x border-[#4a3a2c]/40 ${capBorderClasses} ${capCornerClasses}`}
              style={capTextureStyle}
            >
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-b from-white/90 to-white/10"
                aria-hidden
              />
              <span
                className="relative select-none font-hebrew text-4xl text-[#2a2218]/95"
                style={{
                  textShadow:
                    "0 1px 0 rgba(255,255,255,0.55), 1px 2px 2px rgba(0,0,0,0.2), -1px -1px 0 rgba(255,255,255,0.2)",
                }}
              >
                ש
              </span>
            </button>
          )}

          {variant === "column" && (
            <AnimatePresence initial={false}>
              {bodyOpen && (
                <motion.div
                  key="dial"
                  id="mezuzah-dial"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  {trenchBlock}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        {variant === "header" && (
          <AnimatePresence initial={false}>
            {bodyOpen && (
              <motion.div
                key="dial-header"
                id="mezuzah-dial"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="absolute left-0 top-full z-[100] mt-1 w-full rounded-b-[40px] border border-[#5c4a3a]/50 bg-[#e8dcc8] shadow-[0_20px_50px_rgba(30,22,14,0.35)]"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.05) 100%), url(${MEZUZAH_TEXTURE})`,
                  backgroundSize: "100% 100%, 200% auto",
                  backgroundPosition: "center, center 45%",
                }}
              >
                {trenchBlock}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      <AnimatePresence>
        {hoverPreviewIndex !== null &&
        !isExpanded &&
        bodyOpen &&
        items[hoverPreviewIndex] ? (
          <motion.div
            key={`preview-${items[hoverPreviewIndex]!.key}`}
            initial={{ opacity: 0, x: -12, y: "-50%", scale: 0.96 }}
            animate={{ opacity: 1, x: 0, y: "-50%", scale: 1 }}
            exit={{ opacity: 0, x: -12, y: "-50%", scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="pointer-events-none absolute z-[55] ml-6 w-[min(18rem,calc(100vw-6rem))] max-w-[280px]"
            style={{
              left: "100%",
              top: "calc(5rem + min(46vh, 272px) / 2)",
              transformOrigin: `0% ${n > 1 ? (hoverPreviewIndex / (n - 1)) * 100 : 50}%`,
            }}
          >
            <div
              className="rounded-2xl border border-[#c4a981]/55 bg-[#faf6ec]/95 p-3 shadow-lg backdrop-blur-sm"
              role="tooltip"
            >
              <p className="font-label text-[9px] uppercase tracking-widest text-ink-muted">
                {items[hoverPreviewIndex]!.category}
              </p>
              <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-ink">
                <span className="text-lg" aria-hidden>
                  {items[hoverPreviewIndex]!.emoji}
                </span>
                {items[hoverPreviewIndex]!.label}
              </p>
              <p className="mt-2 line-clamp-3 text-xs leading-snug text-ink-muted">
                {items[hoverPreviewIndex]!.desc}
              </p>
              <p className="mt-2 font-label text-[9px] text-ink-faint">
                Click icon for full panel
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isExpanded && bodyOpen && items[activeIndex] ? (
          <motion.div
            key={items[activeIndex]!.key}
            initial={{
              opacity: 0,
              x: layoutDesktop ? -20 : 0,
              y: "-50%",
              scale: 0.92,
            }}
            animate={{ opacity: 1, x: 0, y: "-50%", scale: 1 }}
            exit={{
              opacity: 0,
              x: layoutDesktop ? -20 : 0,
              y: "-50%",
              scale: 0.92,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="pointer-events-auto z-[60] w-[min(20rem,calc(100vw-1.5rem))] sm:absolute sm:ml-6 sm:w-[min(20rem,calc(100%-2rem))] max-sm:fixed max-sm:left-1/2 max-sm:top-1/2 max-sm:ml-0 md:w-[360px]"
            style={
              layoutDesktop
                ? {
                    left: "100%",
                    top: "calc(5rem + min(46vh, 272px) / 2)",
                    transformOrigin: `0% ${yOffsetPercent}%`,
                  }
                : { left: "50%", top: "50%" }
            }
          >
            <div
              className="relative flex h-[min(24rem,70dvh)] w-full min-h-[16rem] flex-col overflow-y-auto overflow-x-hidden overscroll-y-contain rounded-3xl border border-white/20 p-4 shadow-2xl sm:h-[360px] sm:overflow-hidden sm:p-6"
              style={{
                background:
                  CARD_BACKGROUNDS[activeIndex % CARD_BACKGROUNDS.length],
              }}
            >
              <div className="absolute -left-[100%] top-0 h-full w-[50%] -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-30" />

              <div className="relative z-10 flex flex-1 flex-col">
                <span className="mb-2 inline-block w-max max-w-full rounded-full border border-white/20 bg-black/20 px-3 py-1 font-label text-[10px] uppercase tracking-[0.15em] text-white/90">
                  {items[activeIndex]!.category}
                </span>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white drop-shadow-md sm:text-3xl">
                  {items[activeIndex]!.label}
                </h3>
                <p className="mt-4 leading-relaxed text-white/85">
                  {items[activeIndex]!.desc}
                </p>

                <div className="mt-auto pt-8">
                  <button
                    type="button"
                    onClick={() => onActivate(activeIndex)}
                    className="group relative w-full overflow-hidden rounded-xl border border-white/10 bg-black/20 px-4 py-3 font-medium text-white transition-all hover:bg-black/30 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] active:scale-[0.98]"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {actionLabel}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 transition-opacity group-hover:opacity-100" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
