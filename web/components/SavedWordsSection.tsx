"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Hebrew } from "@/components/Hebrew";
import { speakHebrew } from "@/lib/speech-hebrew";
import {
  loadSavedWords,
  removeSavedWordByIdentity,
  SAVED_WORDS_EVENT,
  savedWordIdentityKey,
  type SavedWordEntry,
} from "@/lib/saved-words";

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

export function SavedWordsSection({ filter }: { filter: string }) {
  const [words, setWords] = useState<SavedWordEntry[]>([]);

  const refresh = useCallback(() => {
    setWords(loadSavedWords());
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener(SAVED_WORDS_EVENT, refresh);
    return () => window.removeEventListener(SAVED_WORDS_EVENT, refresh);
  }, [refresh]);

  const filtered = useMemo(() => {
    const q = normalize(filter);
    if (!q) return words;
    return words.filter((w) => {
      const hay = `${w.he} ${w.translit ?? ""} ${w.en ?? ""} ${w.colloquial ?? ""}`;
      return normalize(hay).includes(q);
    });
  }, [words, filter]);

  return (
    <section className="surface-elevated p-4">
      <p className="font-label text-[10px] uppercase tracking-[0.18em] text-rust">
        Saved words
      </p>
      <p className="mt-1 text-xs text-ink-muted">
        Quick bookmarks (single lemmas), separate from full{" "}
        <strong className="font-medium text-ink">passages</strong> above. Stored
        only in this browser; included in{" "}
        <strong className="font-medium text-ink">schema v3</strong> JSON backups.
      </p>

      {filtered.length === 0 ? (
        <p className="mt-4 text-sm text-ink-faint">
          {words.length === 0
            ? "No saved words yet. Use “Save word” on drills or reading when you see it."
            : "No saved words match your search."}
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {filtered.map((w) => (
            <li
              key={`${savedWordIdentityKey(w)}-${w.importedAt}-${w.source}`}
              className="rounded-xl border border-white/40 bg-parchment-deep/25 p-3 shadow-elevated"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-label text-[9px] uppercase tracking-wide text-ink-faint">
                  {w.source === "hebrew-web" ? "This app" : "Imported"}
                  <span className="ml-1 font-body normal-case tracking-normal text-ink-faint">
                    ·{" "}
                    {new Date(w.importedAt).toLocaleDateString(undefined, {
                      dateStyle: "medium",
                    })}
                  </span>
                </span>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    aria-label={`Speak ${w.he}`}
                    onClick={() => speakHebrew(w.he)}
                    className="rounded-md px-2 py-1 font-label text-[9px] uppercase tracking-wide text-sage hover:bg-sage/10"
                  >
                    Play
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      removeSavedWordByIdentity({
                        he: w.he,
                        translit: w.translit,
                        en: w.en,
                      });
                    }}
                    className="rounded-md px-2 py-1 font-label text-[9px] uppercase tracking-wide text-rust hover:bg-rust/10"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <Hebrew
                as="p"
                className="mt-2 text-right text-lg leading-relaxed text-ink"
              >
                {w.he}
              </Hebrew>
              {w.translit ? (
                <p className="mt-1 text-center text-[11px] italic text-amber">
                  {w.translit}
                </p>
              ) : null}
              {w.en ? (
                <p className="mt-2 border-t border-ink/10 pt-2 text-xs text-ink-muted">
                  {w.en}
                </p>
              ) : null}
              {w.colloquial ? (
                <p className="mt-1 text-[10px] text-ink-faint">
                  <span className="font-label uppercase tracking-wide text-ink-muted">
                    Note
                  </span>{" "}
                  {w.colloquial}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
