/**
 * Export app curriculum + docs to Markdown chunks for LightRAG (scripts/ingest.py).
 *
 * Chunks: 15 entries per file (10–20 range) for efficient embedding/retrieval.
 *
 * Run from repo root:
 *   cd web && npx tsx scripts/export-knowledge.ts
 *
 * Output: ../knowledge/exported/{docs,course,reading,specialty,corpus,...}/
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { COMPREHENSION_BY_SECTION } from "../data/course-comprehension";
import {
  COURSE_LEVELS,
  CORPUS_COUNTS,
  FOUNDATION_TRACK_INTRO,
  getSectionsForLevel,
  LEVEL_1_STORY,
} from "../data/course";
import { getSectionLessonPrimer } from "../data/course-section-primers";
import {
  getStoryForLevel,
  getStoryMcqPack,
  LEVEL_STORY_SHORTCUT_PREREQUISITE_IDS,
} from "../data/course-stories";
import { GRAMMAR_DRILLS } from "../data/grammar-drills";
import { LEGACY_CORPUS_D } from "../data/corpus-d";
import { LIBRARY_EXTERNAL_LINKS } from "../data/library-external-links";
import { NUMBERS_HUB_ENTRIES } from "../data/numbers-hub";
import { READING_HUB_ENTRIES } from "../data/reading-hub";
import { READING_PASSAGES_JT } from "../data/reading-passages-jt";
import { READING_PASSAGES_RD } from "../data/reading-passages-rd";
import { STATIC_ROOT_FAMILIES } from "../data/course-roots";
import { BRIDGE_UNITS } from "../data/bridge-course";
import {
  SECTION_IDS_WITH_MCQ,
  getMcqPackForSection,
} from "../data/section-drills";
import {
  SPECIALTY_TIER_IDS,
  SPECIALTY_TRACKS,
} from "../data/specialty-tracks";
import { getSpecialtyTierMcqPack } from "../data/specialty-tier-packs";
import { WORD_EMOJI_DRILLS } from "../data/word-emoji-drills";
import type { McqItem } from "../data/section-drill-types";
import {
  CARDINAL_MASC_0_TO_10,
  PRON_MASC_0_TO_10,
  ROMAN_0_TO_10,
} from "../data/course-numbers";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = path.resolve(__dirname, "..");
const REPO_ROOT = path.resolve(WEB_ROOT, "..");
const EXPORT_ROOT = path.join(REPO_ROOT, "knowledge", "exported");
const DOCS_SRC = path.join(REPO_ROOT, "docs");

/** Target entries per chunk file (within 10–20). */
const CHUNK_SIZE = 15;

function fm(meta: Record<string, string | number>): string {
  const lines = ["---"];
  for (const [k, v] of Object.entries(meta)) {
    lines.push(`${k}: ${String(v).replace(/\n/g, " ")}`);
  }
  lines.push("---", "");
  return lines.join("\n");
}

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeFile(relPath: string, content: string) {
  const full = path.join(EXPORT_ROOT, relPath);
  ensureDir(path.dirname(full));
  fs.writeFileSync(full, content, "utf8");
}

function chunkArray<T>(arr: readonly T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size) as T[]);
  }
  return out;
}

function writeChunkFiles(
  subdir: string,
  baseName: string,
  bodies: string[],
  metaBase: Record<string, string | number>,
) {
  bodies.forEach((body, i) => {
    const name = `${baseName}-chunk-${String(i + 1).padStart(4, "0")}.md`;
    const meta = {
      ...metaBase,
      chunk_index: i + 1,
      chunk_total: bodies.length,
    };
    writeFile(path.join(subdir, name), fm(meta) + body);
  });
}

function copyDocs() {
  const destDir = path.join(EXPORT_ROOT, "docs");
  ensureDir(destDir);
  if (!fs.existsSync(DOCS_SRC)) return;
  for (const name of fs.readdirSync(DOCS_SRC)) {
    if (!name.endsWith(".md") && !name.endsWith(".txt")) continue;
    const src = path.join(DOCS_SRC, name);
    if (!fs.statSync(src).isFile()) continue;
    fs.copyFileSync(src, path.join(destDir, name));
  }
}

function exportCourseOverview() {
  let body = "# Foundation course overview\n\n";
  body += `${FOUNDATION_TRACK_INTRO}\n\n`;
  body += "## Levels\n\n";
  for (const L of COURSE_LEVELS) {
    body += `### ${L.label}\n\n`;
    body += `- **Icon:** ${L.icon}\n`;
    body += `- **Description:** ${L.desc}\n`;
    const dict = CORPUS_COUNTS[L.n];
    if (dict != null) {
      body += `- **Dictionary entries tagged (lookup scope):** ${dict.toLocaleString()}\n`;
    }
    body += "\n";
  }
  writeFile(
    path.join("course", "overview.md"),
    fm({
      source: "web/data/course.ts",
      kind: "course-overview",
    }) + body,
  );
}

function exportSectionIndex() {
  type Row = {
    level: number;
    id: string;
    label: string;
    type?: string;
  };
  const rows: Row[] = [];
  for (let level = 1; level <= 4; level++) {
    for (const s of getSectionsForLevel(level)) {
      rows.push({
        level,
        id: s.id,
        label: s.label,
        type: s.type,
      });
    }
  }
  const parts = chunkArray(rows, CHUNK_SIZE).map((chunk, idx) => {
    let b = `# Learn sections (chunk ${idx + 1})\n\n`;
    for (const r of chunk) {
      b += `## ${r.level} — ${r.id}\n\n`;
      b += `- **Label:** ${r.label}\n`;
      if (r.type) b += `- **Type:** ${r.type}\n`;
      b += "\n";
    }
    return b;
  });
  writeChunkFiles("course", "sections-index", parts, {
    source: "web/data/course.ts",
    kind: "section-index",
  });
}

function exportPrimers() {
  const ids = new Set<string>();
  for (let level = 1; level <= 4; level++) {
    for (const s of getSectionsForLevel(level)) ids.add(s.id);
  }
  for (const id of SECTION_IDS_WITH_MCQ) ids.add(id);

  type Row = { sectionId: string; text: string };
  const rows: Row[] = [];
  for (const sectionId of [...ids].sort()) {
    const p = getSectionLessonPrimer(sectionId);
    if (!p) continue;
    let text = `## Section ${sectionId}\n\n### Intro\n\n${p.intro}\n\n`;
    if (p.words?.length) {
      text += "### Words\n\n";
      for (const w of p.words) {
        text += `- **${w.he}** — ${w.en}${w.hint ? ` (${w.hint})` : ""}\n`;
      }
      text += "\n";
    }
    if (p.grammar?.length) {
      text += "### Grammar\n\n";
      for (const g of p.grammar) text += `- ${g}\n`;
      text += "\n";
    }
    if (p.ideas?.length) {
      text += "### Ideas\n\n";
      for (const g of p.ideas) text += `- ${g}\n`;
      text += "\n";
    }
    rows.push({ sectionId, text });
  }

  const parts = chunkArray(rows, CHUNK_SIZE).map((chunk, idx) => {
    let b = `# Section primers (chunk ${idx + 1})\n\n`;
    for (const r of chunk) b += r.text + "\n";
    return b;
  });
  writeChunkFiles("course", "section-primers", parts, {
    source: "web/data/course-section-primers.ts",
    kind: "section-primers",
  });
}

function exportStories() {
  type Row = { text: string };
  const rows: Row[] = [];

  rows.push({
    text: `## Level 1 story (Aleph)\n\n**Hebrew:**\n\n${LEVEL_1_STORY.he}\n\n**English:**\n\n${LEVEL_1_STORY.en}\n\n`,
  });

  for (let level = 2; level <= 4; level++) {
    const st = getStoryForLevel(level);
    if (!st) continue;
    rows.push({
      text: `## Level ${level} story\n\n**Hebrew:**\n\n${st.he}\n\n**English:**\n\n${st.en}\n\n`,
    });
  }

  rows.push({
    text: `## Story shortcut prerequisites\n\n${JSON.stringify(LEVEL_STORY_SHORTCUT_PREREQUISITE_IDS, null, 2)}\n\n`,
  });

  const parts = chunkArray(rows, Math.min(CHUNK_SIZE, rows.length || 1)).map(
    (chunk, idx) => {
      let b = `# Level stories (chunk ${idx + 1})\n\n`;
      for (const r of chunk) b += r.text;
      return b;
    },
  );
  writeChunkFiles("course", "level-stories", parts, {
    source: "web/data/course-stories.ts",
    kind: "level-stories",
  });
}

function formatMcqItem(prefix: string, item: McqItem): string {
  let s = `### ${prefix} — ${item.id}\n\n`;
  s += `- **Hebrew prompt:** ${item.promptHe}\n`;
  s += `- **Correct (English):** ${item.correctEn}\n`;
  s += `- **Distractors:** ${item.distractorsEn.join(" | ")}\n\n`;
  return s;
}

function exportStoryMcq() {
  const items: { level: number; item: McqItem }[] = [];
  for (let level = 2; level <= 4; level++) {
    const pack = getStoryMcqPack(level);
    if (!pack || pack.kind !== "mcq") continue;
    for (const it of pack.items) items.push({ level, item: it });
  }
  const parts = chunkArray(items, CHUNK_SIZE).map((chunk, idx) => {
    let b = `# Story mini-quiz items (chunk ${idx + 1})\n\n`;
    for (const { level, item } of chunk) {
      b += formatMcqItem(`Level ${level}`, item);
    }
    return b;
  });
  writeChunkFiles("course", "story-mcq-items", parts, {
    source: "web/data/course-stories.ts",
    kind: "story-mcq",
  });
}

function exportSectionMcq() {
  const items: { sectionId: string; item: McqItem }[] = [];
  for (const sectionId of SECTION_IDS_WITH_MCQ) {
    const pack = getMcqPackForSection(sectionId);
    if (!pack || pack.kind !== "mcq") continue;
    for (const it of pack.items) items.push({ sectionId, item: it });
  }
  const parts = chunkArray(items, CHUNK_SIZE).map((chunk, idx) => {
    let b = `# Section MCQ items (chunk ${idx + 1})\n\n`;
    for (const { sectionId, item } of chunk) {
      b += formatMcqItem(sectionId, item);
    }
    return b;
  });
  writeChunkFiles("course", "section-mcq-items", parts, {
    source: "web/data/section-drills.ts",
    kind: "section-mcq",
  });
}

function exportComprehension() {
  const entries = Object.entries(COMPREHENSION_BY_SECTION);
  const parts = chunkArray(entries, CHUNK_SIZE).map((chunk, idx) => {
    let b = `# Comprehension passages (chunk ${idx + 1})\n\n`;
    for (const [sectionId, p] of chunk) {
      b += `## ${sectionId} — ${p.source}\n\n`;
      b += `**Hebrew:**\n\n${p.h}\n\n**English:**\n\n${p.e}\n\n**Note:** ${p.note}\n\n`;
      b += "### Questions\n\n";
      for (const q of p.questions) {
        b += `#### ${q.q}\n\n`;
        b += `Options: ${q.opts.join(" | ")}\n\n`;
        b += `Answer index: ${q.ans} — ${q.note}\n\n`;
      }
    }
    return b;
  });
  writeChunkFiles("reading", "comprehension", parts, {
    source: "web/data/course-comprehension.ts",
    kind: "comprehension",
  });
}

function formatRdPassage(
  p: (typeof READING_PASSAGES_RD)[number],
  idx: number,
): string {
  let s = `## ${p.label} (${p.id}) [${idx + 1}]\n\n`;
  s += `- **Level:** ${p.lv} · **Source:** ${p.src}\n\n`;
  s += `**Hebrew:**\n\n${p.h}\n\n**English:**\n\n${p.e}\n\n`;
  if (p.vocab.length) {
    s += "### Vocabulary\n\n";
    for (const v of p.vocab) s += `- **${v.h}** (${v.p}) — ${v.e}\n`;
    s += "\n";
  }
  if (p.tq.length) {
    s += "### Translation-style questions\n\n";
    for (const t of p.tq) {
      s += `- Word **${t.w}** → correct **${t.c}**; options: ${t.o.join(" | ")}\n`;
    }
    s += "\n";
  }
  if (p.wq.length) {
    s += "### Word-pick questions\n\n";
    for (const w of p.wq) {
      s += `- English **${w.e}** → correct **${w.c}**; options: ${w.o.join(" | ")}\n`;
    }
    s += "\n";
  }
  return s;
}

function exportReadingRd() {
  const parts = chunkArray([...READING_PASSAGES_RD], CHUNK_SIZE).map(
    (chunk, idx) => {
      let b = `# Reading passages RD (chunk ${idx + 1})\n\n`;
      chunk.forEach((p, i) => {
        b += formatRdPassage(p, idx * CHUNK_SIZE + i);
      });
      return b;
    },
  );
  writeChunkFiles("reading", "passages-rd", parts, {
    source: "web/data/reading-passages-rd.ts",
    kind: "reading-rd",
  });
}

function exportReadingJt() {
  const parts = chunkArray([...READING_PASSAGES_JT], CHUNK_SIZE).map(
    (chunk, idx) => {
      let b = `# Jewish texts passages JT (chunk ${idx + 1})\n\n`;
      for (const p of chunk) {
        b += `## ${p.src}\n\n`;
        b += `- **Category:** ${p.cat}\n`;
        if (p.sefariaLink) b += `- **Link:** ${p.sefariaLink}\n`;
        b += `\n**Hebrew:**\n\n${p.h}\n\n**English:**\n\n${p.e}\n\n`;
        b += `**Note:** ${p.note}\n\n`;
        if (p.vocab.length) {
          b += "### Vocabulary\n\n";
          for (const v of p.vocab) b += `- **${v.h}** (${v.p}) — ${v.e}\n`;
          b += "\n";
        }
      }
      return b;
    },
  );
  writeChunkFiles("reading", "passages-jt", parts, {
    source: "web/data/reading-passages-jt.ts",
    kind: "reading-jt",
  });
}

function exportCourseNumbers() {
  let b = "# Aleph cardinals 0–10 (course numbers)\n\n";
  b += "Masculine forms used in the listen drill (`1-nums`).\n\n";
  for (let i = 0; i < CARDINAL_MASC_0_TO_10.length; i++) {
    b += `## ${ROMAN_0_TO_10[i]}\n\n`;
    b += `- **Hebrew:** ${CARDINAL_MASC_0_TO_10[i]}\n`;
    b += `- **Pronunciation:** ${PRON_MASC_0_TO_10[i]}\n\n`;
  }
  writeFile(
    path.join("numbers-roots", "course-numbers-0-10.md"),
    fm({ source: "web/data/course-numbers.ts", kind: "course-numbers" }) + b,
  );
}

function exportHubsAndLibrary() {
  let rh = "# Reading hub entries\n\n";
  for (const e of READING_HUB_ENTRIES) {
    rh += `## ${e.label}\n\n${e.description}\n\n- **href:** ${e.href}\n- **minLevel:** ${e.minLevel}\n\n`;
  }
  writeFile(
    path.join("reading", "hub-entries.md"),
    fm({ source: "web/data/reading-hub.ts", kind: "reading-hub" }) + rh,
  );

  let nh = "# Numbers hub entries\n\n";
  for (const e of NUMBERS_HUB_ENTRIES) {
    nh += `## ${e.label}\n\n${e.description}\n\n- **href:** ${e.href}\n\n`;
  }
  writeFile(
    path.join("numbers-roots", "numbers-hub.md"),
    fm({ source: "web/data/numbers-hub.ts", kind: "numbers-hub" }) + nh,
  );

  let lib = "# Library external links\n\n";
  for (const L of LIBRARY_EXTERNAL_LINKS) {
    lib += `## ${L.label}\n\n${L.desc}\n\n- **href:** ${L.href}\n- **tags:** ${L.tags}\n\n`;
  }
  writeFile(
    path.join("library", "external-links.md"),
    fm({ source: "web/data/library-external-links.ts", kind: "library-links" }) +
      lib,
  );
}

function exportSpecialtyTracks() {
  let body = "# Specialty tracks (metadata)\n\n";
  for (const t of SPECIALTY_TRACKS) {
    body += `## ${t.title} (\`${t.id}\`)\n\n`;
    body += `${t.blurb}\n\n`;
    body += `- **Domain (Hebrew):** ${t.domainHe}\n`;
    body += `- **Focus:** ${t.focus}\n`;
    body += `- **Group:** ${t.group}\n\n`;
    body += "### Outcomes\n\n";
    for (const o of t.outcomes) body += `- ${o}\n`;
    body += "\n### Tier goals\n\n";
    for (const tier of SPECIALTY_TIER_IDS) {
      body += `- **${tier}:** ${t.tierGoals[tier]}\n`;
    }
    body += "\n";
  }
  writeFile(
    path.join("specialty", "tracks-meta.md"),
    fm({ source: "web/data/specialty-tracks.ts", kind: "specialty-meta" }) +
      body,
  );
}

function exportSpecialtyMcq() {
  const items: { packKey: string; title: string; item: McqItem }[] = [];
  for (const t of SPECIALTY_TRACKS) {
    for (const tier of SPECIALTY_TIER_IDS) {
      const pack = getSpecialtyTierMcqPack(t.id, tier);
      if (!pack || pack.kind !== "mcq") continue;
      const packKey = `${t.id}-${tier}`;
      for (const it of pack.items) {
        items.push({ packKey, title: pack.title, item: it });
      }
    }
  }
  const parts = chunkArray(items, CHUNK_SIZE).map((chunk, idx) => {
    let b = `# Specialty tier MCQ (chunk ${idx + 1})\n\n`;
    for (const { packKey, item } of chunk) {
      b += formatMcqItem(packKey, item);
    }
    return b;
  });
  writeChunkFiles("specialty", "tier-mcq-items", parts, {
    source: "web/data/specialty-tier-packs.ts",
    kind: "specialty-mcq",
  });
}

function exportGrammarAndEmoji() {
  const gItems: { topic: string; prompt: string; line: string }[] = [];
  for (const topic of GRAMMAR_DRILLS) {
    for (const it of topic.items) {
      const line = `**${it.h}** (${it.cue}) — options: ${it.opts.join(" | ")} — answer index ${it.ans}. ${it.note}`;
      gItems.push({ topic: topic.topic, prompt: topic.prompt, line });
    }
  }
  const gParts = chunkArray(gItems, CHUNK_SIZE).map((chunk, idx) => {
    let b = `# Grammar drill items (chunk ${idx + 1})\n\n`;
    for (const it of chunk) {
      b += `## ${it.topic}\n\n_${it.prompt}_\n\n${it.line}\n\n`;
    }
    return b;
  });
  writeChunkFiles("study", "grammar-drills", gParts, {
    source: "web/data/grammar-drills.ts",
    kind: "grammar-drills",
  });

  let em = "# Word ↔ emoji drill\n\n";
  for (const w of WORD_EMOJI_DRILLS) {
    em += `- **${w.h}** (${w.p}) — ${w.e} — ${w.em}\n`;
  }
  writeFile(
    path.join("study", "word-emoji-drills.md"),
    fm({ source: "web/data/word-emoji-drills.ts", kind: "word-emoji" }) + em,
  );
}

function exportRoots() {
  const parts = chunkArray([...STATIC_ROOT_FAMILIES], CHUNK_SIZE).map(
    (chunk, idx) => {
      let b = `# Root families (chunk ${idx + 1})\n\n`;
      for (const fam of chunk) {
        b += `## Root ${fam.root} — ${fam.meaning}\n\n`;
        for (const w of fam.words) {
          b += `- **${w.h}** (${w.p}) — ${w.e}\n`;
        }
        b += "\n";
        if (fam.sentence) {
          b += `**Example:** ${fam.sentence}\n\n`;
          if (fam.trans) b += `*${fam.trans}*\n\n`;
        }
      }
      return b;
    },
  );
  writeChunkFiles("numbers-roots", "root-families", parts, {
    source: "web/data/course-roots.ts",
    kind: "roots",
  });
}

function exportCorpus() {
  const parts = chunkArray([...LEGACY_CORPUS_D], CHUNK_SIZE).map((chunk, idx) => {
    let b = `# Legacy corpus D (chunk ${idx + 1})\n\n`;
    for (const e of chunk) {
      b += `## ${e.h}\n\n`;
      b += `- **Transliteration:** ${e.p}\n`;
      b += `- **English:** ${e.e}\n`;
      b += `- **Level tag:** ${e.l}\n`;
      if (e.shoresh) b += `- **Shoresh:** ${e.shoresh}\n`;
      if (e.gram) b += `- **Grammar note:** ${e.gram}\n`;
      if (e.col) b += `- **Usage/colour:** ${e.col}\n`;
      b += "\n";
    }
    return b;
  });
  writeChunkFiles("corpus", "legacy-d", parts, {
    source: "web/data/corpus-d.ts",
    kind: "legacy-corpus-d",
  });
}

function exportBridge() {
  let b = "# Bridge course units\n\n";
  for (const u of BRIDGE_UNITS) {
    b += `## ${u.title} (\`${u.id}\`)\n\n${u.intro}\n\n`;
    b += `**Hebrew:**\n\n${u.he}\n\n**English:**\n\n${u.en}\n\n`;
    b += `### Practice: ${u.practicePack.title}\n\n_${u.practicePack.intro}_\n\n`;
    if (u.practicePack.kind === "mcq") {
      for (const it of u.practicePack.items) b += formatMcqItem(u.id, it);
    }
  }
  writeFile(
    path.join("course", "bridge-units.md"),
    fm({ source: "web/data/bridge-course.ts", kind: "bridge" }) + b,
  );
}

function main() {
  console.log("Exporting knowledge corpus to", EXPORT_ROOT);
  if (fs.existsSync(EXPORT_ROOT)) {
    fs.rmSync(EXPORT_ROOT, { recursive: true });
  }
  ensureDir(EXPORT_ROOT);

  copyDocs();
  exportCourseOverview();
  exportSectionIndex();
  exportPrimers();
  exportStories();
  exportStoryMcq();
  exportSectionMcq();
  exportComprehension();
  exportReadingRd();
  exportReadingJt();
  exportCourseNumbers();
  exportHubsAndLibrary();
  exportSpecialtyTracks();
  exportSpecialtyMcq();
  exportGrammarAndEmoji();
  exportRoots();
  exportCorpus();
  exportBridge();

  console.log("Done. Chunk size:", CHUNK_SIZE, "entries per file (where applicable).");
}

main();
