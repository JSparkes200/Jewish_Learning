/**
 * Weighted checklist: how close the Next app is to `hebrew-v8.2.html`.
 * Update statuses as features land — single source of truth for the % shown
 * in Progress + Developer.
 */

export type LegacyParityStatus = "done" | "partial" | "planned";

export type LegacyParityItem = {
  id: string;
  label: string;
  detail?: string;
  weight: number;
  status: LegacyParityStatus;
};

/** Weights sum to 100 for an easy “parity %”. */
export const LEGACY_PARITY_ITEMS: readonly LegacyParityItem[] = [
  {
    id: "shell",
    label: "App shell, navigation, modals, routes",
    weight: 10,
    status: "done",
  },
  {
    id: "learn-l1",
    label: "Learn — Aleph path (MCQ + structure)",
    weight: 12,
    status: "done",
  },
  {
    id: "learn-l234",
    label: "Learn — Bet–Dalet MCQ coverage",
    detail:
      "≥12 MCQ prompts per subsection (extras merged in code) + comprehension; legacy HTML still has larger corpus-driven pools",
    weight: 10,
    status: "done",
  },
  {
    id: "alphabet-track",
    label: "Alphabet & script (pre-foundation)",
    detail:
      "Full print Alef–Bet + sofit: trace pads, two-block lesson UI, final (6 traces + 12 sound MCQs); optional gate in Learn",
    weight: 4,
    status: "done",
  },
  {
    id: "comp-story",
    label: "Comprehension passages + level stories",
    weight: 10,
    status: "done",
  },
  {
    id: "special-tracks",
    label: "Reading, numbers, roots tracks",
    detail:
      "1-read + MCQ; `/reading` hub (RD carousel tap-to-hear + quizzes, stories, library); MCQ distractors via API + corpus; `/numbers` (0–100 cards + drills); level stories + quiz; `/roots` course pack + lexicon-derived families by level",
    weight: 8,
    status: "partial",
  },
  {
    id: "unlock-struct",
    label: "Unlock rules (ids, after, ordering)",
    weight: 6,
    status: "done",
  },
  {
    id: "unlock-mastery",
    label: "Per-word mastery + mastery-based gates",
    detail:
      "unlockMastered: max(subs done, course-list words vocabLevels≥2); MCQ + legacy ivrit_lr merge; Progress lists course lemmas + stars; corpus D extracted to web/data/corpus-d.ts — drills not yet corpus-driven; vocabLevels ride along in JSON + optional KV cloud sync",
    weight: 8,
    status: "partial",
  },
  {
    id: "progress-study",
    label: "Progress + Study surfaces",
    detail:
      "Study: review queue + practice grid (MC + fill live; other legacy game types not ported)",
    weight: 7,
    status: "done",
  },
  {
    id: "library",
    label: "Library / external study",
    detail:
      "Curated links (incl. Dicta EN, Reverso, Forvo, Ktiv) + search; saved passages + legacy ivrit_lib merge; Developer JSON download/merge/replace for `hebrew-web-library-saved-v1`; `/reading` carousel includes JT + RD + saves",
    weight: 5,
    status: "partial",
  },
  {
    id: "rabbi",
    label: "Rabbi tips / Ask the Rabbi (AI + legacy quick prompts)",
    detail:
      "Route tips in rabbi-tips.ts; modal RabbiCard calls /api/rabbi with optional learner follow-up (Meaning/Root/Grammar/Example parity with legacy HTML). Word-detail enrichment is Clerk-gated.",
    weight: 4,
    status: "done",
  },
  {
    id: "pwa",
    label: "PWA (manifest, icons, prod service worker)",
    weight: 6,
    status: "done",
  },
  {
    id: "next-up",
    label: "Next up, home continue strip, learn flow polish",
    weight: 5,
    status: "done",
  },
  {
    id: "storage",
    label: "Storage bridge with legacy HTML",
    detail:
      "Round-trip via Developer: merge ivrit_lr (scoped keys) → Next; ivrit export with targetStorageKey → HTML; JSON file backup; optional Vercel KV cloud backup (Bearer sync key, /api/progress) when KV is configured",
    weight: 5,
    status: "done",
  },
] as const;

function pointsForItem(item: LegacyParityItem): number {
  switch (item.status) {
    case "done":
      return item.weight;
    case "partial":
      return Math.round(item.weight / 2);
    case "planned":
      return 0;
    default:
      return 0;
  }
}

export type LegacyParityRow = LegacyParityItem & {
  earned: number;
};

export function computeLegacyParity(): {
  max: number;
  earned: number;
  percent: number;
  rows: LegacyParityRow[];
} {
  const max = LEGACY_PARITY_ITEMS.reduce((s, i) => s + i.weight, 0);
  const rows: LegacyParityRow[] = LEGACY_PARITY_ITEMS.map((i) => ({
    ...i,
    earned: pointsForItem(i),
  }));
  const earned = rows.reduce((s, r) => s + r.earned, 0);
  const percent = max ? Math.round((earned / max) * 100) : 0;
  return { max, earned, percent, rows };
}

export function legacyParityStatusLabel(status: LegacyParityStatus): string {
  switch (status) {
    case "done":
      return "Shipped";
    case "partial":
      return "Partial";
    case "planned":
      return "Not yet";
    default:
      return status;
  }
}
