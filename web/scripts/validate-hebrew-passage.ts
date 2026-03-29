/**
 * CLI: validate Hebrew passage token overlap with `corpus-d`.
 *
 * Usage (from `web/`):
 *   npx tsx scripts/validate-hebrew-passage.ts "בּוֹקֶר טוֹב"
 *   npx tsx scripts/validate-hebrew-passage.ts --level 2 --file ./snippet.txt
 */

import fs from "node:fs";
import {
  formatValidationReport,
  validatePassageAgainstCorpusD,
  validatePassageAgainstCorpusLevel,
} from "../lib/hebrew-passage-pipeline";

function parseArgs(): { text: string; level: number | null } {
  const argv = process.argv.slice(2);
  let file: string | null = null;
  let level: number | null = null;
  const words: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--file" && argv[i + 1]) {
      file = argv[++i];
      continue;
    }
    if (a === "--level" && argv[i + 1]) {
      level = Number(argv[++i]);
      continue;
    }
    words.push(a);
  }
  const joined = words.join(" ").trim();
  const text = file ? fs.readFileSync(file, "utf8") : joined;
  return { text, level: level != null && Number.isFinite(level) ? level : null };
}

const { text, level } = parseArgs();

if (!text.trim()) {
  console.error(
    "Usage: npx tsx scripts/validate-hebrew-passage.ts [--level N] [--file path] \"Hebrew text…\"",
  );
  process.exit(1);
}

if (level != null) {
  const v = validatePassageAgainstCorpusLevel(text, level);
  console.log(formatValidationReport(v, `Corpus overlap (level ≤ ${level})`));
  if (v.outOfLevelForms.length) {
    console.log(
      `  Above-level forms (${v.outOfLevelForms.length}): ${v.outOfLevelForms.slice(0, 40).join(", ")}${v.outOfLevelForms.length > 40 ? " …" : ""}`,
    );
  }
} else {
  console.log(formatValidationReport(validatePassageAgainstCorpusD(text)));
}
