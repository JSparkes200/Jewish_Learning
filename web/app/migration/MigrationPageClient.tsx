"use client";

import Link from "next/link";
import { HtmlMigrationTracker } from "@/components/HtmlMigrationTracker";

export function MigrationPageClient() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <nav className="flex flex-wrap gap-3 text-[10px] uppercase tracking-[0.15em] text-ink-muted">
        <Link href="/" className="text-sage hover:underline">
          Home
        </Link>
        <span className="text-ink-faint">/</span>
        <span className="text-ink">Migration</span>
      </nav>

      <div className="rounded-2xl border border-ink/10 border-t-sage/20 bg-parchment-card/50 p-4">
        <p className="font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
          Restructure note
        </p>
        <p className="mt-2 text-sm text-ink-muted">
          The score below compares the monolithic{" "}
          <code className="rounded bg-parchment-deep/50 px-1 text-[11px]">
            hebrew-v8.2.html
          </code>{" "}
          to this Next app. <strong className="text-ink">New routes</strong>{" "}
          (bridge, foundation exit, specialty tracks, Yiddish) are listed as
          their own workstreams where they do not map 1:1 to legacy tabs —
          they still count toward “learner” phase completion honestly.
        </p>
        <p className="mt-2 text-xs text-ink-faint">
          Device backup: Developer → JSON v2 includes Hebrew course + optional
          Yiddish; merge is union-based for both.
        </p>
      </div>

      <HtmlMigrationTracker variant="full" />

      <p className="text-center text-[11px] text-ink-faint">
        <Link href="/progress" className="text-sage hover:underline">
          Progress
        </Link>
        {" · "}
        <Link href="/developer" className="text-sage hover:underline">
          Developer
        </Link>
        {" · "}
        <Link href="/learn" className="text-sage hover:underline">
          Learn
        </Link>
        {" · "}
        <Link href="/reading" className="text-sage hover:underline">
          Reading
        </Link>
      </p>
    </div>
  );
}
