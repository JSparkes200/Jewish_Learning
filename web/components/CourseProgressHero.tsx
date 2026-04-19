"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { ProgressRing } from "@/components/ProgressRing";
import { YeshivaScrollProgressTrack } from "@/components/YeshivaScrollProgressTrack";

/** Shared look; callers add `relative` (in-flow) or `fixed` (portal) — never both. */
const FUTURE_PANEL_STYLES =
  "isolate overflow-hidden rounded-2xl border border-sage/35 bg-gradient-to-br from-white/80 via-[rgb(252,250,246)]/92 to-teal-950/[0.04] shadow-[0_26px_60px_-18px_rgba(30,22,14,0.28),0_8px_24px_-8px_rgba(15,118,110,0.12),inset_0_1px_0_0_rgba(255,255,255,0.9)] backdrop-blur-[18px] ring-1 ring-teal-600/[0.14]";

const FUTURE_PANEL = `relative ${FUTURE_PANEL_STYLES}`;

/** Stable id for the expanded hub region (single instance per page). */
const COURSE_PROGRESS_REGION_ID = "course-progress-hero-region";

function ChevronUpIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
        clipRule="evenodd"
      />
    </svg>
  );
}


type ExpandedBodyProps = {
  heading: string;
  intro?: string;
  expandableHub: boolean;
  onCollapse: () => void;
  coursePct: number;
  practicePct: number | null;
  sectionsDone: number;
  sectionsTotal: number;
  streakCurrent: number;
  mcqAttempts: number;
  mcqCorrect: number;
  continueHref: string;
  continueLabel: string;
};

function ExpandedPanelBody({
  heading,
  intro,
  expandableHub,
  onCollapse,
  coursePct,
  practicePct,
  sectionsDone,
  sectionsTotal,
  streakCurrent,
  mcqAttempts,
  mcqCorrect,
  continueHref,
  continueLabel,
}: ExpandedBodyProps) {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(118deg,rgb(20_184_166/0.09)_0%,transparent_38%,transparent_62%,rgb(34_197_94/0.06)_100%)] opacity-70"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-px bg-gradient-to-r from-transparent via-teal-400/45 to-transparent"
        aria-hidden
      />

      <div className="relative p-3.5 sm:p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <p className="font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
                  {heading}
                </p>
                <p
                  className="font-hebrew text-[14px] leading-none text-ink/55 sm:text-[15px]"
                  dir="rtl"
                >
                  מַבָּט עַל הַהִתְקַדְמוּת
                </p>
              </div>
              {intro ? (
                <p className="text-sm leading-snug text-ink-muted">{intro}</p>
              ) : null}
            </div>
            {expandableHub ? (
              <button
                type="button"
                onClick={onCollapse}
                className="shrink-0 rounded-lg border border-teal-900/15 bg-white/50 p-1.5 text-teal-900/70 shadow-sm backdrop-blur-sm transition hover:bg-white/70 hover:text-teal-900"
                aria-expanded="true"
                aria-controls={COURSE_PROGRESS_REGION_ID}
                aria-label="Collapse progress panel"
              >
                <ChevronUpIcon />
              </button>
            ) : null}
          </div>

          <YeshivaScrollProgressTrack
            percent={coursePct}
            sectionsDone={sectionsDone}
            sectionsTotal={sectionsTotal}
          />

          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-3">
            <div className="flex flex-1 flex-col justify-center gap-2">
              <GlassStat
                label="Sections"
                value={
                  <>
                    {sectionsDone}
                    <span className="text-xs font-normal text-ink-muted">
                      {" "}
                      / {sectionsTotal}
                    </span>
                  </>
                }
              />
              <GlassStat
                label="Streak"
                value={
                  <>
                    {streakCurrent}
                    <span className="text-xs font-normal text-ink-muted">
                      {" "}
                      day{streakCurrent === 1 ? "" : "s"}
                    </span>
                  </>
                }
              />
            </div>

            <div className="flex flex-col items-center justify-center gap-1.5 sm:w-[8.75rem] sm:shrink-0">
              <div className="relative flex items-center justify-center">
                <ProgressRing
                  percent={coursePct}
                  label={`${coursePct}%`}
                  size={100}
                  stroke={9}
                  tone="sage"
                  sublabel="Alef–Dalet"
                />
              </div>
              <p className="max-w-[11rem] text-center text-[9px] leading-snug text-ink-faint">
                Ring matches the folio bar — both track full-course sections.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-teal-900/12 bg-white/35 px-3 py-2 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.5)] backdrop-blur-md">
            <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
              <div>
                <p className="font-label text-[8px] uppercase tracking-[0.18em] text-ink/50">
                  Practice accuracy
                </p>
                <p className="mt-0.5 text-sm font-semibold tabular-nums text-ink">
                  {practicePct != null ? (
                    <>
                      {practicePct}%
                      <span className="text-xs font-normal text-ink-muted">
                        {" "}
                        · {mcqCorrect}/{mcqAttempts} picks
                      </span>
                    </>
                  ) : (
                    <span className="text-xs font-normal text-ink-muted">
                      Answer a drill to start
                    </span>
                  )}
                </p>
              </div>
              {practicePct != null ? (
                <div
                  className="h-2 w-full overflow-hidden rounded-full border border-white/40 bg-ink/[0.06] shadow-inner sm:max-w-[9rem] sm:flex-1"
                  role="presentation"
                  aria-hidden
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-teal-600 via-teal-500 to-sage transition-[width] duration-500 ease-out motion-reduce:transition-none"
                    style={{ width: `${practicePct}%` }}
                  />
                </div>
              ) : null}
            </div>
          </div>

          <Link
            href={continueHref}
            className="btn-elevated-primary inline-flex w-fit items-center justify-center no-underline"
          >
            {continueLabel}
          </Link>
        </div>
      </div>
    </>
  );
}

/**
 * Course snapshot: optional compact “hub” tile that expands into the full panel.
 * Expanded styling matches the floating teal-glass reading panels elsewhere.
 */
export function CourseProgressHero({
  sectionsDone,
  sectionsTotal,
  streakCurrent,
  mcqAttempts,
  mcqCorrect,
  continueHref = "/learn",
  continueLabel = "Continue learning",
  heading = "Course snapshot",
  intro,
  /** When true (e.g. home hub), starts as a small tile and opens on press. */
  expandableHub = false,
  /** For expandable hub: align floating panel to tile’s right edge (recommended under left-rail hub). */
  hubPanelAnchor = "left",
}: {
  sectionsDone: number;
  sectionsTotal: number;
  streakCurrent: number;
  mcqAttempts: number;
  mcqCorrect: number;
  continueHref?: string;
  continueLabel?: string;
  heading?: string;
  intro?: string;
  expandableHub?: boolean;
  hubPanelAnchor?: "left" | "right" | "right-edge";
}) {
  const [hubOpen, setHubOpen] = useState(!expandableHub);
  const [floatLayout, setFloatLayout] = useState({
    top: 0,
    left: 0,
    width: 448,
  });
  const [mounted, setMounted] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const coursePct =
    sectionsTotal > 0
      ? Math.round((sectionsDone / sectionsTotal) * 100)
      : 0;
  const practicePct =
    mcqAttempts > 0 ? Math.round((mcqCorrect / mcqAttempts) * 100) : null;

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!expandableHub || !hubOpen) return;

    const updateFloatPosition = () => {
      const anchor = anchorRef.current;
      if (!anchor) return;

      const r = anchor.getBoundingClientRect();
      const margin = 12;
      const gap = 6;
      const maxPanelW = 448;

      let panelW: number;
      let left: number;

      if (hubPanelAnchor === "right") {
        panelW = Math.min(maxPanelW, window.innerWidth - 2 * margin);
        left = r.right - panelW;
      } else if (hubPanelAnchor === "right-edge") {
        left = r.right + gap;
        const spaceToRight = window.innerWidth - left - margin;
        panelW = Math.min(maxPanelW, Math.max(200, spaceToRight));
      } else {
        const anchorLeft = Math.max(margin, r.left);
        const spaceToRight = window.innerWidth - anchorLeft - margin;
        panelW = Math.min(maxPanelW, Math.max(200, spaceToRight));
        left = anchorLeft;
      }

      left = Math.max(margin, Math.min(left, window.innerWidth - margin - panelW));
      if (left + panelW > window.innerWidth - margin) {
        panelW = window.innerWidth - margin - left;
        panelW = Math.max(200, panelW);
      }

      let top: number;
      const panelEl = panelRef.current;
      const panelH = panelEl?.offsetHeight ?? 420;

      if (hubPanelAnchor === "right-edge") {
        top = r.top;
        if (top + panelH > window.innerHeight - margin) {
          top = Math.max(margin, window.innerHeight - margin - panelH);
        }
      } else {
        top = r.bottom + gap;
        if (top + panelH > window.innerHeight - margin) {
          top = r.top - panelH - gap;
        }
        top = Math.max(margin, top);
      }

      setFloatLayout({ top, left, width: panelW });
    };

    updateFloatPosition();
    const raf = requestAnimationFrame(() => updateFloatPosition());

    window.addEventListener("resize", updateFloatPosition);
    window.addEventListener("scroll", updateFloatPosition, true);

    const panelEl = panelRef.current;
    const ro =
      typeof ResizeObserver !== "undefined" && panelEl
        ? new ResizeObserver(() => updateFloatPosition())
        : null;
    if (panelEl && ro) ro.observe(panelEl);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", updateFloatPosition);
      window.removeEventListener("scroll", updateFloatPosition, true);
      ro?.disconnect();
    };
  }, [
    expandableHub,
    hubOpen,
    hubPanelAnchor,
    sectionsDone,
    sectionsTotal,
    streakCurrent,
    mcqAttempts,
    mcqCorrect,
    intro,
    heading,
    continueHref,
    continueLabel,
  ]);

  useEffect(() => {
    if (!expandableHub || !hubOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setHubOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expandableHub, hubOpen]);

  const bodyProps: ExpandedBodyProps = {
    heading,
    intro,
    expandableHub,
    onCollapse: () => setHubOpen(false),
    coursePct,
    practicePct,
    sectionsDone,
    sectionsTotal,
    streakCurrent,
    mcqAttempts,
    mcqCorrect,
    continueHref,
    continueLabel,
  };

  if (expandableHub) {
    const portal =
      mounted &&
      hubOpen &&
      createPortal(
        <>
          <button
            type="button"
            className="fixed inset-0 z-[100] cursor-default border-0 bg-ink/[0.18] backdrop-blur-[2px] motion-reduce:backdrop-blur-none"
            aria-label="Dismiss progress panel"
            onClick={() => setHubOpen(false)}
          />
          <div
            ref={panelRef}
            id={COURSE_PROGRESS_REGION_ID}
            role="dialog"
            aria-modal="true"
            aria-label={heading}
            className={`fixed z-[110] max-h-[min(85vh,640px)] max-w-[28rem] min-w-[12rem] overflow-y-auto overscroll-y-contain shadow-[0_32px_72px_-20px_rgba(30,22,14,0.35),0_12px_28px_-8px_rgba(15,118,110,0.18),inset_0_1px_0_0_rgba(255,255,255,0.92)] ${FUTURE_PANEL_STYLES}`}
            style={{
              top: floatLayout.top,
              left: floatLayout.left,
              width: floatLayout.width,
            }}
          >
            <ExpandedPanelBody {...bodyProps} />
          </div>
        </>,
        document.body,
      );

    return (
      <>
        <button
          ref={anchorRef}
          type="button"
          className={`group ${FUTURE_PANEL} relative flex w-44 flex-col items-center gap-3 px-4 py-4 text-center transition-[box-shadow,transform,ring] duration-300 motion-reduce:transition-none hover:-translate-y-0.5 hover:shadow-[0_32px_72px_-20px_rgba(30,22,14,0.32),0_12px_28px_-8px_rgba(15,118,110,0.14),inset_0_1px_0_0_rgba(255,255,255,0.92)] motion-reduce:hover:translate-y-0 ${
            hubOpen
              ? "ring-2 ring-teal-500/45 shadow-[0_32px_72px_-20px_rgba(30,22,14,0.28),0_12px_28px_-8px_rgba(15,118,110,0.16),inset_0_1px_0_0_rgba(255,255,255,0.92)]"
              : ""
          }`}
          onClick={() => setHubOpen((o) => !o)}
          aria-expanded={hubOpen}
          aria-haspopup="dialog"
          aria-controls={hubOpen ? COURSE_PROGRESS_REGION_ID : undefined}
          aria-label={
            hubOpen
              ? `Collapse ${heading}`
              : `Expand ${heading}: ${coursePct}% Alef–Dalet complete`
          }
        >
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(118deg,rgb(20_184_166/0.09)_0%,transparent_38%,transparent_62%,rgb(34_197_94/0.06)_100%)] opacity-70"
            aria-hidden
          />
          {/* Removed chevron up/down icons */}
          <p className="w-full px-2 pt-1 text-center font-label text-[13px] font-semibold uppercase leading-snug tracking-[0.15em] text-ink sm:text-[14px] sm:tracking-[0.18em]">
            {heading}
          </p>
          <div className="relative flex aspect-square w-2/3 shrink-0 items-center justify-center">
            <ProgressRing
              percent={coursePct}
              label={`${coursePct}%`}
              size={104}
              stroke={8}
              tone="sage"
              sublabel="Alef–Dalet"
              compact
            />
          </div>
        </button>
        {portal}
      </>
    );
  }

  return (
    <div
      id={COURSE_PROGRESS_REGION_ID}
      role="region"
      aria-label={heading}
      className={`${FUTURE_PANEL} transition-[box-shadow,transform] duration-300 motion-reduce:transition-none hover:-translate-y-0.5 hover:shadow-[0_32px_72px_-20px_rgba(30,22,14,0.32),0_12px_28px_-8px_rgba(15,118,110,0.14),inset_0_1px_0_0_rgba(255,255,255,0.92)] motion-reduce:hover:translate-y-0`}
    >
      <ExpandedPanelBody {...bodyProps} />
    </div>
  );
}

function GlassStat({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-teal-900/12 bg-white/35 px-3 py-2 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.45)] backdrop-blur-md">
      <div className="flex items-center justify-between gap-2">
        <p className="font-label text-[8px] uppercase tracking-wide text-ink/45">
          {label}
        </p>
        <p className="text-sm font-semibold tabular-nums text-ink">{value}</p>
      </div>
    </div>
  );
}
