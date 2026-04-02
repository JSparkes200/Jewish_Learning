/**
 * Reading hub entries — links into Learn, stories, Library.
 * Built-in `RD` tap-to-hear carousel lives in `ReadingTapCarousel` + `reading-passages-rd.ts`.
 */

export type ReadingHubEntry = {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: string;
  /** Soft hint: show “later” styling when learner active level is below this */
  minLevel: 1 | 2 | 3 | 4;
  borderClass: string;
};

export const READING_HUB_ENTRIES: readonly ReadingHubEntry[] = [
  {
    id: "aleph-read",
    label: "Aleph — guided reading",
    description: "Story + vocabulary MCQs (course section 1-read).",
    href: "/learn/1/1-read",
    icon: "📖",
    minLevel: 1,
    borderClass: "border-sage/35 border-t-sage/50",
  },
  {
    id: "story-1",
    label: "Level 1 — story & mini-quiz",
    description: "Short narrative track with a mini-quiz at the end.",
    href: "/learn/1/story",
    icon: "📚",
    minLevel: 1,
    borderClass: "border-rust/30 border-t-rust/45",
  },
  {
    id: "story-2",
    label: "Level 2 — story & mini-quiz",
    description: "Opens from the level list after your first two Bet subsections (or jump here anytime).",
    href: "/learn/2/story",
    icon: "📚",
    minLevel: 2,
    borderClass: "border-amber/35 border-t-amber/50",
  },
  {
    id: "story-3",
    label: "Level 3 — story & mini-quiz",
    description: "Opens from the level list after your first two Gimel subsections (or jump here anytime).",
    href: "/learn/3/story",
    icon: "📚",
    minLevel: 3,
    borderClass: "border-burg/30 border-t-burg/45",
  },
  {
    id: "story-4",
    label: "Level 4 — story & mini-quiz",
    description: "Opens from the level list after your first two Dalet subsections (or jump here anytime).",
    href: "/learn/4/story",
    icon: "📚",
    minLevel: 4,
    borderClass: "border-ink/20 border-t-sage/40",
  },
  {
    id: "library",
    label: "Library — saved passages",
    description: "Your snippets and curated external links.",
    href: "/library",
    icon: "📜",
    minLevel: 1,
    borderClass: "border-burg/25 border-t-burg/40",
  },
];
