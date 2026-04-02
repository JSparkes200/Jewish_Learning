"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { COURSE_LEVELS, getSectionsForLevel } from "@/data/course";
import { BRIDGE_UNIT_IDS } from "@/data/bridge-course";
import { getSpecialtyTrackMeta } from "@/data/specialty-tracks";
import {
  areAllBridgeUnitsComplete,
  completionRatio,
  effectiveBridgeUnitsCompleted,
  getBridgeModulePassed,
  getFoundationExitStrands,
  getNextSpecialtyTierForTrack,
  isSpecialtyTracksUnlocked,
  type LearnProgressState,
} from "@/lib/learn-progress";
import type { LearnJourneySlot } from "@/lib/learn-journey-hub";
import {
  isBridgeCarouselNavUnlocked,
  isFoundationExitCarouselUnlocked,
  isLevelCarouselUnlocked,
  isPostFoundationSlotDimmed,
  isSpecialtyTrackDrillsUnlocked,
} from "@/lib/learn-journey-hub";

type Props = {
  slot: LearnJourneySlot;
  progress: LearnProgressState;
  developerMode: boolean;
  onClose: () => void;
};

export function LearnJourneyDetailModal({
  slot,
  progress,
  developerMode,
  onClose,
}: Props) {
  const postDim = isPostFoundationSlotDimmed(progress, developerMode);

  let body: ReactNode;
  let title: string;

  if (slot.kind === "level") {
    const level = COURSE_LEVELS.find((l) => l.n === slot.n);
    const unlocked = isLevelCarouselUnlocked(slot.n, progress, developerMode);
    const sections = getSectionsForLevel(slot.n);
    const { done, total, pct } = completionRatio(
      sections,
      progress.completedSections,
    );
    title = level?.label ?? `Level ${slot.n}`;
    body = (
      <div className="space-y-3 text-sm text-ink-muted">
        <p>
          <strong className="text-ink">Status:</strong>{" "}
          {unlocked
            ? "Open — your active level controls which band is highlighted in Next up."
            : "Locked — raise active level on Learn (see Progress controls) or finish earlier work."}
        </p>
        {level ? <p>{level.desc}</p> : null}
        <p className="text-xs text-ink-faint">
          Subsections: {done}/{total} complete ({pct}%).
        </p>
        {unlocked ? (
          <Link
            href={`/learn/${slot.n}`}
            className="btn-elevated-primary inline-flex w-full justify-center no-underline"
          >
            Open level {slot.n} menu →
          </Link>
        ) : null}
      </div>
    );
  } else if (slot.kind === "foundation_exit") {
    const unlocked = isFoundationExitCarouselUnlocked(
      progress,
      developerMode,
    );
    const s = getFoundationExitStrands(progress);
    title = "Foundation exit";
    body = (
      <div className="space-y-3 text-sm text-ink-muted">
        <p>
          Three short exams (reading, grammar, lexicon) prove you can use
          foundation skills together before the bridge.
        </p>
        <p>
          <strong className="text-ink">Status:</strong>{" "}
          {unlocked
            ? "You may open foundation exit."
            : "Locked — finish every subsection in Alef–Dalet first."}
        </p>
        <ul className="list-inside list-disc text-xs">
          <li>Reading strand: {s.reading ? "passed" : "not passed"}</li>
          <li>Grammar strand: {s.grammar ? "passed" : "not passed"}</li>
          <li>Lexicon strand: {s.lexicon ? "passed" : "not passed"}</li>
        </ul>
        {unlocked ? (
          <Link
            href="/learn/foundation-exit"
            className="btn-elevated-primary inline-flex w-full justify-center no-underline"
          >
            Open foundation exit →
          </Link>
        ) : null}
      </div>
    );
  } else if (slot.kind === "bridge") {
    const bridgeNav = isBridgeCarouselNavUnlocked(progress, developerMode);
    const passed = getBridgeModulePassed(progress);
    const units = effectiveBridgeUnitsCompleted(progress);
    const unitsDone = areAllBridgeUnitsComplete(progress);
    title = "Bridge module";
    body = (
      <div className="space-y-3 text-sm text-ink-muted">
        <p>
          Short units connect foundation habits to domain Hebrew. A final
          checkpoint unlocks specialty MCQ tracks.
        </p>
        {postDim ? (
          <p className="rounded-lg border border-amber/25 bg-amber/10 p-2 text-xs text-ink">
            <strong className="text-ink">Locked:</strong> complete all
            Alef–Dalet subsections first. Then pass foundation exit to open the
            bridge.
          </p>
        ) : !bridgeNav ? (
          <p className="rounded-lg border border-amber/25 bg-amber/10 p-2 text-xs text-ink">
            <strong className="text-ink">Locked:</strong> pass all three
            foundation exit strands, then return here.
          </p>
        ) : (
          <>
            <p>
              <strong className="text-ink">Status:</strong>{" "}
              {passed
                ? "Bridge final passed — specialty tiers are available (per track rules)."
                : unitsDone
                  ? "Units complete — take the bridge final when ready."
                  : "Work through bridge units, then the final checkpoint."}
            </p>
            <p className="text-xs text-ink-faint">
              Bridge units marked:{" "}
              {BRIDGE_UNIT_IDS.filter((id) => units[id]).length}/
              {BRIDGE_UNIT_IDS.length}
            </p>
          </>
        )}
        {bridgeNav ? (
          <Link
            href="/learn/bridge"
            className="btn-elevated-primary inline-flex w-full justify-center no-underline"
          >
            Open bridge →
          </Link>
        ) : null}
      </div>
    );
  } else {
    const meta = getSpecialtyTrackMeta(slot.trackId);
    const drills = isSpecialtyTrackDrillsUnlocked(progress, developerMode);
    const specUnlocked = developerMode || isSpecialtyTracksUnlocked(progress);
    const next = getNextSpecialtyTierForTrack(progress, slot.trackId);
    title = meta?.title ?? slot.trackId;
    body = (
      <div className="space-y-3 text-sm text-ink-muted">
        {meta ? <p>{meta.blurb}</p> : null}
        {postDim ? (
          <p className="rounded-lg border border-amber/25 bg-amber/10 p-2 text-xs text-ink">
            <strong className="text-ink">Locked:</strong> finish Alef–Dalet
            (all subsections). After that, foundation exit and the bridge unlock
            specialty drills.
          </p>
        ) : !specUnlocked ? (
          <p className="rounded-lg border border-amber/25 bg-amber/10 p-2 text-xs text-ink">
            <strong className="text-ink">Not yet available:</strong> pass
            foundation exit and the bridge final to open Bronze–Gold tiers.
          </p>
        ) : (
          <p>
            <strong className="text-ink">Status:</strong>{" "}
            {drills
              ? next
                ? `Next open tier: ${next.tier}.`
                : "All published tiers on this track are complete — revisit anytime."
              : "Tracks not unlocked."}
          </p>
        )}
        {meta ? (
          <p className="text-xs text-ink-faint">{meta.focus}</p>
        ) : null}
        <div className="flex flex-col gap-2">
          {drills && next ? (
            <Link
              href={next.href}
              className="btn-elevated-primary inline-flex justify-center no-underline"
            >
              Continue {next.tier} →
            </Link>
          ) : null}
          <Link
            href="/learn/tracks"
            className="rounded-lg border border-ink/15 px-3 py-2 text-center font-label text-[10px] uppercase tracking-wide text-ink-muted hover:bg-parchment-deep/40"
          >
            All specialty tracks →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/45 px-3 pt-[max(0.75rem,env(safe-area-inset-top,0px))] pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] sm:items-center"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="flex max-h-[min(88dvh,560px)] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-ink/15 bg-parchment-card shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="learn-journey-detail-title"
      >
        <div className="border-b border-ink/10 bg-parchment-deep/30 px-4 py-3">
          <p className="font-label text-[9px] uppercase tracking-[0.2em] text-ink-muted">
            Learn journey
          </p>
          <h2
            id="learn-journey-detail-title"
            className="mt-1 text-base font-medium text-ink"
          >
            {title}
          </h2>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain p-4 [scrollbar-gutter:stable]">
          {body}
        </div>
        <div className="border-t border-ink/10 p-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-lg border border-ink/15 py-2 font-label text-[10px] uppercase tracking-wide text-ink-muted hover:bg-parchment-deep/40"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
