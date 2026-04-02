"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { CoverFlowCarousel } from "@/components/CoverFlowCarousel";

type HubSlide = {
  href: string;
  title: string;
  emoji: string;
  desc: string;
  category: string;
};

const SLIDES: readonly HubSlide[] = [
  {
    href: "/learn",
    title: "Learn",
    emoji: "📚",
    desc: "Foundation Alef–Dalet, exit, bridge, and specialty tracks.",
    category: "Course",
  },
  {
    href: "/study",
    title: "Study",
    emoji: "🔁",
    desc: "Next section, review queue, and practice games.",
    category: "Review",
  },
  {
    href: "/reading",
    title: "Reading",
    emoji: "📖",
    desc: "Passages, level stories, and library saves.",
    category: "Practice",
  },
  {
    href: "/numbers",
    title: "Numbers",
    emoji: "🔢",
    desc: "Cardinals, ordinals, days, time, and listen drills.",
    category: "Practice",
  },
  {
    href: "/roots",
    title: "Roots",
    emoji: "🌿",
    desc: "Shoresh families and graduated root drill.",
    category: "Practice",
  },
  {
    href: "/library",
    title: "Library",
    emoji: "📜",
    desc: "Curated links and saved Hebrew clips.",
    category: "Resources",
  },
  {
    href: "/progress",
    title: "Progress",
    emoji: "📊",
    desc: "Badges, streak, and course snapshot.",
    category: "Snapshot",
  },
  {
    href: "/learn/yiddish",
    title: "Yiddish",
    emoji: "ײַ",
    desc: "Parallel track with its own save slot.",
    category: "Course",
  },
];

/**
 * Same 3D cover flow as Reading / Learn journey / Numbers — center opens hub.
 */
export function HomeHubCarousel() {
  const router = useRouter();

  const items = useMemo(
    () =>
      SLIDES.map((s) => ({
        key: s.href,
        label: s.title,
        desc: s.desc,
        category: s.category,
        emoji: s.emoji,
      })),
    [],
  );

  const onActivateCenter = useCallback(
    (idx: number) => {
      const s = SLIDES[idx];
      if (s) router.push(s.href);
    },
    [router],
  );

  return (
    <section className="w-full">
      <CoverFlowCarousel
        variant="minimal"
        items={items}
        onActivateCenter={onActivateCenter}
        centerActionLabel="Open hub →"
        prevAriaLabel="Previous hub"
        nextAriaLabel="Next hub"
      />
    </section>
  );
}
