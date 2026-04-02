/**
 * Reading hub carousel: which passages appear is driven by course progress and
 * opens (see {@link buildProgressMirroredReadingItems}).
 */

import {
  READING_PASSAGES_JT,
  type ReadingPassageJt,
} from "@/data/reading-passages-jt";
import {
  READING_PASSAGES_RD,
  type ReadingPassageRd,
  type ReadingPassageTq,
  type ReadingPassageWq,
} from "@/data/reading-passages-rd";
import type { LearnProgressState } from "@/lib/learn-progress";
import type { SavedLibraryPassage } from "@/lib/library-saved";

export type ReadingCarouselItem = {
  id: string;
  label: string;
  icon: string;
  col: string;
  lv: number;
  src: string;
  h: string;
  e: string;
  vocab?: readonly { h: string; p: string; e: string }[];
  tq?: readonly ReadingPassageTq[];
  wq?: readonly ReadingPassageWq[];
  fromLib: boolean;
  note?: string;
  sefariaLink?: string;
};

function hasAnyCompletedInLevel(
  level: number,
  completed: Record<string, boolean>,
): boolean {
  const prefix = `${level}-`;
  return Object.keys(completed).some((id) => id.startsWith(prefix));
}

/** Jewish text slot `jt-{index}`: first after 1-read; each next after prior was opened. */
export function isJtCarouselUnlocked(
  index: number,
  progress: LearnProgressState,
): boolean {
  const rev = progress.readingCarouselRevealed ?? {};
  const id = `jt-${index}`;
  if (rev[id]) return true;
  if (!progress.completedSections["1-read"]) return false;
  if (index === 0) return true;
  return !!rev[`jt-${index - 1}`];
}

/** Course reading (`RD`) passage: unlock by level milestones + subsection work. */
export function isRdCarouselUnlocked(
  rd: Pick<ReadingPassageRd, "id" | "lv">,
  progress: LearnProgressState,
): boolean {
  const rev = progress.readingCarouselRevealed ?? {};
  if (rev[rd.id]) return true;
  const c = progress.completedSections;
  const lv = rd.lv;
  if (lv <= 1) return !!c["1-read"];
  if (lv === 2) {
    return progress.activeLevel >= 2 && hasAnyCompletedInLevel(2, c);
  }
  if (lv === 3) {
    return progress.activeLevel >= 3 && hasAnyCompletedInLevel(3, c);
  }
  if (lv === 4) {
    return progress.activeLevel >= 4 && hasAnyCompletedInLevel(4, c);
  }
  return false;
}

function jtToItem(jt: ReadingPassageJt, index: number): ReadingCarouselItem {
  return {
    id: `jt-${index}`,
    label: jt.src,
    icon: "📜",
    col: jt.col,
    lv: 1,
    src: jt.cat,
    h: jt.h,
    e: jt.e,
    vocab: jt.vocab,
    note: jt.note,
    sefariaLink: jt.sefariaLink,
    fromLib: false,
  };
}

function rdToItem(r: ReadingPassageRd): ReadingCarouselItem {
  return {
    id: r.id,
    label: r.label,
    icon: r.icon,
    col: r.col,
    lv: r.lv,
    src: r.src,
    h: r.h,
    e: r.e,
    vocab: r.vocab,
    tq: r.tq,
    wq: r.wq,
    fromLib: false,
  };
}

function savedToItem(s: SavedLibraryPassage): ReadingCarouselItem {
  return {
    id: s.id,
    label: s.title,
    icon: "📥",
    col: "#4a6830",
    lv: 1,
    src: "My library",
    h: s.he,
    e: s.en ?? "",
    fromLib: true,
  };
}

function sortReadingItemsByLastOpened(
  items: ReadingCarouselItem[],
  progress: LearnProgressState,
): ReadingCarouselItem[] {
  const t = progress.readingPassageLastOpenedAt ?? {};
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
 * Passages the learner may revisit: unlocked by course + prior JT opens; library
 * saves always included.
 */
export function buildProgressMirroredReadingItems(
  progress: LearnProgressState,
  saved: SavedLibraryPassage[],
): ReadingCarouselItem[] {
  const jt: ReadingCarouselItem[] = [];
  READING_PASSAGES_JT.forEach((row, i) => {
    if (isJtCarouselUnlocked(i, progress)) jt.push(jtToItem(row, i));
  });

  const rd: ReadingCarouselItem[] = [];
  for (const r of READING_PASSAGES_RD) {
    if (isRdCarouselUnlocked(r, progress)) rd.push(rdToItem(r));
  }

  const lib = saved.map(savedToItem);
  return sortReadingItemsByLastOpened([...jt, ...rd, ...lib], progress);
}
