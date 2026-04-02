/**
 * Learn home journey carousel: foundation levels → exit → bridge → specialty tracks.
 */

import { COURSE_LEVELS, getSectionsForLevel } from "@/data/course";
import { SPECIALTY_TRACKS } from "@/data/specialty-tracks";
import type { LearnProgressState } from "@/lib/learn-progress";
import {
  completionRatio,
  getFoundationExitStrands,
  isBridgeUnlocked,
  isFoundationCourseComplete,
  isSpecialtyTracksUnlocked,
} from "@/lib/learn-progress";

export type LearnJourneySlot =
  | { kind: "level"; n: number }
  | { kind: "foundation_exit" }
  | { kind: "bridge" }
  | { kind: "specialty"; trackId: string };

/** Matches {@link CoverFlowCarousel} item fields used by the journey strip. */
export type LearnJourneyCoverFields = {
  key: string;
  label: string;
  desc: string;
  category: string;
  emoji?: string;
  locked?: boolean;
};

export type LearnJourneyRow = {
  slot: LearnJourneySlot;
  cover: LearnJourneyCoverFields;
};

function foundationDone(
  progress: LearnProgressState,
  developerMode: boolean,
): boolean {
  return developerMode || isFoundationCourseComplete(progress);
}

/** Exit strands complete — unlocks bridge module in app logic. */
function exitStrandsDone(
  progress: LearnProgressState,
  developerMode: boolean,
): boolean {
  return developerMode || isBridgeUnlocked(progress);
}

function specialtiesUnlocked(
  progress: LearnProgressState,
  developerMode: boolean,
): boolean {
  return developerMode || isSpecialtyTracksUnlocked(progress);
}

/** Level tile: open lessons for this band. */
export function isLevelCarouselUnlocked(
  levelN: number,
  progress: LearnProgressState,
  developerMode: boolean,
): boolean {
  return developerMode || levelN <= progress.activeLevel;
}

/** Foundation exit exams: open after all Alef–Dalet subsections are complete. */
export function isFoundationExitCarouselUnlocked(
  progress: LearnProgressState,
  developerMode: boolean,
): boolean {
  return foundationDone(progress, developerMode);
}

/** Bridge: same as app — requires all three exit strands. */
export function isBridgeCarouselNavUnlocked(
  progress: LearnProgressState,
  developerMode: boolean,
): boolean {
  return exitStrandsDone(progress, developerMode);
}

/**
 * Specialty track drills: after bridge final pass.
 * Carousel appearance: dimmed until foundation complete; modal explains later gates.
 */
export function isSpecialtyTrackDrillsUnlocked(
  progress: LearnProgressState,
  developerMode: boolean,
): boolean {
  return specialtiesUnlocked(progress, developerMode);
}

/** Dim post-foundation slots until Alef–Dalet subsections are finished. */
export function isPostFoundationSlotDimmed(
  progress: LearnProgressState,
  developerMode: boolean,
): boolean {
  return !foundationDone(progress, developerMode);
}

export function buildLearnJourneyRows(
  progress: LearnProgressState,
  developerMode: boolean,
): LearnJourneyRow[] {
  const rows: LearnJourneyRow[] = [];

  for (const level of COURSE_LEVELS) {
    const unlocked = isLevelCarouselUnlocked(
      level.n,
      progress,
      developerMode,
    );
    const sections = getSectionsForLevel(level.n);
    const { done, total } = completionRatio(
      sections,
      progress.completedSections,
    );
    rows.push({
      slot: { kind: "level", n: level.n },
      cover: {
        key: `level-${level.n}`,
        label: level.label.split(" — ")[0] ?? level.label,
        desc: unlocked
          ? `${done}/${total} subsections · ${level.desc.slice(0, 72)}${level.desc.length > 72 ? "…" : ""}`
          : `Locked — set active level to ${level.n} or finish prior work.`,
        category: `Level ${level.n}`,
        emoji: level.icon,
        locked: !unlocked,
      },
    });
  }

  const exitUnlocked = isFoundationExitCarouselUnlocked(
    progress,
    developerMode,
  );
  const strands = getFoundationExitStrands(progress);
  const exitDoneCount =
    (strands.reading ? 1 : 0) +
    (strands.grammar ? 1 : 0) +
    (strands.lexicon ? 1 : 0);
  rows.push({
    slot: { kind: "foundation_exit" },
    cover: {
      key: "foundation-exit",
      label: "Foundation exit",
      desc: exitUnlocked
        ? `Strands passed: ${exitDoneCount}/3 — reading, grammar, lexicon checkpoints before the bridge.`
        : "Locked — complete every Alef–Dalet subsection first.",
      category: "Milestone",
      emoji: "✓",
      locked: !exitUnlocked,
    },
  });

  const bridgeNav = isBridgeCarouselNavUnlocked(progress, developerMode);
  const postDim = isPostFoundationSlotDimmed(progress, developerMode);
  rows.push({
    slot: { kind: "bridge" },
    cover: {
      key: "bridge",
      label: "Bridge",
      desc: postDim
        ? "Locked until Alef–Dalet is complete — then pass foundation exit to open."
        : bridgeNav
          ? "Connect foundation skills to domain work — units plus final checkpoint."
          : "Pass all three foundation exit strands to unlock the bridge module.",
      category: "Post-foundation",
      emoji: "🌉",
      locked: postDim || !bridgeNav,
    },
  });

  for (const track of SPECIALTY_TRACKS) {
    const drills = isSpecialtyTrackDrillsUnlocked(progress, developerMode);
    rows.push({
      slot: { kind: "specialty", trackId: track.id },
      cover: {
        key: `track-${track.id}`,
        label: track.title,
        desc: postDim
          ? "Locked until you finish Alef–Dalet — then foundation exit, bridge, and tiers unlock in order."
          : drills
            ? `${track.blurb} Bronze → Silver → Gold MCQ badges.`
            : "Complete foundation exit and pass the bridge to unlock specialty tiers.",
        category:
          track.group === "modern_hebrew"
            ? "Modern Hebrew track"
            : "Traditional track",
        emoji: track.group === "modern_hebrew" ? "📰" : "📜",
        locked: postDim || !drills,
      },
    });
  }

  return rows;
}

export function learnJourneyCoverItems(
  progress: LearnProgressState,
  developerMode: boolean,
): LearnJourneyCoverFields[] {
  return buildLearnJourneyRows(progress, developerMode).map((r) => r.cover);
}
