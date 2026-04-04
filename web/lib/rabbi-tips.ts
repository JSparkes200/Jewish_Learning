export type RabbiTip = {
  title: string;
  lines: string[];
  cta?: { label: string; href: string };
};

/** Short scripted guidance by route. */
export function getRabbiTip(pathname: string): RabbiTip {
  if (pathname === "/") {
    return {
      title: "Start here",
      lines: [
        "Use Learn for the leveled path (Aleph–Dalet). Progress saves in this browser.",
        "Roots opens the shoresh hub from the home grid or main menu; Numbers has ordinals, days, and listen drills. Install the PWA for shortcuts.",
        "Optional: Advanced → Developer lets you set a display name under עִבְרִית in the header (local only).",
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
  if (pathname.startsWith("/learn/tracks")) {
    return {
      title: "Specialty tracks",
      lines: [
        "Modern tracks (news, literature, spoken) and traditional tracks (Talmudic / Aramaic) — Bronze → Silver → Gold. Requires foundation exit (all three strands) and a passed bridge final.",
        "Tiers unlock in order on each track; pass the score bar to earn the badge (see Progress).",
        "Each card lists outcomes and cross-links (Reading, Study, Library, Numbers) so MCQs are not your only reps — especially for literature, listening, and sugya reading.",
        "Progress shows every tier checkmark; open the next open tier from there or from this hub.",
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
        "The journey carousel runs Alef–Dalet, foundation exit, bridge, then each specialty track. Open the center card for unlock rules and links — muted cards are gated.",
        "Tap the “i” circle under the carousel for the full path overview (goals and how stages connect).",
        "Alef–Dalet drills use a focused lemma set per level; big dictionary counts are lookup scope, not a memorization quota.",
        "Sections unlock in order inside each level; reading comprehension uses a full passage plus questions.",
        "Aleph: first story after greetings & politeness. Bet–Dalet: story link after your first two subsections there.",
        "Expand Progress controls on Learn home to change active level (or use Developer bypass to unlock all foundation levels in the carousel).",
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
        "Moving devices: Advanced → Developer has Learn JSON, Library saves JSON, and optional cloud backup when your server is set up for it.",
      ],
      cta: { label: "Learn home", href: "/learn" },
    };
  }
  if (pathname.startsWith("/reading")) {
    return {
      title: "Reading",
      lines: [
        "The carousel lists passages you’ve unlocked in the course; Jewish texts unlock one after another as you open each. Drag or use arrows, then open the center card.",
        "Below it, rows jump to Aleph guided reading, each level’s story, and Library. Tap the “i” circle for progress and exercises. Esc closes that help panel.",
        "Tap underlined words in a passage where available; some rows open notes (e.g. Sefaria) or short quizzes.",
      ],
      cta: { label: "Library", href: "/library" },
    };
  }
  if (pathname.startsWith("/numbers")) {
    return {
      title: "Numbers",
      lines: [
        "Listen-and-pick covers 0–10 cardinals; topic quizzes cover ordinals, weekdays, and time units.",
        "The price card rotates sample shekel amounts; higher cardinals continue to grow in the course and hub.",
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
        "Drill asks for the English gloss of the Hebrew form; three correct hits per form marks it solid.",
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
        "Save Hebrew snippets at the top; you can import older passages stored in this browser from a previous study page.",
        "Use translation for a gloss and the separate note field for private reminders (source, deck, etc.).",
        "Advanced → Developer → Library saves JSON downloads or merges your saves.",
        "External links open in a new tab; use search to filter both links and your saves.",
      ],
      cta: { label: "Back to Learn", href: "/learn" },
    };
  }
  if (pathname.startsWith("/settings")) {
    return {
      title: "Settings",
      lines: [
        "Display name is local to this browser — useful for a little identity in the header.",
        "There is no product username/password screen here by default; legacy HTML used ivrit_session and scoped keys.",
        "Developer session (when configured) is for builders testing gates, not learner accounts.",
        "Optional cloud backup uses an anonymous sync key — see Developer → Cloud backup when KV is enabled.",
      ],
      cta: { label: "Developer tools", href: "/developer" },
    };
  }
  if (pathname.startsWith("/progress")) {
    return {
      title: "Progress",
      lines: [
        "Counts reflect sections you marked complete in this app.",
        "Streak uses UTC days when you answer a Learn drill or mark a section complete.",
        "Specialty badges list aims, cross-links (Reading, Study, Library…), and a Next: link per track when the bridge is cleared — tiers are MCQ checkpoints, not the whole skill picture.",
        "Backup or move devices: Advanced → Developer → JSON file (download / merge / replace). Optional cloud backup when your deploy supports it.",
      ],
      cta: { label: "Developer tools", href: "/developer/tools#dev-cloud-backup" },
    };
  }
  if (pathname.startsWith("/developer")) {
    return {
      title: "Developer",
      lines: [
        "Sign in on this page when the server has DEVELOPER_USERNAME, DEVELOPER_EMAIL, and DEVELOPER_SESSION_SECRET — that unlocks Learn gates in this browser (HttpOnly cookie).",
        "Full backups, imports, corpus tools, and the modal demo live under Developer → Open developer tools (/developer/tools). In production, that route requires the same dev session when those env vars are set.",
        "JSON backup downloads Learn progress; merge unions completions and keeps the higher active level.",
        "Library saves JSON: download / merge / replace passages stored for this app.",
        "Cloud backup: push / restore with a sync key when your host has KV configured — see docs/cloud-progress.md in the repo.",
        "You can export data in a format an older single-page study file understands — merge carefully in that browser if you still use it.",
      ],
      cta: { label: "Home", href: "/" },
    };
  }
  if (pathname.startsWith("/migration")) {
    return {
      title: "Migration roadmap",
      lines: [
        "Internal checklist for builders: how much of the old single-file app is represented here.",
        "Phases group foundation, learner surfaces, content engine, and platform tools; “suggested next” follows the order in source.",
        "Update statuses in lib/html-full-migration.ts when you ship a slice — learners do not see this page in the menu.",
      ],
      cta: { label: "Open Learn", href: "/learn" },
    };
  }
  return {
    title: "Keep going",
    lines: [
      "Use the menu (top left) for Home, Learn, Progress, then Practice & resources (Study, Reading, Numbers, Roots, Library, Yiddish).",
      "Advanced → Developer is only for backups, imports, and builder tools.",
      "The Next up chip suggests your next Learn section when you are not on Home.",
    ],
    cta: { label: "Learn", href: "/learn" },
  };
}
