/**
 * Phase A CLI: merge legacy `hebrew-v8.2.html` localStorage dump → Next app backup (schema 3)
 * and optional library backup JSON.
 *
 * Usage:
 *   npx tsx scripts/merge-legacy-to-app-backup.ts --legacy ./legacy-dump.json --out ./merged-app.json
 *   npx tsx scripts/merge-legacy-to-app-backup.ts --legacy ./dump.json --base ./current-app.json --out ./out.json --library-out ./lib.json
 *   npx tsx scripts/merge-legacy-to-app-backup.ts --legacy ./dump.json --saved-words drop --out ./out.json
 *
 * Legacy dump: JSON object whose keys are localStorage keys (e.g. ivrit_lr, ivrit_session_v1,
 * ivrit_lr__alice, ivrit_lib, ivrit_saved). Values may be JSON strings (as stored) or already parsed.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { mergePhaseALegacyDump } from "@/lib/phase-a-legacy-merge";

function argValue(name: string): string | null {
  const i = process.argv.indexOf(name);
  if (i < 0 || i + 1 >= process.argv.length) return null;
  return process.argv[i + 1] ?? null;
}

function main(): void {
  const legacyPath = argValue("--legacy");
  const outPath = argValue("--out");
  if (!legacyPath || !outPath) {
    console.error(
      "Usage: tsx scripts/merge-legacy-to-app-backup.ts --legacy <dump.json> --out <app-backup.json> [--base <app.json>] [--base-library <library.json>] [--library-out <library.json>] [--saved-words port|drop]",
    );
    process.exit(1);
  }

  const basePath = argValue("--base");
  const baseLibPath = argValue("--base-library");
  const libraryOutPath = argValue("--library-out");
  const savedWordsRaw = (argValue("--saved-words") ?? "port").toLowerCase();
  if (savedWordsRaw !== "port" && savedWordsRaw !== "drop") {
    console.error('--saved-words must be "port" or "drop".');
    process.exit(1);
  }

  let legacyDump: Record<string, unknown>;
  try {
    const raw = readFileSync(legacyPath, "utf8");
    const p = JSON.parse(raw) as unknown;
    if (!p || typeof p !== "object" || Array.isArray(p)) {
      console.error("Legacy file must be a JSON object.");
      process.exit(1);
    }
    legacyDump = p as Record<string, unknown>;
  } catch (e) {
    console.error("Failed to read legacy JSON:", e);
    process.exit(1);
  }

  const baseAppJsonText = basePath
    ? readFileSync(basePath, "utf8")
    : undefined;
  const baseLibraryJsonText = baseLibPath
    ? readFileSync(baseLibPath, "utf8")
    : undefined;

  const result = mergePhaseALegacyDump({
    legacyDump,
    baseAppJsonText,
    baseLibraryJsonText,
    savedWords: savedWordsRaw === "drop" ? "drop" : "port",
  });

  if (!result.ok) {
    console.error(result.error);
    process.exit(1);
  }

  writeFileSync(outPath, result.appJson, "utf8");
  console.log(`Wrote app backup: ${outPath}`);

  if (result.libraryJson) {
    if (libraryOutPath) {
      writeFileSync(libraryOutPath, result.libraryJson, "utf8");
      console.log(`Wrote library backup: ${libraryOutPath}`);
    } else {
      console.log(
        "Note: merged library data exists; pass --library-out <path> to write it.",
      );
    }
  }

  console.log("Stats:", JSON.stringify(result.stats, null, 2));
  if (result.stats.legacyOpenaiKeyPresent) {
    console.log(
      "\n*** Legacy dump contained ivrit_openai_key. It was NOT copied into the backup file.\n" +
        "    Set OPENAI_API_KEY (server-only) on Vercel for the Ask Rabbi API — see docs/vercel-environment.md.\n",
    );
  }
}

main();
