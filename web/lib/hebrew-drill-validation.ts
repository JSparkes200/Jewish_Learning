import type { GrammarDrillItem, GrammarDrillTopic } from "@/data/grammar-drills";

const HEBREW_LETTER_RE = /[\u05D0-\u05EA]/;

/** True if the string contains at least one Hebrew letter (incl. final forms). */
export function containsHebrewLetter(s: string): boolean {
  return HEBREW_LETTER_RE.test(s);
}

/**
 * Options may be fully Hebrew, or a short Latin gloss starting with an em dash
 * (e.g. pedagogical “no אֶת” explanations). A few legacy drills use short English
 * article-teaching phrases (“No article — indefinite”).
 */
export function grammarOptionLooksValid(opt: string): boolean {
  const t = opt.trim();
  if (t.length === 0) return false;
  if (containsHebrewLetter(t)) return true;
  if (t.startsWith("—") || t.startsWith("–")) return true;
  if (/^(No |Needs |Add |Use )/i.test(t)) return true;
  return false;
}

export function validateGrammarDrillItem(
  topicId: string,
  index: number,
  item: GrammarDrillItem,
): string[] {
  const p = `${topicId} item ${index}`;
  const err: string[] = [];
  if (!containsHebrewLetter(item.h)) {
    err.push(`${p}: prompt (h) must contain Hebrew letters`);
  }
  if (!item.cue.trim()) {
    err.push(`${p}: cue must be non-empty`);
  }
  if (item.opts.length < 2) {
    err.push(`${p}: need at least 2 options`);
  }
  if (!Number.isInteger(item.ans) || item.ans < 0 || item.ans >= item.opts.length) {
    err.push(`${p}: ans out of range for opts`);
  }
  item.opts.forEach((o, i) => {
    if (!grammarOptionLooksValid(o)) {
      err.push(`${p}: option ${i} should contain Hebrew or start with —/–`);
    }
  });
  if (!item.note.trim()) {
    err.push(`${p}: note must be non-empty`);
  }
  return err;
}

export function validateGrammarDrillTopic(topic: GrammarDrillTopic): string[] {
  if (!topic.id.trim() || !topic.topic.trim() || !topic.prompt.trim()) {
    return [`${topic.id || "(no id)"}: missing id, topic, or prompt`];
  }
  return topic.items.flatMap((it, i) =>
    validateGrammarDrillItem(topic.id, i, it),
  );
}
