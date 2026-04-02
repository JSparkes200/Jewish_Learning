/**
 * Numbers hub: carousel tiles mirror course progress (see
 * {@link buildProgressMirroredNumbersItems}).
 */

import type { LearnProgressState } from "@/lib/learn-progress";

export type NumbersHubCarouselItem = {
  id: string;
  label: string;
  shortDesc: string;
  category: string;
  emoji: string;
  anchor: string;
  hasPracticeDrill: boolean;
};

function hasAnyCompletedInLevel(
  level: number,
  completed: Record<string, boolean>,
): boolean {
  const prefix = `${level}-`;
  return Object.keys(completed).some((id) => id.startsWith(prefix));
}

/** Ordinals / days / time tiles unlock with Bet work (same idea as reading RD lv2). */
export function isNumbersTier2Unlocked(progress: LearnProgressState): boolean {
  return (
    progress.activeLevel >= 2 &&
    hasAnyCompletedInLevel(2, progress.completedSections)
  );
}

const META: Record<
  string,
  Omit<NumbersHubCarouselItem, "id">
> = {
  cards: {
    label: "0–100 cards",
    shortDesc:
      "Browse every cardinal with audio, masculine and feminine forms, and legacy parity.",
    category: "After 1-nums",
    emoji: "🃏",
    anchor: "#cards",
    hasPracticeDrill: true,
  },
  listen: {
    label: "Listen & pick",
    shortDesc: "Hear a number 0–10, then tap the Hebrew you heard.",
    category: "After 1-nums",
    emoji: "◈",
    anchor: "#listen",
    hasPracticeDrill: true,
  },
  grammar: {
    label: "Gender note",
    shortDesc:
      "How Hebrew numbers agree (or seem to invert) with masculine and feminine nouns.",
    category: "After 1-nums",
    emoji: "📐",
    anchor: "#grammar",
    hasPracticeDrill: false,
  },
  price: {
    label: "Prices",
    shortDesc: "Sample shekel amounts — listen and read cardinals with שקלים.",
    category: "After 1-nums",
    emoji: "₪",
    anchor: "#price",
    hasPracticeDrill: true,
  },
  ordinal: {
    label: "Ordinals",
    shortDesc: "Match English position (1st, 2nd…) to Hebrew ordinals.",
    category: "Bet+",
    emoji: "1st",
    anchor: "#ordinal",
    hasPracticeDrill: true,
  },
  days: {
    label: "Days",
    shortDesc: "English weekday to Hebrew day name.",
    category: "Bet+",
    emoji: "📅",
    anchor: "#days",
    hasPracticeDrill: true,
  },
  time: {
    label: "Time words",
    shortDesc: "Clock and schedule vocabulary in Hebrew.",
    category: "Bet+",
    emoji: "⏰",
    anchor: "#time",
    hasPracticeDrill: true,
  },
};

const TIER1_ORDER = ["cards", "listen", "grammar", "price"] as const;
const TIER2_ORDER = ["ordinal", "days", "time"] as const;

function sortNumbersByLastOpened(
  items: NumbersHubCarouselItem[],
  progress: LearnProgressState,
): NumbersHubCarouselItem[] {
  const t = progress.numbersCarouselLastOpenedAt ?? {};
  return [...items]
    .map((it, i) => ({ it, i }))
    .sort((a, b) => {
      const diff = (t[b.it.id] ?? 0) - (t[a.it.id] ?? 0);
      if (diff !== 0) return diff;
      return a.i - b.i;
    })
    .map(({ it }) => it);
}

/**
 * Hub tiles unlocked after Aleph Numbers (1-nums); ordinals/days/time after Bet work begins.
 */
export function buildProgressMirroredNumbersItems(
  progress: LearnProgressState,
): NumbersHubCarouselItem[] {
  const c = progress.completedSections;
  const tier1 = !!c["1-nums"];
  const tier2 = isNumbersTier2Unlocked(progress);
  const out: NumbersHubCarouselItem[] = [];
  if (tier1) {
    for (const id of TIER1_ORDER) {
      const m = META[id];
      if (m) out.push({ id, ...m });
    }
  }
  if (tier2) {
    for (const id of TIER2_ORDER) {
      const m = META[id];
      if (m) out.push({ id, ...m });
    }
  }
  return sortNumbersByLastOpened(out, progress);
}
