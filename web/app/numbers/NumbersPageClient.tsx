"use client";

import Link from "next/link";
import { useCallback } from "react";
import { Hebrew } from "@/components/Hebrew";
import { NumbersBrowseCards } from "@/components/NumbersBrowseCards";
import { NumbersListenDrill } from "@/components/NumbersListenDrill";
import { NumbersPricePeek } from "@/components/NumbersPricePeek";
import { NumbersTopicMcqDrill } from "@/components/NumbersTopicMcqDrill";
import {
  loadLearnProgress,
  recordGradedAnswer,
  recordVocabPracticeForPrompt,
  saveLearnProgress,
  touchDailyStreak,
} from "@/lib/learn-progress";

export function NumbersPageClient() {
  const onPracticeAnswer = useCallback(
    (correct: boolean, ctx?: { promptHe?: string }) => {
      const p = loadLearnProgress();
      let n = touchDailyStreak(p);
      n = recordGradedAnswer(n, correct);
      n = recordVocabPracticeForPrompt(n, ctx?.promptHe, correct);
      saveLearnProgress(n);
    },
    [],
  );

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <nav className="flex flex-wrap gap-3 text-[10px] uppercase tracking-[0.15em] text-ink-muted">
        <Link href="/" className="text-sage hover:underline">
          Home
        </Link>
        <span className="text-ink-faint">/</span>
        <span className="text-ink">Numbers</span>
      </nav>

      <header className="text-center">
        <p className="font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
          Numbers &amp; counting
        </p>
        <Hebrew
          as="h1"
          className="mt-2 block text-3xl leading-snug text-ink sm:text-4xl"
        >
          מִסְפָּרִים
        </Hebrew>
        <p className="mt-2 text-sm italic text-ink-muted">
          Hebrew cardinals, ordinals, days, time, and prices — ported from the
          legacy Numbers tab.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { href: "#cards", label: "0–100 cards", emoji: "🃏" },
          { href: "#listen", label: "Number quiz", emoji: "◈" },
          { href: "#ordinal", label: "Ordinals", emoji: "1st" },
          { href: "#days", label: "Days", emoji: "📅" },
          { href: "#time", label: "Time", emoji: "⏰" },
          { href: "#price", label: "Prices", emoji: "₪" },
          { href: "#grammar", label: "Gender note", emoji: "📐" },
        ].map((x) => (
          <a
            key={x.href}
            href={x.href}
            className="flex flex-col items-center gap-1 rounded-2xl border border-ink/10 bg-parchment-card/60 py-3 transition hover:border-sage/35 hover:bg-parchment-deep/30"
          >
            <span className="text-xl" aria-hidden>
              {x.emoji}
            </span>
            <span className="font-label text-[9px] uppercase tracking-wide text-ink-muted">
              {x.label}
            </span>
          </a>
        ))}
      </div>

      <p className="text-center text-[11px] text-ink-faint">
        Course section{" "}
        <Link href="/learn/1/1-nums" className="text-sage underline">
          Aleph · Numbers (1-nums)
        </Link>{" "}
        also has MCQs + this listen drill.
      </p>

      <section id="cards" className="scroll-mt-24">
        <NumbersBrowseCards />
      </section>

      <section id="listen" className="scroll-mt-24">
        <NumbersListenDrill onPracticeAnswer={onPracticeAnswer} />
      </section>

      <section id="ordinal" className="scroll-mt-24">
        <NumbersTopicMcqDrill
          variant="ordinal"
          onPracticeAnswer={onPracticeAnswer}
        />
      </section>

      <section id="days" className="scroll-mt-24">
        <NumbersTopicMcqDrill
          variant="days"
          onPracticeAnswer={onPracticeAnswer}
        />
      </section>

      <section id="time" className="scroll-mt-24">
        <NumbersTopicMcqDrill
          variant="time"
          onPracticeAnswer={onPracticeAnswer}
        />
      </section>

      <section id="price" className="scroll-mt-24">
        <NumbersPricePeek />
      </section>

      <section
        id="grammar"
        className="scroll-mt-24 rounded-2xl border border-ink/10 bg-parchment-card/50 p-5"
      >
        <p className="font-label text-[10px] uppercase tracking-[0.18em] text-ink-muted">
          Grammar note: number gender
        </p>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          Hebrew numbers have <strong className="text-ink">masculine and feminine</strong>{" "}
          forms that can feel reversed — the feminine form is often used with
          masculine nouns, and vice versa.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-ink/10 bg-parchment-deep/30 p-3 text-center">
            <p className="font-label text-[9px] uppercase tracking-[0.15em] text-ink-faint">
              With masculine nouns
            </p>
            <Hebrew className="mt-2 block text-xl text-ink">
              שְׁלֹשָׁה סְפָרִים
            </Hebrew>
            <p className="mt-1 text-[11px] text-ink-muted">
              three books (f. number)
            </p>
          </div>
          <div className="rounded-xl border border-ink/10 bg-parchment-deep/30 p-3 text-center">
            <p className="font-label text-[9px] uppercase tracking-[0.15em] text-ink-faint">
              With feminine nouns
            </p>
            <Hebrew className="mt-2 block text-xl text-ink">
              שָׁלֹשׁ עָרִים
            </Hebrew>
            <p className="mt-1 text-[11px] text-ink-muted">
              three cities (m. number)
            </p>
          </div>
        </div>
      </section>

      <p className="flex flex-wrap justify-center gap-4 border-t border-ink/10 pt-4 text-[11px]">
        <Link href="/study" className="text-sage underline">
          Study hub
        </Link>
        <Link href="/learn" className="text-sage underline">
          Learn
        </Link>
      </p>
    </div>
  );
}
