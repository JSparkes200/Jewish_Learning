/**
 * Talmudic / rabbinic Hebrew and Jewish Babylonian Aramaic specialty banks.
 * @see specialty-tracks.ts — same tier lengths & pass logic as modern tracks.
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

export const TRADITIONAL_SPECIALTY_PACKS: Record<string, McqDrillPack> = {
  [specialtyTierPackId("talmudic", "bronze")]: mcq(
    "Talmudic / rabbinic — Bronze",
    "Core register: layers of text, argument words, and corpus names — 8 questions.",
    [
      {
        id: "tm-br-1",
        promptHe: "״תָנָא״ — שִׁכְבַת הַמְקוֹרוֹת הַקַּדְמוֹנִים",
        correctEn: "Tannaitic authority or tannaitic source (Mishnah era)",
        distractorsEn: ["Amora only", "modern journalist", "biblical prophet"],
      },
      {
        id: "tm-br-2",
        promptHe: "״אֲמוֹרָא״ — קוֹל בַּגְּמָרָא",
        correctEn: "Amoraic sage (Gemara stratum)",
        distractorsEn: ["Mishnah compiler only", "medieval commentator", "cantor"],
      },
      {
        id: "tm-br-3",
        promptHe: "״מִשְׁנָה״ — קוֹרְפוּס תַּנָּאִי",
        correctEn: "Mishnah corpus (tannaitic code)",
        distractorsEn: ["Gemara only", "midrash aggadah", "modern textbook"],
      },
      {
        id: "tm-br-4",
        promptHe: "״גְּמָרָא״ — שִׁכְבַת הַדִּיּוּן",
        correctEn: "Gemara — discussion layer on the Mishnah",
        distractorsEn: ["Mishnah alone", "Bible only", "liturgy"],
      },
      {
        id: "tm-br-5",
        promptHe: "״סוּגְיָא״ — יְחִידַת דִּיּוּן",
        correctEn: "sugya — unit of Talmudic discussion",
        distractorsEn: ["single verse", "synagogue", "legal contract"],
      },
      {
        id: "tm-br-6",
        promptHe: "״קֻשְׁיָא״ — קֹשֶׁר הַקּוּשְׁיָא",
        correctEn: "objection / difficulty raised against a claim",
        distractorsEn: ["final ruling", "blessing", "translation"],
      },
      {
        id: "tm-br-7",
        promptHe: "״תִּירוּץ״ — אַחַר הַקֻּשְׁיָא",
        correctEn: "resolution / answer to the difficulty",
        distractorsEn: ["new objection", "verse citation only", "silence"],
      },
      {
        id: "tm-br-8",
        promptHe: "״סְתָם״ — קוֹל בְּלִי שֵׁם",
        correctEn: "anonymous voice (often stam of the Gemara)",
        distractorsEn: ["named tanna only", "biblical narrator", "printer"],
      },
    ],
  ),

  [specialtyTierPackId("talmudic", "silver")]: mcq(
    "Talmudic / rabbinic — Silver",
    "Proof textures, citations, and structural terms — 15 questions.",
    [
      {
        id: "tm-sv-1",
        promptHe: "״בְּרַיְיתָא״ — מִקְרָא תַּנָּאִי מִחוּץ לַמִּשְׁנָה",
        correctEn: "baraita — tannaitic tradition outside the Mishnah",
        distractorsEn: ["Amoraic story", "modern essay", "prayer"],
      },
      {
        id: "tm-sv-2",
        promptHe: "״מִנַּלָּן״ — שְׁאֵלַת יְסוֹד",
        correctEn: "whence do we know / what is the source",
        distractorsEn: ["who said it", "what year", "which city"],
      },
      {
        id: "tm-sv-3",
        promptHe: "״מִנַּיִין״ — מִקְרָא סְפֵצִיפִי",
        correctEn: "from what verse / which verse supports this",
        distractorsEn: ["why not", "how many", "where buried"],
      },
      {
        id: "tm-sv-4",
        promptHe: "״תַּנָּאֵי״ — שְׁנֵי פְּסָקִים תַּנָּאִיִּים",
        correctEn: "tannaitic dispute between named tannaim",
        distractorsEn: ["two Amoraim agree", "one midrash", "two cantors"],
      },
      {
        id: "tm-sv-5",
        promptHe: "״מִקְרָא״ — בְּהֶקְשֵׁף לַדִּין",
        correctEn: "Scripture verse cited as proof",
        distractorsEn: ["Aramaic gloss", "Greek loan", "title page"],
      },
      {
        id: "tm-sv-6",
        promptHe: "״כֵּיצַד״ — פִּתּוּחַ הַלִּמּוּד",
        correctEn: "how — opens procedural / legal walkthrough",
        distractorsEn: ["why forbidden", "who pays", "when Shabbat"],
      },
      {
        id: "tm-sv-7",
        promptHe: "״תַּנָּא קַמָּא״ — הַנוּסָח הָרִאשׁוֹן",
        correctEn: "first tanna in a cited dispute",
        distractorsEn: ["last amora", "anonymous stam", "scribe"],
      },
      {
        id: "tm-sv-8",
        promptHe: "״הַבָּא״ — מַבְחִין מִי הַנִּדּוֹן",
        correctEn: "the one who comes / the case introduced (legal subject)",
        distractorsEn: ["the rabbi who enters", "next tractate", "traveler"],
      },
      {
        id: "tm-sv-9",
        promptHe: "״רֵישָׁא״ / ״סֵיפָא״ — חֲלוּקֵי נוּסָח",
        correctEn: "beginning vs. end of a clause or mishnah",
        distractorsEn: ["two cities", "two books", "two holidays"],
      },
      {
        id: "tm-sv-10",
        promptHe: "״קַ״ו״ — מִקַּל אֶל־חָמוּר",
        correctEn: "a fortiori (qal vaḥomer) inference",
        distractorsEn: ["gezerah shavah", "analogy of place", "majority vote"],
      },
      {
        id: "tm-sv-11",
        promptHe: "״גְּזֵרָה שָׁוָה״ — הַקְשָׁאָה מִלְּשׁוֹן אַחֵר",
        correctEn: "analogous verbal derivation between verses",
        distractorsEn: ["simple translation", "vowel pattern", "poetic rhyme"],
      },
      {
        id: "tm-sv-12",
        promptHe: "״הֲלָכָה״ — מִסְגֶּרֶת הַנִּרְאֶה",
        correctEn: "normative ruling / legal outcome",
        distractorsEn: ["story only", "grammar rule", "calendar date"],
      },
      {
        id: "tm-sv-13",
        promptHe: "״אַגָּדָה״ — סִיפּוּר וּמוּסָר",
        correctEn: "non-legal narrative / homiletical material",
        distractorsEn: ["pure halakhah", "vowel lesson", "cantillation"],
      },
      {
        id: "tm-sv-14",
        promptHe: "״מִדְרָשׁ״ — דֶּרֶךְ קְרִיאָה דְּרוּשָׁה",
        correctEn: "midrash — exegetical reading tradition",
        distractorsEn: ["spoken Hebrew slang", "news headline", "cookbook"],
      },
      {
        id: "tm-sv-15",
        promptHe: "״מַתְנִיתִין״ — הַטֶּקְסְט הַמִּשְׁנָאִי",
        correctEn: "Mishnaic text under discussion",
        distractorsEn: ["Gemara story", "biblical scroll", "letter to editor"],
      },
    ],
  ),

  [specialtyTierPackId("talmudic", "gold")]: mcq(
    "Talmudic / rabbinic — Gold",
    "Finer argument vocabulary and editorial habits — 25 questions.",
    [
      {
        id: "tm-gd-1",
        promptHe: "״תִּיוּבְתָּא״ — סוֹף הַקַּו",
        correctEn: "refutation that defeats the line of argument",
        distractorsEn: ["friendly agreement", "new mishnah", "blessing"],
      },
      {
        id: "tm-gd-2",
        promptHe: "״מְקַשֶּׁה״ — מַעֲלֶה קֻשְׁיָא",
        correctEn: "raises a difficulty (verb / role)",
        distractorsEn: ["resolves quietly", "copies text", "translates"],
      },
      {
        id: "tm-gd-3",
        promptHe: "״מְתָרֵץ״ — נוֹתֵן תִּירוּץ",
        correctEn: "resolves / answers the difficulty",
        distractorsEn: ["asks only", "leaves unresolved", "changes subject"],
      },
      {
        id: "tm-gd-4",
        promptHe: "״שְׁאֵילָה״ וְ״תְּשׁוּבָה״ — מִבְנֶה סִיפּוּרִי",
        correctEn: "question-and-answer frame in discourse",
        distractorsEn: ["buying and selling", "prayer response", "two verses"],
      },
      {
        id: "tm-gd-5",
        promptHe: "״סְתָם מִשְׁנָה״ — לְלֹא שֵׁם",
        correctEn: "anonymous Mishnah (no named tanna)",
        distractorsEn: ["baraita only", "Gemara stam", "biblical verse"],
      },
      {
        id: "tm-gd-6",
        promptHe: "״תַּנָּאֵי אַלִּיבָּא דְּ…״ — מִסְגֶּרֶת נִרְאֵית",
        correctEn: "tannaim disagree about / according to X",
        distractorsEn: ["everyone agrees", "only one tanna", "no dispute"],
      },
      {
        id: "tm-gd-7",
        promptHe: "״אָמַר מָר״ — הַפְנָיָה לְסִפְרוּת",
        correctEn: "the master said — cites authoritative voice",
        distractorsEn: ["anonymous printer", "child student", "secular judge"],
      },
      {
        id: "tm-gd-8",
        promptHe: "״דְּאָמַר מָר״ — כְּפִי שֶׁנֶּאֱמַר",
        correctEn: "as the master said — textual anchor",
        distractorsEn: ["as the crowd shouted", "as translated", "as forgotten"],
      },
      {
        id: "tm-gd-9",
        promptHe: "״רַבָּא אָמַר״ / ״רַבִּי… אָמַר״ — יִחוּס",
        correctEn: "named amoraic attribution",
        distractorsEn: ["anonymous stam", "bibical quote", "headline"],
      },
      {
        id: "tm-gd-10",
        promptHe: "״מַאי שְׁנָא״ — הַבְדָּלָה",
        correctEn: "what is the difference (between cases)",
        distractorsEn: ["what is the year", "who is greater", "where is it"],
      },
      {
        id: "tm-gd-11",
        promptHe: "״אִיבַּעְיָא לָן״ — סְפֵקוּת פְּתוּחָה",
        correctEn: "it is a question for us / left undecided",
        distractorsEn: ["decided unanimously", "forbidden", "irrelevant"],
      },
      {
        id: "tm-gd-12",
        promptHe: "״תַּרְתֵּי סְתָמֵי״ — שְׁנֵי סְתָמִים",
        correctEn: "two anonymous clauses to reconcile",
        distractorsEn: ["two named rabbis", "two books", "two holidays"],
      },
      {
        id: "tm-gd-13",
        promptHe: "״לֵישְׁנָא אַחֲרִינָא״ — נוּסָח אַחֵר",
        correctEn: "alternative wording / version",
        distractorsEn: ["wrong print", "foreign language", "later story"],
      },
      {
        id: "tm-gd-14",
        promptHe: "״גִּירְסָא״ — קְרִיאַת הַטֶּקְסְט",
        correctEn: "textual reading / manuscript reading",
        distractorsEn: ["legal ruling", "synagogue", "melody"],
      },
      {
        id: "tm-gd-15",
        promptHe: "״דִּינָא״ — מִסְגֶּרֶת מִשְׁפָּטִית",
        correctEn: "the law / the ruling in context",
        distractorsEn: ["the story", "the song", "the building"],
      },
      {
        id: "tm-gd-16",
        promptHe: "״רְאָיָה״ — הַצְגָּת רְאָיָה",
        correctEn: "proof brought in argument",
        distractorsEn: ["refutation only", "prayer", "translation"],
      },
      {
        id: "tm-gd-17",
        promptHe: "״קַלָּא וַחֲמוּרָא״ — מִקַּל לַחָמוּר",
        correctEn: "a fortiori from lighter to stricter",
        distractorsEn: ["majority rule", "custom", "anecdote"],
      },
      {
        id: "tm-gd-18",
        promptHe: "״סְבֵירָא לֵיהּ״ — עֲמִידָה אִישִׁית",
        correctEn: "he holds / it is his view",
        distractorsEn: ["he forgot", "he left", "he laughed"],
      },
      {
        id: "tm-gd-19",
        promptHe: "״לָא שְׁנָא״ — הַקְשָׁאָה לְשׁוֹנִית",
        correctEn: "it is not different — same law either way",
        distractorsEn: ["it is forbidden", "it is new", "it is long"],
      },
      {
        id: "tm-gd-20",
        promptHe: "״הֵיכִי דָמֵי״ — בּוֹחֲנִים דּוּגְמָה",
        correctEn: "what is it like — probing a parallel",
        distractorsEn: ["where is it", "who pays", "when done"],
      },
      {
        id: "tm-gd-21",
        promptHe: "״מַאי קָא מַשְׁמַע לָן״ — מֶה הַלִּמּוּד",
        correctEn: "what is this teaching us",
        distractorsEn: ["who wrote this", "when printed", "how much costs"],
      },
      {
        id: "tm-gd-22",
        promptHe: "״אִם כֵּן״ — הַנְחָה לְבָדִיקָה",
        correctEn: "if so — tests consequence of assumption",
        distractorsEn: ["therefore forbidden", "amen", "the end"],
      },
      {
        id: "tm-gd-23",
        promptHe: "״מִיהוּ״ — זִהוּי",
        correctEn: "which one / who exactly (in a list)",
        distractorsEn: ["why not", "how many", "where from"],
      },
      {
        id: "tm-gd-24",
        promptHe: "״עִיקָּרָא דִּינָא״ — לֵב הַדִּין",
        correctEn: "main point of the ruling",
        distractorsEn: ["side story", "title of book", "opening blessing"],
      },
      {
        id: "tm-gd-25",
        promptHe: "״סוֹף דִּינָא״ — מַסּוֹף הַדִּיּוּן",
        correctEn: "end of the ruling / bottom line",
        distractorsEn: ["beginning only", "question only", "translation"],
      },
    ],
  ),

  [specialtyTierPackId("aramaic", "bronze")]: mcq(
    "Jewish Babylonian Aramaic — Bronze",
    "High-frequency particles and frames in sugya Aramaic — 8 questions.",
    [
      {
        id: "ar-br-1",
        promptHe: "״אִיכָּא דְּאָמְרִי״",
        correctEn: "some say (introducing an alternative tradition)",
        distractorsEn: ["everyone agrees", "the Bible says", "no one knows"],
      },
      {
        id: "ar-br-2",
        promptHe: "״אִי אֶפְשָׁר״",
        correctEn: "it is impossible / cannot be",
        distractorsEn: ["it is permitted", "it is sweet", "it is written"],
      },
      {
        id: "ar-br-3",
        promptHe: "״מִי אִיכָּא״",
        correctEn: "is there…? (rhetorical or real question)",
        distractorsEn: ["who are you", "where is it", "how much"],
      },
      {
        id: "ar-br-4",
        promptHe: "״קָאָמַר״",
        correctEn: "is saying / means (present continuous)",
        distractorsEn: ["was silent", "will write", "forgot"],
      },
      {
        id: "ar-br-5",
        promptHe: "״דְּמִי״",
        correctEn: "is comparable / is like",
        distractorsEn: ["is forbidden", "is heavy", "is new"],
      },
      {
        id: "ar-br-6",
        promptHe: "״אֶלָּא״",
        correctEn: "rather / except / if not — pivot in argument",
        distractorsEn: ["also", "because", "tomorrow"],
      },
      {
        id: "ar-br-7",
        promptHe: "״הָא״",
        correctEn: "this (deictic) — pointing at the case/text",
        distractorsEn: ["that one far", "maybe", "never"],
      },
      {
        id: "ar-br-8",
        promptHe: "״כִּי אָמְרִי״",
        correctEn: "when they say / according to the statement",
        distractorsEn: ["if I forget", "when Shabbat ends", "in Greek"],
      },
    ],
  ),

  [specialtyTierPackId("aramaic", "silver")]: mcq(
    "Jewish Babylonian Aramaic — Silver",
    "Existential, inference, and discourse connectors — 15 questions.",
    [
      {
        id: "ar-sv-1",
        promptHe: "״אִיתָא״ / ״לֵיתָא״",
        correctEn: "there is / there is not (existential)",
        distractorsEn: ["yes / no", "here / there", "good / bad"],
      },
      {
        id: "ar-sv-2",
        promptHe: "״אִיכָּא״ / ״לֵיכָּא״",
        correctEn: "there is / there is not (common in questions)",
        distractorsEn: ["I have / you have", "go / come", "read / write"],
      },
      {
        id: "ar-sv-3",
        promptHe: "״אֲמַאי״",
        correctEn: "why",
        distractorsEn: ["where", "when", "how many"],
      },
      {
        id: "ar-sv-4",
        promptHe: "״מִנָּא״",
        correctEn: "whence / from where (source question)",
        distractorsEn: ["who", "what", "how"],
      },
      {
        id: "ar-sv-5",
        promptHe: "״תְּנָא״",
        correctEn: "he taught / the tanna taught (introducing citation)",
        distractorsEn: ["he asked", "he refused", "he slept"],
      },
      {
        id: "ar-sv-6",
        promptHe: "״אָמְרִי״",
        correctEn: "they say / it was said",
        distractorsEn: ["I say", "we go", "you see"],
      },
      {
        id: "ar-sv-7",
        promptHe: "״קַמָּאֵי״",
        correctEn: "the first ones / earlier authorities",
        distractorsEn: ["the last ones", "the children", "the books"],
      },
      {
        id: "ar-sv-8",
        promptHe: "״בַּתְרָאֵי״",
        correctEn: "the later ones / later authorities",
        distractorsEn: ["the first ones", "the readers", "the weeks"],
      },
      {
        id: "ar-sv-9",
        promptHe: "״אַדְּמִי״",
        correctEn: "would compare / is like (conditional)",
        distractorsEn: ["would forbid", "would leave", "would sell"],
      },
      {
        id: "ar-sv-10",
        promptHe: "״אִי הָכִי״",
        correctEn: "if so — drawing consequence",
        distractorsEn: ["if maybe", "if yesterday", "if expensive"],
      },
      {
        id: "ar-sv-11",
        promptHe: "״הָכִי גַּרְמִינַן״",
        correctEn: "thus we conclude / we derive",
        distractorsEn: ["thus we eat", "thus we sleep", "thus we sell"],
      },
      {
        id: "ar-sv-12",
        promptHe: "״מַאי אִיכָּא לְמֵימַר״",
        correctEn: "what is there to say — rhetorical limit",
        distractorsEn: ["what is the price", "what is your name", "what day"],
      },
      {
        id: "ar-sv-13",
        promptHe: "״דְּלָא״",
        correctEn: "that not / without / who does not",
        distractorsEn: ["that also", "because", "inside"],
      },
      {
        id: "ar-sv-14",
        promptHe: "״בְּמַאי עָסְקִינַן״",
        correctEn: "what are we dealing with — sets the case",
        distractorsEn: ["what are we eating", "where are we going", "who pays"],
      },
      {
        id: "ar-sv-15",
        promptHe: "״הַשְׁתָּא״",
        correctEn: "now — pivot to present argument",
        distractorsEn: ["yesterday", "never", "maybe"],
      },
    ],
  ),

  [specialtyTierPackId("aramaic", "gold")]: mcq(
    "Jewish Babylonian Aramaic — Gold",
    "Denser connectives, modals, and meta-language — 25 questions.",
    [
      {
        id: "ar-gd-1",
        promptHe: "״אִיבַּעְיָא״",
        correctEn: "it was asked / an open question",
        distractorsEn: ["it was answered", "it was forbidden", "it was sold"],
      },
      {
        id: "ar-gd-2",
        promptHe: "״פְּשִׁיטָא״",
        correctEn: "it is obvious / straightforward",
        distractorsEn: ["it is broken", "it is expensive", "it is hidden"],
      },
      {
        id: "ar-gd-3",
        promptHe: "״מִיהוּ״",
        correctEn: "however / but (concessive pivot)",
        distractorsEn: ["who", "water", "today"],
      },
      {
        id: "ar-gd-4",
        promptHe: "״אֶלָּא מֵעַתָּה״",
        correctEn: "if so / in that case — objection frame",
        distractorsEn: ["except today", "only maybe", "but never"],
      },
      {
        id: "ar-gd-5",
        promptHe: "״וְהָא״",
        correctEn: "but behold — objection marker",
        distractorsEn: ["and this", "or that", "if not"],
      },
      {
        id: "ar-gd-6",
        promptHe: "״מַאי חֲזֵית״",
        correctEn: "what did you see — challenges preference",
        distractorsEn: ["what did you eat", "what did you pay", "what time"],
      },
      {
        id: "ar-gd-7",
        promptHe: "״דְּאָמַר״",
        correctEn: "that said / as X said (relative)",
        distractorsEn: ["that went", "that wrote", "that bought"],
      },
      {
        id: "ar-gd-8",
        promptHe: "״כִּי הֵיכִי דְּ…״",
        correctEn: "just as / in the way that",
        distractorsEn: ["because", "if not", "maybe"],
      },
      {
        id: "ar-gd-9",
        promptHe: "״אִי אִיתָא״",
        correctEn: "if it exists / if there is such a case",
        distractorsEn: ["if impossible", "if forbidden", "if expensive"],
      },
      {
        id: "ar-gd-10",
        promptHe: "״לָא שְׁנָא״",
        correctEn: "it is not different — same ruling",
        distractorsEn: ["not heard", "not written", "not eaten"],
      },
      {
        id: "ar-gd-11",
        promptHe: "״הָא אִיתָּא״",
        correctEn: "here it is / there is such a case",
        distractorsEn: ["here we go", "there is none", "here is food"],
      },
      {
        id: "ar-gd-12",
        promptHe: "״מִי שָׁמַעַת לָךְ״",
        correctEn: "who listened to you — rhetorical pushback",
        distractorsEn: ["who paid you", "who saw you", "who sold"],
      },
      {
        id: "ar-gd-13",
        promptHe: "״אִי אִיתָּא דִּנָא״",
        correctEn: "if the law is so / if it is true",
        distractorsEn: ["if the judge", "if the money", "if the food"],
      },
      {
        id: "ar-gd-14",
        promptHe: "״בְּשֶׁלָמָא״",
        correctEn: "granted / it is fine that… (concession)",
        distractorsEn: ["in peace", "in silence", "in Hebrew"],
      },
      {
        id: "ar-gd-15",
        promptHe: "״אֶלָּא הָא״",
        correctEn: "rather this — narrows to key issue",
        distractorsEn: ["except that", "also this", "never this"],
      },
      {
        id: "ar-gd-16",
        promptHe: "״מַאי דְּאָמַר״",
        correctEn: "what he said / the content of the statement",
        distractorsEn: ["what he ate", "what he paid", "what he saw"],
      },
      {
        id: "ar-gd-17",
        promptHe: "״אִי אִיתָּא דִּינָא״",
        correctEn: "if the ruling is X — tests consistency",
        distractorsEn: ["if the day is long", "if the food is cold", "if the road"],
      },
      {
        id: "ar-gd-18",
        promptHe: "״הָא קָא מַשְׁמַע לָן״",
        correctEn: "this teaches us",
        distractorsEn: ["this feeds us", "this sells us", "this hides"],
      },
      {
        id: "ar-gd-19",
        promptHe: "״לָאו הָכִי הוּא״",
        correctEn: "is it not so — checking agreement",
        distractorsEn: ["it is not here", "it is not food", "it is not new"],
      },
      {
        id: "ar-gd-20",
        promptHe: "״אִי הָכִי נֵימָא״",
        correctEn: "if so, let us say — proposing wording",
        distractorsEn: ["if so, let us eat", "if so, go home", "if so, pay"],
      },
      {
        id: "ar-gd-21",
        promptHe: "״מַאי טַעְמָא״",
        correctEn: "what is the reason",
        distractorsEn: ["what is the price", "what is the place", "what is the day"],
      },
      {
        id: "ar-gd-22",
        promptHe: "״אִי אִיתָּא דְּ…״",
        correctEn: "if it is the case that…",
        distractorsEn: ["if there is no", "if we forget", "if we eat"],
      },
      {
        id: "ar-gd-23",
        promptHe: "״הָא לָא קָא מַשְׁכַּחַת לָךְ״",
        correctEn: "you do not find / you cannot establish",
        distractorsEn: ["you do not eat", "you do not pay", "you do not see"],
      },
      {
        id: "ar-gd-24",
        promptHe: "״אִי אִיתָּא דִּינָא דְּרַבָּא״",
        correctEn: "if Rava’s ruling applies — hypothetical",
        distractorsEn: ["if Rava ate", "if Rava left", "if Rava paid"],
      },
      {
        id: "ar-gd-25",
        promptHe: "״סְתִימָא בְּאוּרַיְיתָא״",
        correctEn: "it is implicit in Scripture — hermeneutic claim",
        distractorsEn: ["it is explicit in Greek", "it is forbidden", "it is new"],
      },
    ],
  ),
};
