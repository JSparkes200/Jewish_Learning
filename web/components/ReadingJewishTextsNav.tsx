"use client";

import { unlockedJtCategoriesInOrder } from "@/lib/reading-jt-category-nav";
import type { LearnProgressState } from "@/lib/learn-progress";
import { READING_PASSAGES_JT } from "@/data/reading-passages-jt";

type Props = {
  progress: LearnProgressState;
  /** `null` = show all passages in carousel order (no category focus). */
  selectedCategory: string | null;
  onSelectCategory: (cat: string | null) => void;
};

/** Horizontal category chips — mirrors legacy `rTexts` / Jewish Texts library strip. */
export function ReadingJewishTextsNav({
  progress,
  selectedCategory,
  onSelectCategory,
}: Props) {
  const cats = unlockedJtCategoriesInOrder(progress);
  if (cats.length === 0) return null;

  const colFor = (cat: string) =>
    READING_PASSAGES_JT.find((j) => j.cat === cat)?.col ?? "#8a6840";

  return (
    <div className="space-y-2">
      <p className="font-label text-[9px] uppercase tracking-[0.18em] text-ink-muted">
        Jewish texts by category
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button
          type="button"
          onClick={() => onSelectCategory(null)}
          className={`shrink-0 rounded-full border px-3 py-1.5 font-label text-[8px] uppercase tracking-wider transition ${
            selectedCategory == null
              ? "border-sage bg-sage/15 text-sage"
              : "border-ink/15 bg-transparent text-ink-muted hover:border-ink/25"
          }`}
        >
          All
        </button>
        {cats.map((cat) => {
          const active = selectedCategory === cat;
          const col = colFor(cat);
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(active ? null : cat)}
              className={`shrink-0 rounded-full border px-3 py-1.5 font-label text-[8px] uppercase tracking-wider transition ${
                active
                  ? ""
                  : "border-ink/15 bg-transparent text-ink-muted hover:border-ink/25"
              }`}
              style={
                active
                  ? {
                      borderColor: col,
                      color: col,
                      backgroundColor: `${col}1a`,
                    }
                  : undefined
              }
            >
              {cat}
            </button>
          );
        })}
      </div>
      <p className="text-[10px] leading-snug text-ink-faint">
        Tap a category to jump the carousel to the first unlocked passage in that
        track (same idea as the legacy Texts page). Choose All to browse everything
        again.
      </p>
    </div>
  );
}
