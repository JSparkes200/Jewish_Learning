/**
 * Server-side enrichment for a Hebrew headword: static root family (legacy ROOTS
 * parity) + optional intro extract from Hebrew Wikipedia.
 */

import { STATIC_ROOT_FAMILIES } from "@/data/course-roots";
import { stripNikkud } from "@/lib/hebrew-nikkud";

export type WordDetailRootFamily = {
  root: string;
  meaning: string;
  sentenceHe?: string;
  sentenceEn?: string;
};

export type WordDetailEnrichment = {
  wikiTitle: string | null;
  wikiExtract: string | null;
  rootFamily: WordDetailRootFamily | null;
};

function findRootFamilyForHeadword(he: string): WordDetailRootFamily | null {
  const bare = stripNikkud(he.trim());
  if (!bare) return null;
  for (const fam of STATIC_ROOT_FAMILIES) {
    if (stripNikkud(fam.root) === bare) {
      return {
        root: fam.root,
        meaning: fam.meaning,
        sentenceHe: fam.sentence,
        sentenceEn: fam.trans,
      };
    }
    for (const w of fam.words) {
      if (stripNikkud(w.h) === bare) {
        return {
          root: fam.root,
          meaning: fam.meaning,
          sentenceHe: fam.sentence,
          sentenceEn: fam.trans,
        };
      }
    }
  }
  return null;
}

const WIKI_EXTRACT_MAX = 520;

async function fetchHeWikiExtract(
  title: string,
): Promise<{ title: string | null; extract: string | null }> {
  const t = title.trim();
  if (!t) return { title: null, extract: null };
  const url = new URL("https://he.wikipedia.org/w/api.php");
  url.searchParams.set("action", "query");
  url.searchParams.set("format", "json");
  url.searchParams.set("prop", "extracts");
  url.searchParams.set("exintro", "1");
  url.searchParams.set("explaintext", "1");
  url.searchParams.set("redirects", "1");
  url.searchParams.set("titles", t);

  try {
    const res = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return { title: null, extract: null };
    const data = (await res.json()) as {
      query?: {
        pages?: Record<
          string,
          { title?: string; extract?: string; missing?: boolean }
        >;
      };
    };
    const pages = data.query?.pages;
    if (!pages) return { title: null, extract: null };
    const first = Object.values(pages)[0];
    if (!first || first.missing || !first.extract?.trim()) {
      return { title: null, extract: null };
    }
    let ex = first.extract.replace(/\s+/g, " ").trim();
    if (ex.length > WIKI_EXTRACT_MAX) {
      ex = `${ex.slice(0, WIKI_EXTRACT_MAX).trim()}…`;
    }
    return { title: first.title ?? t, extract: ex };
  } catch {
    return { title: null, extract: null };
  }
}

export async function buildWordDetailEnrichment(
  headword: string,
): Promise<WordDetailEnrichment> {
  const trimmed = headword.trim();
  const rootFamily = trimmed ? findRootFamilyForHeadword(trimmed) : null;
  const wiki = trimmed ? await fetchHeWikiExtract(trimmed) : { title: null, extract: null };
  return {
    wikiTitle: wiki.title,
    wikiExtract: wiki.extract,
    rootFamily,
  };
}
