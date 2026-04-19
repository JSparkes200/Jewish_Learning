export type HubSlide = {
  href: string;
  title: string;
  emoji: string;
  desc: string;
  category: string;
};

/** Primary navigation hubs — used by home column wheel and header mezuzah (replaces hamburger). */
export const HUB_SLIDES: readonly HubSlide[] = [
  {
    href: "/",
    title: "Home",
    emoji: "🏠",
    desc: "Course hub, weekly parsha, and your scroll of progress.",
    category: "Start",
  },
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
  {
    href: "/settings",
    title: "Settings",
    emoji: "⚙️",
    desc: "Account, profile, and preferences.",
    category: "Account",
  },
];
