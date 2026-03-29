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

export function FluencyPageClient() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-6">
      <header className="mb-8">
        <p className="font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
          Learn
        </p>
        <h1 className="mt-1 font-hebrew text-2xl text-ink">
          Fluency path — one stop
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          This app is built for a long journey: you will circle back to lessons,
          reread, and re-drill. The path below is the full spine — from
          foundation through bridge, modern and traditional specialties, optional
          Yiddish, and daily tools — so you do not need to patch together
          multiple products for Hebrew (and related) literacy.
        </p>
      </header>

      <ol className="relative space-y-0 border-l-2 border-sage/25 pl-6">
        {STEPS.map((step, i) => (
          <li key={step.title} className="pb-10 last:pb-0">
            <span
              className="absolute -left-[9px] flex h-4 w-4 items-center justify-center rounded-full border-2 border-sage/40 bg-parchment-card text-[10px] font-medium text-sage"
              aria-hidden
            >
              {i + 1}
            </span>
            <h2 className="font-label text-sm text-ink">{step.title}</h2>
            <p className="mt-2 text-sm text-ink-muted">{step.body}</p>
            <Link
              href={step.href}
              className="mt-2 inline-block font-label text-[10px] uppercase tracking-wide text-sage underline"
            >
              {step.cta} →
            </Link>
          </li>
        ))}
      </ol>

      <div className="mt-10 rounded-2xl border border-ink/10 border-t-sage/20 bg-parchment-card/35 p-4">
        <p className="font-label text-[10px] uppercase tracking-[0.18em] text-ink-muted">
          Authors &amp; longer passages
        </p>
        <p className="mt-2 text-xs text-ink-muted">
          Long-form reading and comprehension are growing over time. On{" "}
          <Link href="/developer" className="text-sage underline">
            Developer
          </Link>
          , the passage validator scores Hebrew drafts against the app dictionary
          (and optional level caps) so you can tune difficulty before items ship.
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-ink/10 bg-parchment-card/40 p-4">
        <p className="font-label text-[10px] uppercase tracking-[0.18em] text-ink-muted">
          Specialty tracks detail
        </p>
        <p className="mt-2 text-sm text-ink-muted">
          After the bridge, open{" "}
          <Link href="/learn/tracks" className="text-sage underline">
            specialty tracks
          </Link>
          :{" "}
          <span className="text-ink">Modern Israeli Hebrew</span> (news,
          literature, spoken) and{" "}
          <span className="text-ink">traditional texts</span>{" "}
          (Talmudic / rabbinic Hebrew and Jewish Babylonian Aramaic). Same tier
          sizes and scoring; your Progress page lists every badge.
        </p>
      </div>

      <p className="mt-8 text-center text-xs text-ink-faint">
        <Link href="/learn" className="text-sage underline">
          ← Learn home
        </Link>
      </p>
    </div>
  );
}
