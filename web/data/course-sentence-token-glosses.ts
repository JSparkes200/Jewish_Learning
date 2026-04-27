import { stripNikkud } from "@/lib/hebrew-nikkud";

/**
 * Bare-form (no nikkud) → short English gloss for correct-sentence feedback.
 */
export const COURSE_SENTENCE_TOKEN_GLOSS: Record<string, string> = {
  מים: "water",
  שלום: "hello / peace",
  אני: "I",
  דני: "Dani (name)",
  לחם: "bread",
  הם: "they (m.)",
  תודה: "thanks",
  רבה: "much / very (with thanks)",
  אמא: "mom",
  כסא: "chair",
  בבקשה: "please",
  ספר: "book",
  כן: "yes",
  רוצה: "want(s) (m.s.)",
  קפה: "coffee",
  כלב: "dog",
  לא: "no / not",
  יודע: "know(s) (m.s.)",
  יודעים: "know (m.pl.)",
  שולחן: "table",
  סליחה: "excuse me / sorry",
  איפה: "where",
  השירותים: "the restroom(s)",
  השמש: "the sun",
  בוקר: "morning",
  טוב: "good",
  אבא: "dad",
  חלון: "window",
  ערב: "evening",
  חבר: "friend (m.)",
  עיפרון: "pencil",
  לילה: "night",
  ילד: "child (m.)",
  קטן: "small (m.s.)",
  קטנה: "small (f.s.)",
  קטנים: "small (m.pl.)",
  לומד: "learn(s) (m.s.)",
  עברית: "Hebrew",
  טלוויזיה: "television",
  אתה: "you (m.s.)",
  מכונית: "car",
  רוצים: "want (m.pl.)",
  את: "you (f.s.)",
  אוהבת: "love(s) (f.s.)",
  דלת: "door",
  אוהבים: "love (m.pl.)",
  אנחנו: "we",
  אוכלים: "eat (m.pl.)",
  תפוח: "apple",
  ישנים: "sleep (m.pl.)",
  עץ: "tree",
  אוכל: "eat(s) (m.s.)",
  זה: "this (m.)",
  כלבים: "dogs",
  גדול: "big (m.s.)",
  רעיון: "idea",
  כחול: "blue",
  זאת: "this (f.)",
  ילדה: "girl",
  ילדות: "girls (children, pl. f.)",
  שותה: "drinks (f.s.)",
  אלה: "these",
  ילדים: "children",
  רעבים: "hungry (m.pl.)",
  יש: "there is / have",
  לי: "to me / I have",
  שאלה: "question",
  שמש: "sun",
  אחד: "one (m.)",
  אחת: "one (f.)",
  שניים: "two (m.)",
  שתיים: "two (f.)",
  כאן: "here",
  עצים: "trees",
  השעה: "the hour / the time",
  עכשיו: "now",
  עשר: "ten",
  שמשות: "lamp globes (here: wrong distractor in context)",
  עשרה: "ten (count form)",
  עשרים: "twenty",
  בן: "son / age (m.)",
  בת: "daughter / age (f.)",
  מאה: "hundred",
  עולה: "costs / goes up",
  שקלים: "shekels",
  מאות: "hundreds",
  אלף: "thousand",
  אלפים: "thousands",
  ישן: "sleeps / old (m.s.)",
};

function bare(s: string): string {
  return stripNikkud(s).replace(/[?!.,׳״:;־—]/g, "");
}

export function glossForHebrewToken(token: string): string | undefined {
  const k = bare(token);
  if (!k) return undefined;
  if (COURSE_SENTENCE_TOKEN_GLOSS[k]) return COURSE_SENTENCE_TOKEN_GLOSS[k];
  const noArticle = k.replace(/^ה/, "");
  if (noArticle !== k && COURSE_SENTENCE_TOKEN_GLOSS[noArticle]) {
    return "the + " + COURSE_SENTENCE_TOKEN_GLOSS[noArticle];
  }
  return undefined;
}
