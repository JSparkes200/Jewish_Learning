"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CorpusDPreview } from "@/components/CorpusDPreview";
import { DeveloperLexiconBrowse } from "@/components/DeveloperLexiconBrowse";
import { PassageValidatorPanel } from "@/components/PassageValidatorPanel";
import { DeveloperAuthPanel } from "./DeveloperAuthPanel";
import { HtmlMigrationTracker } from "@/components/HtmlMigrationTracker";
import { LegacyParityPanel } from "@/components/LegacyParityPanel";
import { ALPHABET_LETTER_IDS } from "@/data/alphabet-letters";
import { SECTION_IDS_WITH_MCQ } from "@/data/section-drills";
import {
  LEARN_PROGRESS_EVENT,
  LEARN_PROGRESS_KEY,
  getBridgeModulePassed,
  getFoundationExitStrands,
  loadLearnProgress,
  saveLearnProgress,
  setAlphabetGate,
  setBridgeModulePassed,
  setFoundationExitStrand,
  NEXT_UP_EXPANDED_STORAGE_KEY,
  clearVocabLevelsOnly,
  resetWebAppLocalCourseState,
} from "@/lib/learn-progress";
import {
  createEmptyYiddishProgressState,
  loadYiddishProgress,
  mergeYiddishProgressStates,
  resetYiddishProgressLocal,
  saveYiddishProgress,
} from "@/lib/yiddish-progress";
import { stringifyIvritLegacyExport } from "@/lib/legacy-ivrit-export";
import {
  mergeLearnProgressStates,
  parseAppProgressJson,
  stringifyAppProgressExport,
} from "@/lib/learn-progress-backup";
import {
  mergeLegacyLibraryIntoWebApp,
  previewLegacyLibraryImport,
} from "@/lib/legacy-library-import";
import {
  mergeLegacyLearnIntoWebApp,
  previewLegacyLearnImport,
} from "@/lib/legacy-storage-import";
import {
  LIBRARY_SAVED_EVENT,
  LIBRARY_SAVED_KEY,
  mergePassagesIntoLibrarySaved,
  parseLibrarySavedBackupJson,
  replaceLibrarySavedList,
  stringifyLibrarySavedExport,
} from "@/lib/library-saved";
import {
  LOCAL_PROFILE_EVENT,
  LOCAL_PROFILE_KEY,
  loadLocalProfile,
  saveLocalProfile,
} from "@/lib/local-profile";
import {
  TRIAL_DURATION_MS,
  TRIAL_SESSION_EVENT,
  TRIAL_SESSION_STORAGE_KEY,
  clearTrialSession,
  formatTrialCountdown,
  getTrialRemainingMs,
  loadTrialSession,
  startTrialSession,
} from "@/lib/trial-session";
import {
  deleteCloudProgress,
  pullProgressFromCloud,
  pushProgressToCloud,
} from "@/lib/cloud-progress-client";
import {
  CLOUD_SYNC_TOKEN_KEY,
  getOrCreateCloudSyncToken,
  regenerateCloudSyncToken,
} from "@/lib/cloud-sync-token";
import {
  loadSavedWords,
  mergeSavedWordLists,
  saveSavedWords,
} from "@/lib/saved-words";

export function DeveloperTools() {
  const drillCount = SECTION_IDS_WITH_MCQ.length;
  const [nameDraft, setNameDraft] = useState("");
  const [legacyImportTick, setLegacyImportTick] = useState(0);
  const [legacyImportNote, setLegacyImportNote] = useState<string | null>(null);
  const [legacyLibImportTick, setLegacyLibImportTick] = useState(0);
  const [legacyLibImportNote, setLegacyLibImportNote] = useState<string | null>(
    null,
  );
  const [backupFeedback, setBackupFeedback] = useState<{
    variant: "ok" | "err";
    text: string;
  } | null>(null);
  const [cloudFeedback, setCloudFeedback] = useState<{
    variant: "ok" | "err";
    text: string;
  } | null>(null);
  const [libraryBackupFeedback, setLibraryBackupFeedback] = useState<{
    variant: "ok" | "err";
    text: string;
  } | null>(null);
  const [ivritExportNote, setIvritExportNote] = useState<string | null>(null);
  const [trialDevTick, setTrialDevTick] = useState(0);
  const [gateDevTick, setGateDevTick] = useState(0);
  const backupFileRef = useRef<HTMLInputElement>(null);
  const backupModeRef = useRef<"merge" | "replace">("merge");
  const libraryBackupFileRef = useRef<HTMLInputElement>(null);
  const libraryBackupModeRef = useRef<"merge" | "replace">("merge");

  const legacyPreview = useMemo(() => {
    if (typeof window === "undefined") {
      return previewLegacyLearnImport({
        completedSections: {},
        activeLevel: 1,
      });
    }
    return previewLegacyLearnImport(loadLearnProgress());
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refresh when tick / storage changes
  }, [legacyImportTick]);

  const legacyLibPreview = useMemo(() => {
    return previewLegacyLibraryImport();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- bump tick to re-read localStorage
  }, [legacyLibImportTick]);

  const storageLines = useMemo(
    () => [
      `${LEARN_PROGRESS_KEY} — completions, active level, streak, MCQ tallies, vocabLevels, rootDrill (legacy import + JSON backup); readingCarouselRevealed, readingPassageLastOpenedAt, readingPassageQuizComplete; numbersCarouselLastOpenedAt, numbersDrillEngaged`,
      `${NEXT_UP_EXPANDED_STORAGE_KEY} — Next-up bar expanded`,
      `${LOCAL_PROFILE_KEY} — optional display name (header)`,
      `${TRIAL_SESSION_STORAGE_KEY} — local 72h trial (Rabbi + badge slot; dev tools)`,
      `alphabetGate, alphabetLettersTraced, alphabetFinalExamPassed, foundationExit, bridgeModulePassed, bridgeUnitsCompleted, specialtyTierPassed — inside ${LEARN_PROGRESS_KEY} (course gates)`,
      `${LIBRARY_SAVED_KEY} — Library saved passages`,
      `ivrit_lib (or ivrit_lib__&lt;user&gt;) — legacy HTML “My Library”; merge on Developer / Library`,
      `${CLOUD_SYNC_TOKEN_KEY} — anonymous Bearer token for Vercel KV cloud backup (same KV as password-reset codes when configured)`,
    ],
    [],
  );

  const syncName = useCallback(() => {
    setNameDraft(loadLocalProfile().displayName ?? "");
  }, []);

  useEffect(() => {
    syncName();
    window.addEventListener(LOCAL_PROFILE_EVENT, syncName);
    return () => window.removeEventListener(LOCAL_PROFILE_EVENT, syncName);
  }, [syncName]);

  useEffect(() => {
    const bump = () => setLegacyImportTick((t) => t + 1);
    window.addEventListener(LEARN_PROGRESS_EVENT, bump);
    return () => window.removeEventListener(LEARN_PROGRESS_EVENT, bump);
  }, []);

  useEffect(() => {
    const bump = () => setGateDevTick((t) => t + 1);
    window.addEventListener(LEARN_PROGRESS_EVENT, bump);
    return () => window.removeEventListener(LEARN_PROGRESS_EVENT, bump);
  }, []);

  useEffect(() => {
    const bump = () => setLegacyLibImportTick((t) => t + 1);
    window.addEventListener(LIBRARY_SAVED_EVENT, bump);
    return () => window.removeEventListener(LIBRARY_SAVED_EVENT, bump);
  }, []);

  useEffect(() => {
    const bump = () => setTrialDevTick((t) => t + 1);
    window.addEventListener(TRIAL_SESSION_EVENT, bump);
    const id = window.setInterval(bump, 1000);
    return () => {
      window.removeEventListener(TRIAL_SESSION_EVENT, bump);
      window.clearInterval(id);
    };
  }, []);

  void trialDevTick;
  const trialSession = loadTrialSession();

  void gateDevTick;
  const gateSnap = loadLearnProgress();
  const fe = getFoundationExitStrands(gateSnap);
  const bridgePassedDev = getBridgeModulePassed(gateSnap);
  const alphabetLettersDev = ALPHABET_LETTER_IDS.filter(
    (id) => gateSnap.alphabetLettersTraced?.[id],
  ).length;

  return (
    <div className="mt-8 space-y-6">
      <DeveloperAuthPanel />
      <PassageValidatorPanel />
      <CorpusDPreview />
      <DeveloperLexiconBrowse />

      <div className="rounded-xl border border-ink/12 border-t-rust/20 bg-parchment-card/80 p-4">
        <h3 className="font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
          Trial session (local prototype)
        </h3>
        <p className="mt-2 text-xs text-ink-muted">
          Simulates pressing <strong className="text-ink">Start trial</strong> after the
          readiness flow. The sticky header shows a countdown; Rabbi button styling
          reflects trial state. Production will tie this to auth and token limits.
        </p>
        {trialSession ? (
          <p className="mt-2 font-mono text-xs text-ink">
            Active · {formatTrialCountdown(getTrialRemainingMs(trialSession))} left
            {trialSession.badgeId != null && trialSession.badgeId !== ""
              ? ` · badge: ${trialSession.badgeId}`
              : ""}
          </p>
        ) : (
          <p className="mt-2 text-xs text-ink-faint">No active trial.</p>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-lg bg-rust px-3 py-2 font-label text-[10px] uppercase tracking-wide text-white hover:brightness-110"
            onClick={() => {
              startTrialSession(TRIAL_DURATION_MS);
              setTrialDevTick((t) => t + 1);
            }}
          >
            Start 72h trial
          </button>
          <button
            type="button"
            className="rounded-lg border border-ink/15 bg-parchment-deep/40 px-3 py-2 font-label text-[10px] uppercase tracking-wide text-ink hover:bg-parchment-deep/60"
            onClick={() => {
              startTrialSession(2 * 60 * 1000);
              setTrialDevTick((t) => t + 1);
            }}
          >
            Start 2 min trial
          </button>
          <button
            type="button"
            className="rounded-lg border border-ink/15 px-3 py-2 font-label text-[10px] uppercase tracking-wide text-ink-muted hover:bg-parchment-deep/40"
            onClick={() => {
              clearTrialSession();
              setTrialDevTick((t) => t + 1);
            }}
          >
            Clear trial
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-ink/12 border-t-sage/30 bg-parchment-card/80 p-4">
        <h3 className="font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
          Course gates (alphabet, foundation exit, bridge)
        </h3>
        <p className="mt-2 text-xs text-ink-muted">
          <code className="text-[11px]">alphabetGate</code>:{" "}
          <strong className="text-ink">
            {gateSnap.alphabetGate ?? "(unset → resolver)"}
          </strong>
          . <code className="text-[11px]">alphabetLettersTraced</code>:{" "}
          <strong className="text-ink">
            {alphabetLettersDev}/{ALPHABET_LETTER_IDS.length}
          </strong>
          . <code className="text-[11px]">alphabetFinalExamPassed</code>:{" "}
          <strong className="text-ink">
            {gateSnap.alphabetFinalExamPassed === true ? "true" : "false"}
          </strong>
          . <code className="text-[11px]">foundationExit</code>: reading{" "}
          {fe.reading ? "✓" : "·"} grammar {fe.grammar ? "✓" : "·"} lexicon{" "}
          {fe.lexicon ? "✓" : "·"}.{" "}
          <code className="text-[11px]">bridgeModulePassed</code>:{" "}
          <strong className="text-ink">{bridgePassedDev ? "true" : "false"}</strong>.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-lg border border-ink/15 px-3 py-2 font-label text-[10px] uppercase tracking-wide text-ink hover:bg-parchment-deep/40"
            onClick={() => {
              const p = loadLearnProgress();
              const next = { ...p };
              delete next.alphabetGate;
              saveLearnProgress(next);
              setGateDevTick((t) => t + 1);
            }}
          >
            Clear alphabet gate
          </button>
          <button
            type="button"
            className="rounded-lg border border-ink/15 px-3 py-2 font-label text-[10px] uppercase tracking-wide text-ink hover:bg-parchment-deep/40"
            onClick={() => {
              let p = loadLearnProgress();
              p = setAlphabetGate(p, "unseen");
              saveLearnProgress(p);
              setGateDevTick((t) => t + 1);
            }}
          >
            Set alphabet unseen
          </button>
          <button
            type="button"
            className="rounded-lg border border-ink/15 px-3 py-2 font-label text-[10px] uppercase tracking-wide text-ink-muted hover:bg-parchment-deep/40"
            onClick={() => {
              const p = loadLearnProgress();
              const next = { ...p };
              delete next.alphabetLettersTraced;
              delete next.alphabetFinalExamPassed;
              if (next.alphabetGate === "passed") {
                next.alphabetGate = "in_progress";
              }
              saveLearnProgress(next);
              setGateDevTick((t) => t + 1);
            }}
          >
            Clear alphabet letters & final
          </button>
          <button
            type="button"
            className="rounded-lg border border-ink/15 px-3 py-2 font-label text-[10px] uppercase tracking-wide text-ink hover:bg-parchment-deep/40"
            onClick={() => {
              const p = loadLearnProgress();
              const next = { ...p };
              delete next.foundationExit;
              saveLearnProgress(next);
              setGateDevTick((t) => t + 1);
            }}
          >
            Clear foundation exit
          </button>
          <button
            type="button"
            className="rounded-lg bg-sage px-3 py-2 font-label text-[10px] uppercase tracking-wide text-white hover:brightness-110"
            onClick={() => {
              let p = loadLearnProgress();
              (["reading", "grammar", "lexicon"] as const).forEach((k) => {
                p = setFoundationExitStrand(p, k, true);
              });
              saveLearnProgress(p);
              setGateDevTick((t) => t + 1);
            }}
          >
            Pass all exit strands
          </button>
          <button
            type="button"
            className="rounded-lg border border-ink/15 px-3 py-2 font-label text-[10px] uppercase tracking-wide text-ink-muted hover:bg-parchment-deep/40"
            onClick={() => {
              const p = loadLearnProgress();
              const next = setBridgeModulePassed(p, false);
              saveLearnProgress(next);
              setGateDevTick((t) => t + 1);
            }}
          >
            Clear bridge module pass
          </button>
          <button
            type="button"
            className="rounded-lg border border-ink/15 px-3 py-2 font-label text-[10px] uppercase tracking-wide text-ink-muted hover:bg-parchment-deep/40"
            onClick={() => {
              const p = loadLearnProgress();
              const next = { ...p };
              delete next.bridgeUnitsCompleted;
              saveLearnProgress(next);
              setGateDevTick((t) => t + 1);
            }}
          >
            Clear bridge units only
          </button>
          <button
            type="button"
            className="rounded-lg bg-sage/80 px-3 py-2 font-label text-[10px] uppercase tracking-wide text-white hover:brightness-110"
            onClick={() => {
              let p = loadLearnProgress();
              p = setBridgeModulePassed(p, true);
              saveLearnProgress(p);
              setGateDevTick((t) => t + 1);
            }}
          >
            Pass bridge module
          </button>
          <button
            type="button"
            className="rounded-lg border border-ink/15 px-3 py-2 font-label text-[10px] uppercase tracking-wide text-ink-muted hover:bg-parchment-deep/40"
            onClick={() => {
              const p = loadLearnProgress();
              const next = { ...p };
              delete next.specialtyTierPassed;
              saveLearnProgress(next);
              setGateDevTick((t) => t + 1);
            }}
          >
            Clear specialty tier passes
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-ink/12 border-t-sage/25 bg-parchment-card/80 p-4">
        <h3 className="font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
          Import from legacy HTML app
        </h3>
        <p className="mt-2 text-xs text-ink-muted">
          If you studied in the legacy single-page app in this browser, section
          checkmarks live under{" "}
          <code className="text-[11px]">ivrit_lr</code> (or{" "}
          <code className="text-[11px]">ivrit_lr__&lt;user&gt;</code> when
          logged in there). Merge copies matching ids into{" "}
          <code className="text-[11px]">{LEARN_PROGRESS_KEY}</code> and raises{" "}
          <strong className="text-ink">active level</strong> to at least legacy{" "}
          <code className="text-[11px]">ivrit_lv</code>.{" "}
          <strong className="text-ink">Streak</strong> merges longest run; if
          you already have a Next streak (UTC day), current streak stays on the
          web copy. <strong className="text-ink">Vocab levels</strong> (
          <code className="text-[11px]">learner.vocab</code>,{" "}
          <code className="text-[11px]">lv</code>) merge into{" "}
          <code className="text-[11px]">vocabLevels</code> for Bet–Dalet{" "}
          <code className="text-[11px]">unlockMastered</code> gates (with the
          course word list in this app).
        </p>
        {!legacyPreview.found ? (
          <p className="mt-3 text-xs text-ink-faint">
            No legacy learner blob detected on this device.
          </p>
        ) : legacyPreview.parseError ? (
          <p className="mt-3 text-xs text-rust">{legacyPreview.parseError}</p>
        ) : (
          <ul className="mt-3 space-y-1 font-mono text-[11px] text-ink-muted">
            <li>Key: {legacyPreview.sourceKey}</li>
            <li>Legacy sections marked: {legacyPreview.legacyMarkedCount}</li>
            <li>Match Next course ids: {legacyPreview.knownOverlapCount}</li>
            <li>New completions for this app: {legacyPreview.newlyCompletedCount}</li>
            {legacyPreview.legacyLevel != null ? (
              <li>
                Legacy level ({legacyPreview.legacyLevelKey}):{" "}
                {legacyPreview.legacyLevel}
              </li>
            ) : null}
            {legacyPreview.unknownSampleIds.length > 0 ? (
              <li className="text-ink-faint">
                Unknown ids (skipped):{" "}
                {legacyPreview.unknownSampleIds.join(", ")}
                {legacyPreview.legacyMarkedCount >
                legacyPreview.knownOverlapCount +
                  legacyPreview.unknownSampleIds.length
                  ? " …"
                  : ""}
              </li>
            ) : null}
            <li>
              Legacy vocab lemmas: {legacyPreview.legacyVocabLemmas} (lv≥2:{" "}
              {legacyPreview.legacyVocabMastered})
            </li>
            <li>
              Legacy root drill: {legacyPreview.legacyRootDrillFamilies} families,{" "}
              {legacyPreview.legacyRootDrillFormEntries} form slot
              {legacyPreview.legacyRootDrillFormEntries === 1 ? "" : "s"}
            </li>
          </ul>
        )}
        {legacyImportNote ? (
          <p className="mt-2 text-xs text-sage">{legacyImportNote}</p>
        ) : null}
        <button
          type="button"
          disabled={!legacyPreview.found || !!legacyPreview.parseError}
          className="mt-4 rounded-lg bg-sage px-4 py-2 font-label text-[10px] uppercase tracking-wide text-white hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          onClick={() => {
            setLegacyImportNote(null);
            const r = mergeLegacyLearnIntoWebApp();
            if (r.ok) {
              setLegacyImportNote(
                `${r.message} ${r.sectionsMerged} section(s) newly marked; active ${r.activeLevelBefore} → ${r.activeLevelAfter}. Vocab lemmas merged: ${r.vocabLemmasMerged}.`,
              );
            } else {
              setLegacyImportNote(r.message);
            }
            setLegacyImportTick((t) => t + 1);
          }}
        >
          Merge legacy completions
        </button>
      </div>

      <div className="rounded-xl border border-ink/12 border-t-sage/25 bg-parchment-card/80 p-4">
        <h3 className="font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
          Legacy Library passages (<code className="text-[11px]">ivrit_lib</code>)
        </h3>
        <p className="mt-2 text-xs text-ink-muted">
          Passages saved in the legacy single-page app live under{" "}
          <code className="text-[11px]">ivrit_lib</code>, or{" "}
          <code className="text-[11px]">ivrit_lib__&lt;user&gt;</code> when the
          legacy app had an active session (
          <code className="text-[11px]">ivrit_session_v1</code>). Merge copies
          new items into{" "}
          <code className="text-[11px]">{LIBRARY_SAVED_KEY}</code> (same ids are
          skipped). Vocab/quiz data from legacy rows is not imported.
        </p>
        {!legacyLibPreview.found ? (
          <p className="mt-3 text-xs text-ink-faint">
            No legacy library array found on this device.
          </p>
        ) : legacyLibPreview.parseError ? (
          <p className="mt-3 text-xs text-rust">{legacyLibPreview.parseError}</p>
        ) : legacyLibPreview.legacyCount === 0 ? (
          <p className="mt-3 text-xs text-ink-faint">
            Legacy library key exists but is empty.
          </p>
        ) : (
          <ul className="mt-3 space-y-1 font-mono text-[11px] text-ink-muted">
            <li>Key: {legacyLibPreview.storageKey}</li>
            <li>Rows in legacy: {legacyLibPreview.legacyCount}</li>
            <li>Mappable passages: {legacyLibPreview.mappableCount}</li>
            {legacyLibPreview.sampleTitles.length > 0 ? (
              <li className="text-ink-faint">
                Sample: {legacyLibPreview.sampleTitles.join(" · ")}
              </li>
            ) : null}
          </ul>
        )}
        {legacyLibImportNote ? (
          <p className="mt-2 text-xs text-sage">{legacyLibImportNote}</p>
        ) : null}
        <button
          type="button"
          disabled={
            !legacyLibPreview.found ||
            !!legacyLibPreview.parseError ||
            legacyLibPreview.mappableCount === 0
          }
          className="mt-4 rounded-lg bg-sage px-4 py-2 font-label text-[10px] uppercase tracking-wide text-white hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          onClick={() => {
            setLegacyLibImportNote(null);
            const r = mergeLegacyLibraryIntoWebApp();
            if (r.ok) {
              setLegacyLibImportNote(
                `${r.message} Added ${r.added}; skipped (already had id) ${r.skipped}.`,
              );
            } else {
              setLegacyLibImportNote(r.message);
            }
            setLegacyLibImportTick((t) => t + 1);
          }}
        >
          Merge legacy library passages
        </button>
      </div>

      <div
        id="dev-library-json"
        className="scroll-mt-24 rounded-xl border border-ink/12 border-t-sage/20 bg-parchment-card/80 p-4"
      >
        <h3 className="font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
          Library saves JSON (this app)
        </h3>
        <p className="mt-2 text-xs text-ink-muted">
          Download or import passages stored under{" "}
          <code className="rounded bg-parchment-deep/50 px-1 text-[11px]">
            {LIBRARY_SAVED_KEY}
          </code>
          . Merge adds by <code className="text-[11px]">id</code> (skips
          duplicates); replace overwrites all saves.
        </p>
        {libraryBackupFeedback ? (
          <p
            className={`mt-2 text-xs ${libraryBackupFeedback.variant === "err" ? "text-rust" : "text-sage"}`}
          >
            {libraryBackupFeedback.text}
          </p>
        ) : null}
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-lg bg-sage px-4 py-2 font-label text-[10px] uppercase tracking-wide text-white hover:brightness-110"
            onClick={() => {
              setLibraryBackupFeedback(null);
              const json = stringifyLibrarySavedExport();
              const blob = new Blob([json], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `hebrew-library-saves-${new Date().toISOString().slice(0, 10)}.json`;
              a.click();
              URL.revokeObjectURL(url);
              setLibraryBackupFeedback({
                variant: "ok",
                text: "Download started.",
              });
            }}
          >
            Download library JSON
          </button>
          <button
            type="button"
            className="rounded-lg border border-ink/15 px-4 py-2 font-label text-[10px] uppercase tracking-wide text-ink-muted hover:bg-parchment-deep/40"
            onClick={() => {
              libraryBackupModeRef.current = "merge";
              libraryBackupFileRef.current?.click();
            }}
          >
            Merge from file…
          </button>
          <button
            type="button"
            className="rounded-lg border border-rust/35 px-4 py-2 font-label text-[10px] uppercase tracking-wide text-rust hover:bg-rust/10"
            onClick={() => {
              libraryBackupModeRef.current = "replace";
              libraryBackupFileRef.current?.click();
            }}
          >
            Replace from file…
          </button>
        </div>
        <input
          ref={libraryBackupFileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={async (e) => {
            const input = e.target;
            const file = input.files?.[0];
            const mode = libraryBackupModeRef.current;
            libraryBackupModeRef.current = "merge";
            input.value = "";
            if (!file) return;
            setLibraryBackupFeedback(null);
            const text = await file.text();
            const parsed = parseLibrarySavedBackupJson(text);
            if (!parsed.ok) {
              setLibraryBackupFeedback({ variant: "err", text: parsed.error });
              return;
            }
            if (parsed.passages.length === 0) {
              setLibraryBackupFeedback({
                variant: "err",
                text: "No valid passages in file.",
              });
              return;
            }
            if (mode === "replace") {
              const ok =
                typeof window !== "undefined" &&
                window.confirm(
                  "Replace ALL Library saves on this device with the file?",
                );
              if (!ok) return;
              replaceLibrarySavedList(parsed.passages);
              setLibraryBackupFeedback({
                variant: "ok",
                text: `Replaced with ${parsed.passages.length} passage(s).`,
              });
              setLegacyLibImportTick((t) => t + 1);
              return;
            }
            const r = mergePassagesIntoLibrarySaved(parsed.passages);
            setLibraryBackupFeedback({
              variant: "ok",
              text: `Merged: added ${r.added}, skipped (same id) ${r.skipped}.`,
            });
            setLegacyLibImportTick((t) => t + 1);
          }}
        />
      </div>

      <div className="rounded-xl border border-ink/12 border-t-amber/20 bg-parchment-card/80 p-4">
        <h3 className="font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
          Export for legacy HTML app (<code className="text-[11px]">ivrit_lr</code>)
        </h3>
        <p className="mt-2 text-xs text-ink-muted">
          Download a JSON file with <code className="text-[11px]">ivrit_lr</code>{" "}
          (learner object) and <code className="text-[11px]">ivrit_lv</code>{" "}
          shaped like the legacy HTML app expected. If this browser still has
          legacy data, it is{" "}
          <strong className="text-ink">merged</strong> (union completions, max
          vocab <code className="text-[11px]">lv</code>, max root-drill hits,
          streak by latest UTC day). Otherwise you get a minimal learner shell
          plus this app&apos;s progress.
        </p>
        <p className="mt-2 text-[11px] leading-relaxed text-ink-faint">
          The JSON includes <code className="text-[10px]">targetStorageKey</code>{" "}
          (e.g. <code className="text-[10px]">ivrit_lr</code> or{" "}
          <code className="text-[10px]">ivrit_lr__username</code> when a legacy
          session exists in this browser). Set that key to{" "}
          <code className="text-[10px]">JSON.stringify(file.ivrit_lr)</code> and
          the matching <code className="text-[10px]">ivrit_lv</code> key to your
          level. See <code className="text-[10px]">instructions</code> in the
          file. Reload the HTML app.
        </p>
        {ivritExportNote ? (
          <p className="mt-2 text-xs text-sage">{ivritExportNote}</p>
        ) : null}
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-lg border border-amber/40 bg-amber/15 px-4 py-2 font-label text-[10px] uppercase tracking-wide text-ink hover:bg-amber/25"
            onClick={() => {
              setIvritExportNote(null);
              const json = stringifyIvritLegacyExport(loadLearnProgress());
              const blob = new Blob([json], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `hebrew-ivrit-legacy-export-${new Date().toISOString().slice(0, 10)}.json`;
              a.click();
              URL.revokeObjectURL(url);
              setIvritExportNote("Download started. Keep a backup of legacy storage before overwriting.");
            }}
          >
            Download ivrit export
          </button>
          <button
            type="button"
            className="rounded-lg border border-ink/15 px-4 py-2 font-label text-[10px] uppercase tracking-wide text-ink-muted hover:bg-parchment-deep/40"
            onClick={async () => {
              setIvritExportNote(null);
              try {
                await navigator.clipboard.writeText(
                  stringifyIvritLegacyExport(loadLearnProgress()),
                );
                setIvritExportNote("Full export JSON copied to clipboard.");
              } catch {
                setIvritExportNote("Could not copy — use download instead.");
              }
            }}
          >
            Copy JSON
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-ink/12 border-t-sage/20 bg-parchment-card/80 p-4">
        <h3 className="font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
          JSON backup (this app)
        </h3>
        <p className="mt-2 text-xs text-ink-muted">
          Download <strong className="text-ink">schema v3</strong>: Hebrew (
          <code className="rounded bg-parchment-deep/50 px-1 text-[11px]">
            {LEARN_PROGRESS_KEY}
          </code>
          ), optional Yiddish (
          <code className="rounded bg-parchment-deep/50 px-1 text-[11px]">
            hebrew-web-yiddish-v1
          </code>
          ), and optional saved words (
          <code className="rounded bg-parchment-deep/50 px-1 text-[11px]">
            hebrew-web-saved-words-v1
          </code>
          ) from legacy <code className="text-[11px]">ivrit_saved</code> merges.
          v2 backups still import. Merge unions progress; Yiddish sections union;
          saved words merge by Hebrew/translit/gloss. Replace overwrites Hebrew,
          Yiddish, and saved words only when the file includes a{" "}
          <code className="text-[11px]">savedWords</code> array (v3).
        </p>
        {backupFeedback ? (
          <p
            className={`mt-2 text-xs ${backupFeedback.variant === "err" ? "text-rust" : "text-sage"}`}
          >
            {backupFeedback.text}
          </p>
        ) : null}
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-lg bg-sage px-4 py-2 font-label text-[10px] uppercase tracking-wide text-white hover:brightness-110"
            onClick={() => {
              setBackupFeedback(null);
              const json = stringifyAppProgressExport(
                loadLearnProgress(),
                loadYiddishProgress(),
                loadSavedWords(),
              );
              const blob = new Blob([json], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `hebrew-app-backup-${new Date().toISOString().slice(0, 10)}.json`;
              a.click();
              URL.revokeObjectURL(url);
              setBackupFeedback({ variant: "ok", text: "Download started (v3)." });
            }}
          >
            Download JSON
          </button>
          <button
            type="button"
            className="rounded-lg border border-ink/15 px-4 py-2 font-label text-[10px] uppercase tracking-wide text-ink-muted hover:bg-parchment-deep/40"
            onClick={() => {
              backupModeRef.current = "merge";
              backupFileRef.current?.click();
            }}
          >
            Merge from file…
          </button>
          <button
            type="button"
            className="rounded-lg border border-rust/35 px-4 py-2 font-label text-[10px] uppercase tracking-wide text-rust hover:bg-rust/10"
            onClick={() => {
              backupModeRef.current = "replace";
              backupFileRef.current?.click();
            }}
          >
            Replace from file…
          </button>
        </div>
        <input
          ref={backupFileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={async (e) => {
            const input = e.target;
            const file = input.files?.[0];
            const mode = backupModeRef.current;
            backupModeRef.current = "merge";
            input.value = "";
            if (!file) return;
            setBackupFeedback(null);
            const text = await file.text();
            const parsed = parseAppProgressJson(text);
            if (!parsed.ok) {
              setBackupFeedback({ variant: "err", text: parsed.error });
              return;
            }
            if (mode === "replace") {
              const ok =
                typeof window !== "undefined" &&
                window.confirm(
                  "Replace ALL Hebrew + Yiddish progress on this device with this file? This cannot be undone.",
                );
              if (!ok) return;
              saveLearnProgress(parsed.progress);
              saveYiddishProgress(
                parsed.yiddish ?? createEmptyYiddishProgressState(),
              );
              if (parsed.savedWords !== undefined) {
                saveSavedWords(parsed.savedWords);
              }
              setBackupFeedback({
                variant: "ok",
                text:
                  parsed.savedWords !== undefined
                    ? "Replaced local Hebrew, Yiddish, and saved words from file."
                    : "Replaced local Hebrew and Yiddish from file.",
              });
              setLegacyImportTick((t) => t + 1);
              return;
            }
            const merged = mergeLearnProgressStates(
              loadLearnProgress(),
              parsed.progress,
            );
            saveLearnProgress(merged);
            if (parsed.yiddish) {
              const yMerged = mergeYiddishProgressStates(
                loadYiddishProgress(),
                parsed.yiddish,
              );
              saveYiddishProgress(yMerged);
            }
            if (parsed.savedWords !== undefined && parsed.savedWords.length > 0) {
              saveSavedWords(
                mergeSavedWordLists(loadSavedWords(), parsed.savedWords),
              );
            }
            setBackupFeedback({
              variant: "ok",
              text: "Merged file into local progress (Hebrew + Yiddish + saved words if present).",
            });
            setLegacyImportTick((t) => t + 1);
          }}
        />
      </div>

      <div
        id="dev-cloud-backup"
        className="scroll-mt-24 rounded-xl border border-ink/12 border-t-sage/25 bg-parchment-card/80 p-4"
      >
        <h3 className="font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
          Cloud backup (Vercel KV)
        </h3>
        <p className="mt-2 text-xs text-ink-muted">
          When{" "}
          <code className="rounded bg-parchment-deep/50 px-1 text-[11px]">KV_REST_*</code>{" "}
          is set on the server, this app can store a{" "}
          <strong className="text-ink">sanitized</strong> copy of Learn progress
          in KV. Access is gated by a random{" "}
          <strong className="text-ink">sync key</strong> in this browser (not a
          login). Anyone with the key can read or overwrite the backup — treat it
          like a secret. See{" "}
          <code className="rounded bg-parchment-deep/50 px-1 text-[11px]">
            docs/cloud-progress.md
          </code>
          .
        </p>
        {cloudFeedback ? (
          <p
            className={`mt-2 text-xs ${cloudFeedback.variant === "err" ? "text-rust" : "text-sage"}`}
          >
            {cloudFeedback.text}
          </p>
        ) : null}
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-lg bg-sage px-4 py-2 font-label text-[10px] uppercase tracking-wide text-white hover:brightness-110"
            onClick={async () => {
              setCloudFeedback(null);
              getOrCreateCloudSyncToken();
              const r = await pushProgressToCloud();
              setCloudFeedback(
                r.ok
                  ? { variant: "ok", text: "Pushed local Learn progress to KV." }
                  : { variant: "err", text: r.error },
              );
            }}
          >
            Push to cloud
          </button>
          <button
            type="button"
            className="rounded-lg border border-ink/15 px-4 py-2 font-label text-[10px] uppercase tracking-wide text-ink hover:bg-parchment-deep/40"
            onClick={async () => {
              setCloudFeedback(null);
              getOrCreateCloudSyncToken();
              const r = await pullProgressFromCloud("merge");
              setCloudFeedback(
                r.ok
                  ? {
                      variant: "ok",
                      text: "Merged cloud backup into local progress (union).",
                    }
                  : { variant: "err", text: r.error },
              );
              if (r.ok) setLegacyImportTick((t) => t + 1);
            }}
          >
            Restore from cloud (merge)
          </button>
          <button
            type="button"
            className="rounded-lg border border-rust/35 px-4 py-2 font-label text-[10px] uppercase tracking-wide text-rust hover:bg-rust/10"
            onClick={async () => {
              setCloudFeedback(null);
              if (
                typeof window !== "undefined" &&
                !window.confirm(
                  "Replace ALL local Learn progress with the cloud copy? This cannot be undone.",
                )
              ) {
                return;
              }
              getOrCreateCloudSyncToken();
              const r = await pullProgressFromCloud("replace");
              setCloudFeedback(
                r.ok
                  ? {
                      variant: "ok",
                      text: "Replaced local progress from cloud.",
                    }
                  : { variant: "err", text: r.error },
              );
              if (r.ok) setLegacyImportTick((t) => t + 1);
            }}
          >
            Restore from cloud (replace)
          </button>
          <button
            type="button"
            className="rounded-lg border border-ink/15 px-4 py-2 font-label text-[10px] uppercase tracking-wide text-ink-muted hover:bg-parchment-deep/40"
            onClick={async () => {
              setCloudFeedback(null);
              const t = getOrCreateCloudSyncToken();
              try {
                await navigator.clipboard.writeText(t);
                setCloudFeedback({
                  variant: "ok",
                  text: "Sync key copied — store it safely to restore on another device.",
                });
              } catch {
                setCloudFeedback({
                  variant: "err",
                  text: "Could not copy. Check browser permissions.",
                });
              }
            }}
          >
            Copy sync key
          </button>
          <button
            type="button"
            className="rounded-lg border border-ink/15 px-4 py-2 font-label text-[10px] uppercase tracking-wide text-ink-muted hover:bg-parchment-deep/40"
            onClick={() => {
              setCloudFeedback(null);
              if (typeof window === "undefined") return;
              const paste = window.prompt(
                "Paste sync key from your other browser (UUID format).",
              );
              if (!paste?.trim()) return;
              const v = paste.trim();
              if (v.length < 16) {
                setCloudFeedback({
                  variant: "err",
                  text: "Key too short.",
                });
                return;
              }
              try {
                localStorage.setItem(CLOUD_SYNC_TOKEN_KEY, v);
                setCloudFeedback({
                  variant: "ok",
                  text: "Sync key saved — use Restore from cloud when KV is configured.",
                });
              } catch {
                setCloudFeedback({
                  variant: "err",
                  text: "Could not save key.",
                });
              }
            }}
          >
            Paste sync key
          </button>
          <button
            type="button"
            className="rounded-lg border border-amber/35 px-4 py-2 font-label text-[10px] uppercase tracking-wide text-amber hover:bg-amber/10"
            onClick={() => {
              setCloudFeedback(null);
              if (
                typeof window !== "undefined" &&
                !window.confirm(
                  "Generate a new sync key? The old key will no longer match this browser — save the old key if you still need the cloud backup.",
                )
              ) {
                return;
              }
              regenerateCloudSyncToken();
              setCloudFeedback({
                variant: "ok",
                text: "New sync key generated for this browser.",
              });
            }}
          >
            New sync key
          </button>
          <button
            type="button"
            className="rounded-lg border border-ink/15 px-4 py-2 font-label text-[10px] uppercase tracking-wide text-ink-muted hover:bg-parchment-deep/40"
            onClick={async () => {
              setCloudFeedback(null);
              if (
                typeof window !== "undefined" &&
                !window.confirm(
                  "Delete the cloud backup for the current sync key? Local progress is unchanged.",
                )
              ) {
                return;
              }
              const r = await deleteCloudProgress();
              setCloudFeedback(
                r.ok
                  ? { variant: "ok", text: "Cloud backup deleted for this key." }
                  : { variant: "err", text: r.error },
              );
            }}
          >
            Delete cloud copy
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-ink/12 bg-parchment-card/80 p-4">
        <h3 className="font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
          Local storage (this browser)
        </h3>
        <ul className="mt-2 space-y-1 font-mono text-[11px] text-ink-muted">
          {storageLines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-lg border border-ink/20 bg-parchment-deep/30 px-3 py-2 font-label text-[10px] uppercase tracking-wide text-ink-muted transition hover:bg-parchment-deep/50"
            onClick={() => {
              if (
                typeof window !== "undefined" &&
                window.confirm(
                  "Clear only vocabulary levels (vocabLevels)? Completions, streak, and MCQ totals stay.",
                )
              ) {
                clearVocabLevelsOnly();
                setLegacyImportTick((t) => t + 1);
              }
            }}
          >
            Clear vocab levels only
          </button>
          <button
            type="button"
            className="rounded-lg border border-rust/40 bg-rust/10 px-3 py-2 font-label text-[10px] uppercase tracking-wide text-rust transition hover:bg-rust/20"
            onClick={() => {
              if (
                typeof window !== "undefined" &&
                window.confirm(
                  "Clear Learn progress and Next-up panel state on this device?",
                )
              ) {
                resetWebAppLocalCourseState();
                setLegacyImportTick((t) => t + 1);
              }
            }}
          >
            Reset Learn + Next up storage
          </button>
          <button
            type="button"
            className="rounded-lg border border-ink/20 bg-parchment-deep/30 px-3 py-2 font-label text-[10px] uppercase tracking-wide text-ink-muted transition hover:bg-parchment-deep/50"
            onClick={() => {
              if (
                typeof window !== "undefined" &&
                window.confirm(
                  "Clear Yiddish course storage (hebrew-web-yiddish-v1) only?",
                )
              ) {
                resetYiddishProgressLocal();
                setLegacyImportTick((t) => t + 1);
              }
            }}
          >
            Clear Yiddish course storage
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-ink/12 bg-parchment-card/80 p-4">
        <h3 className="font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
          Display name (local only)
        </h3>
        <p className="mt-2 text-xs text-ink-muted">
          Shown under the Hebrew title in the header. Not sent to any server.
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="text"
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            placeholder="e.g. Dov"
            maxLength={48}
            className="min-w-0 flex-1 rounded-lg border border-ink/15 bg-parchment px-3 py-2 text-sm text-ink placeholder:text-ink-faint"
          />
          <button
            type="button"
            className="rounded-lg bg-sage px-4 py-2 font-label text-[10px] uppercase tracking-wide text-white hover:brightness-110"
            onClick={() => saveLocalProfile({ displayName: nameDraft })}
          >
            Save
          </button>
          <button
            type="button"
            className="rounded-lg border border-ink/15 px-4 py-2 font-label text-[10px] uppercase tracking-wide text-ink-muted hover:bg-parchment-deep/40"
            onClick={() => {
              setNameDraft("");
              saveLocalProfile({});
            }}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-ink/12 bg-parchment-card/80 p-4">
        <h3 className="font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
          Learn drills (Next)
        </h3>
        <p className="mt-2 text-xs text-ink-muted">
          <strong className="text-ink">{drillCount}</strong> course sections
          have MCQ packs (Aleph + Bet–Dalet index in{" "}
          <code className="rounded bg-parchment-deep/50 px-1 text-[11px]">
            section-drills*.ts
          </code>
          ). <code className="text-[11px]">1-read</code> and{" "}
          <code className="text-[11px]">/learn/1/story</code> reuse the same
          story quiz pack.
        </p>
        <p className="mt-2 text-[10px] leading-relaxed text-ink-faint">
          {SECTION_IDS_WITH_MCQ.join(", ")}
        </p>
      </div>

      <div
        id="dev-parity-migration"
        className="space-y-6 rounded-xl border border-ink/12 border-dashed border-ink/15 bg-parchment-deep/25 p-4"
      >
        <div>
          <h3 className="font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
            Maintainer scores (optional)
          </h3>
          <p className="mt-2 text-xs text-ink-muted">
            Weighted checklists for porting work from the old single-file app.
            Hidden from Progress; open{" "}
            <Link href="/migration" className="text-sage underline hover:text-sage/90">
              Migration roadmap
            </Link>{" "}
            for the full HTML workstream list.
          </p>
        </div>
        <HtmlMigrationTracker variant="compact" />
        <LegacyParityPanel variant="full" />
      </div>

      <div className="rounded-xl border border-ink/12 bg-parchment-card/80 p-4">
        <h3 className="font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
          Docs
        </h3>
        <p className="mt-2 text-xs text-ink-muted">
          Repo:{" "}
          <code className="rounded bg-parchment-deep/50 px-1 text-[11px]">
            docs/auth-security.md
          </code>
          ,{" "}
          <code className="rounded bg-parchment-deep/50 px-1 text-[11px]">
            docs/vercel-environment.md
          </code>
          , and other notes at the project root.
        </p>
      </div>
    </div>
  );
}
