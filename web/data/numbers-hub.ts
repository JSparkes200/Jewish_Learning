/**
 * Numbers hub — in-page anchors plus Learn entry for course MCQs.
 */

export type NumbersHubEntry = {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: string;
  /** Soft “later” styling when Bet tiles are not in the carousel yet */
  minLevel: 1 | 2;
  borderClass: string;
};

export const NUMBERS_HUB_ENTRIES: readonly NumbersHubEntry[] = [
  {
    id: "course-nums",
    label: "Alef — Numbers in Learn",
    description:
      "Course MCQs and the same listen drill, with progress tied to 1-nums.",
    href: "/learn/1/1-nums",
    icon: "📘",
    minLevel: 1,
    borderClass: "border-sage/35 border-t-sage/50",
  },
  {
    id: "cards",
    label: "0–100 cards",
    description: "Full cardinal grid with audio — legacy openNumCards parity.",
    href: "/numbers#cards",
    icon: "🃏",
    minLevel: 1,
    borderClass: "border-amber/35 border-t-amber/50",
  },
  {
    id: "listen",
    label: "Listen & pick (0–10)",
    description: "Spoken number, four Hebrew choices.",
    href: "/numbers#listen",
    icon: "◈",
    minLevel: 1,
    borderClass: "border-rust/30 border-t-rust/45",
  },
  {
    id: "ordinal",
    label: "Ordinals",
    description: "English position to Hebrew ordinal.",
    href: "/numbers#ordinal",
    icon: "1st",
    minLevel: 2,
    borderClass: "border-amber/30 border-t-amber/45",
  },
  {
    id: "days",
    label: "Days of the week",
    description: "Weekday in English → Hebrew.",
    href: "/numbers#days",
    icon: "📅",
    minLevel: 2,
    borderClass: "border-burg/30 border-t-burg/45",
  },
  {
    id: "time",
    label: "Time words",
    description: "Schedule and clock vocabulary.",
    href: "/numbers#time",
    icon: "⏰",
    minLevel: 2,
    borderClass: "border-sage/30 border-t-sage/45",
  },
  {
    id: "price",
    label: "Prices (peek)",
    description: "Shekel amounts with audio.",
    href: "/numbers#price",
    icon: "₪",
    minLevel: 1,
    borderClass: "border-sage/25 border-t-sage/40",
  },
  {
    id: "grammar",
    label: "Number gender note",
    description: "Why masculine/feminine forms pair with nouns the way they do.",
    href: "/numbers#grammar",
    icon: "📐",
    minLevel: 1,
    borderClass: "border-ink/15 border-t-ink/25",
  },
];
