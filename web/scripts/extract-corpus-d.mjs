/**
 * Extract `const D=[...]` from ../hebrew-v8.2.html → web/data/corpus-d.ts
 * Run from repo root: node web/scripts/extract-corpus-d.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..", "..");
const htmlPath = path.join(repoRoot, "hebrew-v8.2.html");
const outPath = path.join(repoRoot, "web", "data", "corpus-d.ts");

const lines = fs.readFileSync(htmlPath, "utf8").split(/\r?\n/);
const startLine = 1998; // 1-based: const D=[
const endLine = 7356; // 1-based: ];
const startIdx = startLine - 1;
const endIdx = endLine - 1;
const open = lines[startIdx];
if (!open?.trim().startsWith("const D=[")) {
  throw new Error(`Expected const D=[ at line ${startLine}, got: ${open?.slice(0, 40)}`);
}
const close = lines[endIdx];
if (close?.trim() !== "];") {
  throw new Error(`Expected ]; at line ${endLine}, got: ${close}`);
}

const body = lines.slice(startIdx + 1, endIdx);

const header = `/**
 * Legacy dictionary D from hebrew-v8.2.html (generated — do not hand-edit).
 * Format: { h, p, e, l, col?, gram?, shoresh? }
 *
 * Regenerate from repo root: node web/scripts/extract-corpus-d.mjs
 */

export type LegacyCorpusEntry = {
  h: string;
  p: string;
  e: string;
  l: number;
  col?: string;
  gram?: string;
  shoresh?: string;
};

export const LEGACY_CORPUS_D: readonly LegacyCorpusEntry[] = [
`;

const out = `${header}${body.join("\n")}\n];\n`;
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, out, "utf8");

const entryCount = (out.match(/\{h:/g) ?? []).length;
console.log(`Wrote ${outPath} (${entryCount} {h:…} objects, ${Math.round(out.length / 1024)} KB)`);
