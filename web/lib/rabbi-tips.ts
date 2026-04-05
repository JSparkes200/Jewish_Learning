export type RabbiTip = {
  title: string;
  lines: string[];
  cta?: { label: string; href: string };
};

/** Short scripted guidance by route — warm, clear, accurate (not halachic authority). */
export function getRabbiTip(pathname: string): RabbiTip {
  if (pathname === "/") {
    return {
      title: "Welcome in",
      lines: [
        "Your leveled path lives under Learn (Alef through Dalet); progress stays in this browser until you export it.",
        "Roots is your shoresh hub; Numbers holds ordinals, days, and listening reps. Add the PWA if you like shortcuts on your home screen.",
        "If you want your name under עִבְרִית in the header, you can set it locally in Settings (no cloud account required).",
        "Study nudges you toward the next open section; Reading gathers stories and guided Aleph reads; Library is your door to curated sites.",
      ],
      cta: { label: "Open Learn", href: "/learn" },
    };
  }
  if (pathname.startsWith("/learn/alphabet")) {
    return {
      title: "The letters",
      lines: [
        "You’ll meet each print letter and each sofit (final) form — trace with your finger or stylus, or mark practiced if tracing isn’t accessible.",
        "The final checkpoint asks for six traces plus twelve sound questions; you can skip the whole track from Developer if you’re already fluent in reading.",
        "The main Alef–Dalet story path still starts from Learn home; think of this track as tuning your eyes and hand.",
      ],
      cta: { label: "Learn home", href: "/learn" },
    };
  }
  if (pathname.startsWith("/learn/foundation-exit")) {
    return {
      title: "Before the bridge",
      lines: [
        "Three strands — reading, grammar, and lexicon — each ends in twelve multiple-choice questions; about nine in ten correct marks that strand passed.",
        "Developer can simulate a pass or clear what’s left when you’re testing the flow; live learners will see richer banks over time.",
        "When all three strands show passed, the bridge unlocks — that’s your doorway into specialty work.",
      ],
      cta: { label: "Open bridge", href: "/learn/bridge" },
    };
  }
  if (pathname.startsWith("/learn/bridge")) {
    return {
      title: "The bridge",
      lines: [
        "After foundation exit, you get four short units — read, drill, then mark each complete in order.",
        "The last stop is a twelve-question checkpoint (roughly three in four to pass); Developer can reset units and that pass when you’re debugging.",
        "Text usually appears without nikkud here; flip vowel points on when you want training wheels.",
        "If this page stays locked, finish reading, grammar, and lexicon on Foundation exit first (or simulate from Developer).",
      ],
      cta: { label: "Learn home", href: "/learn" },
    };
  }
  if (pathname.startsWith("/learn/tracks")) {
    return {
      title: "Where you go next",
      lines: [
        "Modern tracks (news, literature, spoken Hebrew) and traditional ones (Talmudic / rabbinic Hebrew, Jewish Babylonian Aramaic) each run Bronze → Silver → Gold. You’ll need foundation exit and a passed bridge final first.",
        "Tiers open in order; clear the score bar to earn the badge you’ll see in Progress.",
        "Each card points you to Reading, Study, Library, Numbers — so multiple choice is never your only kind of rep, especially for listening and sugya reading.",
        "Progress lists every tier you’ve cleared; hop to the next open tier from there or from this hub.",
      ],
      cta: { label: "Progress", href: "/progress" },
    };
  }
  if (pathname.startsWith("/learn/yiddish")) {
    return {
      title: "ייִדיש alongside Hebrew",
      lines: [
        "This track saves under its own key — it won’t overwrite your Alef–Dalet file.",
        "Sections still unlock in order; reach the pass line on the MCQ run, then mark complete when you’re satisfied.",
        "Answers here still feed your main streak and MCQ totals, so the two paths cheer each other on.",
      ],
      cta: { label: "Learn home", href: "/learn" },
    };
  }
  if (pathname.startsWith("/learn")) {
    return {
      title: "Inside Learn",
      lines: [
        "The carousel is your spine: Alef–Dalet, foundation exit, bridge, then each specialty track. The center card explains what’s locked and what opens next.",
        "Tap the small “i” under the carousel anytime for this full path map — goals, order, and how the pieces connect.",
        "Each level drills a focused set of words; big dictionary counts describe how wide the lookup net is, not a quota you must memorize tonight.",
        "Sections unlock in order within a level; comprehension lessons give you a whole passage before the questions.",
        "Aleph’s first story lands after greetings and politeness; Bet and Dalet link their stories after your first two subsections there.",
        "You can change your active level from the Progress expander on Learn home, or ask Developer mode to open every foundation level for a tour.",
      ],
      cta: { label: "See Progress", href: "/progress" },
    };
  }
  if (pathname.startsWith("/study")) {
    return {
      title: "Review that sticks",
      lines: [
        "Suggested next follows your active level and what’s unlocked; story links let you rehearse vocabulary without advancing the checklist.",
        "First taps on MCQ and comprehension count toward your lifetime practice tally; Hebrew MCQ prompts also raise word levels that feed unlock gates.",
        "The Word levels card sums lemmas you’ve touched at level two or higher; Progress breaks it down per course level.",
        "Replay quizzes whenever you like — only “Mark section complete” moves the official path forward.",
        "New device? Advanced → Developer has Learn JSON export, Library saves JSON, and optional cloud backup when your server is configured.",
      ],
      cta: { label: "Learn home", href: "/learn" },
    };
  }
  if (pathname.startsWith("/reading")) {
    return {
      title: "Reading as a habit",
      lines: [
        "The carousel lists passages you’ve earned in the course; Jewish-text rows unlock one after another as you open each. Swipe or use arrows, then open the center card for the full piece.",
        "Below, quick rows jump to Aleph guided reading, each level’s story, and Library. The “i” circle explains progress and exercises; Esc closes that panel.",
        "Tap underlined words where you see them; some rows open notes (for example Sefaria) or a short quiz.",
      ],
      cta: { label: "Library", href: "/library" },
    };
  }
  if (pathname.startsWith("/numbers")) {
    return {
      title: "Numbers in your ear",
      lines: [
        "Listen-and-pick covers zero through ten as cardinals; topic quizzes add ordinals, weekdays, and time words.",
        "The shekel sample card rotates amounts; larger cardinals keep growing in the course and in this hub.",
        "Everything you do here counts toward the same MCQ streak and lifetime tally as Learn drills.",
      ],
      cta: { label: "Aleph numbers section", href: "/learn/1/1-nums" },
    };
  }
  if (pathname.startsWith("/roots")) {
    return {
      title: "Roots (שורשים)",
      lines: [
        "Each family gathers forms built from the same three consonants — the engine behind a cloud of related words.",
        "In drill mode you match a Hebrew form to its English gloss; three correct hits on a shape mark it solid in your tracker.",
        "Study expands by difficulty tier and adds example sentences when we have them.",
        "You’ll meet this same explorer inside Bet–Dalet roots lessons; this menu page is for quick open practice.",
      ],
      cta: { label: "Back to Learn", href: "/learn" },
    };
  }
  if (pathname.startsWith("/library")) {
    return {
      title: "Your shelf",
      lines: [
        "Save Hebrew snippets at the top; you can import older passages that lived in this browser on a previous study page.",
        "Use translation for the gloss and the note field for whatever helps you remember — source, deck name, your own reminder.",
        "Developer → Library saves JSON downloads or merges your collection without losing duplicates carelessly.",
        "External links open in a new tab; search filters both curated links and your saves.",
      ],
      cta: { label: "Back to Learn", href: "/learn" },
    };
  }
  if (pathname.startsWith("/settings")) {
    return {
      title: "Settings",
      lines: [
        "Display name is only for this browser — a small hello in the header.",
        "There’s no product username/password screen here by default; older HTML flows used ivrit_session and scoped keys.",
        "Developer session (when your host configures it) is for builders testing gates, not learner accounts.",
        "Optional cloud backup uses an anonymous sync key — see Developer → Cloud backup when KV is enabled on your deploy.",
      ],
      cta: { label: "Developer tools", href: "/developer" },
    };
  }
  if (pathname.startsWith("/progress")) {
    return {
      title: "Your arc",
      lines: [
        "Counts reflect sections you’ve marked complete in this app.",
        "Streak uses UTC days when you answer a Learn drill or mark a section complete.",
        "Specialty badges list aims, cross-links, and a “Next” hint per track after the bridge — tiers are checkpoints, not the whole skill picture.",
        "Moving devices: Advanced → Developer → JSON (download, merge, or replace). Cloud backup appears when your deployment supports it.",
      ],
      cta: { label: "Developer tools", href: "/developer/tools#dev-cloud-backup" },
    };
  }
  if (pathname.startsWith("/developer")) {
    return {
      title: "Builder tools",
      lines: [
        "Sign in on this page when the server sets DEVELOPER_USERNAME, DEVELOPER_EMAIL, and DEVELOPER_SESSION_SECRET — that cookie unlocks Learn gates in this browser.",
        "Full backups, imports, corpus helpers, and the modal demo live under Developer → tools. In production, that route needs the same session when those env vars exist.",
        "Learn JSON export merges by union and keeps the higher active level when both files disagree.",
        "Library saves JSON: download, merge, or replace passages stored for this app.",
        "Cloud backup pushes and restores with a sync key when KV is configured — see docs/cloud-progress.md in the repo.",
        "You can export in a shape an older single-page study file understands — merge carefully in that browser if you still rely on it.",
      ],
      cta: { label: "Home", href: "/" },
    };
  }
  if (pathname.startsWith("/migration")) {
    return {
      title: "Migration notes",
      lines: [
        "Internal checklist for builders: how much of the legacy single-file app lives here now.",
        "Phases group foundation, learner surfaces, content engine, and platform tools; suggested-next order follows the source roadmap.",
        "Update statuses in lib/html-full-migration.ts when you ship a slice — learners don’t see this page in the menu.",
      ],
      cta: { label: "Open Learn", href: "/learn" },
    };
  }
  return {
    title: "Keep going",
    lines: [
      "Menu (top left): Home, Learn, Progress, then Practice — Study, Reading, Numbers, Roots, Library, Yiddish.",
      "Advanced → Developer is for backups, imports, and builder utilities — not required for daily study.",
      "When you’re not on Home, the Next up chip suggests the next Learn section that fits your progress.",
    ],
    cta: { label: "Learn", href: "/learn" },
  };
}
