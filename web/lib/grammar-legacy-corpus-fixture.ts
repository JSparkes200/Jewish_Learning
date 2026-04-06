import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { GRAMMAR_LEGACY_PARITY_EXTRAS } from "@/lib/grammar-legacy-parity-extras";

export type LegacyCorpusJsonEntry = {
  h: string;
  p: string;
  e: string;
  l: number;
  shoresh?: string;
  gram?: string;
  col?: string;
};

function j(s: string) {
  return JSON.stringify(s);
}

/** Same shape as `web/scripts/extract-corpus-d.mjs` — one dictionary row per line. */
export function legacyCorpusEntryToTs(o: LegacyCorpusJsonEntry): string {
  const bits = [`h:${j(o.h)}`, `p:${j(o.p)}`, `e:${j(o.e)}`, `l:${o.l}`];
  if (o.shoresh != null && o.shoresh !== "") bits.push(`shoresh:${j(o.shoresh)}`);
  if (o.gram != null && o.gram !== "") bits.push(`gram:${j(o.gram)}`);
  if (o.col != null && o.col !== "") bits.push(`col:${j(o.col)}`);
  return `{${bits.join(",")}}`;
}

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Text blob for grammar parity tests: serialized `legacy-corpus-d.json` rows plus
 * frozen non-D snippets (stories, passages) that lived outside dictionary D in HTML.
 */
export function getGrammarParityLegacyFixtureText(): string {
  const dataPath = join(__dirname, "..", "data", "legacy-corpus-d.json");
  const rows = JSON.parse(
    readFileSync(dataPath, "utf8"),
  ) as LegacyCorpusJsonEntry[];
  const corpusBlob = rows.map(legacyCorpusEntryToTs).join(",");
  const extrasBlob = GRAMMAR_LEGACY_PARITY_EXTRAS.join("\n");
  return `${corpusBlob}\n${extrasBlob}`;
}
