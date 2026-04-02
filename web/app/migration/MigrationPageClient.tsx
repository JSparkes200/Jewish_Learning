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
          For builders
        </p>
        <p className="mt-2 text-sm text-ink-muted">
          This page is an internal map of what the old single-file course covered
          vs this app. New product slices (bridge, foundation exit, specialty
          tracks, Yiddish) appear as their own rows when they do not map 1:1 to
          old tabs.
        </p>
        <p className="mt-2 text-xs text-ink-faint">
          Backups: Advanced → Developer → JSON v2 (Hebrew + optional Yiddish).
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
