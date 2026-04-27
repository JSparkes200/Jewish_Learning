/**
 * Street & informal Hebrew — specialty track `casual` (Bronze / Silver / Gold).
 *
 * Content is hand-authored for pedagogy from established spoken-Israeli patterns
 * (texting, work chat, friends). We do not scrape social media or forums: such
 * material is user-owned, ToS-gated, and unsuitable to redistribute as curriculum.
 *
 * @see specialty-tracks.ts (track `casual`)
 */

import type { McqDrillPack } from "./section-drill-types";
import { specialtyTierPackId } from "./specialty-tracks";

function mcq(
  title: string,
  intro: string,
  items: McqDrillPack["items"],
): McqDrillPack {
  return { kind: "mcq", title, intro, items };
}

export const CASUAL_TIER_PACKS: Record<string, McqDrillPack> = {
  [specialtyTierPackId("casual", "bronze")]: mcq(
    "Street — Bronze",
    "High-frequency colloquial chunks — 8 questions.",
    [
      {
        id: "cz-br-1",
        promptHe: "סבבה",
        correctEn: "OK / sure / we’re good (agreement)",
        distractorsEn: [
          "only angry refusal",
          "formal only in court",
          "never used in conversation",
        ],
        translit: "sababa",
      },
      {
        id: "cz-br-2",
        promptHe: "אחלה",
        correctEn: "great / awesome (informal approval)",
        distractorsEn: [
          "boring / dull",
          "I refuse",
          "only a food word",
        ],
        translit: "akhla",
      },
      {
        id: "cz-br-3",
        promptHe: "יאללה",
        correctEn: "come on / let’s go / alright then (momentum)",
        distractorsEn: [
          "please wait forever",
          "I hate you",
          "only a goodbye",
        ],
        translit: "yala",
      },
      {
        id: "cz-br-4",
        promptHe: "אין בעיה",
        correctEn: "no problem (casual assent / reassurance)",
        distractorsEn: [
          "big problem only",
          "I can’t help",
          "formal contract clause only",
        ],
      },
      {
        id: "cz-br-5",
        promptHe: "תכלס",
        correctEn: "practically / bottom line (casual, ‘the point is…’)",
        distractorsEn: [
          "only a math term",
          "I disagree strongly",
          "ancient Mishnaic only",
        ],
        translit: "ikhles",
      },
      {
        id: "cz-br-6",
        promptHe: "וואלה",
        correctEn: "like, wow, honestly (discourse / surprise filler)",
        distractorsEn: [
          "only a place name",
          "never in speech",
          "formal report opening only",
        ],
        translit: "walla",
      },
      {
        id: "cz-br-7",
        promptHe: "מגניב",
        correctEn: "cool (style approval — casual)",
        distractorsEn: [
          "ugly / stupid",
          "very formal praise",
          "only for weather",
        ],
        translit: "magniv",
      },
      {
        id: "cz-br-8",
        promptHe: "בקיצור",
        correctEn: "anyway / in short (wrapping up the story)",
        distractorsEn: [
          "only a book title",
          "I’m starting a new topic with no link",
          "only in legal Hebrew",
        ],
        translit: "bikitsur",
      },
    ],
  ),

  [specialtyTierPackId("casual", "silver")]: mcq(
    "Street — Silver",
    "Particles, hedges, and chat-style phrasing — 15 questions.",
    [
      {
        id: "cz-sv-1",
        promptHe: "נו",
        correctEn: "so? / c’mon / well? (nudge, impatience, fill)",
        distractorsEn: [
          "yes, formally",
          "the number zero",
          "only ‘no’",
        ],
      },
      {
        id: "cz-sv-2",
        promptHe: "יופי",
        correctEn: "great / nice one (satisfied approval)",
        distractorsEn: [
          "terrible",
          "boring",
          "only a fruit name in slang",
        ],
      },
      {
        id: "cz-sv-3",
        promptHe: "אין מצב",
        correctEn: "no way (that can’t be / I won’t accept it)",
        distractorsEn: [
          "definitely yes",
          "I agree 100%",
          "please continue",
        ],
      },
      {
        id: "cz-sv-4",
        promptHe: "אני עושֶׁה פאס (על משימה / הזמנה — מילה מ־'pass')",
        correctEn: "I pass / I’ll sit this one out (soft opt-out, casual loan)",
        distractorsEn: [
          "I’ll definitely do it",
          "I’m the winner",
          "formal only in Knesset",
        ],
        translit: "pass",
      },
      {
        id: "cz-sv-5",
        promptHe: "הכל טוב",
        correctEn: "it’s all good / we’re fine (reassuring wrap-up)",
        distractorsEn: [
          "everything is terrible",
          "only a shopping list",
          "I’m angry with you",
        ],
      },
      {
        id: "cz-sv-6",
        promptHe: "אחי (כשמדברים לחבר, לאו דווקא אח)",
        correctEn: "bro / mate (familiar address — often not literal ‘brother’)",
        distractorsEn: [
          "formal ‘sir’",
          "insult in every use",
          "only family tree",
        ],
        translit: "akhi",
      },
      {
        id: "cz-sv-7",
        promptHe: "אני בפנים (על אירוע / רעיון — סלנג)",
        correctEn: "I’m in / I’m down (I want to be part of it)",
        distractorsEn: [
          "I’m outside physically only",
          "I refuse to enter",
          "I’m at home sleeping",
        ],
      },
      {
        id: "cz-sv-8",
        promptHe: "זהו? אז מה עושים?",
        correctEn: "So that’s it? So what are we doing? (pragmatic next step)",
        distractorsEn: [
          "I have no more questions in formal Hebrew",
          "only a math riddle",
          "goodbye forever",
        ],
      },
      {
        id: "cz-sv-9",
        promptHe: "למה לא?",
        correctEn: "Why not? (openness / casual assent to a plan)",
        distractorsEn: [
          "I absolutely forbid",
          "only a rhetorical question in news",
          "never a positive meaning",
        ],
      },
      {
        id: "cz-sv-10",
        promptHe: "על הדרך (ניסוח בטלפון, לא פורמלי)",
        correctEn: "on the way (I’ll do it en route / while I’m at it)",
        distractorsEn: [
          "only a highway sign",
          "never in speech",
          "I will never do it",
        ],
      },
      {
        id: "cz-sv-11",
        promptHe: "אני סגור (על ביטחון ברעיון — סלנג)",
        correctEn: "I’m set / I’m good with it (figurative, ‘locked in’ — casual)",
        distractorsEn: [
          "I’m locked in a room",
          "I disagree",
          "I’m confused",
        ],
      },
      {
        id: "cz-sv-12",
        promptHe: "הזוי",
        correctEn: "crazy / wild (surreal, sometimes negative)",
        distractorsEn: [
          "boring and normal",
          "formal and polite",
          "only a weather word",
        ],
        translit: "hizui",
      },
      {
        id: "cz-sv-13",
        promptHe: "חבל",
        correctEn: "what a shame / that’s a pity (sympathy, mild regret)",
        distractorsEn: [
          "congratulations",
          "I’m furious",
          "only a rope (never figurative)",
        ],
      },
      {
        id: "cz-sv-14",
        promptHe: "רגע, רגע",
        correctEn: "hold on, hold on (pause / rethink — spoken brake)",
        distractorsEn: [
          "hurry up",
          "you’re wrong in court",
          "only a clock",
        ],
      },
      {
        id: "cz-sv-15",
        promptHe: "זה הזייה / זה הזוי (יומיומי)",
        correctEn: "That’s wild / that’s crazy (surreal or unfair situation)",
        distractorsEn: [
          "that’s very formal",
          "that is exactly expected",
          "I love bureaucracy",
        ],
      },
    ],
  ),

  [specialtyTierPackId("casual", "gold")]: mcq(
    "Street — Gold",
    "Denser colloquial chains, work chat, and register switches — 25 questions.",
    [
      { id: "cz-gd-1", promptHe: "בטח, אבל תראה", correctEn: "Sure, but look (soft objection coming)", distractorsEn: ["I refuse to see", "only yes with no 'but'", "formal only"] },
      { id: "cz-gd-2", promptHe: "אני לא בקטע של זה", correctEn: "I’m not into that (not my vibe, casual opt-out)", distractorsEn: ["I love it", "I’m physically inside", "only formal"] },
      { id: "cz-gd-3", promptHe: "זה סטנדרט, לא?", correctEn: "That’s standard, no? (expectation / mild challenge)", distractorsEn: ["that is illegal", "only a math term", "never in speech"] },
      { id: "cz-gd-4", promptHe: "אין דברים כאלו (הפתעה/זעם mild)", correctEn: "I can’t believe it / that’s not a thing (surprise, pushback)", distractorsEn: ["there are many such things", "only a compliment", "ancient only"] },
      { id: "cz-gd-5", promptHe: "לצאת מהקצב (שיחה לא פורמלית)", correctEn: "to get out of the rhythm / to drop the beat (lose thread)", distractorsEn: ["to run faster", "to enter only", "only music theory"] },
      { id: "cz-gd-6", promptHe: "לעשות בול", correctEn: "to nail it (hit exactly right — casual bravo)", distractorsEn: ["to make a ball only", "to miss completely", "only sports TV"] },
      { id: "cz-gd-7", promptHe: "לשים לב, זה מס' אחת", correctEn: "note: that’s priority #1 (work chat style)", distractorsEn: ["ignore that", "lowest priority", "only a phone number"] },
      { id: "cz-gd-8", promptHe: "אני בראש שקט (על הלו״ז)", correctEn: "I’m easy / I’m flexible (head calm — schedule OK)", distractorsEn: ["I have a headache only", "I’m angry", "I refuse to plan"] },
      { id: "cz-gd-9", promptHe: "אין דחיפות, כשיוצא", correctEn: "no rush, whenever you’re free (loose async)", distractorsEn: ["urgent only", "never reply", "only legal deadline"] },
      { id: "cz-gd-10", promptHe: "תעשה לי רושם ש…", correctEn: "I get the feeling that… (hedged perception)", distractorsEn: ["I am certain in court", "I see only colors", "only formal report"] },
      { id: "cz-gd-11", promptHe: "לסגור מעגל (בשיחה)", correctEn: "to close a loop (finish that open thread, office chat)", distractorsEn: ["to start a new fight", "only geometry in school", "never metaphorical"] },
      { id: "cz-gd-12", promptHe: "לזרוק פה רעיון", correctEn: "to throw an idea out there (casual brainstorm)", distractorsEn: ["to throw a ball only", "formal only", "to refuse ideas"] },
      { id: "cz-gd-13", promptHe: "אני בצד שלך (בוויכוח חברי)", correctEn: "I’m on your side (informal allegiance — friend tone)", distractorsEn: ["I am beside you only physically", "I oppose you", "only a sports cheer"] },
      { id: "cz-gd-14", promptHe: "אל תדאג, סידרתי", correctEn: "Don’t worry, I’ve sorted it (reassure + I handled)", distractorsEn: ["worry more", "I made it worse", "only a threat"] },
      { id: "cz-gd-15", promptHe: "אני בדיוק בזה", correctEn: "I’m on it right now (fully focused on that task, chat)", distractorsEn: ["I ignore that task", "I finished last year", "only a mistake"] },
      { id: "cz-gd-16", promptHe: "אין רוח לזה (היום)", correctEn: "I don’t have the headspace for that today (mood, informal)", distractorsEn: ["I love it today", "only about wind weather", "formal only"] },
      { id: "cz-gd-17", promptHe: "לחוץ בקטנה (יומיומי, לא ניטור רפואי)", correctEn: "a little stressed (small-scale pressure, casual)", distractorsEn: ["completely calm", "only a medical device", "very formal"] },
      { id: "cz-gd-18", promptHe: "לקחת בקלות (הערה, לא אגרסיה)", correctEn: "to take lightly (mild, don’t get heavy — not aggressive)", distractorsEn: ["to take as heavy", "to refuse all jokes", "only weightlifting"] },
      { id: "cz-gd-19", promptHe: "רגע, דילגתי על משהו (בהסבר, לא בטיימינג)", correctEn: "wait, I skipped something in the explanation (self-correction, casual)", distractorsEn: ["I finished perfectly", "formal only", "only in poetry"] },
      { id: "cz-gd-20", promptHe: "לעשות בינג׳ לסדרה", correctEn: "to binge a series (loan + colloquial object)", distractorsEn: ["to watch one minute only", "formal news only", "never said in Israel"] },
      { id: "cz-gd-21", promptHe: "על הזמן! (הפתעה חיובית, יומיומי)", correctEn: "Amazing! / (lit.) before time — colloquial praise for something great", distractorsEn: ["terrible", "boring", "formal only"] },
      { id: "cz-gd-22", promptHe: "אני בדרך, עשר דק׳", correctEn: "I’m on my way, 10 min (text coordination)", distractorsEn: ["I will not come", "I’m in bed", "only a train timetable"] },
      { id: "cz-gd-23", promptHe: "נתראה / נדבר", correctEn: "see you / we’ll talk (loose sign-off in chat, either can close)", distractorsEn: ["I never want to see you", "formal only in law", "only a goodbye in poetry"] },
      { id: "cz-gd-24", promptHe: "לשלוח / לרדת בוואטסאפ (הודעה קצרה)", correctEn: "to send / to drop a line on WhatsApp (async ping)", distractorsEn: ["only email in court", "never in Hebrew", "formal only"] },
      { id: "cz-gd-25", promptHe: "לסיום: נעשה הפרדה בין רהוט ליומיומי (ניסוח קורס)", correctEn: "In short: keep classroom Hebrew for school and layer street chunks where trust + context allow — both are 'real' Hebrew, different register.", distractorsEn: [
          "street Hebrew is fake",
          "formal is never used in Israel",
          "use slang in every work email to your boss, always",
        ] },
    ],
  ),
};
