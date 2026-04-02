/**
 * Specialty tier MCQ banks (authored for this app — expand over time).
 * @see specialty-tracks.ts
 */

import type { McqDrillPack } from "./section-drill-types";
import {
  specialtyTierPackId,
  type SpecialtyTierId,
} from "./specialty-tracks";
import { TRADITIONAL_SPECIALTY_PACKS } from "./specialty-tier-packs-traditional";

function mcq(
  title: string,
  intro: string,
  items: McqDrillPack["items"],
): McqDrillPack {
  return { kind: "mcq", title, intro, items };
}

const MODERN_HEBREW_PACKS: Record<string, McqDrillPack> = {
  [specialtyTierPackId("news", "bronze")]: mcq(
    "News — Bronze",
    "Journalistic vocabulary and headline-style Hebrew — 8 questions.",
    [
      {
        id: "nw-br-1",
        promptHe: "כּוֹתֶרֶת",
        correctEn: "headline / title line",
        distractorsEn: ["footnote only", "last paragraph", "author photo"],
      },
      {
        id: "nw-br-2",
        promptHe: "חֲדָשׁוֹת",
        correctEn: "news",
        distractorsEn: ["weather only", "sports only", "fiction"],
      },
      {
        id: "nw-br-3",
        promptHe: "עִתּוֹן",
        correctEn: "newspaper",
        distractorsEn: ["novel", "dictionary", "map"],
      },
      {
        id: "nw-br-4",
        promptHe: "דִּיוּוּחַ",
        correctEn: "report / coverage",
        distractorsEn: ["recipe", "poem", "riddle"],
      },
      {
        id: "nw-br-5",
        promptHe: "תַמְצִית פְּתִיחָה",
        correctEn: "lead / opening summary",
        distractorsEn: ["sports score only", "weather icon", "blank page"],
      },
      {
        id: "nw-br-6",
        promptHe: "מַמְשִׁיךְ בְּעִמּוּד 2",
        correctEn: "continued on page 2 (typical jump line)",
        distractorsEn: ["end of story", "no more news", "only in print ads"],
      },
      {
        id: "nw-br-7",
        promptHe: "כַּתָב / כַּתָבָה",
        correctEn: "correspondent / reporter (byline sense)",
        distractorsEn: ["only the printer", "only the reader", "only ads"],
      },
      {
        id: "nw-br-8",
        promptHe: "עִדְכּוּן אַחֲרוֹן",
        correctEn: "latest update (breaking-news sense)",
        distractorsEn: ["oldest archive", "fiction ending", "weather only"],
      },
    ],
  ),

  [specialtyTierPackId("news", "silver")]: mcq(
    "News — Silver",
    "Register: neutral reporting vs commentary — 15 questions.",
    [
      {
        id: "nw-sv-1",
        promptHe: "לְפִי הַדִּיוּוּחַ",
        correctEn: "according to the report",
        distractorsEn: ["in my opinion", "once upon a time", "never mind"],
      },
      {
        id: "nw-sv-2",
        promptHe: "מְקוֹרוֹת מְעוֹרִים אָמְרוּ",
        correctEn: "involved sources said",
        distractorsEn: ["the reader guessed", "no one spoke", "only children"],
      },
      {
        id: "nw-sv-3",
        promptHe: "טְרֶמְפּ לְאָמְרוֹ",
        correctEn: "before publication / before it was said publicly",
        distractorsEn: ["after the vote only", "only in English", "only on TV"],
      },
      {
        id: "nw-sv-4",
        promptHe: "מַעֲרֶכֶת",
        correctEn: "editorial staff / masthead sense",
        distractorsEn: ["sports league", "train schedule", "recipe list"],
      },
      {
        id: "nw-sv-5",
        promptHe: "טוּר דֵּעָה",
        correctEn: "opinion column / op-ed",
        distractorsEn: ["weather map", "comics page", "crossword only"],
      },
      {
        id: "nw-sv-6",
        promptHe: "הֵעֲרוּת מַעֲרִיכָה",
        correctEn: "editor’s note",
        distractorsEn: ["reader comment", "classified ad", "sports score"],
      },
      {
        id: "nw-sv-7",
        promptHe: "כְּתָבָה חוֹקֶרֶת",
        correctEn: "investigative article / reporting piece",
        distractorsEn: ["fiction serial", "recipe column", "horoscope only"],
      },
      {
        id: "nw-sv-8",
        promptHe: "מָקוֹר עִתּוֹנָאִי",
        correctEn: "journalistic source",
        distractorsEn: ["only the headline font", "only the paper weight", "only ads"],
      },
      {
        id: "nw-sv-9",
        promptHe: "לְהַבְהִיר מִיּוֹדָעִים",
        correctEn: "to clarify on the record (official statement sense)",
        distractorsEn: ["to hide facts", "to delete the article", "to print blank"],
      },
      {
        id: "nw-sv-10",
        promptHe: "שׁוּרַת כּוֹתֶרֶת מִשְׁנִיָה",
        correctEn: "secondary headline / subhead",
        distractorsEn: ["page number", "photo credit only", "weather icon"],
      },
      {
        id: "nw-sv-11",
        promptHe: "מִדִּיּוּם חָדָשׁ",
        correctEn: "news medium / outlet",
        distractorsEn: ["only a novel", "only a map", "only a cookbook"],
      },
      {
        id: "nw-sv-12",
        promptHe: "לְסַכֵּם אֶת הָעִקָּר",
        correctEn: "to sum up the gist (reporting sense)",
        distractorsEn: ["to invent details", "to remove verbs", "to avoid facts"],
      },
      {
        id: "nw-sv-13",
        promptHe: "צִיטּוּט מְלֻאֶה",
        correctEn: "full quote (not trimmed)",
        distractorsEn: ["headline only", "photo only", "ad only"],
      },
      {
        id: "nw-sv-14",
        promptHe: "לְהַסִית אֶת הַשְׁאֵלָה",
        correctEn: "to steer the question (interview framing)",
        distractorsEn: ["to end interview", "to whisper only", "to sleep"],
      },
      {
        id: "nw-sv-15",
        promptHe: "תַּגּוּב רִאשׁוֹנִי מֵהַמּוֹשָׁב",
        correctEn: "first response from the office / spokesperson",
        distractorsEn: ["reader poll", "comics", "sports only"],
      },
    ],
  ),

  [specialtyTierPackId("news", "gold")]: mcq(
    "News — Gold",
    "Framing, bias vocabulary, and argument in the press — 25 questions.",
    [
      {
        id: "nw-gd-1",
        promptHe: "אוֹפְיָה שֶׁל הַכְּתָבָה",
        correctEn: "the article’s slant / framing",
        distractorsEn: ["paper thickness", "font size", "photo color"],
      },
      {
        id: "nw-gd-2",
        promptHe: "טַעֲנָה מֻנַחַת מֵרֹאשׁ",
        correctEn: "a loaded claim / begged question",
        distractorsEn: ["neutral fact", "weather report", "sports score"],
      },
      {
        id: "nw-gd-3",
        promptHe: "לְהַסִית אֶת הַקּוֹרֵא",
        correctEn: "to steer / influence the reader",
        distractorsEn: ["to thank the reader", "to print blank pages", "to remove ads"],
      },
      {
        id: "nw-gd-4",
        promptHe: "מִשְׁפָּט פְּתִיחָה חָזָק",
        correctEn: "a strong opening sentence (rhetorical hook)",
        distractorsEn: ["a weak ending", "a photo caption only", "a crossword"],
      },
      {
        id: "nw-gd-5",
        promptHe: "הַבְחָנָה בֵּין חוֹזֶר לְדֵעָה",
        correctEn: "distinguishing fact from opinion",
        distractorsEn: ["spelling only", "font choice", "page number"],
      },
      {
        id: "nw-gd-6",
        promptHe: "כִּתּוּב מְאוּזָן",
        correctEn: "balanced writing",
        distractorsEn: ["handwriting only", "all caps", "no verbs"],
      },
      {
        id: "nw-gd-7",
        promptHe: "הַקְשָׁר חָסֵר",
        correctEn: "missing context / decontextualized quote risk",
        distractorsEn: ["too many photos", "too many ads", "too many fonts"],
      },
      {
        id: "nw-gd-8",
        promptHe: "לְהַעֲלוֹת סְפֵקוֹת",
        correctEn: "to raise doubts (rhetorical / framing)",
        distractorsEn: ["to confirm everything", "to end the article", "to add photos only"],
      },
      {
        id: "nw-gd-9",
        promptHe: "צִיטּוּט מְעוּוָת",
        correctEn: "distorted quote / out-of-context snippet",
        distractorsEn: ["perfect transcript", "blank quote", "only a headline"],
      },
      {
        id: "nw-gd-10",
        promptHe: "אִשְׁמוּת בְּלִי רְאָיוֹת",
        correctEn: "accusation without evidence (critique of reporting)",
        distractorsEn: ["balanced summary", "weather data", "sports score"],
      },
      {
        id: "nw-gd-11",
        promptHe: "שְׁפוֹת חֲזָקוֹת בַּכְּתָבָה",
        correctEn: "strong wording / charged language",
        distractorsEn: ["neutral list of facts", "only numbers", "only photos"],
      },
      {
        id: "nw-gd-12",
        promptHe: "לְהַסִית אֶת הַדִּיסְקוּר",
        correctEn: "to steer the discourse / set the agenda",
        distractorsEn: ["to end discussion", "to print nothing", "to remove headlines"],
      },
      {
        id: "nw-gd-13",
        promptHe: "מִסְפָּר נִרְאֶה אוֹבְיֶקְטִיבִי",
        correctEn: "a number that looks objective (rhetorical use of stats)",
        distractorsEn: ["a random emoji", "a poem", "a riddle"],
      },
      {
        id: "nw-gd-14",
        promptHe: "הַפְרָשָׁה מְאַחֶרֶת",
        correctEn: "a different reading / alternate interpretation",
        distractorsEn: ["same font", "same photo size", "same page count"],
      },
      {
        id: "nw-gd-15",
        promptHe: "לְהַדְגִּישׁ סִיוּג",
        correctEn: "to emphasize a caveat / qualification",
        distractorsEn: ["to remove all nuance", "to add fiction", "to skip sources"],
      },
      {
        id: "nw-gd-16",
        promptHe: "כְּתָבָה מְאַחֶרֶת",
        correctEn: "a follow-up article",
        distractorsEn: ["a novel sequel", "a cookbook", "a map"],
      },
      {
        id: "nw-gd-17",
        promptHe: "שְׁקִיפוּת עִתּוֹנָאִית",
        correctEn: "journalistic transparency (sources, corrections)",
        distractorsEn: ["opaque ads only", "hidden comics", "secret fonts"],
      },
      {
        id: "nw-gd-18",
        promptHe: "לְבַחֵן אֶת הַנִימָה",
        correctEn: "to examine the tone (critical reading)",
        distractorsEn: ["to ignore tone", "to measure paper", "to count commas only"],
      },
      {
        id: "nw-gd-19",
        promptHe: "לְהַעֲלוֹת אֶת הַסִּיוּג",
        correctEn: "to bring up the caveat / qualification",
        distractorsEn: ["to hide nuance", "to end article", "to add fiction"],
      },
      {
        id: "nw-gd-20",
        promptHe: "מַסְעַר עִתּוֹנָאִי",
        correctEn: "press storm / media frenzy",
        distractorsEn: ["quiet library", "sports league", "recipe book"],
      },
      {
        id: "nw-gd-21",
        promptHe: "לְהַדְגִּישׁ אֶת הַהֶבֵדֶל",
        correctEn: "to stress the distinction (analytical reporting)",
        distractorsEn: ["to erase differences", "to add ads", "to skip facts"],
      },
      {
        id: "nw-gd-22",
        promptHe: "שְׁכֶבֶת מְאוּזָן",
        correctEn: "balanced tone / measured wording",
        distractorsEn: ["all caps", "no verbs", "random words"],
      },
      {
        id: "nw-gd-23",
        promptHe: "הַצְמָדָה לַעֲדוּת",
        correctEn: "anchoring to testimony / evidence",
        distractorsEn: ["ignoring sources", "only opinion", "only photos"],
      },
      {
        id: "nw-gd-24",
        promptHe: "לְפָרֵשׁ מֵחָדָשׁ אֶת הַמּוֹנָחִים",
        correctEn: "to redefine the terms (debate / op-ed)",
        distractorsEn: ["to confuse deliberately", "to end talk", "to whisper"],
      },
      {
        id: "nw-gd-25",
        promptHe: "נִקּוּד מֻסְכָּם לְסִיוּם",
        correctEn: "agreed takeaway / closing point (facilitated discourse)",
        distractorsEn: ["random ending", "no conclusion", "only jokes"],
      },
    ],
  ),

  [specialtyTierPackId("literature", "bronze")]: mcq(
    "Literature — Bronze",
    "Basic literary vocabulary — 8 questions.",
    [
      {
        id: "lit-br-1",
        promptHe: "מְסַפֵּר",
        correctEn: "narrator / tells a story",
        distractorsEn: ["only a newspaper", "only math", "only cooking"],
      },
      {
        id: "lit-br-2",
        promptHe: "דְּמוּת",
        correctEn: "character / figure",
        distractorsEn: ["chapter number", "publisher only", "index"],
      },
      {
        id: "lit-br-3",
        promptHe: "מֶטָפוֹרָה",
        correctEn: "metaphor",
        distractorsEn: ["footnote", "headline", "invoice"],
      },
      {
        id: "lit-br-4",
        promptHe: "פָּסוּק",
        correctEn: "verse / line of poetry",
        distractorsEn: ["shopping list", "phone number", "recipe step"],
      },
      {
        id: "lit-br-5",
        promptHe: "מוֹנוֹלוֹג",
        correctEn: "monologue",
        distractorsEn: ["dialogue only", "stage direction only", "ticket price"],
      },
      {
        id: "lit-br-6",
        promptHe: "מֶשֶׁךְ הָעֲלִילָה",
        correctEn: "plot / storyline",
        distractorsEn: ["book weight", "cover color", "ISBN only"],
      },
      {
        id: "lit-br-7",
        promptHe: "סִימוּל טְמוּנִי",
        correctEn: "subtext / implicit layer",
        distractorsEn: ["only font size", "only price", "only index"],
      },
      {
        id: "lit-br-8",
        promptHe: "דִּיּוּק לְשׁוֹנִי",
        correctEn: "wording choice / diction",
        distractorsEn: ["page number", "book weight", "barcode"],
      },
    ],
  ),

  [specialtyTierPackId("literature", "silver")]: mcq(
    "Literature — Silver",
    "Voice, imagery, and tone — 15 questions.",
    [
      {
        id: "lit-sv-1",
        promptHe: "קוֹל סִפְרוּתִי",
        correctEn: "literary voice",
        distractorsEn: ["volume knob", "radio static", "grammar table"],
      },
      {
        id: "lit-sv-2",
        promptHe: "תַּמְצִית רֵעַשׁוֹנִית",
        correctEn: "sensory image / vivid impression",
        distractorsEn: ["table of contents", "copyright page", "price"],
      },
      {
        id: "lit-sv-3",
        promptHe: "מֶתַח בַּיִּשּׂוּעַ",
        correctEn: "tension in the plot",
        distractorsEn: ["paper thickness", "book glue", "margin size"],
      },
      {
        id: "lit-sv-4",
        promptHe: "סִיּוּם פָּתוּחַ",
        correctEn: "open ending",
        distractorsEn: ["closed cover", "last page number", "index only"],
      },
      {
        id: "lit-sv-5",
        promptHe: "רֶמֶז לַקּוֹרֵא",
        correctEn: "hint to the reader / foreshadowing cue",
        distractorsEn: ["library fine", "bookmark", "font license"],
      },
      {
        id: "lit-sv-6",
        promptHe: "אִירוֹנִיָה",
        correctEn: "irony (literary sense)",
        distractorsEn: ["only rhyme", "only length", "only rhyme scheme"],
      },
      {
        id: "lit-sv-7",
        promptHe: "תַּמְצִית רֵיחַ",
        correctEn: "smell image / olfactory detail",
        distractorsEn: ["table of contents", "price tag", "ISBN"],
      },
      {
        id: "lit-sv-8",
        promptHe: "קֶצֶב שִׁירִי",
        correctEn: "poetic rhythm / cadence",
        distractorsEn: ["page margin", "book glue", "cover color"],
      },
      {
        id: "lit-sv-9",
        promptHe: "דִּמְיוֹן חָזוֹתִי",
        correctEn: "visual imagery",
        distractorsEn: ["only grammar table", "only footnote", "only index"],
      },
      {
        id: "lit-sv-10",
        promptHe: "נְקֻדַּת מַבָּט",
        correctEn: "point of view (who sees / tells)",
        distractorsEn: ["page number", "chapter price", "font license"],
      },
      {
        id: "lit-sv-11",
        promptHe: "סִימֶשֶׁךְ בֵּין זְמַנִּים",
        correctEn: "time shift / flashback-forward cue",
        distractorsEn: ["book weight", "margin width", "paper texture"],
      },
      {
        id: "lit-sv-12",
        promptHe: "מִשְׁפָּט מַעֲמִיס",
        correctEn: "a loaded sentence (emotionally weighted)",
        distractorsEn: ["blank line", "page break only", "copyright line"],
      },
      {
        id: "lit-sv-13",
        promptHe: "קְצַב סִפּוּרִי",
        correctEn: "narrative pacing",
        distractorsEn: ["paper thickness", "ISBN", "margin only"],
      },
      {
        id: "lit-sv-14",
        promptHe: "דִּמְיוֹן שְׁמַעִי",
        correctEn: "auditory imagery",
        distractorsEn: ["table of contents", "price", "font license"],
      },
      {
        id: "lit-sv-15",
        promptHe: "מִבְטָא דַּרְשָׁנִי",
        correctEn: "declamatory tone / rhetorical delivery",
        distractorsEn: ["shopping list", "invoice", "index"],
      },
    ],
  ),

  [specialtyTierPackId("literature", "gold")]: mcq(
    "Literature — Gold",
    "Register shifts, unreliable narration, intertextuality — 25 questions.",
    [
      {
        id: "lit-gd-1",
        promptHe: "מְסַפֵּר לֹא אָמִין",
        correctEn: "unreliable narrator",
        distractorsEn: ["third-person omniscient only", "cookbook author", "indexer"],
      },
      {
        id: "lit-gd-2",
        promptHe: "הֲפוֹךְ צִפּוּי",
        correctEn: "subverted expectation / twist",
        distractorsEn: ["page flip", "book cover", "chapter title only"],
      },
      {
        id: "lit-gd-3",
        promptHe: "אִינְטֶר־טֶקְסְטוּאָלִיּוּת",
        correctEn: "intertextuality (allusion between texts)",
        distractorsEn: ["only spelling", "only rhyme", "only font"],
      },
      {
        id: "lit-gd-4",
        promptHe: "מַעֲבָר בֵּין רְגִישׁוּת לְהִתְלוֹנְנוּת",
        correctEn: "shift between lyric and argumentative tone",
        distractorsEn: ["paper size", "margin width", "ISBN"],
      },
      {
        id: "lit-gd-5",
        promptHe: "שְׁכֶבֶת רִשׁוּם אֵלֶגִי",
        correctEn: "elegiac register / lamenting tone",
        distractorsEn: ["comedy only", "technical manual", "legal contract"],
      },
      {
        id: "lit-gd-6",
        promptHe: "קְרִיאָה מְאוּזֶנֶת",
        correctEn: "balanced reading / nuanced interpretation",
        distractorsEn: ["skimming only", "ignoring context", "random guessing"],
      },
      {
        id: "lit-gd-7",
        promptHe: "מֵטָא־סִפּוּר",
        correctEn: "story about telling the story (meta-narrative)",
        distractorsEn: ["only spelling", "only rhyme", "only font"],
      },
      {
        id: "lit-gd-8",
        promptHe: "פִּתְרוֹן דּוּ כְּמַשְׁמָעוּת",
        correctEn: "double meaning / deliberate ambiguity",
        distractorsEn: ["single dictionary gloss", "ISBN", "price"],
      },
      {
        id: "lit-gd-9",
        promptHe: "שִׁבּוּץ אַלּוּזִיוֹת",
        correctEn: "cluster of allusions",
        distractorsEn: ["random typos", "shopping list", "index only"],
      },
      {
        id: "lit-gd-10",
        promptHe: "מַעֲבָר בֵּין רְגִישׁוּת לְפָרוֹדִיָה",
        correctEn: "shift between lyric and parody",
        distractorsEn: ["paper size", "margin", "glue"],
      },
      {
        id: "lit-gd-11",
        promptHe: "קְרִיעַת הַמִּסְגֶּרֶת",
        correctEn: "breaking the fourth wall",
        distractorsEn: ["chapter number", "cover art only", "footnote"],
      },
      {
        id: "lit-gd-12",
        promptHe: "סִימוּלַצְיָה סִפְרוּתִית",
        correctEn: "literary simulation / imagined world rules",
        distractorsEn: ["math proof", "legal contract", "recipe"],
      },
      {
        id: "lit-gd-13",
        promptHe: "רֶגַע הַכֵּרָה בְּמִבְנֵה הָעֲלִילָה",
        correctEn: "anagnorisis / recognition–revelation beat",
        distractorsEn: ["table of contents", "index", "price"],
      },
      {
        id: "lit-gd-14",
        promptHe: "מִבְנֶה מַעֲגָלִי",
        correctEn: "circular structure (returns to opening)",
        distractorsEn: ["linear list only", "blank pages", "random order"],
      },
      {
        id: "lit-gd-15",
        promptHe: "שְׁכֶבֶת אֶפִי",
        correctEn: "epic register / elevated style",
        distractorsEn: ["text message tone", "invoice", "manual"],
      },
      {
        id: "lit-gd-16",
        promptHe: "קְרִיאָה בִּנְגִיעָה פּוֹלִיטִית",
        correctEn: "politically inflected reading",
        distractorsEn: ["ignoring politics", "counting letters", "font only"],
      },
      {
        id: "lit-gd-17",
        promptHe: "הֲפוֹךְ צִפּוּי צִפּוּי",
        correctEn: "subverted expectation of expectations (meta-twist)",
        distractorsEn: ["same ending twice", "blank ending", "index"],
      },
      {
        id: "lit-gd-18",
        promptHe: "שְׁכֶבֶת מוֹנוֹלוֹגִית פְּנִימִית",
        correctEn: "interior monologue register",
        distractorsEn: ["stage directions only", "newspaper", "recipe"],
      },
      {
        id: "lit-gd-19",
        promptHe: "פּוֹלִיפוֹנִיָה סִפְרוּתִית",
        correctEn: "literary polyphony (many voices)",
        distractorsEn: ["one font", "one rhyme", "one page"],
      },
      {
        id: "lit-gd-20",
        promptHe: "מַעֲבָר בֵּין זְמַנִים",
        correctEn: "shift between time layers (narrative)",
        distractorsEn: ["page margin", "glue", "cover"],
      },
      {
        id: "lit-gd-21",
        promptHe: "סִימוּל צִלּוּל",
        correctEn: "deepening subtext (reading move)",
        distractorsEn: ["skimming", "ignoring", "random"],
      },
      {
        id: "lit-gd-22",
        promptHe: "שְׁכֶבֶת חֲזוֹנִית",
        correctEn: "visionary register",
        distractorsEn: ["manual tone", "invoice", "recipe"],
      },
      {
        id: "lit-gd-23",
        promptHe: "מִבְנֶה מִדְרָגִי",
        correctEn: "layered structure (textual levels)",
        distractorsEn: ["flat list", "blank page", "index only"],
      },
      {
        id: "lit-gd-24",
        promptHe: "קְרִיאָה נֶגְדִּית",
        correctEn: "counter-reading / resistant reading",
        distractorsEn: ["literal only", "skipping", "random"],
      },
      {
        id: "lit-gd-25",
        promptHe: "סִיוּם מֻפְתָּח",
        correctEn: "open closure (literary ending)",
        distractorsEn: ["blank end", "index", "price"],
      },
    ],
  ),

  [specialtyTierPackId("spoken", "bronze")]: mcq(
    "Spoken — Bronze",
    "Everyday interaction and classroom-style Hebrew — 8 questions.",
    [
      {
        id: "sp-br-1",
        promptHe: "סְלִיחָה, אֶפְשָׁר לַחֲזֹר?",
        correctEn: "Sorry, can you repeat?",
        distractorsEn: ["I refuse", "I am leaving", "I am sleeping"],
      },
      {
        id: "sp-br-2",
        promptHe: "אֲנִי מֻבְטָח שֶׁ…",
        correctEn: "I’m sure that…",
        distractorsEn: ["I forgot", "I never tried", "I hate"],
      },
      {
        id: "sp-br-3",
        promptHe: "בְּבַקָּשָׁה תַּאֲטוּ קְצָת",
        correctEn: "Please slow down a little",
        distractorsEn: ["Please shout", "Please leave", "Please sing"],
      },
      {
        id: "sp-br-4",
        promptHe: "אֵיךְ אוֹמְרִים אֶת זֶה בְּעִבְרִית?",
        correctEn: "How do you say this in Hebrew?",
        distractorsEn: ["What time is it?", "Where is the bank?", "I am hungry"],
      },
      {
        id: "sp-br-5",
        promptHe: "נַתְחִיל מֵהַהִתְחָלָה",
        correctEn: "Let’s start from the beginning",
        distractorsEn: ["Let’s skip everything", "Let’s end now", "Let’s eat"],
      },
      {
        id: "sp-br-6",
        promptHe: "זֶה בָּרוּר?",
        correctEn: "Is that clear?",
        distractorsEn: ["Is it expensive?", "Is it far?", "Is it closed?"],
      },
      {
        id: "sp-br-7",
        promptHe: "אֶפְשָׁר לְהַאֲטוֹת עוֹד קְצָת?",
        correctEn: "Can you slow down a bit more?",
        distractorsEn: ["Can you shout?", "Can you leave?", "Can you run?"],
      },
      {
        id: "sp-br-8",
        promptHe: "אֲנִי עוֹד לֹא מַבִין",
        correctEn: "I still don’t understand",
        distractorsEn: ["I understand everything", "I refuse", "I sleep"],
      },
    ],
  ),

  [specialtyTierPackId("spoken", "silver")]: mcq(
    "Spoken — Silver",
    "Hedging, clarifying, and managing conversation — 15 questions.",
    [
      {
        id: "sp-sv-1",
        promptHe: "כְּלוֹמַר…",
        correctEn: "meaning / in other words",
        distractorsEn: ["goodbye", "hello", "never"],
      },
      {
        id: "sp-sv-2",
        promptHe: "אִם הֲבִינוּתִי נְכוֹנָה…",
        correctEn: "if I understood correctly…",
        distractorsEn: ["if I am angry…", "if it rains…", "if we sleep…"],
      },
      {
        id: "sp-sv-3",
        promptHe: "תֹּאמַר עוֹד פַּעַם בְּמִילִים אֲחֵרוֹת?",
        correctEn: "Can you say it again in other words?",
        distractorsEn: ["Can you whisper?", "Can you leave?", "Can you pay?"],
      },
      {
        id: "sp-sv-4",
        promptHe: "זֶה חָשׁוּב לִי לְהַבְהִיר",
        correctEn: "It’s important for me to clarify",
        distractorsEn: ["I want to confuse", "I want to sleep", "I want to sell"],
      },
      {
        id: "sp-sv-5",
        promptHe: "בּוֹא נַחֲלֹק אֶת זֶה לִשְׁנַיִם",
        correctEn: "Let’s split this in two / take it in two steps",
        distractorsEn: ["Let’s break the table", "Let’s ignore it", "Let’s run"],
      },
      {
        id: "sp-sv-6",
        promptHe: "אֲנִי מַקְשִׁיב",
        correctEn: "I’m listening",
        distractorsEn: ["I’m invisible", "I’m lost", "I’m finished"],
      },
      {
        id: "sp-sv-7",
        promptHe: "רֶגַע, אֲנִי רוֹצֶה לְהַבְהִיר נְקֻדָּה",
        correctEn: "Wait — I want to clarify one point",
        distractorsEn: ["I want to leave", "I want to sleep", "I want to shout"],
      },
      {
        id: "sp-sv-8",
        promptHe: "זֶה מַמָּשׁ מַה שֶׁחָשַׁבְתִּי",
        correctEn: "That’s exactly what I thought",
        distractorsEn: ["I never listen", "I disagree always", "I am confused"],
      },
      {
        id: "sp-sv-9",
        promptHe: "אֶפְשָׁר דֻּגְמָה?",
        correctEn: "Can you give an example?",
        distractorsEn: ["Can you leave?", "Can you pay?", "Can you sing?"],
      },
      {
        id: "sp-sv-10",
        promptHe: "אֲנִי לֹא בָּטוּחַ שֶׁהֲבִינִיתִי",
        correctEn: "I’m not sure I understood",
        distractorsEn: ["I understood everything perfectly", "I refuse", "I sleep"],
      },
      {
        id: "sp-sv-11",
        promptHe: "בּוֹא נַחֲזֹר לַנּוֹשֵׂא",
        correctEn: "Let’s get back to the topic",
        distractorsEn: ["Let’s change subject forever", "Let’s eat", "Let’s run"],
      },
      {
        id: "sp-sv-12",
        promptHe: "זֶה חָשׁוּב לִי שֶׁנַּסְכִּים עַל הַמּוֹנָחִים",
        correctEn: "It’s important we agree on the terms / words",
        distractorsEn: ["I want confusion", "I want silence", "I want money"],
      },
      {
        id: "sp-sv-13",
        promptHe: "בְּקִצּוּר, מַה הָעִקָּר?",
        correctEn: "In short, what’s the main point?",
        distractorsEn: ["What time is it?", "Where is the bank?", "I am tired"],
      },
      {
        id: "sp-sv-14",
        promptHe: "אֲנִי רוֹצֶה לְהַבְהִיר מִיּוֹדָעִים",
        correctEn: "I want to clarify on the record",
        distractorsEn: ["I want to hide", "I want to leave", "I want to sleep"],
      },
      {
        id: "sp-sv-15",
        promptHe: "נַחֲזֹר אֶל זֶה בְּרֶגַע",
        correctEn: "we’ll come back to this in a moment",
        distractorsEn: ["we will never return", "we will eat", "we will run"],
      },
    ],
  ),

  [specialtyTierPackId("spoken", "gold")]: mcq(
    "Spoken — Gold",
    "Formal interviews, disagreement, and pragmatic face-saving — 25 questions.",
    [
      {
        id: "sp-gd-1",
        promptHe: "שְׁאֵלַת הַמָשָׁךְ",
        correctEn: "follow-up question (interview sense)",
        distractorsEn: ["final exam", "weather alert", "train ticket"],
      },
      {
        id: "sp-gd-2",
        promptHe: "לְשַׁמֵר עַל פָּנִים",
        correctEn: "to save face / preserve dignity (pragmatic)",
        distractorsEn: ["to wash face only", "to paint", "to photograph"],
      },
      {
        id: "sp-gd-3",
        promptHe: "אֲנִי מַכְבִּד אֶת הַמּוֹשָׁב, אַךְ…",
        correctEn: "I respect the position, but… (disagreement frame)",
        distractorsEn: ["I hate everyone", "I agree completely", "I am silent"],
      },
      {
        id: "sp-gd-4",
        promptHe: "נַעֲצֹר כָּאן בִּקְצָרָה",
        correctEn: "we’ll stop here briefly (time-boxing)",
        distractorsEn: ["we will never stop", "we will sleep", "we will run"],
      },
      {
        id: "sp-gd-5",
        promptHe: "הַאִם תִּרְצֶה לְהַגְדִּיר מֵחָדָשׁ?",
        correctEn: "Would you like to redefine / rephrase?",
        distractorsEn: ["Would you like to leave?", "Would you like to pay?", "Would you like to shout?"],
      },
      {
        id: "sp-gd-6",
        promptHe: "נִשְׁמַע שׁוּב בְּרֶמֶז אַחֵר",
        correctEn: "we hear it again with a different nuance (meta)",
        distractorsEn: ["we never listen", "we delete audio", "we ignore text"],
      },
      {
        id: "sp-gd-7",
        promptHe: "לְהַקְשִׁיחַ אֶת הַשְׁאֵלָה",
        correctEn: "to sharpen the question (interview / debate)",
        distractorsEn: ["to avoid questions", "to end talk", "to whisper only"],
      },
      {
        id: "sp-gd-8",
        promptHe: "אֲנִי מַכִּיר בַּחֲשִׁיבוּת הַנּוֹשֵׂא, אַךְ…",
        correctEn: "I recognize the importance of the issue, but…",
        distractorsEn: ["I ignore the issue", "I hate discussion", "I agree fully"],
      },
      {
        id: "sp-gd-9",
        promptHe: "נַעֲשֶׂה הַפְסָקָה קְצָרָה לְהַבְהָרוֹת",
        correctEn: "we’ll take a short break for clarifications",
        distractorsEn: ["we will never stop", "we will sleep", "we will leave"],
      },
      {
        id: "sp-gd-10",
        promptHe: "הַאִם אֶפְשָׁר לְהַגְבִּיל אֶת הַתְּשׁוּבָה?",
        correctEn: "Can we limit the answer (time / scope)?",
        distractorsEn: ["Can we shout?", "Can we ignore?", "Can we sleep?"],
      },
      {
        id: "sp-gd-11",
        promptHe: "לְהַעֲלוֹת נִקּוּד שֶׁאֵינוֹ מֻנַח",
        correctEn: "to raise an unstated assumption (critical talk)",
        distractorsEn: ["to hide assumptions", "to end talk", "to agree blindly"],
      },
      {
        id: "sp-gd-12",
        promptHe: "נִשְׁמַע אֶת הַגִּרְסָה הַשְׁנִיָה",
        correctEn: "let’s hear the second version / side",
        distractorsEn: ["we refuse both", "we delete audio", "we ignore"],
      },
      {
        id: "sp-gd-13",
        promptHe: "לְשַׁמֵר עַל כָּבוֹד הַדִּיּוּן",
        correctEn: "to keep the discussion respectful (face-work)",
        distractorsEn: ["to insult", "to ignore", "to leave"],
      },
      {
        id: "sp-gd-14",
        promptHe: "אֲנִי מְבַקֵּשׁ הַרְחָבָה קְצָרָה",
        correctEn: "I’m asking for a brief expansion / elaboration",
        distractorsEn: ["I want silence", "I want to leave", "I want money"],
      },
      {
        id: "sp-gd-15",
        promptHe: "נַחֲזֹר לַשְׁאֵלָה הַמֶּרְכָּזִית",
        correctEn: "let’s return to the central question",
        distractorsEn: ["let’s avoid questions", "let’s eat", "let’s sleep"],
      },
      {
        id: "sp-gd-16",
        promptHe: "הַאִם יֵשׁ מָקוֹם לְסִיוּג?",
        correctEn: "Is there room for a caveat?",
        distractorsEn: ["no nuance ever", "only jokes", "only silence"],
      },
      {
        id: "sp-gd-17",
        promptHe: "לְהַצְמִיד אֶת הַדִּיּוּן לַעֲדוּת",
        correctEn: "to tie the discussion to evidence / testimony",
        distractorsEn: ["to ignore evidence", "to guess", "to whisper"],
      },
      {
        id: "sp-gd-18",
        promptHe: "נִסְגֹּר בְּנִקּוּד מֻסְכָּם",
        correctEn: "we’ll close on an agreed point (facilitation)",
        distractorsEn: ["we will fight", "we will leave angry", "we will ignore"],
      },
      {
        id: "sp-gd-19",
        promptHe: "לְהַעֲלוֹת שְׁאֵלַת הַמָשָׁךְ",
        correctEn: "to raise a follow-up question",
        distractorsEn: ["to end interview", "to whisper only", "to sleep"],
      },
      {
        id: "sp-gd-20",
        promptHe: "אֲנִי מַכִּיר בַּהֶקְשֵׁר, אַךְ…",
        correctEn: "I acknowledge the context, but…",
        distractorsEn: ["I ignore context", "I agree fully", "I refuse"],
      },
      {
        id: "sp-gd-21",
        promptHe: "נִשְׁמַע גִּרְסָה מְקוּצֶּרֶת",
        correctEn: "let’s hear a shortened version",
        distractorsEn: ["we refuse to listen", "we delete audio", "we ignore"],
      },
      {
        id: "sp-gd-22",
        promptHe: "לְהַסִית אֶת הַדִּיּוּן לַעֲדוּת",
        correctEn: "to steer the discussion toward evidence",
        distractorsEn: ["to avoid facts", "to joke", "to leave"],
      },
      {
        id: "sp-gd-23",
        promptHe: "לְהַסִית אֶת הַמּוֹשָׁב לִתְשׁוּבָה יְשִׁירָה",
        correctEn: "to steer the speaker toward a direct answer",
        distractorsEn: ["to avoid questions", "to joke", "to leave"],
      },
      {
        id: "sp-gd-24",
        promptHe: "נִשְׁמַע הֶסֵכֵם קְצָר",
        correctEn: "let’s hear a brief agreement / summary",
        distractorsEn: ["we refuse", "we fight", "we ignore"],
      },
      {
        id: "sp-gd-25",
        promptHe: "נִסְגֹּר בְּנִקּוּד שֶׁאֵינוֹ מֻנַח",
        correctEn: "we’ll close on an unstated premise (made explicit)",
        distractorsEn: ["we hide everything", "we joke", "we leave angry"],
      },
    ],
  ),
};

const PACKS: Record<string, McqDrillPack> = {
  ...MODERN_HEBREW_PACKS,
  ...TRADITIONAL_SPECIALTY_PACKS,
};

export function getSpecialtyTierMcqPack(
  trackId: string,
  tier: SpecialtyTierId,
): McqDrillPack | undefined {
  return PACKS[specialtyTierPackId(trackId, tier)];
}
