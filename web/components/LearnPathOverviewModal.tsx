"use client";

import Link from "next/link";
import { LEARN_HUB_PATH } from "@/lib/learn-progress";

const STEPS = [
  {
    title: "Foundation (Alef–Dalet)",
    body:
      "Leveled sections grow your reading, grammar, and vocabulary. Finish all four levels, then let Study and Library deepen what you’ve met — circling back is part of the work.",
    href: LEARN_HUB_PATH,
    cta: "Learn home",
  },
  {
    title: "Foundation exit",
    body:
      "Three strands — reading, grammar, lexicon — show that your skills hang together before harder gates open. You can always revisit a strand to refresh.",
    href: "/learn/foundation-exit",
    cta: "Foundation exit",
  },
  {
    title: "Bridge",
    body:
      "Short units plus a final checkpoint carry foundation Hebrew into domain reading. Passing unlocks the specialty tiers.",
    href: "/learn/bridge",
    cta: "Bridge",
  },
  {
    title: "Specialty tracks",
    body:
      "Modern Israeli Hebrew (news, literature, spoken) and traditional literacy (Talmudic / rabbinic Hebrew, Jewish Babylonian Aramaic). Each track runs Bronze → Silver → Gold with the same lengths and pass rules; badges live in Progress, and you can repeat drills anytime.",
    href: "/learn/tracks",
    cta: "Specialty tracks",
  },
  {
    title: "Yiddish (parallel)",
    body:
      "Optional sister track with its own save slot — for learners who want Ashkenazi Jewish language alongside Hebrew without mixing progress files.",
    href: "/learn/yiddish",
    cta: "Yiddish",
  },
  {
    title: "Ongoing practice",
    body:
      "Study suggests your next section; Reading, Roots, Numbers, and Library widen what you hear and read. Progress stays the home for badges and the long arc.",
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
        What you’re building, and how the stages fit
      </p>
      <p className="mt-2 text-[11px] text-ink-faint">
        Press{" "}
        <kbd className="rounded border border-ink/15 bg-parchment-deep/50 px-1.5 py-0.5 font-mono text-[10px]">
          Esc
        </kbd>{" "}
        to close. On Learn, swipe the carousel to open any stage and see what’s
        unlocked.
      </p>
      <p className="mt-3 text-xs leading-relaxed text-ink-muted">
        Hebrew study is a long arc: you’ll return to lessons, reread, and re-drill.
        The spine below runs foundation → bridge → specialties, with optional
        Yiddish and daily tools alongside.
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
          Long-form reading keeps growing. On{" "}
          <Link href="/developer/tools" className="text-sage underline">
            Developer
          </Link>
          , the passage validator scores Hebrew drafts against the app
          dictionary so you can draft with confidence.
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
