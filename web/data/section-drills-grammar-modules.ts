import type { McqDrillPack } from "./section-drill-types";

/**
 * Targeted grammar modules (end of each foundation level) — MCQ tests recognition
 * and contrastive pairs called out in curriculum planning (matres, prep suffixes,
 * binyan families, smikhut, passives, hypotheticals).
 */
export const grammarModuleDrillPacks: Record<string, McqDrillPack> = {
  "1-matres": {
    kind: "mcq",
    title: "From dots to full spelling",
    intro:
      "You’ll connect voweled words to the way they look in apps, street signs, and messaging — vav, yod, and final letters are doing real work, not decoration.",
    items: [
      {
        id: "t1",
        promptHe: "שֻׁלְחָן",
        correctEn: "The same word unvowelled is often written שולחן (vav = /o/ sound in full spelling).",
        distractorsEn: [
          "Yod and vav are never used for vowel sounds in modern spelling",
          "Unvowelled Hebrew is always the same as pointed Hebrew letter-for-letter",
          "Matres only appear in biblical texts",
        ],
        translit: "shulkhan",
        vibeNote:
          "In ktiv male (\"full\" spelling), vav and yod act as matres lectionis — they carry part of the vowel so you can read without nikkud.",
      },
      {
        id: "t2",
        promptHe: "הוּא (he) · הִיא (she) · הֵם (they)",
        correctEn: "Dropping nikkud, context + מ\"ם תי\"ו (final forms) and word patterns keep gender/number clear.",
        distractorsEn: [
          "Unvowelled Hebrew is impossible to disambiguate",
          "Hebrew written without dots is a different language",
          "You must always guess from the first letter only",
        ],
      },
      {
        id: "t3",
        promptHe: "יוֹם",
        correctEn: "Often written יום with yod as part of the /o/ vowel pattern in full spelling.",
        distractorsEn: [
          "The word is never spelled with a yod",
          "Nikkud and spelling always match 1:1 in modern Hebrew",
          "Only foreign words get full spelling",
        ],
        translit: "yom",
      },
      {
        id: "t4",
        promptHe: "בֵּית + סֵפֶר (school) — the smikhut pair",
        correctEn: "You’ll learn the construct בֵּית סֵפֶר / בית ספר in a later module; here notice ב alone isn’t a word for “house of.”",
        distractorsEn: [
          "בית ספר means “book house” as two separate full words only",
          "Construct state never shortens the first noun",
          "You always write הָבַּיִת before סֵפֶר for “the school”",
        ],
      },
      {
        id: "t5",
        promptHe: "מֵילִים (words) in everyday typing",
        correctEn: "Full spelling (כתיב מלא) often uses extra vav/yod to mark vowels readers would feel from nikkud.",
        distractorsEn: [
          "WhatsApp Hebrew never uses vav for /o/",
          "Ktiv male is a spelling mistake to avoid",
          "Only newspapers use unvowelled text",
        ],
      },
      {
        id: "t6",
        promptHe: "לַיְלָה (night) vs לֵיל (construct: ליל …)",
        correctEn: "The same root can show different matres: לילה (night) vs construct ליל + noun — patterns you’ll read more than guess once.",
        distractorsEn: [
          "construct never changes the letters inside a word",
          "ליל and לילה are two unrelated roots",
          "construct always adds a hay at the end",
        ],
        translit: "layla / leil",
      },
      {
        id: "t7",
        promptHe: "What’s the best mindset when nikkud disappear?",
        correctEn: "Read by root + matres + context — not by translating letter-by-letter from English order.",
        distractorsEn: [
          "Memorize every unvowelled word as a new shape",
          "Use English cognates for every guess",
          "Stop studying until nikkud are automatic with zero mistakes",
        ],
      },
      {
        id: "t8",
        promptHe: "אֳוֹתִיּוֹת הֲנָחָה (matres lectionis) — the usual suspects",
        correctEn: "Vav, yod, and sometimes aleph/final he carry vowel information in unpointed text.",
        distractorsEn: [
          "Only shin/sin dot matters for reading",
          "Dagesh in bet/kaf/pe is the main clue for unvowelled reading",
          "Matres are the same as silent letters in English",
        ],
      },
    ],
  },
  "2-prep-suf": {
    kind: "mcq",
    title: "One word, not two",
    intro:
      "Hebrew glues prepositions to pronouns. אִתִּי is “with me” as one word — not *עם אני*.",
    items: [
      {
        id: "p1",
        promptHe: "אִתִּי",
        correctEn: "With me (אֶת + suffix or אִתְּ- + 1s)",
        distractorsEn: ["To me", "From me", "About me"],
        translit: "iti",
      },
      {
        id: "p2",
        promptHe: "לָנוּ",
        correctEn: "To us / for us (ל + 1p)",
        distractorsEn: [
          "Us (direct object — אֹתָנוּ)",
          "With us (אִתָּנוּ)",
          "Our (שֶׁלָּנוּ or suffix on noun)",
        ],
        translit: "lanu",
      },
      {
        id: "p3",
        promptHe: "אוֹתָנוּ",
        correctEn: "Us (direct object אֶת- + 1p)",
        distractorsEn: ["To us (לנו)", "We (אנחנו as object wrong)", "Our house only"],
        translit: "otanu",
      },
      {
        id: "p4",
        promptHe: "אִתּוֹ",
        correctEn: "With him (with + 3ms)",
        distractorsEn: ["To him (לו)", "His (שלו or suffix)", "Him (object) only"],
        translit: "ito",
      },
      {
        id: "p5",
        promptHe: "לָהֶם",
        correctEn: "To them (ל + 3mp)",
        distractorsEn: [
          "Them (object) only",
          "With them",
          "They (subject pronoun)",
        ],
        translit: "lahem",
      },
      {
        id: "p6",
        promptHe: "מִמֶּנּוּ / מִמֶּנִּי",
        correctEn: "From him / it · from me (מן + suffix — doubled נ in the stem forms)",
        distractorsEn: [
          "Only used for physical movement, never time",
          "Always means 'more than' in comparisons",
          "Same as the word for 'singer'",
        ],
        translit: "mimenu / mimeni",
      },
      {
        id: "p7",
        promptHe: "Contrast: “they saw us” needs",
        correctEn: "אוֹתָנוּ (object) — the verb already carries “they” by agreement",
        distractorsEn: [
          "לָנוּ (to us) as the only option",
          "אֲנַחְנוּ (subject) after the verb in every sentence",
          "אִתָּנוּ (with us) for every ‘us’ in speech",
        ],
      },
      {
        id: "p8",
        promptHe: "בּוֹ / בִּי / בָּהּ / בָּהֶם",
        correctEn: "In him · in me · in her · in them — (ב + pronoun suffix) — the preposition fuses, English keeps two words.",
        distractorsEn: [
          "These are all future-tense verb prefixes",
          "They are plural definite articles",
          "They can only mark location in space, not abstract ‘in that idea’",
        ],
      },
    ],
  },
  "3-binyan-logic": {
    kind: "mcq",
    title: "Same root, different job",
    intro:
      "You already meet roots; here you use בִּנְיָנִים (patterns) the way Hebrew speakers do — the same three consonants, different 'syntax' of meaning.",
    items: [
      {
        id: "b1",
        promptHe: "Root כ.ת.ב — basic active (to write) is usually",
        correctEn: "Qal: לִכְתֹּב (katav, yikhtov, kotev…)",
        distractorsEn: [
          "Only Nif’al: לְהִכָּתֵב",
          "Only Pi'el: לְכַתֵּב",
          "An English loan verb",
        ],
      },
      {
        id: "b2",
        promptHe: "לְכַתֵּב (Pi'el) — from כ.ת.ב",
        correctEn: "Often “to address a letter / write formally / have something written a certain way” (intensive / result nuance) — not the same as plain “write a note.”",
        distractorsEn: [
          "Always means to erase",
          "Only passive: was written",
          "Only in biblical poetry",
        ],
      },
      {
        id: "b3",
        promptHe: "לְהַכְתִּיב (Hif'il) — from כ.ת.ב",
        correctEn: "Causative: to dictate / make (someone) write — one person’s action causes another’s writing.",
        distractorsEn: [
          "Means I wrote alone without anyone else",
          "Means to read out loud",
          "Same as to correspond by email",
        ],
      },
      {
        id: "b4",
        promptHe: "לְהִתְכַּתֵּב (Hitpa'el) — from כ.ת.ב",
        correctEn: "Reciprocal / middle: to correspond, exchange letters — the action bounces between people.",
        distractorsEn: [
          "Means to erase a letter from memory",
          "Only used for singing",
          "Same as to publish in a paper",
        ],
      },
      {
        id: "b5",
        promptHe: "לְהִכָּתֵב (Nif'al) — from כ.ת.ב",
        correctEn: "Often passive: to be written / to get written; sometimes middle nuance in modern usage.",
        distractorsEn: [
          "Always future tense of Qal",
          "Only means I refuse to write",
          "Only biblical — never in news",
        ],
      },
      {
        id: "b6",
        promptHe: "Why is learning binyanim “math-like”?",
        correctEn: "You predict meaning from (root + pattern): new verbs are guessable if you know the family.",
        distractorsEn: [
          "Every verb is a random string to memorize in isolation",
          "Binyan never changes the meaning, only the vowels’ beauty",
          "Only 10 verbs in Hebrew have multiple binyan forms",
        ],
      },
      {
        id: "b7",
        promptHe: "Root ל.מ.ד — לִלְמוֹד (to learn) vs לְלַמֵּד (to teach, Hif’il pattern)",
        correctEn: "Hif’il (לְלַמֵּד) is causative: to cause to learn. Qal לִלְמוֹד = to learn — same three letters, different binyan job.",
        distractorsEn: [
          "They are unrelated roots",
          "Hif’il is always the feminine form",
          "Qal and Hif’il are identical in the past tense for every verb",
        ],
      },
      {
        id: "b8",
        promptHe: "Pi'el dagesh in the middle of the root usually signals",
        correctEn: "An intensive, declarative, or factitive nuance (often affecting someone/something) — a core Pi'el “feel.”",
        distractorsEn: [
          "The verb is a typo",
          "The verb is always passive",
          "The dagesh means you whisper the word",
        ],
      },
    ],
  },
  "3-smikhut": {
    kind: "mcq",
    title: "Smikhut: possessor in one phrase",
    intro:
      "Noun + noun: the first noun is “nismakh” to the second — the article usually lands on the *second* piece of the pair.",
    items: [
      {
        id: "s1",
        promptHe: "The school (literally: house-of the-book)",
        correctEn: "בֵּית הַסֵּפֶר (NOT *הבית-ספר as one long compound with the first part definite alone)",
        distractorsEn: [
          "הַבַּיִת־הַסֵּפֶר (two full Article words — wrong in standard construct)",
          "הַבַּיִת הַסֵּפֶר (two nouns, each with ה — for this phrase, wrong for ‘school’ as one unit)",
          "בַּיִת סֵפֶר (indefinite only — not the idiom for school)",
        ],
      },
      {
        id: "s2",
        promptHe: "בַּיִת (house) in construct before סֵפֶר",
        correctEn: "Often shortened / vowel change: בֵּית (construct form), not the pausal בַּיִת",
        distractorsEn: [
          "Always stays בית with no change",
          "Becomes a verb in construct",
          "Adds a hay at the end for no reason",
        ],
      },
      {
        id: "s3",
        promptHe: "מִשְׁפָּחָה + אָבִי (my father’s family)",
        correctEn: "מִשְׁפַּחַת אָבִי — tav f. construct ending links to the possessor (first noun in construct takes special linking)",
        distractorsEn: [
          "מִשְׁפָּחָה הָאָבִי",
          "הַמִשְׁפָּחָה־אָבִי",
          "אָבִי מִשְׁפָּחָה in free word order for every possessive",
        ],
      },
      {
        id: "s4",
        promptHe: "Definite + construct: “king of the land” / “the land’s king”",
        correctEn: "מֶלֶךְ + definite second noun → מֶלֶךְ הָאָרֶץ / מלך הארץ — ה on the second member shows which land.",
        distractorsEn: [
          "המלך וארץ as two apposed words only",
          "המלך־הארץ with double possession on the first",
          "מלכת הארץ for every regnal phrase",
        ],
      },
      {
        id: "s5",
        promptHe: "A school textbook (material) — not the building called “school”",
        correctEn: "You build phrases like סֵפֶר + subject area or a loan/collocation — the fixed idiom בֵּית־הַסֵּפֶר = the *school* the institution, not a catch-all for every 'school' compound.",
        distractorsEn: [
          "Use בֵּית־הַסֵּפֶר for any book about school, always",
          "Hebrew has one compound for “school” in every possible meaning with zero distinction",
          "סֵפֶר־הַמִשְׁפָּחָה is the normal word for a textbook, always, in Ulpan",
        ],
      },
      {
        id: "s6",
        promptHe: "שֶׁׁל with a noun: “Dana’s book” in colloquial speech",
        correctEn: "הַסֵּפֶר שֶׁל דָּנָה — the של chain replaces construct in everyday speech in many cases — both systems coexist.",
        distractorsEn: [
          "You must use construct only, never שֶׁל, in modern Hebrew",
          "שֶׁל can never appear with a definite noun",
          "Dana’s book is always two separate sentences",
        ],
      },
      {
        id: "s7",
        promptHe: "What smikhut does *not* do",
        correctEn: "It is not the same as English of-X word order with two full articles; ה usually hugs the *head* of the whole NP or the second noun, depending on the idiom",
        distractorsEn: [
          "You can stack ה on every adjective in any order",
          "Construct only works with body-part words",
          "Construct and של are 100% interchangeable in all contexts with zero nuance",
        ],
      },
      {
        id: "s8",
        promptHe: "יֵשׁ … בְּ־ pattern vs construct",
        correctEn: "“There is/are” uses יֵשׁ + prepositional / phrase structure; “house of” uses construct for tight noun–noun binding — don’t conflate the patterns.",
        distractorsEn: [
          "יֵשׁ בית is always a construct phrase",
          "construct never appears in Jewish religious phrases",
          "יֵשׁ only works with people nouns",
        ],
      },
    ],
  },
  "4-passive": {
    kind: "mcq",
    title: "Who did it vs what happened to it",
    intro:
      "News, law, and formal Hebrew love passive/causative binyanim. You won’t *speak* Pu'al all day, but you’ll *read* it constantly.",
    items: [
      {
        id: "v1",
        promptHe: "דִּבְּרוּ עַל־זֶה (active: they spoke) vs נִדְבַּר (was spoken, context)",
        correctEn: "Nif'al and passive patterns flip focus: event first, agent optional in the sentence.",
        distractorsEn: [
          "Passive means the sentence is ungrammatical in Hebrew",
          "Nif’al is only for plants",
          "Active and passive are identical in every newspaper",
        ],
      },
      {
        id: "v2",
        promptHe: "Pu’al / Huf’al look & feel: doublings + u- vowel patterns in past",
        correctEn: "You’ll spot passive stems by template (often u- under first consonant, known roots in passive templates) and context (“was / got done”).",
        distractorsEn: [
          "They only appear in the Bible, never in TV news",
          "Pu’al and Qal are never related for the same root",
          "Passive sentences never name the agent in Hebrew, ever",
        ],
      },
      {
        id: "v3",
        promptHe: "Huf’al: הוּכְרַע (was decided / was defeated) — feel",
        correctEn: "Causative–passive: X was made to happen by an implicit agent — very common in formal reportage.",
        distractorsEn: [
          "Always the first person past of Qal",
          "A slang intensifier in speech",
          "Same as a question word",
        ],
        translit: "hukhra`",
      },
      {
        id: "v4",
        promptHe: "לָמֶד / לִמַּד / לֻמַּד (learn / teach / be taught) — one root, three voices",
        correctEn: "The same three letters move through binyan families — passive isn’t a separate root list.",
        distractorsEn: [
          "למד is the only root that can do this; others are static",
          "Passive in Hebrew is always with נפעל in English",
          "These three are unrelated homonyms by coincidence",
        ],
      },
      {
        id: "v5",
        promptHe: "When tourists speak only Qal+Pi'el, but want to read policy papers:",
        correctEn: "You train recognition of passive patterns + agent-by-pp phrases (יְעַל ידי / על ידי) — you don’t need to produce Huf’al in conversation first.",
        distractorsEn: [
          "You should avoid all media until you can produce Pu’al fluently",
          "Passive is banned in the Academy’s dictionary",
          "Law Hebrew uses only Aramaic passives from now on",
        ],
      },
      {
        id: "v6",
        promptHe: "נִפְתַּח / נִסְגַּר (was opened / was closed) — Nif’al in news",
        correctEn: "Nif’al is your everyday passive/inchoative: “it opened / it got closed / it turned out” — not exotic.",
        distractorsEn: [
          "These can only be said about doors in poetry",
          "Nif’al is always future tense in newspapers",
          "They mean the building opened itself on purpose, always with blame",
        ],
      },
      {
        id: "v7",
        promptHe: "Why formal Hebrew “sounds more passive”",
        correctEn: "It backgrounds whodunnit, foregrounds what happened to institutions or publics — the same in English policy speak.",
        distractorsEn: [
          "Because Hebrew can’t do active voice at all in news",
          "Because all journalists hate agents",
          "Because Binyan was invented in 1990",
        ],
      },
      {
        id: "v8",
        promptHe: "גּוֹרֵם לְ־ / מְחַיֵּב (cause / obligate) vs passive result",
        correctEn: "Causative (Hif’il) actions often pair with what happened to the theme in passive binyan in the next clause — a rhetorical move you read in op-eds.",
        distractorsEn: [
          "Causative and passive can never co-occur in one paragraph",
          "These patterns only in spoken café Hebrew",
          "Op-eds can’t use binyan variation",
        ],
      },
    ],
  },
  "4-if-clauses": {
    kind: "mcq",
    title: "If — likely vs if-only (counterfactual)",
    intro:
      "אִם is your default “if” for open conditions. אִלּוּ / לוּ and irrealis mood for past unreality is a *different* branch of the brain — and uses different past forms in careful Hebrew.",
    items: [
      {
        id: "c1",
        promptHe: "אִם + future / imperfect for open condition",
        correctEn: "“If I have time, I will come” — אִם + future on both sides in modern speech is normal.",
        distractorsEn: [
          "אִם can never take future tense in Hebrew",
          "You must use אִלוּ for all future if-clauses",
          "If-clauses in Hebrew are always back-to-front from English in every case",
        ],
      },
      {
        id: "c2",
        promptHe: "אִלּוּ / לוּ + past contrary-to-fact (literary / careful: “if I had known…)",
        correctEn: "These mark counterfactuals — the condition did not hold; the apodosis is the unrealized result.",
        distractorsEn: [
          "They are synonyms for 'maybe'",
          "They are only for weather forecasts",
          "They require present tense on both sides",
        ],
      },
      {
        id: "c3",
        promptHe: "Spoken way to say “if I were you” / “I should have”",
        correctEn: "Periphrastic: הָייתי אמור, כדאי היה, with אם + past, or colloquial chunking — high-register אילו/לו is for formal/written layers.",
        distractorsEn: [
          "Hebrew has no way to say regret",
          "You use אם יהיה for all counterfactuals in speech",
          "Only biblical Hebrew can express 'should have'",
        ],
      },
      {
        id: "c4",
        promptHe: "“If and only if” / logical condition",
        correctEn: "Not one fixed morpheme — you paraphrase with רק אם, אם ורק אם, in math/argument contexts.",
        distractorsEn: [
          "אִלוֹ is the official sign for if-and-only-if in Ulpan",
          "You double אם אם for iff",
          "Hebrew has no way to be precise in logic",
        ],
      },
      {
        id: "c5",
        promptHe: "אִם אֱמֶת (if true) in debate",
        correctEn: "A frozen rhetorical block — you’ll read it, not build it with classroom אם rules per se.",
        distractorsEn: [
          "Always ungrammatical in Modern Hebrew",
          "Means 'in truth' with zero connection to 'if'",
          "Only in cooking recipes",
        ],
      },
      {
        id: "c6",
        promptHe: "Emotional: לוֹ הָיִיתִי יוֹדֵעַ! (if only I had known)",
        correctEn: "The לו/אלו + past complex is a classic literary counterfactual — recognize it, then imitate in writing when you are ready.",
        distractorsEn: [
          "This is how toddlers say I don’t know",
          "The same as אני לא ידע",
          "Always uses future tense in both clauses",
        ],
      },
      {
        id: "c7",
        promptHe: "“Whether” (indirect) uses",
        correctEn: "Often אם embedded under verbs of knowing/asking — a different use from adverbial 'if (then)' — context tells you which.",
        distractorsEn: [
          "Whether is always a separate word (שֶׁ) with no אם",
          "You can never use אם in reported speech",
          "Hebrew can’t do indirect questions",
        ],
      },
      {
        id: "c8",
        promptHe: "What most learners do wrong with counterfactuals",
        correctEn: "They translate every English 'if' as אִם — even for counterfactuals where careful Hebrew uses אִלּוּ/לוּ + past — and they never learn the high-register irrealis pattern.",
        distractorsEn: [
          "They use too much אילו in café orders",
          "They think אם can’t begin a question",
          "They refuse to use past tense in any clause",
        ],
      },
    ],
  },
};
