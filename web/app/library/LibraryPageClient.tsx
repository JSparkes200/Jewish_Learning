"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Hebrew } from "@/components/Hebrew";
import { LibraryCoverCarousel } from "@/components/LibraryCoverCarousel";
import { LIBRARY_EXTERNAL_LINKS } from "@/data/library-external-links";
import {
  mergeLegacyLibraryIntoWebApp,
  previewLegacyLibraryImport,
} from "@/lib/legacy-library-import";
import {
  LIBRARY_SAVED_EVENT,
  addLibrarySaved,
  loadLibrarySaved,
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
  const [formMsg, setFormMsg] = useState<string | null>(null);
  const [legacyImportMsg, setLegacyImportMsg] = useState<string | null>(null);
  const [legacyLibTick, setLegacyLibTick] = useState(0);

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
    });
    setDraftTitle("");
    setDraftHe("");
    setDraftEn("");
    refreshSaved();
    setFormMsg("Saved.");
  }, [draftTitle, draftHe, draftEn, refreshSaved]);

  return (
    <div className="space-y-8">
      {carouselLinks.length > 0 ? (
        <LibraryCoverCarousel links={carouselLinks} />
      ) : null}

      <section className="surface-elevated p-4">
        <p className="font-label text-[10px] uppercase tracking-[0.18em] text-sage">
          Your saved passages
        </p>
        <p className="mt-1 text-xs text-ink-muted">
          Stored in this browser. If an older Hebrew study page left saved
          passages in this browser, you can import them below. To back up or
          move only these saves, use{" "}
          <Link
            href="/developer#dev-library-json"
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
              English / notes (optional)
            </label>
            <textarea
              value={draftEn}
              onChange={(e) => setDraftEn(e.target.value)}
              placeholder="Translation or source link…"
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
                  <span className="font-label text-[11px] uppercase tracking-wide text-sage">
                    {x.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      removeLibrarySaved(x.id);
                      refreshSaved();
                    }}
                    className="shrink-0 rounded-md px-2 py-1 font-label text-[9px] uppercase tracking-wide text-rust hover:bg-rust/10"
                  >
                    Remove
                  </button>
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
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <label className="block">
          <span className="font-label text-[10px] uppercase tracking-[0.18em] text-ink-muted">
            Search links &amp; saved passages
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by name, topic, keyword…"
            autoComplete="off"
            className="input-inset mt-2 w-full px-3 py-2.5 text-sm"
          />
        </label>
        <p className="mt-2 text-sm text-ink-muted">
          External sites open in a new tab. List view below matches your filter.
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
