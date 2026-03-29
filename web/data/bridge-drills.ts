/**
 * Bridge final checkpoint (after all {@link BRIDGE_UNITS} are marked complete).
 * Pass rule: ≥75% (see {@link BRIDGE_PASS_TARGET_PCT} in course-post-foundation).
 */

import type { McqDrillPack } from "./section-drill-types";

export const BRIDGE_FINAL_EXAM_PACK: McqDrillPack = {
  kind: "mcq",
  title: "Bridge — final checkpoint",
  intro:
    "Mixed items from register, reading strategies, and classroom Hebrew. Complete all four study units first.",
  items: [
    {
      id: "br-f-1",
      promptHe: "שָׁלוֹם בַּכִּתָּה — expected tone:",
      correctEn: "friendly + instructional",
      distractorsEn: ["legal contract only", "biblical only", "silent only"],
    },
    {
      id: "br-f-2",
      promptHe: "Common “I don’t understand” (m. speaker):",
      correctEn: "אֲנִי לֹא מֵבִין",
      distractorsEn: ["אֲנִי מֵבִין", "אֲנִי רוֹצֶה", "אֲנִי יָשֵׁן"],
    },
    {
      id: "br-f-3",
      promptHe: "Best first step with unpointed text:",
      correctEn: "spot known words and roots",
      distractorsEn: ["skip every other word", "read right-to-left only", "ignore prefixes"],
    },
    {
      id: "br-f-4",
      promptHe: "Bridge vs foundation exit difficulty:",
      correctEn: "wider text types + lower pass bar",
      distractorsEn: ["same bar as exit", "no reading", "only grammar"],
    },
    {
      id: "br-f-5",
      promptHe: "קוֹרְאִים אֶת הַמִּשְׁפָּט שׁוּב — שׁוּב means:",
      correctEn: "again",
      distractorsEn: ["never", "only once", "only aloud"],
    },
    {
      id: "br-f-6",
      promptHe: "מָה שְׁלוֹמֵךְ? addresses:",
      correctEn: "a woman (singular “you”)",
      distractorsEn: ["a man", "a group of men", "a child only"],
    },
    {
      id: "br-f-7",
      promptHe: "עִתּוֹנוּת is associated with:",
      correctEn: "news / journalistic Hebrew",
      distractorsEn: ["cookbook Hebrew only", "prayer only", "baby talk"],
    },
    {
      id: "br-f-8",
      promptHe: "נַתְחִיל suggests:",
      correctEn: "we will begin / let’s begin",
      distractorsEn: ["we already finished", "we disagree", "we will skip"],
    },
    {
      id: "br-f-9",
      promptHe: "הָרַעַיוֹן בָּרוּר יוֹתֵר after rereading:",
      correctEn: "the idea is clearer",
      distractorsEn: ["the idea disappeared", "the text is shorter", "wrong language"],
    },
    {
      id: "br-f-10",
      promptHe: "מָה שְׁלוֹמְכֶם? (plural “you”) fits:",
      correctEn: "asking a group how they are",
      distractorsEn: ["one child", "a formal letter only", "asking the time"],
    },
    {
      id: "br-f-11",
      promptHe: "רִשׁוּם (register) helps you choose:",
      correctEn: "formal vs informal wording",
      distractorsEn: ["only spelling", "only pronunciation", "only numbers"],
    },
    {
      id: "br-f-12",
      promptHe: "After the bridge, learners typically:",
      correctEn: "pick a specialty track (news, lit, speech…)",
      distractorsEn: ["stop studying", "repeat Aleph only", "skip all reading"],
    },
  ],
};

/** @deprecated Use {@link BRIDGE_FINAL_EXAM_PACK}. */
export const BRIDGE_PLACEHOLDER_PACK = BRIDGE_FINAL_EXAM_PACK;
