"use client";

import Link from "next/link";

const STEPS = [
  {
    title: "Foundation (Alef–Dalet)",
    body:
      "Leveled sections build reading, grammar, and vocabulary. Complete all four levels, then use Study and Library to reinforce — relearning is normal.",
    href: "/learn",
    cta: "Learn home",
  },
  {
    title: "Foundation exit",
    body:
      "Three strands (reading, grammar, lexicon) prove integrated skill before advanced gates. You can revisit strands to refresh.",
    href: "/learn/foundation-exit",
    cta: "Foundation exit",
  },
  {
    title: "Bridge",
    body:
      "Short units plus a final checkpoint connect foundation skills to domain work. Passing unlocks specialty tiers.",
    href: "/learn/bridge",
    cta: "Bridge",
  },
  {
    title: "Specialty tracks",
    body:
      "Modern Israeli domains (news, literature, spoken) and traditional text literacy (Talmudic / rabbinic Hebrew, Jewish Babylonian Aramaic). Each track runs Bronze → Silver → Gold; same lengths and pass rules. Badges stay in Progress — repeat drills anytime.",
    href: "/learn/tracks",
    cta: "Specialty tracks",
  },
  {
    title: "Yiddish (parallel)",
    body:
      "Optional sister track with its own save slot. Fits learners who want Ashkenazi Jewish language alongside Hebrew.",
    href: "/learn/yiddish",
    cta: "Yiddish",
  },
  {
    title: "Ongoing practice",
    body:
      "Study suggests your next section; Reading, Roots, Numbers, and Library support breadth. Use Progress to see badges and keep one place for the long arc.",
    href: "/study",
    cta: "Study",
  },
] as const;

/** Full-course path and goals (formerly the standalone Fluency page). */
export function LearnPathOverviewModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="w-[min(100vw-2rem,26rem)] max-h-[min(85dvh,640px)] overflow-y-auto rounded-2xl border border-ink/12 bg-parchment-card p-5 shadow-elevated-lg [scrollbar-gutter:stable]">
      <h2
        id="learn-path-overview-title"
        className="font-label text-[10px] uppercase tracking-[0.2em] text-sage"
      >
        Your path through the course
      </h2>
      <p className="mt-2 text-sm font-medium text-ink">
        Goals and how each stage fits together
      </p>
      <p className="mt-2 text-[11px] text-ink-faint">
        Press{" "}
        <kbd className="rounded border border-ink/15 bg-parchment-deep/50 px-1.5 py-0.5 font-mono text-[10px]">
          Esc
        </kbd>{" "}
        to close. Use the carousel on Learn to open any stage and see unlock
        status.
      </p>
      <p className="mt-3 text-xs leading-relaxed text-ink-muted">
        This app is built for a long journey: you will circle back to lessons,
        reread, and re-drill. The spine below runs from foundation through
        bridge, specialties, optional Yiddish, and daily tools.
      </p>

      <ol className="relative mt-4 space-y-0 border-l-2 border-sage/25 pl-5">
        {STEPS.map((step, i) => (
          <li key={step.title} className="pb-6 last:pb-0">
            <span
              className="absolute -left-[7px] flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-sage/40 bg-parchment-card text-[9px] font-medium text-sage"
              aria-hidden
            >
              {i + 1}
            </span>
            <h3 className="font-label text-xs text-ink">{step.title}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">
              {step.body}
            </p>
            <Link
              href={step.href}
              className="mt-1.5 inline-block font-label text-[9px] uppercase tracking-wide text-sage underline"
            >
              {step.cta} →
            </Link>
          </li>
        ))}
      </ol>

      <div className="mt-4 rounded-xl border border-ink/10 border-t-sage/20 bg-parchment-card/50 p-3">
        <p className="font-label text-[9px] uppercase tracking-[0.18em] text-ink-muted">
          Authors &amp; longer passages
        </p>
        <p className="mt-1.5 text-[11px] leading-snug text-ink-muted">
          Long-form reading grows over time. On{" "}
          <Link href="/developer" className="text-sage underline">
            Developer
          </Link>
          , the passage validator scores Hebrew drafts against the app
          dictionary.
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="btn-elevated-primary mt-5 w-full"
      >
        Close
      </button>
    </div>
  );
}
