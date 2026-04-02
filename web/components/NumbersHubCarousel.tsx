"use client";

import Link from "next/link";
import { useCallback, useMemo } from "react";
import { CoverFlowCarousel } from "@/components/CoverFlowCarousel";
import { buildProgressMirroredNumbersItems } from "@/lib/numbers-carousel";
import {
  loadLearnProgress,
  saveLearnProgress,
  touchNumbersCarouselHub,
  type LearnProgressState,
} from "@/lib/learn-progress";

function clipDesc(s: string, max = 120): string {
  const t = s.trim().replace(/\s+/g, " ");
  if (!t) return "Tap to jump to this topic on the page.";
  return t.length <= max ? t : `${t.slice(0, max - 1).trim()}…`;
}

export function NumbersHubCarousel({
  progress,
}: {
  progress: LearnProgressState;
}) {
  const items = useMemo(
    () => buildProgressMirroredNumbersItems(progress),
    [progress],
  );

  const coverItems = useMemo(() => {
    const engaged = progress.numbersDrillEngaged ?? {};
    return items.map((it) => ({
      key: it.id,
      label: it.label,
      desc: clipDesc(it.shortDesc),
      category: it.category,
      emoji: it.emoji,
      badgeDot: it.hasPracticeDrill && !engaged[it.id],
    }));
  }, [items, progress.numbersDrillEngaged]);

  const onActivateCenter = useCallback(
    (idx: number) => {
      const it = items[idx];
      if (!it) return;
      const cur = loadLearnProgress();
      saveLearnProgress(touchNumbersCarouselHub(cur, it.id));
      const id = it.anchor.replace(/^#/, "");
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    },
    [items],
  );

  return (
    <CoverFlowCarousel
      key={`${progress.activeLevel}-${items.length}-${Object.keys(progress.numbersDrillEngaged ?? {}).length}-${Object.keys(progress.numbersCarouselLastOpenedAt ?? {}).length}`}
      variant="minimal"
      items={coverItems}
      onActivateCenter={onActivateCenter}
      centerActionLabel="Jump to section →"
      prevAriaLabel="Previous topic"
      nextAriaLabel="Next topic"
      emptySlot={
        items.length === 0 ? (
          <>
            <p className="font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
              Your numbers shelf
            </p>
            <p className="mt-2 text-sm text-ink-muted">
              Tiles appear here after you complete{" "}
              <strong className="text-ink">Alef — Numbers (1-nums)</strong> in
              Learn. Ordinals, days, and time unlock when you start working in
              Bet (any two subsections completed there).
            </p>
            <Link
              href="/learn/1/1-nums"
              className="btn-elevated-primary mt-4 inline-flex no-underline"
            >
              Open Numbers in Learn →
            </Link>
          </>
        ) : undefined
      }
    />
  );
}
