"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  SPECIALTY_TIER_IDS,
  SPECIALTY_TRACKS,
  type SpecialtyTrackGroup,
  getSpecialtyPassMinCorrect,
} from "@/data/specialty-tracks";
import { getSpecialtyTierMcqPack } from "@/data/specialty-tier-packs";
import {
  getBridgeModulePassed,
  isBridgeUnlocked,
  isSpecialtyTierRecordedPassed,
  isSpecialtyTracksUnlocked,
  specialtyTierUnlockedForAttempt,
} from "@/lib/learn-progress";
import { useLearnProgressSync } from "@/lib/use-learn-progress-sync";

function tierLabel(t: (typeof SPECIALTY_TIER_IDS)[number]): string {
  return t.charAt(0).toUpperCase() + t.slice(1);
}

const GROUP_LABEL: Record<SpecialtyTrackGroup, { title: string; blurb: string }> =
  {
    modern_hebrew: {
      title: "Modern Israeli Hebrew",
      blurb:
        "News, literature, and goal-oriented speech — contemporary register and media.",
    },
    traditional_texts: {
      title: "Traditional texts",
      blurb:
        "Talmudic / rabbinic Hebrew and Jewish Babylonian Aramaic — lemmas and frames for sugya literacy.",
    },
  };

const GROUP_ORDER: readonly SpecialtyTrackGroup[] = [
  "modern_hebrew",
  "traditional_texts",
];

export function TracksPageClient() {
  const [progress] = useLearnProgressSync({});
  const specialtyUnlocked = isSpecialtyTracksUnlocked(progress);
  const bridgePassed = getBridgeModulePassed(progress);
  const exitComplete = isBridgeUnlocked(progress);

  const rowsByGroup = useMemo(
    () =>
      GROUP_ORDER.map((group) => ({
        group,
        label: GROUP_LABEL[group],
        rows: SPECIALTY_TRACKS.filter((t) => t.group === group).map(
          (track) => {
            const meta = track;
            return SPECIALTY_TIER_IDS.map((tier) => {
              const unlocked = specialtyTierUnlockedForAttempt(
                progress,
                track.id,
                tier,
              );
              const passed = isSpecialtyTierRecordedPassed(
                progress,
                track.id,
                tier,
              );
              const p = getSpecialtyTierMcqPack(track.id, tier);
              const itemCount = p?.items.length ?? 0;
              const minCorrect =
                itemCount > 0
                  ? getSpecialtyPassMinCorrect(itemCount, tier)
                  : 0;
              return {
                trackId: track.id,
                tier,
                meta,
                unlocked,
                passed,
                minCorrect,
                itemCount,
              };
            });
          },
        ),
      })),
    [progress],
  );

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-6">
      <header className="mb-8">
        <p className="font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
          Post-bridge
        </p>
        <h1 className="mt-1 font-hebrew text-2xl text-ink">Specialty tracks</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Domain badges in three tiers: Bronze → Silver → Gold. Bronze is 8
          items; Silver 15; Gold 25 — stricter pass bars at each step. Requires
          foundation exit (three strands), bridge pass, then unlock tiers in
          order. Modern tracks and traditional (Talmudic / Aramaic) tracks share
          the same rules — revisit tiers anytime; Progress keeps your badges.
        </p>
        <p className="mt-3 text-xs text-ink-faint">
          <Link href="/learn/fluency" className="text-sage underline">
            Fluency path overview
          </Link>{" "}
          — how this fits your full journey (foundation → bridge → specialties).
        </p>
      </header>

      {!specialtyUnlocked ? (
        <div className="mb-8 rounded-2xl border border-rust/30 bg-rust/5 p-4">
          <p className="font-label text-[10px] uppercase tracking-[0.18em] text-rust">
            Locked
          </p>
          {!exitComplete ? (
            <p className="mt-2 text-sm text-ink-muted">
              Pass all three foundation exit strands (reading, grammar, lexicon),
              then the bridge, to open specialty badges.{" "}
              <Link
                href="/learn/foundation-exit"
                className="font-medium text-sage underline"
              >
                Foundation exit
              </Link>
              .
            </p>
          ) : !bridgePassed ? (
            <p className="mt-2 text-sm text-ink-muted">
              Foundation exit is done — pass the bridge final checkpoint next.{" "}
              <Link
                href="/learn/bridge"
                className="font-medium text-sage underline"
              >
                Bridge module
              </Link>
              .
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="space-y-10">
        {rowsByGroup.map(({ group, label, rows }) => (
          <section key={group} className="space-y-4">
            <div className="border-b border-ink/10 pb-2">
              <h2 className="font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
                {label.title}
              </h2>
              <p className="mt-1 text-xs text-ink-muted">{label.blurb}</p>
            </div>
            <ul className="space-y-6">
              {rows.map((tiers) => (
                <li
                  key={tiers[0]?.meta.id}
                  className="rounded-2xl border border-ink/10 bg-parchment-card/40 p-4 shadow-sm"
                >
                  <div className="mb-3 flex flex-wrap items-baseline gap-2">
                    <h3 className="font-label text-sm text-ink">
                      {tiers[0]?.meta.title}
                    </h3>
                    <span className="font-hebrew text-sm text-ink-muted">
                      {tiers[0]?.meta.domainHe}
                    </span>
                  </div>
                  <p className="mb-4 text-xs text-ink-muted">
                    {tiers[0]?.meta.blurb}
                  </p>
                  <ol className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                    {tiers.map((t) => {
                      const href = `/learn/tracks/${encodeURIComponent(t.trackId)}/${encodeURIComponent(t.tier)}`;
                      const canOpen = specialtyUnlocked && t.unlocked;
                      return (
                        <li key={t.tier} className="min-w-0 flex-1">
                          {canOpen ? (
                            <Link
                              href={href}
                              className="flex h-full flex-col gap-1 rounded-xl border border-sage/25 bg-parchment-deep/30 px-3 py-2 transition hover:border-sage/50 hover:bg-parchment-deep/50"
                            >
                              <span className="font-label text-[10px] uppercase tracking-wide text-sage">
                                {tierLabel(t.tier)}
                              </span>
                              <span className="text-[11px] text-ink-muted">
                                Need {t.minCorrect}/{t.itemCount}+ ·{" "}
                                {t.passed ? (
                                  <span className="text-sage">Passed</span>
                                ) : (
                                  "Open"
                                )}
                              </span>
                            </Link>
                          ) : (
                            <div className="flex h-full flex-col gap-1 rounded-xl border border-ink/10 bg-parchment-deep/20 px-3 py-2 opacity-70">
                              <span className="font-label text-[10px] uppercase tracking-wide text-ink-muted">
                                {tierLabel(t.tier)}
                              </span>
                              <span className="text-[11px] text-ink-faint">
                                {!specialtyUnlocked
                                  ? !exitComplete
                                    ? "Locked — foundation exit"
                                    : "Locked — bridge"
                                  : "Complete the previous tier"}
                              </span>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-ink-faint">
        <Link href="/learn" className="text-sage underline">
          ← Learn home
        </Link>
      </p>
    </div>
  );
}
