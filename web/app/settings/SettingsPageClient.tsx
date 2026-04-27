"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  LOCAL_PROFILE_EVENT,
  loadLocalProfile,
  saveLocalProfile,
} from "@/lib/local-profile";
import {
  PREFERENCES_EVENT,
  loadPreferences,
  savePreferences,
} from "@/lib/learn-preferences";
import {
  LEARN_PROGRESS_EVENT,
  loadLearnProgress,
  saveLearnProgress,
} from "@/lib/learn-progress";
import type { AppSession } from "@/lib/app-session.model";
import {
  mergeLearnProgressStates,
  parseAppProgressJson,
  stringifyAppProgressExport,
} from "@/lib/learn-progress-backup";
import {
  loadYiddishProgress,
  saveYiddishProgress,
  mergeYiddishProgressStates,
  createEmptyYiddishProgressState,
} from "@/lib/yiddish-progress";
import {
  loadSavedWords,
  saveSavedWords,
  mergeSavedWordLists,
} from "@/lib/saved-words";
import {
  pushProgressToCloud,
  pullProgressFromCloud,
} from "@/lib/cloud-progress-client";
import { getUniversalResumePath } from "@/lib/app-activity";

// ─── small UI helpers ─────────────────────────────────────────────────────────

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/50 ${
        checked
          ? "border-sage bg-sage"
          : "border-ink/20 bg-parchment-deep/60"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

type FeedbackState = { variant: "ok" | "err"; text: string } | null;

function Feedback({ fb }: { fb: FeedbackState }) {
  if (!fb) return null;
  return (
    <p
      className={`mt-2 rounded-lg px-3 py-2 text-xs ${
        fb.variant === "ok"
          ? "bg-sage/10 text-sage"
          : "bg-rust/10 text-rust"
      }`}
    >
      {fb.text}
    </p>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export function SettingsPageClient() {
  // ── profile ──────────────────────────────────────────────────────────────
  const [nameDraft, setNameDraft] = useState("");

  const syncName = useCallback(() => {
    setNameDraft(loadLocalProfile().displayName ?? "");
  }, []);
  useEffect(() => {
    syncName();
    window.addEventListener(LOCAL_PROFILE_EVENT, syncName);
    return () => window.removeEventListener(LOCAL_PROFILE_EVENT, syncName);
  }, [syncName]);

  // ── preferences ──────────────────────────────────────────────────────────
  const [prefs, setPrefs] = useState(() => loadPreferences());

  const syncPrefs = useCallback(() => setPrefs(loadPreferences()), []);
  useEffect(() => {
    syncPrefs();
    window.addEventListener(PREFERENCES_EVENT, syncPrefs);
    return () => window.removeEventListener(PREFERENCES_EVENT, syncPrefs);
  }, [syncPrefs]);

  const setPref = useCallback(
    (patch: Parameters<typeof savePreferences>[0]) => {
      savePreferences(patch);
    },
    [],
  );

  // ── backup ───────────────────────────────────────────────────────────────
  const [backupFb, setBackupFb] = useState<FeedbackState>(null);
  const [cloudFb, setCloudFb] = useState<FeedbackState>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const importModeRef = useRef<"merge" | "replace">("merge");

  // listen for progress changes to reflect import
  useEffect(() => {
    const bump = () => setBackupFb(null);
    window.addEventListener(LEARN_PROGRESS_EVENT, bump);
    return () => window.removeEventListener(LEARN_PROGRESS_EVENT, bump);
  }, []);

  const [appSession, setAppSession] = useState<AppSession | undefined>(undefined);
  useEffect(() => {
    const sync = () => setAppSession(loadLearnProgress().appSession);
    sync();
    window.addEventListener(LEARN_PROGRESS_EVENT, sync);
    return () => window.removeEventListener(LEARN_PROGRESS_EVENT, sync);
  }, []);

  const resumeFromActivityHref = useMemo(
    () => getUniversalResumePath(loadLearnProgress()),
    [appSession],
  );

  const handleExport = useCallback(() => {
    setBackupFb(null);
    const json = stringifyAppProgressExport(
      loadLearnProgress(),
      loadYiddishProgress(),
      loadSavedWords(),
    );
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hebrew-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setBackupFb({ variant: "ok", text: "Backup downloaded (schema v3, includes Yiddish + saved words)." });
  }, []);

  const handleImportFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target;
      const file = input.files?.[0];
      const mode = importModeRef.current;
      importModeRef.current = "merge";
      input.value = "";
      if (!file) return;
      setBackupFb(null);
      const text = await file.text();
      const parsed = parseAppProgressJson(text);
      if (!parsed.ok) {
        setBackupFb({ variant: "err", text: parsed.error });
        return;
      }
      if (mode === "replace") {
        const ok = window.confirm(
          "Replace ALL Hebrew + Yiddish progress on this device with this file? This cannot be undone.",
        );
        if (!ok) return;
        saveLearnProgress(parsed.progress);
        saveYiddishProgress(
          parsed.yiddish ?? createEmptyYiddishProgressState(),
        );
        if (parsed.savedWords !== undefined) saveSavedWords(parsed.savedWords);
        setBackupFb({
          variant: "ok",
          text: "Progress replaced from backup file.",
        });
        return;
      }
      // merge mode
      saveLearnProgress(mergeLearnProgressStates(loadLearnProgress(), parsed.progress));
      if (parsed.yiddish) {
        saveYiddishProgress(mergeYiddishProgressStates(loadYiddishProgress(), parsed.yiddish));
      }
      if (parsed.savedWords?.length) {
        saveSavedWords(mergeSavedWordLists(loadSavedWords(), parsed.savedWords));
      }
      setBackupFb({
        variant: "ok",
        text: "Merged backup into local progress.",
      });
    },
    [],
  );

  const handleCloudPush = useCallback(async () => {
    setCloudFb(null);
    const result = await pushProgressToCloud();
    setCloudFb(
      result.ok
        ? { variant: "ok", text: "Progress saved to cloud." }
        : { variant: "err", text: result.error },
    );
  }, []);

  const handleCloudPull = useCallback(async () => {
    setCloudFb(null);
    const result = await pullProgressFromCloud("merge");
    setCloudFb(
      result.ok
        ? { variant: "ok", text: "Progress loaded from cloud and merged." }
        : { variant: "err", text: result.error },
    );
  }, []);

  return (
    <div className="mx-auto max-w-lg space-y-6">

      {/* ── Learner name ─────────────────────────────────────────────── */}
      <section className="surface-elevated p-5">
        <p className="section-label text-sage">Learner name</p>
        <p className="mt-1 text-xs text-ink-muted">
          Shown under עִבְרִית in the header — local only, no account needed.
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="text"
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveLocalProfile({ displayName: nameDraft });
            }}
            placeholder="e.g. Dov"
            maxLength={48}
            className="input-inset min-w-0 flex-1 px-3 py-2 text-sm"
          />
          <button
            type="button"
            className="btn-elevated-primary shrink-0"
            onClick={() => saveLocalProfile({ displayName: nameDraft })}
          >
            Save
          </button>
          <button
            type="button"
            className="btn-elevated-secondary shrink-0"
            onClick={() => {
              setNameDraft("");
              saveLocalProfile({});
            }}
          >
            Clear
          </button>
        </div>
      </section>

      {/* ── Study preferences ────────────────────────────────────────── */}
      <section className="surface-elevated p-5">
        <p className="section-label text-sage">Study preferences</p>
        <p className="mt-1 text-xs text-ink-muted">
          These apply across all drills and exercises as your default — you can
          still override them per session.
        </p>

        <ul className="mt-4 space-y-4">
          <li className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink">
                Show vowel points (ניקוד)
              </p>
              <p className="mt-0.5 text-xs text-ink-muted">
                Display nikkud by default in vocabulary drills. Turn off to
                practice reading unvoweled text.
              </p>
            </div>
            <Toggle
              checked={prefs.showNikkudDefault}
              onChange={(v) => setPref({ showNikkudDefault: v })}
              label={
                prefs.showNikkudDefault
                  ? "Vowel points on — tap to turn off"
                  : "Vowel points off — tap to turn on"
              }
            />
          </li>

          <li className="flex items-center justify-between gap-4 border-t border-ink/8 pt-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink">Auto-play audio</p>
              <p className="mt-0.5 text-xs text-ink-muted">
                Automatically speak the Hebrew prompt when each drill question
                loads.
              </p>
            </div>
            <Toggle
              checked={prefs.audioAutoPlay}
              onChange={(v) => setPref({ audioAutoPlay: v })}
              label={
                prefs.audioAutoPlay
                  ? "Audio auto-play on — tap to turn off"
                  : "Audio auto-play off — tap to turn on"
              }
            />
          </li>
        </ul>
      </section>

      {/* ── Activity log (this device) ────────────────────────────────── */}
      <section className="surface-elevated p-5">
        <p className="section-label text-sage">Recent pages (this device)</p>
        <p className="mt-1 text-xs text-ink-muted">
          Where you have moved in the app — used for “Continue” after sign-in and
          for resume when you open Learn. Included in the same progress backup
          and cloud save as your course data.
        </p>
        {resumeFromActivityHref ? (
          <div className="mt-3">
            <Link
              href={resumeFromActivityHref}
              className="inline-flex items-center gap-1.5 rounded-lg bg-sage px-3 py-2 font-label text-[10px] uppercase tracking-wide text-white transition hover:brightness-110"
            >
              Open last resumable page
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3" aria-hidden>
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>
        ) : null}
        {appSession?.visitLog && appSession.visitLog.length > 0 ? (
          <ol className="mt-3 max-h-56 space-y-1.5 overflow-y-auto text-xs">
            {appSession.visitLog.map((e) => (
              <li
                key={`${e.path}-${e.at}`}
                className="flex flex-col gap-0.5 rounded-lg border border-ink/8 bg-parchment-deep/20 px-2 py-1.5 sm:flex-row sm:items-baseline sm:justify-between"
              >
                <Link
                  href={e.path}
                  className="font-medium text-sage hover:underline"
                >
                  {e.label}
                </Link>
                <span className="shrink-0 text-[10px] text-ink-faint">
                  {new Date(e.at).toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-2 text-xs text-ink-faint">No visits recorded yet.</p>
        )}
      </section>

      {/* ── Progress data ────────────────────────────────────────────── */}
      <section className="surface-elevated p-5">
        <p className="section-label text-sage">Your progress data</p>
        <p className="mt-1 text-xs text-ink-muted">
          All progress — Hebrew course, Yiddish, saved words — lives in your
          browser. Export before switching devices or clearing storage.
        </p>

        {/* JSON backup */}
        <div className="mt-4">
          <p className="text-xs font-medium text-ink">JSON backup (local file)</p>
          <p className="mt-0.5 text-xs text-ink-muted">
            Downloads a full snapshot (schema v3: Hebrew + Yiddish + saved
            words). Import merges with current data; Replace overwrites it.
          </p>
          <Feedback fb={backupFb} />
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className="btn-elevated-primary"
              onClick={handleExport}
            >
              Export backup
            </button>
            <button
              type="button"
              className="btn-elevated-secondary"
              onClick={() => {
                importModeRef.current = "merge";
                fileRef.current?.click();
              }}
            >
              Merge from file
            </button>
            <button
              type="button"
              className="rounded-xl border border-rust/30 bg-rust/8 px-5 py-2.5 font-label text-xs uppercase tracking-wide text-rust transition hover:bg-rust/15"
              onClick={() => {
                importModeRef.current = "replace";
                fileRef.current?.click();
              }}
            >
              Replace from file
            </button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={handleImportFile}
          />
        </div>

        {/* Cloud sync */}
        <div className="mt-5 border-t border-ink/8 pt-5">
          <p className="text-xs font-medium text-ink">Cloud sync (Clerk account)</p>
          <p className="mt-0.5 text-xs text-ink-muted">
            Saves your Hebrew progress to the server via your signed-in account.
            Requires{" "}
            <strong className="text-ink">Vercel KV</strong> on the host.{" "}
            <Link href="/sign-in" className="text-sage underline hover:text-sage/80">
              Sign in
            </Link>{" "}
            if you haven't already.
          </p>
          <Feedback fb={cloudFb} />
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className="btn-elevated-primary"
              onClick={handleCloudPush}
            >
              Push to cloud
            </button>
            <button
              type="button"
              className="btn-elevated-secondary"
              onClick={handleCloudPull}
            >
              Pull from cloud
            </button>
          </div>
        </div>
      </section>

      {/* ── Account ──────────────────────────────────────────────────── */}
      <section className="surface-elevated p-5">
        <p className="section-label text-sage">Account &amp; sign-in</p>
        <ul className="mt-3 space-y-3 text-sm text-ink-muted">
          <li>
            <strong className="text-ink">Guest mode</strong> — Progress stays
            in this browser. No sign-in required. Use Export above to keep a
            backup.
          </li>
          <li>
            <strong className="text-ink">Signed in (Clerk)</strong> — Same
            local progress, plus optional cloud sync above. Your account does
            not change what content you can access; it just lets you push
            progress to the server.
          </li>
          <li>
            <strong className="text-ink">Saved words</strong> — When signed in,
            a small copy of your saved words also syncs to your Clerk account
            metadata across devices automatically.
          </li>
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/sign-in" className="btn-elevated-secondary text-center">
            Sign in
          </Link>
          <Link href="/sign-up" className="btn-elevated-secondary text-center">
            Create account
          </Link>
        </div>
      </section>

      {/* ── Advanced ─────────────────────────────────────────────────── */}
      <section className="rounded-xl border border-ink/10 bg-parchment-card/30 px-4 py-3">
        <p className="section-label">Advanced</p>
        <p className="mt-1.5 text-xs text-ink-muted">
          Legacy import (old HTML app data), passage validator, and developer
          controls live in the{" "}
          <Link href="/developer" className="text-sage underline hover:text-sage/80">
            Developer tools
          </Link>{" "}
          section.
        </p>
      </section>
    </div>
  );
}
