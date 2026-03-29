"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Hebrew } from "@/components/Hebrew";
import {
  mergeLegacyLibraryIntoWebApp,
  previewLegacyLibraryImport,
} from "@/lib/legacy-library-import";
import {
  LIBRARY_SAVED_EVENT,
  LIBRARY_SAVED_KEY,
  addLibrarySaved,
  loadLibrarySaved,
  removeLibrarySaved,
  type SavedLibraryPassage,
} from "@/lib/library-saved";

const LINKS = [
  {
    href: "https://www.sefaria.org/texts",
    label: "Sefaria",
    desc: "Tanakh, Talmud, commentaries — bilingual",
    tags: "text bible talmud",
  },
  {
    href: "https://pealim.com/",
    label: "Pealim",
    desc: "Verb conjugations & Hebrew dictionary",
    tags: "verbs grammar dictionary",
  },
  {
    href: "https://nakdan.dicta.org.il/",
    label: "Dicta Nakdan",
    desc: "Add niqqud to Hebrew text",
    tags: "nikkud vocalization",
  },
  {
    href: "https://www.nli.org.il/en/discover/manuscripts",
    label: "National Library of Israel",
    desc: "Manuscripts & digital collections",
    tags: "manuscripts archive",
  },
  {
    href: "https://www.morfix.co.il/",
    label: "Morfix",
    desc: "Hebrew–English dictionary & usage",
    tags: "dictionary translation",
  },
  {
    href: "https://hebrew-academy.org.il/",
    label: "Hebrew Language Academy",
    desc: "Official norms, terminology, and resources",
    tags: "grammar academy standard",
  },
  {
    href: "https://www.english.dicta.org.il/",
    label: "Dicta (English)",
    desc: "Lexicon, morphology, and text tools with an English UI",
    tags: "dicta grammar morphology",
  },
  {
    href: "https://context.reverso.net/translation/hebrew-english",
    label: "Reverso Context",
    desc: "Real-world Hebrew–English phrase examples",
    tags: "examples translation phrases bilingual",
  },
  {
    href: "https://forvo.com/languages/he/",
    label: "Forvo — Hebrew",
    desc: "Native speaker recordings for pronunciation",
    tags: "pronunciation audio speaking listening",
  },
  {
    href: "https://www.ktiv.co.il/",
    label: "Ktiv",
    desc: "Hebrew spelling and word forms (Israeli standard)",
    tags: "spelling orthography writing",
  },
] as const;

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
    if (!q) return [...LINKS];
    return LINKS.filter((x) => {
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
      <section className="rounded-2xl border border-sage/25 bg-sage/5 p-4">
        <p className="font-label text-[10px] uppercase tracking-[0.18em] text-sage">
          Your saved passages
        </p>
        <p className="mt-1 text-xs text-ink-muted">
          Stored in this browser (
          <code className="rounded bg-parchment-deep/50 px-1 text-[10px]">
            {LIBRARY_SAVED_KEY}
          </code>
          ). If you used{" "}
          <code className="text-[10px]">hebrew-v8.2.html</code> here, you can
          merge passages from{" "}
          <code className="text-[10px]">ivrit_lib</code> (see Developer for
          details). To back up or move only these saves, use{" "}
          <Link
            href="/developer#dev-library-json"
            className="text-sage underline hover:text-sage/90"
          >
            Developer → Library saves JSON
          </Link>
          .
        </p>
        {legacyLibHint.found &&
        legacyLibHint.mappableCount > 0 &&
        !legacyLibHint.parseError ? (
          <p className="mt-2 text-[11px] text-ink-muted">
            Legacy library detected ({legacyLibHint.mappableCount} passage
            {legacyLibHint.mappableCount === 1 ? "" : "s"} at{" "}
            <code className="text-[10px]">{legacyLibHint.storageKey}</code>).
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
            className="rounded-lg border border-sage/40 px-3 py-1.5 font-label text-[9px] uppercase tracking-wide text-sage hover:bg-sage/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Merge from legacy HTML library
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
              className="mt-1 w-full rounded-lg border border-ink/15 bg-parchment px-3 py-2 text-sm text-ink"
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
              className="mt-1 w-full rounded-lg border border-ink/15 bg-parchment px-3 py-2 font-hebrew text-base text-ink"
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
              className="mt-1 w-full rounded-lg border border-ink/15 bg-parchment px-3 py-2 text-sm text-ink"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onAddSaved}
              className="rounded-lg bg-sage px-4 py-2 font-label text-[10px] uppercase tracking-wide text-white hover:brightness-110"
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
                className="rounded-xl border border-ink/10 bg-parchment-card/60 p-3"
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
            className="mt-2 w-full rounded-xl border border-ink/15 bg-parchment px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint"
          />
        </label>
        <p className="mt-2 text-sm text-ink-muted">
          External sites open in a new tab.
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
                  className="block rounded-xl border border-ink/10 bg-parchment-card/40 px-4 py-3 transition hover:border-sage/40 hover:bg-parchment-deep/30"
                >
                  <span className="font-label text-[11px] uppercase tracking-wide text-sage">
                    {x.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-ink-muted">
                    {x.desc}
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
