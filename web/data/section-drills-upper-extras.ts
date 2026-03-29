import type { McqItem } from "./section-drill-types";

/**
 * Extra MCQ rows merged onto {@link upperLevelDrillPacks} so each Bet–Dalet
 * drill section reaches ≥12 prompts (parity target vs legacy depth).
 */

function ex(
  id: string,
  promptHe: string,
  correctEn: string,
  distractorsEn: string[],
): McqItem {
  return { id, promptHe, correctEn, distractorsEn };
}

export const upperLevelDrillExtras: Record<string, readonly McqItem[]> = {
  "2-modern-1": [
    ex("m9", "אֵין מַצָּב", "No worries / it's fine (colloquial)", [
      "Big problem",
      "Go away",
      "I'm angry",
    ]),
    ex("m10", "פֹּה זֶה", "Here (emphatic, colloquial)", [
      "Over there",
      "Never",
      "Tomorrow",
    ]),
    ex("m11", "נוּ, בּוֹא", "Come on (nudging)", [
      "Stay forever",
      "Be quiet",
      "I'm leaving",
    ]),
    ex("m12", "מַה קּוֹרֶה?", "What's happening? / What's up?", [
      "What time is it?",
      "Where is the door?",
      "I disagree",
    ]),
  ],
  "2-modern-2": [
    ex("b9", "חֶבֶר", "Friend (m.)", ["Enemy", "Stranger only", "Teacher"]),
    ex("b10", "מוֹלַדֶת", "Homeland / birthplace", ["Future", "Debt", "Color"]),
    ex("b11", "דּוֹר", "Generation", ["Hour", "Recipe", "Ticket"]),
    ex("b12", "מַסֹּרֶת", "Tradition (also spelled מָסֹרֶת)", [
      "Invention",
      "Joke",
      "Silence",
    ]),
  ],
  "2-text-1": [
    ex("t9", "אֱלֹהִים", "God", ["Angel only", "Temple wall", "Book cover"]),
    ex("t10", "נֶפֶשׁ", "Soul / life-breath", ["Body only", "Tool", "Color"]),
    ex("t11", "רַחֲמִים", "Mercy / compassion", ["Cruelty", "Speed", "Metal"]),
    ex("t12", "תּוֹדָה", "Thanks / gratitude", ["Curse", "Silence", "War"]),
  ],
  "2-text-2": [
    ex("tr9", "אֱמֶת", "Truth", ["Lie", "Joke", "Speed"]),
    ex("tr10", "שָׁלוֹם", "Peace / wholeness", ["War", "Debt", "Noise"]),
    ex("tr11", "חֶסֶד", "Loving-kindness", ["Hatred", "Tool", "Invoice"]),
    ex("tr12", "דִּין", "Judgment / law", ["Joke", "Silence", "Toy"]),
  ],
  "2-bridge": [
    ex("br9", "שֵׁם עֶצֶם", "Noun (grammar)", ["Verb only", "Color", "Number"]),
    ex("br10", "פֹּעַל", "Verb (grammar)", ["Noun only", "Title", "Letter"]),
    ex("br11", "תּוֹאַר", "Adjective / epithet", ["Verb", "Preposition", "Number"]),
    ex("br12", "מִלַּת קְשִׁיר", "Conjunction", ["Noun", "Color", "Animal"]),
  ],
  "2-roots": [
    ex("r13", "נִכְתַּב", "It was written (nif'al)", [
      "He wrote",
      "I will write",
      "Writing desk",
    ]),
    ex("r14", "הִתְדַּבְּרוּ", "They spoke with each other (hitpa'el)", [
      "They wrote",
      "They slept",
      "They sold",
    ]),
  ],
  "3-ethics-1": [
    ex("e3g", "צֶדֶק", "Justice / righteousness", ["Injustice", "Speed", "Toy"]),
    ex("e3h", "כָּבוֹד", "Honor / respect", ["Shame", "Debt", "Noise"]),
    ex("e3i", "רָע", "Evil / bad", ["Good only", "Silence", "Tool"]),
    ex("e3j", "טוֹב", "Good / welfare", ["Evil", "War", "Invoice"]),
  ],
  "3-ethics-2": [
    ex("e6g", "נְחָמָה", "Comfort / consolation", ["Anger", "War", "Debt"]),
    ex("e6h", "גְּאוֹן", "Pride / majesty", ["Shame only", "Toy", "Recipe"]),
    ex("e6i", "שְׁבִיעִי", "Seventh / Sabbath-related (adj.)", [
      "First",
      "Tenth",
      "Twelfth",
    ]),
    ex("e6j", "קֹדֶשׁ קָדָשִׁים", "Holy of Holies", [
      "Kitchen",
      "Market",
      "Office",
    ]),
  ],
  "3-text-1": [
    ex("tx3g", "מִדְרָשׁ", "Midrash / homiletical study", [
      "Newspaper",
      "Novel",
      "Map",
    ]),
    ex("tx3h", "פְּסוּקִים", "Verses (biblical)", [
      "Chapters only",
      "Jokes",
      "Bills",
    ]),
    ex("tx3i", "תַּרְגּוּם", "Translation (esp. Aramaic Targum)", [
      "Curse",
      "Silence",
      "War",
    ]),
    ex("tx3j", "שְׁאֵלָה", "Question (in study)", [
      "Answer only",
      "Recipe",
      "Tool",
    ]),
  ],
  "3-text-2": [
    ex("tx6g", "עֲבוֹדָה", "Service / worship / work", [
      "Sleep",
      "Joke",
      "Debt",
    ]),
    ex("tx6h", "נֵר", "Lamp / candle", ["Table", "Key", "Shoe"]),
    ex("tx6i", "לוּלָב", "Lulav (Sukkot)", [
      "Matzah",
      "Shofar only",
      "Megillah",
    ]),
    ex("tx6j", "אֶתְרוֹג", "Etrog (Sukkot)", [
      "Apple",
      "Bread",
      "Salt",
    ]),
  ],
  "3-bridge": [
    ex("g5g", "סֵפֶר", "Book / scroll", ["Stone", "Cloud", "Shoe"]),
    ex("g5h", "פָּסוּק", "Verse (line of text)", [
      "Chapter title",
      "Invoice",
      "Map",
    ]),
    ex("g5i", "מַשְׁמָעוּת", "Meaning / significance", [
      "Silence",
      "Color",
      "Animal",
    ]),
    ex("g5j", "פּוֹשֵׁט", "Plain (simple) reader / approach", [
      "Hidden mystic",
      "Angry",
      "Asleep",
    ]),
  ],
  "3-roots": [
    ex("rt8", "שָׁלַח — שְׁלִיחוּת", "He sent — mission / agency", [
      "He sent — soup",
      "He sent — sleep",
      "He sent — joke",
    ]),
    ex("rt9", "מָצָא — מְצִיאָה", "He found — a find / discovery", [
      "He found — war",
      "He found — debt",
      "He found — toy",
    ]),
  ],
  "4-public-1": [
    ex("p3g", "מַעֲרֶכֶת", "System / array (e.g. defense)", [
      "Recipe",
      "Joke",
      "Toy",
    ]),
    ex("p3h", "רֶמֶז", "Hint / allusion", ["Fact", "Recipe", "Invoice"]),
    ex("p3i", "תַּגּוּב", "Response / reply (press)", [
      "Question only",
      "Silence",
      "Sleep",
    ]),
    ex("p3j", "עִתּוֹנַאִי", "Journalist", ["Baker", "Pilot", "Farmer"]),
  ],
  "4-public-2": [
    ex("p6g", "חֲקִיקָה", "Legislation", ["Cooking", "Painting", "Sleep"]),
    ex("p6h", "מִשְׁפָּט", "Trial / judgment", ["Party", "Song", "Game"]),
    ex("p6i", "עוֹרֵךְ דִּין", "Lawyer / advocate", [
      "Journalist",
      "Chef",
      "Pilot",
    ]),
    ex("p6j", "עֻבְדָה", "Fact / deed (legal)", ["Joke", "Silence", "Toy"]),
  ],
  "4-public-3": [
    ex("p9g", "מַס", "Tax", ["Gift", "Song", "Color"]),
    ex("p9h", "שְׂכַר", "Wage / pay", ["Tax", "War", "Sleep"]),
    ex("p9i", "שַׁקָּל", "Shekel (currency)", ["Dollar only", "Meter", "Hour"]),
    ex("p9j", "אִינְפְלַצְיָה", "Inflation (economics)", [
      "Deflation only",
      "Recipe",
      "Silence",
    ]),
  ],
  "4-text-1": [
    ex("h3g", "אִידֵאוֹלוֹגְיָה", "Ideology", ["Recipe", "Silence", "Toy"]),
    ex("h3h", "מַהְפֵּכָה", "Revolution", ["Recipe", "Silence", "Sleep"]),
    ex("h3i", "שִׁלּוּב", "Combination / integration", [
      "Separation",
      "War",
      "Debt",
    ]),
    ex("h3j", "גַּלּוּי", "Revelation / disclosure", [
      "Concealment",
      "Sleep",
      "Toy",
    ]),
  ],
  "4-bridge": [
    ex("h6g", "הַקְשׁ", "Inference / derivation (logic)", [
      "Joke",
      "Recipe",
      "Color",
    ]),
    ex("h6h", "סִתּוּמָה", "Contradiction / difficulty (textual)", [
      "Agreement",
      "Silence",
      "Sleep",
    ]),
    ex("h6i", "פִּשּׁוּט", "Simplification", [
      "Complexity",
      "Anger",
      "War",
    ]),
    ex("h6j", "הַעֲמָקָה", "Deepening / going deeper", [
      "Shallow joke",
      "Silence",
      "Toy",
    ]),
  ],
  "4-nuance": [
    ex("n3g", "מִצַּד אֶחָד", "On one hand", [
      "On the other hand",
      "In conclusion",
      "Good night",
    ]),
    ex("n3h", "מִצַּד שֵׁנִי", "On the other hand", [
      "For example",
      "Good morning",
      "Never",
    ]),
    ex("n3i", "בִּכְלָל", "In general / at all (contextual)", [
      "Never",
      "Only today",
      "Secretly",
    ]),
    ex("n3j", "בְּאוֹפֶן סְפֵצִיפִי", "Specifically", [
      "Generally",
      "Never",
      "Silently",
    ]),
  ],
  "4-roots": [
    ex("n11", "הִתְאַחֲדוּת", "Unification / reunion", [
      "Separation",
      "Laughter",
      "Recipe",
    ]),
    ex("n12", "הִתְפַּתְּחוּת", "Development / unfolding", [
      "Collapse",
      "Silence",
      "Sleep",
    ]),
  ],
};
