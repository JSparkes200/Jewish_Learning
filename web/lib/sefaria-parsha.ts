/**
 * Weekly Torah portion text (Hebrew + English) via Sefaria public APIs.
 * @see https://developers.sefaria.org/
 */

export type ParshaPassagePayload = {
  /** Human-readable range, e.g. "Leviticus 16:1-20:27" */
  ref: string;
  /** Sefaria URL slug from calendars API, e.g. "Leviticus.16.1-20.27" */
  urlSlug: string;
  parshaTitleEn: string;
  parshaTitleHe: string;
  /** Parallel verses (HTML stripped) */
  verses: { he: string; en: string }[];
  sefariaReadUrl: string;
};

type SefariaCalendarItem = {
  title?: { en?: string };
  url?: string;
  ref?: string;
  displayValue?: { en?: string; he?: string };
};

type SefariaCalendarResponse = {
  calendar_items?: SefariaCalendarItem[];
};

type SefariaTextsResponse = {
  he?: unknown;
  text?: unknown;
  ref?: string;
};

/** Remove Sefaria HTML tags/entities for display and speech (Tanakh strings). */
export function stripSefariaHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&thinsp;/gi, "")
    .replace(/&[#\w]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function flattenSefariaField(field: unknown): string[] {
  if (typeof field === "string") return [field];
  if (Array.isArray(field)) {
    return field.flatMap(flattenSefariaField);
  }
  return [];
}

/**
 * Fetch Parashat Hashavua ref + full text for a civil date (Diaspora schedule).
 */
export async function fetchParshaPassageForDate(
  y: number,
  m: number,
  d: number,
  init?: RequestInit,
): Promise<ParshaPassagePayload | null> {
  const calUrl = `https://www.sefaria.org/api/calendars?year=${y}&month=${m}&day=${d}&diaspora=1`;
  const calRes = await fetch(calUrl, init);
  if (!calRes.ok) return null;

  const cal = (await calRes.json()) as SefariaCalendarResponse;
  const parshaItem = cal.calendar_items?.find(
    (it) => it.title?.en === "Parashat Hashavua",
  );
  if (!parshaItem?.url) return null;
  const urlSlug = parshaItem.url.trim();

  const textUrl = `https://www.sefaria.org/api/texts/${encodeURIComponent(urlSlug)}`;
  const textRes = await fetch(textUrl, init);
  if (!textRes.ok) return null;

  const doc = (await textRes.json()) as SefariaTextsResponse;
  const heFlat = flattenSefariaField(doc.he);
  const enFlat = flattenSefariaField(doc.text);
  const n = Math.min(heFlat.length, enFlat.length);
  if (n === 0) return null;

  const verses: { he: string; en: string }[] = [];
  for (let i = 0; i < n; i++) {
    verses.push({
      he: stripSefariaHtml(heFlat[i] ?? ""),
      en: stripSefariaHtml(enFlat[i] ?? ""),
    });
  }

  const ref = parshaItem.ref ?? doc.ref ?? "";
  const dv = parshaItem.displayValue;
  const parshaTitleEn = dv?.en?.trim() ?? "";
  const parshaTitleHe = dv?.he?.trim() ?? "";

  const sefariaReadUrl = `https://www.sefaria.org/${urlSlug}`;

  return {
    ref,
    urlSlug,
    parshaTitleEn,
    parshaTitleHe,
    verses,
    sefariaReadUrl,
  };
}
