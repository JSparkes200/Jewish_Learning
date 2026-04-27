"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Hebrew } from "@/components/Hebrew";
import { LibraryCoverCarousel } from "@/components/LibraryCoverCarousel";
import { SavedWordsSection } from "@/components/SavedWordsSection";
import { SavedWordsFlashcard } from "@/components/SavedWordsFlashcard";
import { loadSavedWords, SAVED_WORDS_EVENT } from "@/lib/saved-words";
import { LIBRARY_EXTERNAL_LINKS } from "@/data/library-external-links";
import {
  mergeLegacyLibraryIntoWebApp,
  previewLegacyLibraryImport,
} from "@/lib/legacy-library-import";
import {
  LIBRARY_SAVED_EVENT,
  addLibrarySaved,
  loadLibrarySaved,
  patchLibrarySaved,
  removeLibrarySaved,
  type SavedLibraryPassage,
} from "@/lib/library-saved";

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

export function LibraryPageClient() {
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState<SavedLibraryPassage[]>([]);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftHe, setDraftHe] = useState("");
  const [draftEn, setDraftEn] = useState("");
  const [draftNote, setDraftNote] = useState("");
  const [noteEditorId, setNoteEditorId] = useState<string | null>(null);
  const [noteEditorDraft, setNoteEditorDraft] = useState("");
  const [formMsg, setFormMsg] = useState<string | null>(null);
  const [legacyImportMsg, setLegacyImportMsg] = useState<string | null>(null);
  const [legacyLibTick, setLegacyLibTick] = useState(0);
  const [flashcardOpen, setFlashcardOpen] = useState(false);
  const [savedWordsList, setSavedWordsList] = useState(() => loadSavedWords());

  const legacyLibHint = useMemo(() => {
    return previewLegacyLibraryImport();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- bump tick to re-read localStorage
  }, [legacyLibTick]);

  const refreshSaved = useCallback(() => {
    setSaved(loadLibrarySaved());
  }, []);

  useEffect(() => {
    refreshSaved();
    window.addEventListener(LIBRARY_SAVED_EVENT, refreshSaved);
    return () => window.removeEventListener(LIBRARY_SAVED_EVENT, refreshSaved);
  }, [refreshSaved]);

  useEffect(() => {
    const refresh = () => setSavedWordsList(loadSavedWords());
    refresh();
    window.addEventListener(SAVED_WORDS_EVENT, refresh);
    return () => window.removeEventListener(SAVED_WORDS_EVENT, refresh);
  }, []);

  const filteredLinks = useMemo(() => {
    const q = normalize(query);
    if (!q) return [...LIBRARY_EXTERNAL_LINKS];
    return LIBRARY_EXTERNAL_LINKS.filter((x) => {
      const hay = `${x.label} ${x.desc} ${x.tags}`;
      return normalize(hay).includes(q);
    });
  }, [query]);

  const filteredSaved = useMemo(() => {
    const q = normalize(query);
    if (!q) return saved;
    return saved.filter((x) => {
      const hay = `${x.title} ${x.he} ${x.en ?? ""}`;
      return normalize(hay).includes(q);
    });
  }, [saved, query]);

  const carouselLinks = filteredLinks;

  const onAddSaved = useCallback(() => {
    setFormMsg(null);
    const title = draftTitle.trim();
    const he = draftHe.trim();
    if (!title || !he) {
      setFormMsg("Add a title and Hebrew text.");
      return;
    }
    addLibrarySaved({
      title,
      he,
      en: draftEn.trim() || undefined,
      note: draftNote.trim() || undefined,
    });
    setDraftTitle("");
    setDraftHe("");
    setDraftEn("");
    setDraftNote("");
    refreshSaved();
    setFormMsg("Saved.");
  }, [draftTitle, draftHe, draftEn, draftNote, refreshSaved]);

  return (
    <div className="space-y-8">
      {carouselLinks.length > 0 ? (
        <LibraryCoverCarousel links={carouselLinks} />
      ) : null}

      <section className="surface-elevated p-4">
        <label className="block">
          <span className="font-label text-[10px] uppercase tracking-[0.18em] text-ink-muted">
            Search library
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter passages, saved words, and links…"
            autoComplete="off"
            className="input-inset mt-2 w-full px-3 py-2.5 text-sm"
          />
        </label>
        <p className="mt-2 text-xs text-ink-muted">
          One search box filters everything below: your passages, bookmarked
          lemmas, and curated links.
        </p>
      </section>

      <section className="surface-elevated p-4">
        <p className="font-label text-[10px] uppercase tracking-[0.18em] text-sage">
          Your saved passages
        </p>
        <p className="mt-1 text-xs text-ink-muted">
          Stored in this browser. Practice with saved lines from{" "}
          <Link href="/reading" className="text-sage underline hover:text-sage/90">
            Reading
          </Link>{" "}
          or{" "}
          <Link href="/study" className="text-sage underline hover:text-sage/90">
            Study
          </Link>
          ; track course work on{" "}
          <Link href="/progress" className="text-sage underline hover:text-sage/90">
            Progress
          </Link>
          . If an older Hebrew study page left saves here, import below. To back
          up or move only these saves, use{" "}
          <Link
            href="/developer/tools#dev-library-json"
            className="text-sage underline hover:text-sage/90"
          >
            Advanced → Developer → Library saves JSON
          </Link>
          .
        </p>
        {legacyLibHint.found &&
        legacyLibHint.mappableCount > 0 &&
        !legacyLibHint.parseError ? (
          <p className="mt-2 text-[11px] text-ink-muted">
            Older saved passages found ({legacyLibHint.mappableCount} passage
            {legacyLibHint.mappableCount === 1 ? "" : "s"} in this browser).
          </p>
        ) : null}
        {legacyImportMsg ? (
          <p className="mt-2 text-xs text-sage">{legacyImportMsg}</p>
        ) : null}
        <div className="mt-2">
          <button
            type="button"
            disabled={
              !legacyLibHint.found ||
              !!legacyLibHint.parseError ||
              legacyLibHint.mappableCount === 0
            }
            onClick={() => {
              setLegacyImportMsg(null);
              const r = mergeLegacyLibraryIntoWebApp();
              if (r.ok) {
                setLegacyImportMsg(
                  `Imported ${r.added} new passage(s); ${r.skipped} already in this app.`,
                );
                refreshSaved();
              } else {
                setLegacyImportMsg(r.message);
              }
              setLegacyLibTick((t) => t + 1);
            }}
            className="btn-elevated-secondary disabled:cursor-not-allowed disabled:opacity-40"
          >
            Import older browser saves
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <label className="font-label text-[9px] uppercase tracking-wide text-ink-muted">
              Title
            </label>
            <input
              type="text"
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              placeholder="e.g. Shabbat kiddush line"
              maxLength={120}
              className="input-inset mt-1 w-full px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="font-label text-[9px] uppercase tracking-wide text-ink-muted">
              Hebrew
            </label>
            <textarea
              value={draftHe}
              onChange={(e) => setDraftHe(e.target.value)}
              placeholder="Paste or type Hebrew…"
              rows={3}
              dir="rtl"
              lang="he"
              className="input-inset mt-1 w-full px-3 py-2 font-hebrew text-base"
            />
          </div>
          <div>
            <label className="font-label text-[9px] uppercase tracking-wide text-ink-muted">
              English / translation (optional)
            </label>
            <textarea
              value={draftEn}
              onChange={(e) => setDraftEn(e.target.value)}
              placeholder="Gloss or short translation…"
              rows={2}
              className="input-inset mt-1 w-full px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="font-label text-[9px] uppercase tracking-wide text-ink-muted">
              Your note (optional)
            </label>
            <textarea
              value={draftNote}
              onChange={(e) => setDraftNote(e.target.value)}
              placeholder="Private memo — source, deck, reminder…"
              rows={2}
              className="input-inset mt-1 w-full px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onAddSaved}
              className="btn-elevated-primary"
            >
              Save passage
            </button>
            {formMsg ? (
              <span className="text-xs text-ink-muted">{formMsg}</span>
            ) : null}
          </div>
        </div>

        {filteredSaved.length === 0 ? (
          <p className="mt-4 text-sm text-ink-faint">
            {saved.length === 0
              ? "No saved passages yet."
              : "No saved passages match your search."}
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {filteredSaved.map((x) => (
              <li
                key={x.id}
                className="rounded-xl border border-white/40 bg-parchment-deep/30 p-3 shadow-elevated"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="min-w-0 font-label text-[11px] uppercase tracking-wide text-sage">
                    <span className="block">{x.title}</span>
                    <span className="mt-0.5 block font-body text-[9px] font-normal normal-case tracking-normal text-ink-faint">
                      Saved{" "}
                      {new Date(x.createdAt).toLocaleDateString(undefined, {
                        dateStyle: "medium",
                      })}
                    </span>
                  </span>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setNoteEditorId(x.id);
                        setNoteEditorDraft(x.note ?? "");
                      }}
                      className="rounded-md px-2 py-1 font-label text-[9px] uppercase tracking-wide text-sage hover:bg-sage/10"
                    >
                      {noteEditorId === x.id ? "Editing…" : "Edit note"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        removeLibrarySaved(x.id);
                        if (noteEditorId === x.id) {
                          setNoteEditorId(null);
                          setNoteEditorDraft("");
                        }
                        refreshSaved();
                      }}
                      className="rounded-md px-2 py-1 font-label text-[9px] uppercase tracking-wide text-rust hover:bg-rust/10"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <Hebrew
                  as="p"
                  className="mt-2 text-right text-sm leading-relaxed text-ink"
                >
                  {x.he}
                </Hebrew>
                {x.en ? (
                  <p className="mt-2 border-t border-ink/10 pt-2 text-xs text-ink-muted">
                    {x.en}
                  </p>
                ) : null}
                {x.note && noteEditorId !== x.id ? (
                  <p className="mt-2 border-t border-ink/10 pt-2 text-[11px] italic text-ink-faint">
                    Note: {x.note}
                  </p>
                ) : null}
                {noteEditorId === x.id ? (
                  <div className="mt-2 border-t border-ink/10 pt-2">
                    <textarea
                      value={noteEditorDraft}
                      onChange={(e) => setNoteEditorDraft(e.target.value)}
                      placeholder="Private memo…"
                      rows={2}
                      className="input-inset w-full px-3 py-2 text-sm"
                    />
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="btn-elevated-primary text-[10px]"
                        onClick={() => {
                          patchLibrarySaved(x.id, { note: noteEditorDraft });
                          setNoteEditorId(null);
                          setNoteEditorDraft("");
                          refreshSaved();
                        }}
                      >
                        Save note
                      </button>
                      <button
                        type="button"
                        className="btn-elevated-secondary text-[10px]"
                        onClick={() => {
                          setNoteEditorId(null);
                          setNoteEditorDraft("");
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      {flashcardOpen && savedWordsList.length > 0 ? (
        <section className="surface-elevated p-5">
          <SavedWordsFlashcard
            words={savedWordsList}
            onClose={() => setFlashcardOpen(false)}
          />
        </section>
      ) : null}

      <SavedWordsSection filter={query}>
        {savedWordsList.length >= 2 && !flashcardOpen ? (
          <button
            type="button"
            onClick={() => setFlashcardOpen(true)}
            className="mt-3 inline-flex items-center gap-2 rounded-xl border border-sage/30 bg-sage/8 px-4 py-2 font-label text-[10px] uppercase tracking-wide text-sage transition hover:bg-sage/15 hover:border-sage/50"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5" aria-hidden><rect x="2" y="4" width="20" height="16" rx="3"/><path d="M12 8v8M8 12h8"/></svg>
            Drill saved words ({savedWordsList.length})
          </button>
        ) : null}
      </SavedWordsSection>

      <section>
        <p className="text-sm text-ink-muted">
          External sites open in a new tab. The list matches your search above.
        </p>
        {filteredLinks.length === 0 ? (
          <p className="mt-4 rounded-xl border border-ink/10 bg-parchment-card/40 px-4 py-6 text-center text-sm text-ink-muted">
            No links match &ldquo;{query}&rdquo;.{" "}
            <button
              type="button"
              className="text-sage underline"
              onClick={() => setQuery("")}
            >
              Clear search
            </button>
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {filteredLinks.map((x) => (
              <li key={x.href}>
                <a
                  href={x.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="surface-elevated flex gap-3 rounded-2xl px-4 py-3 no-underline transition hover:border-sage/35"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- local themed SVG */}
                  <img
                    src={x.iconSrc}
                    alt=""
                    width={48}
                    height={48}
                    className="h-12 w-12 shrink-0 rounded-xl border border-white/60 bg-white/90 object-contain p-1 shadow-elevated"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="font-label text-[11px] uppercase tracking-wide text-sage">
                      {x.label}
                    </span>
                    <span className="mt-0.5 block text-xs text-ink-muted">
                      {x.desc}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
