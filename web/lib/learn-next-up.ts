import { COURSE_LEVELS, getSectionsForLevel } from "@/data/course";
import { SPECIALTY_TRACKS } from "@/data/specialty-tracks";
import { YIDDISH_SECTIONS } from "@/data/yiddish-course";
import type { YiddishProgressState } from "@/lib/yiddish-progress";
import { yiddishSectionUnlocked } from "@/lib/yiddish-progress";
import {
  getBridgeModulePassed,
  getFoundationExitStrands,
  getNextSpecialtyTierForTrack,
  isSpecialtyTracksUnlocked,
  sectionUnlocked,
  type LearnProgressState,
} from "@/lib/learn-progress";

export type LearnNextUp = { href: string; label: string; icon?: string };

function levelShortLabel(n: number): string {
  const meta = COURSE_LEVELS.find((l) => l.n === n);
  if (!meta) return `Level ${n}`;
  return meta.label.split("—")[0]?.trim() ?? `Level ${n}`;
}

function firstIncompleteSpecialtyNext(
  progress: LearnProgressState,
): LearnNextUp | null {
  if (!isSpecialtyTracksUnlocked(progress)) return null;
  for (const track of SPECIALTY_TRACKS) {
    const next = getNextSpecialtyTierForTrack(progress, track.id);
    if (!next) continue;
    const shortTitle = track.title.split("—")[0]?.trim() ?? track.id;
    return {
      href: next.href,
      label: `Specialty · ${shortTitle} (${next.tier})`,
      icon: "🎖️",
    };
  }
  return null;
}

function nextYiddishSectionUp(
  state: YiddishProgressState,
): LearnNextUp | null {
  for (const sec of YIDDISH_SECTIONS) {
    if (!yiddishSectionUnlocked(state, sec.id)) continue;
    if (!state.completedSections[sec.id]) {
      return {
        href: `/learn/yiddish/${encodeURIComponent(sec.id)}`,
        label: `Yiddish · ${sec.label}`,
        icon: "ײַ",
      };
    }
  }
  return null;
}

function allFoundationLevelsComplete(
  progress: LearnProgressState,
): boolean {
  return [1, 2, 3, 4].every((n) => {
    const secs = getSectionsForLevel(n);
    return (
      secs.length > 0 && secs.every((x) => progress.completedSections[x.id])
    );
  });
}

export type GetNextLearnUpOptions = {
  /** When set, Next up can suggest the next open Yiddish section after specialty tiers are done. */
  yiddishProgress?: YiddishProgressState;
};

/**
 * Next place to study: active Hebrew level section, then (when Alef–Dalet is
 * complete) foundation exit → bridge → specialty tiers → optional Yiddish.
 */
export function getNextLearnUp(
  progress: LearnProgressState,
  options?: GetNextLearnUpOptions,
): LearnNextUp {
  const level = progress.activeLevel;
  const sections = getSectionsForLevel(level);

  if (sections.length === 0) {
    return {
      href: "/learn",
      label: "Learn — course & levels",
      icon: "📚",
    };
  }

  const allDoneThisLevel = sections.every(
    (s) => progress.completedSections[s.id],
  );

  if (allDoneThisLevel) {
    const allFourDone = allFoundationLevelsComplete(progress);

    if (allFourDone) {
      const fe = getFoundationExitStrands(progress);
      const exitDone = fe.reading && fe.grammar && fe.lexicon;
      if (!exitDone) {
        return {
          href: "/learn/foundation-exit",
          label: "Foundation exit — three strands",
          icon: "✓",
        };
      }
      if (!getBridgeModulePassed(progress)) {
        return {
          href: "/learn/bridge",
          label: "Bridge — final checkpoint",
          icon: "🌉",
        };
      }
      const spec = firstIncompleteSpecialtyNext(progress);
      if (spec) return spec;
      if (options?.yiddishProgress) {
        const y = nextYiddishSectionUp(options.yiddishProgress);
        if (y) return y;
      }
      return {
        href: "/progress",
        label: "Milestones — badges & stats",
        icon: "✓",
      };
    }

    if (level < 4) {
      const nl = level + 1;
      const nextSections = getSectionsForLevel(nl);
      const first = nextSections[0];
      if (first) {
        return {
          href: `/learn/${nl}/${encodeURIComponent(first.id)}`,
          label: `Next: ${levelShortLabel(nl)} · ${first.label}`,
          icon: "📚",
        };
      }
    }

    return {
      href: "/learn",
      label: "Choose a level to review",
      icon: "📚",
    };
  }

  for (const s of sections) {
    if (progress.completedSections[s.id]) continue;
    if (
      !sectionUnlocked(
        level,
        sections,
        s.id,
        progress.completedSections,
        progress.vocabLevels,
      )
    )
      continue;
    return {
      href: `/learn/${level}/${encodeURIComponent(s.id)}`,
      label: `Level ${level} · ${s.label}`,
      icon: "📚",
    };
  }

  return {
    href: `/learn/${level}`,
    label: `Level ${level} — finish prerequisites on the level list`,
    icon: "🔒",
  };
}
