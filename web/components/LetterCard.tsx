"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import {
  type ComponentProps,
  type MutableRefObject,
  type ReactNode,
  type Ref,
  type RefObject,
  forwardRef,
  useLayoutEffect,
  useRef,
} from "react";
import type { CourseLevel } from "@/data/course";

const CENTER_SMOOTH = { stiffness: 220, damping: 32, mass: 0.4 };
const VELOCITY_SMOOTH = { stiffness: 420, damping: 42, mass: 0.25 };

export type LetterCardProps = {
  children: ReactNode;
  className?: string;
  /** Optional scrollable ancestor (defaults to the window / document scroll). */
  scrollRootRef?: RefObject<HTMLElement | null>;
  /** Foundation level (Alef–Dalet): drives `data-*` and a default `aria-label`. */
  letter?: CourseLevel;
  /**
   * When true, skips center/scroll/velocity motion so a parent (e.g. 3D stack)
   * can own transforms and hover.
   */
  disableParallax?: boolean;
} & Omit<ComponentProps<typeof motion.div>, "style" | "children"> & {
  style?: ComponentProps<typeof motion.div>["style"];
};

function assignRef<T>(ref: Ref<T> | undefined, value: T) {
  if (!ref) return;
  if (typeof ref === "function") {
    ref(value);
  } else {
    (ref as MutableRefObject<T | null>).current = value;
  }
}

/**
 * Letter “stone” with glass styling: scales up and becomes opaque near the
 * vertical viewport center; tilts slightly with scroll velocity (3D, perspective).
 */
export const LetterCard = forwardRef<HTMLDivElement, LetterCardProps>(
  function LetterCard(
    {
      children,
      className = "",
      scrollRootRef,
      letter,
      disableParallax = false,
      style: styleProp,
      ...rest
    },
    forwardedRef,
  ) {
    const localRef = useRef<HTMLDivElement>(null);
    const reduce = useReducedMotion() ?? false;
    const parallax = !disableParallax;

    const { scrollY } = useScroll();
    const rawCenterProximity = useMotionValue(1);
    const centerProximity = useSpring(rawCenterProximity, CENTER_SMOOTH);
    const scrollVelocityY = useVelocity(scrollY);
    const velSmoothed = useSpring(scrollVelocityY, VELOCITY_SMOOTH);

    const scale = useTransform(centerProximity, [0, 1], [0.84, 1.04]);
    const opacity = useTransform(centerProximity, [0, 1], [0.38, 1]);

    const rotateX = useTransform(
      velSmoothed,
      [-900, 900],
      [5, -5],
      { clamp: true },
    );
    const rotateY = useTransform(
      velSmoothed,
      [-900, 900],
      [-4, 4],
      { clamp: true },
    );

    const updateCenterProximity = () => {
      const el = localRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.height === 0 && rect.width === 0) return;
      const vh =
        scrollRootRef?.current?.clientHeight ?? window.innerHeight;
      const rootTop =
        scrollRootRef?.current?.getBoundingClientRect().top ?? 0;
      const viewportCenter = rootTop + vh * 0.5;
      const elCenterY = rect.top + rect.height * 0.5;
      const maxDist = vh * 0.5;
      const t =
        1 - Math.min(1, Math.abs(elCenterY - viewportCenter) / maxDist);
      rawCenterProximity.set(Math.max(0, t));
    };

    useLayoutEffect(() => {
      if (!parallax) return;
      if (reduce) {
        rawCenterProximity.set(1);
        return;
      }
      updateCenterProximity();
      const root = scrollRootRef?.current ?? window;
      const opts: AddEventListenerOptions = { capture: true, passive: true };
      const onScroll = () => {
        requestAnimationFrame(updateCenterProximity);
      };
      root.addEventListener("scroll", onScroll, opts);
      window.addEventListener("resize", onScroll, opts);
      return () => {
        root.removeEventListener("scroll", onScroll, opts);
        window.removeEventListener("resize", onScroll, opts);
      };
    }, [parallax, reduce, rawCenterProximity, scrollRootRef]);

    const setRef = (node: HTMLDivElement | null) => {
      localRef.current = node;
      assignRef(forwardedRef, node);
    };

    const motionStyle: ComponentProps<typeof motion.div>["style"] = {
      ...styleProp,
      transformStyle: "preserve-3d",
      ...(parallax
        ? {
            scale: reduce ? 1 : scale,
            opacity: reduce ? 1 : opacity,
            rotateX: reduce ? 0 : rotateX,
            rotateY: reduce ? 0 : rotateY,
          }
        : {
            scale: 1,
            opacity: 1,
            rotateX: 0,
            rotateY: 0,
          }),
    };

    const inner = (
      <motion.div
        ref={setRef}
        {...rest}
        {...(letter
          ? {
              "data-course-level": letter.n,
              "data-hebrew-letter": letter.icon,
              "aria-label": `${letter.label} — ${letter.desc}`,
            }
          : {})}
        className={[
          "relative rounded-2xl border-t border-l border-ink/12 bg-parchment-card/40",
          "border-r-[4px] border-b-[4px] border-r-[rgba(0,0,0,0.1)] border-b-[rgba(0,0,0,0.1)]",
          "shadow-[0_6px_20px_rgba(20,12,6,0.08)]",
          "backdrop-blur-lg backdrop-saturate-150 will-change-transform",
          "ring-1 ring-inset ring-white/30",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        style={motionStyle}
      >
        <span
          className="pointer-events-none absolute left-1/2 top-2 z-[2] -translate-x-1/2 select-none font-hebrew text-[15px] font-medium leading-none tracking-tight text-[#b8952e] [text-shadow:_0_1px_0_rgba(255,255,255,0.45),_0_-0.5px_0_rgba(0,0,0,0.08)]"
          aria-hidden
        >
          ש
        </span>
        {children}
      </motion.div>
    );

    if (disableParallax) {
      return inner;
    }

    return (
      <div
        className="origin-center [transform-style:preserve-3d]"
        style={{ perspective: "1000px" }}
      >
        {inner}
      </div>
    );
  },
);

LetterCard.displayName = "LetterCard";
