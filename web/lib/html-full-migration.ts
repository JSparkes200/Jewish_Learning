/**
 * Full-scope migration tracker: `hebrew-v8.2.html` → Next (`web/`).
 *
 * **Different from** `legacy-parity.ts`, which scores a smaller “product parity”
 * checklist. This map is organized by **legacy routes / subsystems** (see `go()`
 * in the HTML file) and is meant for **honest 1:1 migration planning**.
 *
 * Weights sum to **100**. Update `status` as work lands (`done` | `partial` |
 * `not_started`). `partial` earns half points (rounded), same math as legacy parity.
 */

export type HtmlMigrationPhase = "foundation" | "learner" | "engine" | "platform";

export type HtmlMigrationStatus = "done" | "partial" | "not_started";

export type HtmlMigrationWorkstream = {
  id: string;
  phase: HtmlMigrationPhase;
  /** Short title */
  label: string;
  /** Legacy touchpoints (pages, data, or concepts) */
  legacyRef: string;
  /** Honest current state vs HTML */
  detail: string;
  /** Suggested order for future PRs (lower first) */
  suggestedOrder: number;
  weight: number;
  status: HtmlMigrationStatus;
};

export const HTML_MIGRATION_PHASE_LABELS: Record<
  HtmlMigrationPhase,
  { title: string; blurb: string }
> = {
  foundation: {
    title: "Foundation & shell",
    blurb: "Routing, chrome, PWA, and shared UX primitives.",
  },
  learner: {
    title: "Learner surfaces",
    blurb:
      "Tabs and flows users touch daily: course, study, reading, numbers, roots, library, progress.",
  },
  engine: {
    title: "Content engine",
    blurb:
      "Embedded dictionary `D`, section word pools, dynamic roots, grammar data — the HTML’s single-file corpus.",
  },
  platform: {
    title: "Platform & power tools",
    blurb: "Accounts, Rabbi/API, Developer poses & lexicon tooling.",
  },
};

/**
 * Single source of truth for the **full HTML migration** score.
 * Tweak `status` / `detail` when you ship a slice; keep weights stable unless
 * priorities change.
 */
export const HTML_FULL_MIGRATION_WORKSTREAMS: readonly HtmlMigrationWorkstream[] =
  [
    {
      id: "foundation-shell",
      phase: "foundation",
      label: "App shell, navigation, PWA",
      legacyRef: "Nav `go()`, modal host, standalone shell",
      detail:
        "Next: AppShell, hamburger IA, modals, /roots, manifest shortcuts, prod SW. Parity for primary navigation patterns.",
      suggestedOrder: 1,
      weight: 5,
      status: "done",
    },
    {
      id: "learn-course-path",
      phase: "learner",
      label: "Learn / course path & section drills",
      legacyRef: "`rLearn`, `openSection`, course modals, MCQ from pools",
      detail:
        "Subsections, MCQ packs, comprehension, stories, numbers, roots. MCQ distractors: `POST /api/mcq-choices` (server corpus + inline); client Learn bundle no longer ships `LEGACY_CORPUS_D`.",
      suggestedOrder: 2,
      weight: 20,
      status: "partial",
    },
    {
      id: "study-review-hub",
      phase: "learner",
      label: "Study / practice / review queue",
      legacyRef: "`rReviewHub`, `rPractice`, `rReview`, `learner.rq`, `gt` games",
      detail:
        "Study hub: streak, next-up, MCQ tallies, review queue, practice grid — MC + fill-in modals (corpus pool); tap/match/trans/img/gram still HTML-only. Optional: `gt` stats strip per mode.",
      suggestedOrder: 4,
      weight: 10,
      status: "partial",
    },
    {
      id: "reading-carousel",
      phase: "learner",
      label: "Reading tab & read carousel",
      legacyRef: "`rReading`, `rRead`, JT/RD + library carousel",
      detail:
        "`/reading` hub: Aleph 1-read, L1–L4 stories, Library, comp note; carousel = `JT` + level-filtered `RD` + library, tap words, notes/Sefaria on JT, `RD` tq/wq quizzes.",
      suggestedOrder: 5,
      weight: 8,
      status: "partial",
    },
    {
      id: "numbers-tab",
      phase: "learner",
      label: "Numbers tab (full)",
      legacyRef: "`rNumbers`, course numbers modal",
      detail:
        "Next: `/numbers` hub — browse cards 0–100 (legacy `NUMS`), listen 0–10, ordinal/day/time MCQs, price peek, gender note; Learn `1-nums` MCQs. Optional later: horizontal swipe carousel UX, full `NUMS` months in hub.",
      suggestedOrder: 6,
      weight: 4,
      status: "partial",
    },
    {
      id: "roots-dynamic",
      phase: "learner",
      label: "Roots tab + dict-derived families",
      legacyRef: "`rRoots`, `getRootsForLevel`, `ROOTS` + `D` merge",
      detail:
        "Next: static `ROOTS` families + graduated drill + course MCQ. `/roots` Lexicon mode uses `getDynamicCourseRootFamiliesForLevel` (same rule as legacy `getRootsForLevel`). Course pack remains the curated `ROOTS` list.",
      suggestedOrder: 7,
      weight: 7,
      status: "partial",
    },
    {
      id: "library-saved",
      phase: "learner",
      label: "Library & saved passages",
      legacyRef: "`rLibrary`, `rSaved`, `ivrit_lib`",
      detail:
        "Next: curated links, search, saved passages, legacy library merge, Developer JSON export/merge/replace for saves. Missing: legacy reading integrations, richer row metadata from HTML.",
      suggestedOrder: 8,
      weight: 6,
      status: "partial",
    },
    {
      id: "progress-dashboard",
      phase: "learner",
      label: "Progress / dashboard",
      legacyRef: "`rDash`, completion widgets, mastery summaries",
      detail:
        "Progress + Study: course mastery, root drill, specialty badge grid (post-bridge), Yiddish section counts, legacy parity + roadmap. Missing: full `rDash` widget parity.",
      suggestedOrder: 3,
      weight: 6,
      status: "partial",
    },
    {
      id: "post-foundation-specialty",
      phase: "learner",
      label: "Post-foundation: exit, bridge, specialty tiers",
      legacyRef: "N/A in single HTML (new product slice)",
      detail:
        "Foundation exit (3 strands), bridge module, specialty MCQ tracks: modern (news / literature / spoken) + traditional (Talmudic / rabbinic Hebrew, Jewish Babylonian Aramaic), Bronze–Gold, `/learn/fluency` overview, gating + Progress badges. Next: reading-heavy Gold, more domains (Rashi, etc.).",
      suggestedOrder: 3,
      weight: 2,
      status: "partial",
    },
    {
      id: "yiddish-parallel-track",
      phase: "learner",
      label: "Yiddish parallel course",
      legacyRef: "N/A in legacy HTML",
      detail:
        "`/learn/yiddish` linear sections + MCQs, separate storage; counts toward streak via main Learn save; included in Developer JSON v2 backup.",
      suggestedOrder: 3,
      weight: 1,
      status: "partial",
    },
    {
      id: "corpus-d",
      phase: "engine",
      label: "Dictionary corpus `D` & pools",
      legacyRef: "`D` array, `getSectionPool`, mastery on full lemmas",
      detail:
        "Lexicon in `web/data/corpus-d.ts`; `buildMcqEnglishChoices` pulls wrong options from `D` (level-aware) with inline fallback. Section word pools still TS-authored vs legacy `getSectionPool`.",
      suggestedOrder: 10,
      weight: 10,
      status: "partial",
    },
    {
      id: "grammar-gram",
      phase: "engine",
      label: "Grammar exercise sets (`GRAM`)",
      legacyRef: "`GRAM` exercises in HTML",
      detail:
        "Not in Next as first-class drills; some grammar touched via MCQ themes only.",
      suggestedOrder: 11,
      weight: 5,
      status: "not_started",
    },
    {
      id: "auth-accounts",
      phase: "platform",
      label: "Auth, sessions, scoped storage",
      legacyRef: "`authIsLoggedIn`, `ivrit_session_v1`, scoped `ivrit_lr__user`",
      detail:
        "Next app is local-first guest mode; optional KV `/api/progress` sync (Bearer sync key) is not accounts. Legacy usernames, login UI, and server-backed flows not replicated.",
      suggestedOrder: 9,
      weight: 8,
      status: "not_started",
    },
    {
      id: "rabbi-ai",
      phase: "platform",
      label: "Ask the Rabbi (full)",
      legacyRef: "Rabbi modal, OpenAI / API, exercise context",
      detail:
        "Next: route-based Rabbi tips. Missing: legacy word/sentence Rabbi with API keys, streaming, and HTML parity prompts.",
      suggestedOrder: 12,
      weight: 7,
      status: "partial",
    },
    {
      id: "developer-poses",
      phase: "platform",
      label: "Developer: poses, lexicon edits, design lab",
      legacyRef: "`rDeveloper`, `rPoses`, master edits, design preview",
      detail:
        "Developer: Learn+Yiddish JSON v2 backup/merge, Library saves JSON, legacy merges, ivrit export, optional KV cloud backup. Missing: pose animator, lexicon master edits, page design simulator from HTML.",
      suggestedOrder: 13,
      weight: 1,
      status: "partial",
    },
  ] as const;

function pointsForStatus(
  weight: number,
  status: HtmlMigrationStatus,
): number {
  switch (status) {
    case "done":
      return weight;
    case "partial":
      return Math.round(weight / 2);
    case "not_started":
      return 0;
    default:
      return 0;
  }
}

export type HtmlMigrationRow = HtmlMigrationWorkstream & {
  earned: number;
};

export function computeHtmlFullMigration(): {
  max: number;
  earned: number;
  percent: number;
  rows: HtmlMigrationRow[];
  byPhase: Record<
    HtmlMigrationPhase,
    { max: number; earned: number; percent: number }
  >;
} {
  const max = HTML_FULL_MIGRATION_WORKSTREAMS.reduce((s, w) => s + w.weight, 0);
  const rows: HtmlMigrationRow[] = HTML_FULL_MIGRATION_WORKSTREAMS.map((w) => ({
    ...w,
    earned: pointsForStatus(w.weight, w.status),
  }));
  const earned = rows.reduce((s, r) => s + r.earned, 0);
  const percent = max ? Math.round((earned / max) * 100) : 0;

  const phases: HtmlMigrationPhase[] = [
    "foundation",
    "learner",
    "engine",
    "platform",
  ];
  const byPhase = {} as Record<
    HtmlMigrationPhase,
    { max: number; earned: number; percent: number }
  >;
  for (const p of phases) {
    const inPhase = rows.filter((r) => r.phase === p);
    const pm = inPhase.reduce((s, r) => s + r.weight, 0);
    const pe = inPhase.reduce((s, r) => s + r.earned, 0);
    byPhase[p] = {
      max: pm,
      earned: pe,
      percent: pm ? Math.round((pe / pm) * 100) : 0,
    };
  }

  return { max, earned, percent, rows, byPhase };
}

export function htmlMigrationStatusLabel(status: HtmlMigrationStatus): string {
  switch (status) {
    case "done":
      return "Migrated";
    case "partial":
      return "In progress";
    case "not_started":
      return "Not started";
    default:
      return status;
  }
}

/** Recommended next workstreams by `suggestedOrder`, unfinished first. */
export function recommendedNextWorkstreams(
  limit = 4,
): readonly HtmlMigrationWorkstream[] {
  const open = HTML_FULL_MIGRATION_WORKSTREAMS.filter(
    (w) => w.status !== "done",
  );
  return [...open]
    .sort((a, b) => a.suggestedOrder - b.suggestedOrder)
    .slice(0, limit);
}
