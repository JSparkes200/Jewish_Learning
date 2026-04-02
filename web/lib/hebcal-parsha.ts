/**
 * Weekly Torah portion from Hebcal (public JSON, no API key).
 * @see https://www.hebcal.com/home/developer-apis
 */

export type ParshaSnapshot = {
  /** e.g. "Parashat Vayikra" */
  title: string;
  /** e.g. "פרשת ויקרא" */
  hebrew?: string;
  /** Link from Hebcal or constructed Sefaria search */
  readUrl: string;
  /** Gregorian date string used for the request */
  dateLabel: string;
};

type HebcalItem = {
  title?: string;
  category?: string;
  hebrew?: string;
  link?: string;
  leyning?: { torah?: string };
};

type HebcalShabbatResponse = {
  items?: HebcalItem[];
};

type HebcalConverterResponse = {
  hebrew?: string;
  events?: string[];
};

export function sefariaSearchUrl(query: string): string {
  const q = encodeURIComponent(query.replace(/^Parashat\s+/i, "").trim());
  return `https://www.sefaria.org/search?q=${q}`;
}

/**
 * Parsha for the Shabbat that begins after this Gregorian date (Hebcal’s week view).
 */
export async function fetchParshaSnapshot(
  y: number,
  m: number,
  d: number,
): Promise<ParshaSnapshot | null> {
  const url = `https://www.hebcal.com/shabbat?cfg=json&geo=none&M=on&gy=${y}&gm=${m}&gd=${d}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;
  const data = (await res.json()) as HebcalShabbatResponse;
  const cat = (c: string | undefined) => (c ?? "").toLowerCase();
  const parsha = data.items?.find(
    (it) =>
      cat(it.category) === "parashat" ||
      cat(it.category) === "parshat" ||
      /parashat|parshat|torah reading|this week'?s? torah portion/i.test(
        it.title ?? "",
      ),
  );
  if (!parsha?.title) return null;
  const readUrl =
    parsha.link?.startsWith("http") ? parsha.link : sefariaSearchUrl(parsha.title);
  return {
    title: parsha.title,
    hebrew: parsha.hebrew,
    readUrl,
    dateLabel: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
  };
}

/** Hebrew civil date line for the same Gregorian day (best-effort). */
export async function fetchHebrewDateLine(
  y: number,
  m: number,
  d: number,
): Promise<string | null> {
  const url = `https://www.hebcal.com/converter?cfg=json&gy=${y}&gm=${m}&gd=${d}&g2h=1`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;
  const data = (await res.json()) as HebcalConverterResponse;
  if (data.hebrew) return data.hebrew;
  if (data.events?.length) return data.events[0] ?? null;
  return null;
}
