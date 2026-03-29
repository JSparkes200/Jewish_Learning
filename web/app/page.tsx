import Link from "next/link";
import { Hebrew } from "@/components/Hebrew";
import { HomeContinueStrip } from "./HomeContinueStrip";

/**
 * Home — shell only until legacy parity.
 * Small helpers stay in this file.
 */

function WelcomeBlock() {
  return (
    <section className="mb-8 text-center">
      <Hebrew
        as="h1"
        className="block text-2xl leading-snug text-ink sm:text-3xl"
      >
        בְּרוּכִים הַבָּאִים לִישִׁיבָה
      </Hebrew>
      <p className="mt-2 font-label text-xs uppercase tracking-[0.18em] text-ink-muted">
        Next.js + Tailwind — migration in progress
      </p>
    </section>
  );
}

type HomeTileProps = {
  href: string;
  label: string;
  sub: string;
  ringClass: string;
  emoji: string;
};

function HomeTile({ href, label, sub, ringClass, emoji }: HomeTileProps) {
  return (
    <Link
      href={href}
      className={`group flex flex-col items-center gap-2 rounded-2xl border border-ink/10 bg-parchment-card/90 p-5 shadow-md backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-lg ${ringClass}`}
    >
      <span
        className="flex h-14 w-14 items-center justify-center rounded-full text-2xl shadow-inner"
        aria-hidden
      >
        {emoji}
      </span>
      <span className="font-label text-[10px] uppercase tracking-[0.2em] text-ink">
        {label}
      </span>
      <Hebrew as="span" className="block w-full text-center text-xs text-ink-muted">
        {sub}
      </Hebrew>
    </Link>
  );
}

function HomeActionGrid() {
  return (
    <nav
      className="mx-auto grid max-w-lg grid-cols-2 gap-3 sm:max-w-2xl sm:grid-cols-3 sm:gap-4"
      aria-label="Primary actions"
    >
      <HomeTile
        href="/learn"
        label="Learn"
        sub="קורסים ושיעורים"
        ringClass="focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage"
        emoji="📚"
      />
      <HomeTile
        href="/study"
        label="Study"
        sub="חזרה ותרגול"
        ringClass="focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber"
        emoji="🔁"
      />
      <HomeTile
        href="/numbers"
        label="Numbers"
        sub="מִסְפָּרִים"
        ringClass="focus-visible:outline focus-visible:outline-2 focus-visible:outline-rust"
        emoji="🔢"
      />
      <HomeTile
        href="/roots"
        label="Roots"
        sub="שׁוֹרָשִׁים"
        ringClass="focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber"
        emoji="שׁ"
      />
      <HomeTile
        href="/library"
        label="Library"
        sub="ספרייה ומקורות"
        ringClass="focus-visible:outline focus-visible:outline-2 focus-visible:outline-burg"
        emoji="📜"
      />
      <HomeTile
        href="/reading"
        label="Reading"
        sub="קְרִיאָה"
        ringClass="focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage"
        emoji="📖"
      />
      <HomeTile
        href="/progress"
        label="Progress"
        sub="הִתְקַדְמוּת"
        ringClass="focus-visible:outline focus-visible:outline-2 focus-visible:outline-rust"
        emoji="📊"
      />
    </nav>
  );
}

function DevNote() {
  return (
    <Hebrew
      as="p"
      className="mx-auto mt-10 max-w-md text-center text-[11px] leading-relaxed text-ink-faint"
    >
      אפליקציית Next זו כוללת מסלול לימוד, חידונים, והתקדמות מקומית. עדיין אפשר
      להשתמש בקובץ ה־HTML הישן לתכנים מלאים שלא הועברו עדיין.
    </Hebrew>
  );
}

function MigrationNote() {
  return (
    <p className="mx-auto mt-6 max-w-md rounded-xl border border-ink/10 bg-parchment-card/50 px-4 py-3 text-center text-[11px] leading-relaxed text-ink-muted">
      <strong className="text-ink">Accounts:</strong> This Next app has{" "}
      <strong>no login</strong> yet — progress is local to this browser. The
      legacy <code className="rounded bg-parchment-deep/40 px-1">.html</code>{" "}
      file has usernames, password reset, and Rabbi flows; see{" "}
      <code className="text-[10px]">docs/next-migration.md</code> and{" "}
      <code className="text-[10px]">docs/auth-security.md</code>.
    </p>
  );
}

export default function HomePage() {
  return (
    <div className="mx-auto max-w-lg">
      <WelcomeBlock />
      <HomeContinueStrip />
      <HomeActionGrid />
      <MigrationNote />
      <DevNote />
    </div>
  );
}
