export type RabbiTip = {
  title: string;
  lines: string[];
  cta?: { label: string; href: string };
};

/** Short scripted guidance by route (expand during migration). */
export function getRabbiTip(pathname: string): RabbiTip {
  if (pathname === "/") {
    return {
      title: "Start here",
      lines: [
        "Use Learn for the leveled path (Aleph–Dalet). Progress saves in this browser.",
        "Roots opens the shoresh hub from the home grid or main menu; Numbers has ordinals, days, and listen drills. Install the PWA for shortcuts.",
        "Optional: Developer → Display name shows under עִבְרִית in the header (local only).",
        "Study suggests your next section; Reading lists stories + Aleph guided read; Library opens curated external sites.",
      ],
      cta: { label: "Open Learn", href: "/learn" },
    };
  }
  if (pathname.startsWith("/learn/alphabet")) {
    return {
      title: "Alphabet track",
      lines: [
        "Trace each print letter and each sofit form (or use “Mark as practiced” for accessibility), then finish the final: six traces + twelve sound questions.",
        "You can skip the whole track or simulate completion from Developer.",
        "The main course path still starts at Alef–Dalet on the Learn home.",
      ],
      cta: { label: "Learn home", href: "/learn" },
    };
  }
  if (pathname.startsWith("/learn/foundation-exit")) {
    return {
      title: "Foundation exit",
      lines: [
        "Three strands — reading, grammar, lexicon — each has twelve MCQs; 90% or higher marks that strand passed.",
        "Simulate pass / clear remain for testing; production will expand banks and add proctoring rules later.",
        "When all three show passed, the bridge unlocks (Learn → Bridge).",
      ],
      cta: { label: "Open bridge", href: "/learn/bridge" },
    };
  }
  if (pathname.startsWith("/learn/bridge")) {
    return {
      title: "Bridge",
      lines: [
        "After foundation exit (three strands at 90%), you get four short study units — read, practice, then mark each complete in order.",
        "The final checkpoint is twelve questions at about 75%; clearing completion in Developer resets units and the final pass.",
        "Text defaults without nikkud; toggle vowel points at the top when you want them.",
        "If this page is locked, pass reading, grammar, and lexicon on Foundation exit (or use Developer to simulate).",
      ],
      cta: { label: "Learn home", href: "/learn" },
    };
  }
  if (pathname.startsWith("/learn/fluency")) {
    return {
      title: "Fluency path",
      lines: [
        "One spine: foundation → exit → bridge → specialty tiers (modern + traditional) → optional Yiddish, with Study/Reading/Roots alongside.",
        "Relearning is expected — badges keep your place; drills are there to revisit.",
        "Traditional tracks cover Talmudic / rabbinic Hebrew and Jewish Babylonian Aramaic lemmas in the same tier format as modern tracks.",
      ],
      cta: { label: "Specialty tracks", href: "/learn/tracks" },
    };
  }
  if (pathname.startsWith("/learn/tracks")) {
    return {
      title: "Specialty tracks",
      lines: [
        "Modern tracks (news, literature, spoken) and traditional tracks (Talmudic / Aramaic) — Bronze → Silver → Gold. Requires foundation exit (all three strands) and a passed bridge final.",
        "Tiers unlock in order on each track; pass the score bar to earn the badge (see Progress).",
        "Next up can deep-link the first incomplete tier once you are eligible.",
      ],
      cta: { label: "Progress", href: "/progress" },
    };
  }
  if (pathname.startsWith("/learn/yiddish")) {
    return {
      title: "ייִדיש course",
      lines: [
        "Parallel track: progress lives under its own storage key, separate from Alef–Dalet.",
        "Sections unlock in order; reach the pass line on the MCQ run to mark a section complete.",
        "Practice answers still count toward your main streak and MCQ totals.",
      ],
      cta: { label: "Learn home", href: "/learn" },
    };
  }
  if (pathname.startsWith("/learn")) {
    return {
      title: "Inside Learn",
      lines: [
        "Alef–Dalet is the foundation track: drills use a focused lemma set per level; big dictionary counts are for lookup, not a memorization quota.",
        "Sections unlock in order. Do the mini-quiz when you see it, then mark complete to move on.",
        "Reading comprehension sections show a full Hebrew passage + questions (ported from the legacy HTML).",
        "Aleph: the first story sits in the section list after greetings & politeness. Bet–Dalet: a full-screen story link appears in the list after your first two subsections there — not at the very top.",
        "On the Learn home, each level row shows course prompts at lv≥2 (MCQs + legacy import) toward comprehension gates.",
        "Switch active level on the Learn home if you are reviewing a higher track.",
      ],
      cta: { label: "See Progress", href: "/progress" },
    };
  }
  if (pathname.startsWith("/study")) {
    return {
      title: "Review",
      lines: [
        "Suggested next follows your active level and unlocks; story links drill vocabulary without advancing the path.",
        "MCQ & comprehension first clicks add to your lifetime practice tally; Hebrew MCQ prompts also build word levels for unlock gates.",
        "The Word levels card sums lv≥2 lemmas; Progress has the per-level breakdown.",
        "Re-run quizzes anytime — only “Mark section complete” moves the course checklist.",
        "Moving devices: Developer has Learn JSON, Library saves JSON, and optional cloud backup (KV) for course progress.",
      ],
      cta: { label: "Learn home", href: "/learn" },
    };
  }
  if (pathname.startsWith("/reading")) {
    return {
      title: "Reading",
      lines: [
        "This hub lists level stories, Aleph guided read, and a carousel of JT passages, reading drills (RD), and Library saves.",
        "Tap underlined words where available; some rows open notes (e.g. Sefaria) or short quizzes.",
        "Saves you add on the Library page can appear here when they match the carousel filter.",
      ],
      cta: { label: "Library", href: "/library" },
    };
  }
  if (pathname.startsWith("/numbers")) {
    return {
      title: "Numbers",
      lines: [
        "Listen-and-pick covers 0–10 cardinals; topic quizzes match the legacy tab for ordinals, weekdays, and time units.",
        "The price card rotates sample shekel amounts; full 11–100 cardinals stay in the HTML file until the corpus migrates.",
        "Practice here counts toward your MCQ streak and lifetime tally the same as Learn drills.",
      ],
      cta: { label: "Aleph numbers section", href: "/learn/1/1-nums" },
    };
  }
  if (pathname.startsWith("/roots")) {
    return {
      title: "Roots",
      lines: [
        "Each family groups forms built from the same three-letter root (shoresh).",
        "Drill asks for the English gloss of a Hebrew form; three correct hits per form matches the legacy “solid” bar.",
        "Study expands tiers (core verbs → derivatives) with example sentences where we have them.",
        "The same explorer appears inside Bet–Dalet roots course sections; this page is for quick access from the menu.",
      ],
      cta: { label: "Back to Learn", href: "/learn" },
    };
  }
  if (pathname.startsWith("/library")) {
    return {
      title: "Library",
      lines: [
        "Save Hebrew snippets at the top; you can merge from legacy ivrit_lib if you used the HTML app in this browser.",
        "Developer → Library saves JSON (anchor #dev-library-json) downloads or merges your Next app saves.",
        "External links open in a new tab; use search to filter both links and your saves.",
      ],
      cta: { label: "Back to Learn", href: "/learn" },
    };
  }
  if (pathname.startsWith("/progress")) {
    return {
      title: "Progress",
      lines: [
        "Counts reflect sections you marked complete in this Next app (not the legacy HTML file yet).",
        "Streak uses UTC days when you answer a Learn drill or mark a section complete.",
        "Backup or move devices: Developer → JSON file (download / merge / replace). Optional: same page → Cloud backup (Vercel KV) when the server has KV linked.",
        "Legacy HTML: merge ivrit_lr in Developer, or export from Next and import there.",
      ],
      cta: { label: "Developer tools", href: "/developer#dev-cloud-backup" },
    };
  }
  if (pathname.startsWith("/developer")) {
    return {
      title: "Developer",
      lines: [
        "Developer mode: when the server has DEVELOPER_USERNAME, DEVELOPER_EMAIL, and DEVELOPER_SESSION_SECRET set, sign in below with that pair to unlock all Learn gates in this browser (HttpOnly cookie).",
        "Reset storage to test onboarding; modal demo exercises the shared shell.",
        "JSON backup downloads Learn progress; merge unions completions and keeps the higher active level.",
        "Library saves JSON: same page — download / merge / replace passages stored under hebrew-web-library-saved-v1.",
        "Cloud backup (Vercel KV): push / restore with a sync key when KV is configured on the deploy — see docs/cloud-progress.md.",
        "ivrit export builds ivrit_lr / ivrit_lv for the legacy HTML app — merge with existing legacy storage in this browser when present.",
        "Read docs/next-migration.md in the repo for the full checklist.",
      ],
      cta: { label: "Home", href: "/" },
    };
  }
  if (pathname.startsWith("/migration")) {
    return {
      title: "Migration roadmap",
      lines: [
        "This percentage is the full HTML → Next scope (weighted workstreams), not the shorter legacy parity checklist on Progress.",
        "Phases group foundation, learner surfaces, content engine, and platform tools; “suggested next” follows the order in source.",
        "When a slice ships, update statuses in lib/html-full-migration.ts so the bar stays honest.",
      ],
      cta: { label: "Open Learn", href: "/learn" },
    };
  }
  return {
    title: "Keep going",
    lines: [
      "Use the menu (top left) for Home, Learn, Study, Numbers, Roots, Library, Reading, Progress, Roadmap, Developer.",
      "Roadmap shows the full HTML → Next migration score; Progress shows the shorter legacy parity bar too.",
      "The Next up chip suggests your next Learn section when you are not on Home.",
    ],
    cta: { label: "Learn", href: "/learn" },
  };
}
