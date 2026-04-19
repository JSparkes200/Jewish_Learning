/**
 * Validates `LEGACY_CORPUS_D` invariants for CI.
 *
 * Run from `web/`: npx tsx scripts/validate-legacy-corpus.ts
 *
 * Policy:
 * - ERROR (exit 1): Hebrew letters in romanization `p`, or missing `p` when `h` is set.
 * - WARN: other non-ASCII in `p` (often Cyrillic “lookalikes” — normalize in a future pass),
 *   very long `col`, and duplicate full rows {h,p,e,l}.
 */
import { LEGACY_CORPUS_D } from "../data/corpus-d";

const COL_WARN_LEN = 450;

const HEBREW_IN_P = /[\u0590-\u05FF]/;

function isAscii(s: string): boolean {
  for (let i = 0; i < s.length; i++) {
    if (s.charCodeAt(i) > 127) return false;
  }
  return true;
}

function main() {
  const errors: string[] = [];
  const warnings: string[] = [];

  const rowKeys = new Map<string, number[]>();
  let nonAsciiPCount = 0;

  LEGACY_CORPUS_D.forEach((row, i) => {
    const line = i + 1;
    const p = row.p ?? "";

    if (HEBREW_IN_P.test(p)) {
      errors.push(
        `Line ${line}: Hebrew script in romanization "p" (entry h=${JSON.stringify(row.h).slice(0, 36)}…)`,
      );
    } else if (!p.trim() && row.h?.trim()) {
      errors.push(`Line ${line}: empty "p" but "h" is set`);
    } else if (!isAscii(p)) {
      nonAsciiPCount++;
    }

    const key = JSON.stringify({
      h: row.h,
      p: row.p,
      e: row.e,
      l: row.l,
    });
    const prev = rowKeys.get(key) ?? [];
    prev.push(line);
    rowKeys.set(key, prev);

    if (row.col && row.col.length > COL_WARN_LEN) {
      warnings.push(
        `Line ${line}: "col" is ${row.col.length} chars (>${COL_WARN_LEN}) — consider shortening`,
      );
    }
  });

  let duplicateRowGroups = 0;
  for (const [, lines] of rowKeys) {
    if (lines.length > 1) duplicateRowGroups++;
  }
  if (duplicateRowGroups > 0) {
    warnings.push(
      `${duplicateRowGroups} groups of identical rows (same h, p, e, l) — consider deduping for flashcards`,
    );
  }
  if (nonAsciiPCount > 0) {
    warnings.push(
      `${nonAsciiPCount} entries have non-ASCII romanization (often Cyrillic homoglyphs in "p") — batch-normalize when convenient`,
    );
  }

  if (errors.length) {
    for (const w of warnings) {
      console.warn(`[validate-legacy-corpus] WARN: ${w}`);
    }
    for (const e of errors) {
      console.error(`[validate-legacy-corpus] ERROR: ${e}`);
    }
    process.exit(1);
  }

  for (const w of warnings) {
    console.warn(`[validate-legacy-corpus] WARN: ${w}`);
  }
  console.log(
    `[validate-legacy-corpus] OK — ${LEGACY_CORPUS_D.length} entries, ${warnings.length} warning line(s)`,
  );
}

main();
