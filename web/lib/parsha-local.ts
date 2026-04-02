/**
 * Parsha + Hebrew civil date without network, using @hebcal/core
 * (Diaspora sedra schedule; Shabbat on or after the given Gregorian day).
 */

import { HDate, HebrewCalendar } from "@hebcal/core";
import type { ParshaSnapshot } from "@/lib/hebcal-parsha";
import { sefariaSearchUrl } from "@/lib/hebcal-parsha";

export function getParshaSnapshotLocal(
  y: number,
  m: number,
  d: number,
): ParshaSnapshot | null {
  const g = new Date(y, m - 1, d);
  if (Number.isNaN(g.getTime())) return null;
  const h = new HDate(g);
  const sedra = HebrewCalendar.getSedra(h.getFullYear(), false);
  const result = sedra.lookup(h);
  if (!result.parsha?.length) return null;
  const title = sedra.getString(h, "en");
  const hebrew = sedra.getString(h, "he");
  return {
    title,
    hebrew,
    readUrl: sefariaSearchUrl(title),
    dateLabel: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
  };
}

export function getHebrewDateLineLocal(
  y: number,
  m: number,
  d: number,
): string | null {
  const g = new Date(y, m - 1, d);
  if (Number.isNaN(g.getTime())) return null;
  return new HDate(g).render("he");
}
