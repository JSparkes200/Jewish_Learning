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
    desc: "Your leveled spine: Alef–Dalet, exit, bridge, then the specialty tracks.",
    category: "Course",
  },
  {
    href: "/study",
    title: "Study",
    emoji: "🔁",
    desc: "Suggested next, review queue, and the practice games you love to replay.",
    category: "Review",
  },
  {
    href: "/reading",
    title: "Reading",
    emoji: "📖",
    desc: "Passages you’ve unlocked, level stories, and what you’ve saved to Library.",
    category: "Practice",
  },
  {
    href: "/numbers",
    title: "Numbers",
    emoji: "🔢",
    desc: "Cardinals, ordinals, days, time — plus listen-and-tap in Hebrew.",
    category: "Practice",
  },
  {
    href: "/roots",
    title: "Roots",
    emoji: "🌿",
    desc: "Root families (שורשים) and the graduated drill that tracks each form.",
    category: "Practice",
  },
  {
    href: "/library",
    title: "Library",
    emoji: "📜",
    desc: "Curated links and the Hebrew lines you’ve clipped for yourself.",
    category: "Resources",
  },
  {
    href: "/progress",
    title: "Progress",
    emoji: "📊",
    desc: "Badges, streak, and the honest snapshot of where you stand.",
    category: "Snapshot",
  },
  {
    href: "/learn/yiddish",
    title: "Yiddish",
    emoji: "ײַ",
    desc: "A parallel track — its own save slot, same warm study habit.",
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
