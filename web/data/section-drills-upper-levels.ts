import type { McqDrillPack, McqItem } from "./section-drill-types";

/**
 * Bet–Dalet MCQ drills (themes match subsection titles; expanded for deeper practice).
 */
export const upperLevelDrillPacks: Record<string, McqDrillPack> = {
  "2-modern-1": {
    kind: "mcq",
    title: "Israeli colloquial — in the wild",
    intro: "Spoken Hebrew you hear on the street.",
    items: [
      {
        id: "m1",
        promptHe: "סַבָּבָה",
        correctEn: "OK / cool / fine",
        distractorsEn: ["Terrible", "Never mind", "Stop it"],
      },
      {
        id: "m2",
        promptHe: "תַּכְלֶס",
        correctEn: "Bottom line / practically speaking",
        distractorsEn: ["In theory only", "Politely", "Ancient Hebrew"],
      },
      {
        id: "m3",
        promptHe: "אֵין בְּעַיָּה",
        correctEn: "No problem",
        distractorsEn: ["Big problem", "I disagree", "Wait here"],
      },
      {
        id: "m4",
        promptHe: "נִרְאֶה לִי",
        correctEn: "It seems to me / I think",
        distractorsEn: ["I forbid", "You must", "I forgot"],
      },
      idItem("m5", "יַאלְלָה", "Come on / let's go", [
        "Go away forever",
        "I'm sorry",
        "Be quiet",
      ]),
      idItem("m6", "בְּסֵדֶר", "OK / all right", [
        "Completely wrong",
        "Too expensive",
        "Dangerous",
      ]),
      idItem("m7", "חֲבָל", "What a pity / too bad", [
        "Congratulations",
        "Hurry up",
        "You're welcome",
      ]),
      idItem("m8", "אִי אֶפְשָׁר", "It's impossible / one can't", [
        "It's easy",
        "It's required",
        "It's boring",
      ]),
    ],
  },
  "2-modern-2": {
    kind: "mcq",
    title: "Belonging & character",
    intro: "Identity and social glue.",
    items: [
      {
        id: "b1",
        promptHe: "חֶבְרָה",
        correctEn: "Society / company (people)",
        distractorsEn: ["Grammar table", "Ship", "Silence"],
      },
      {
        id: "b2",
        promptHe: "מִשְׁפָּחָה",
        correctEn: "Family",
        distractorsEn: ["Army unit", "Classroom", "Debt"],
      },
      {
        id: "b3",
        promptHe: "אֶרֶץ",
        correctEn: "Land / country",
        distractorsEn: ["Sky", "Sentence", "Answer"],
      },
      {
        id: "b4",
        promptHe: "עַם",
        correctEn: "People / nation",
        distractorsEn: ["Alone", "Enemy only", "Grammar gender"],
      },
      idItem("b5", "בַּיִת", "Home / house", ["Ship", "Price", "Answer"]),
      idItem("b6", "קְהִלָּה", "Community", [
        "Mountain",
        "Machine",
        "Season",
      ]),
      idItem("b7", "זֶהוּת", "Identity", ["Distance", "Silence", "Tool"]),
      idItem("b8", "תַּרְבּוּת", "Culture", [
        "Kitchen",
        "Battery",
        "Ticket",
      ]),
    ],
  },
  "2-text-1": {
    kind: "mcq",
    title: "Prayer & blessing — core words",
    intro: "Liturgical vocabulary (simplified).",
    items: [
      {
        id: "t1",
        promptHe: "בְּרָכָה",
        correctEn: "Blessing",
        distractorsEn: ["Curse", "Question", "Story"],
      },
      {
        id: "t2",
        promptHe: "תְּפִלָּה",
        correctEn: "Prayer",
        distractorsEn: ["Song only", "Law", "Gift"],
      },
      {
        id: "t3",
        promptHe: "אֱמוּנָה",
        correctEn: "Faith / trust",
        distractorsEn: ["Doubt only", "Speed", "Silence"],
      },
      {
        id: "t4",
        promptHe: "שָׁמַיִם",
        correctEn: "Heavens / sky",
        distractorsEn: ["Earth only", "Temple", "Book"],
      },
      idItem("t5", "קֹדֶשׁ", "Sacred / holiness (n.)", [
        "Profane joke",
        "Fast train",
        "Empty room",
      ]),
      idItem("t6", "קָהָל", "Congregation / assembly", [
        "Private joke",
        "Coastline",
        "Kitchen",
      ]),
      idItem("t7", "בְּרִית", "Covenant", ["Curtain", "Bridge", "Recipe"]),
      idItem("t8", "נְבוּאָה", "Prophecy", ["Grammar", "Invoice", "Toy"]),
    ],
  },
  "2-text-2": {
    kind: "mcq",
    title: "Tradition & memory",
    intro: "Words for continuity and ethics.",
    items: [
      idItem("tr1", "מָסֹרֶת", "Tradition", [
        "Invention",
        "Joke",
        "Noise",
      ]),
      idItem("tr2", "זֵכֶר", "Memory / remembrance", [
        "Future",
        "Tool",
        "Color",
      ]),
      idItem("tr3", "צֶדֶק", "Justice / righteousness", [
        "Anger",
        "Speed",
        "Silence",
      ]),
      idItem("tr4", "חֶסֶד", "Kindness / steadfast love", [
        "Hatred",
        "Debt",
        "War",
      ]),
      idItem("tr5", "מִצְוָה", "Commandment / good deed", [
        "Sin only",
        "Joke",
        "Tool",
      ]),
      idItem("tr6", "תּוֹרָה", "Torah / teaching", [
        "Joke only",
        "Speed",
        "Noise",
      ]),
      idItem("tr7", "חַיִּים", "Life", ["Death wish", "Tool", "Color"]),
      idItem("tr8", "תְּשׁוּבָה", "Answer / return (moral sense)", [
        "Question only",
        "War",
        "Sleep",
      ]),
    ],
  },
  "2-bridge": {
    kind: "mcq",
    title: "Bridge — learning moves",
    intro: "Meta-language for studying Hebrew.",
    items: [
      idItem("br1", "מִלָּה", "Word", ["Letter only", "Root only", "Verse"]),
      idItem("br2", "מִשְׁפָּט", "Sentence", ["Paragraph", "Title", "Number"]),
      idItem("br3", "שֹׁרֶשׁ", "Root (3 consonants)", ["Vowel", "Prefix", "Name"]),
      idItem("br4", "תַּרְגּוּל", "Exercise / drill", ["Exam only", "Holiday", "Food"]),
      idItem("br5", "אוֹת", "Letter (alphabet sign)", [
        "Root",
        "Sentence",
        "Title",
      ]),
      idItem("br6", "נִקּוּד", "Niqqud / vocalization", [
        "Root only",
        "Verb tense",
        "Title",
      ]),
      idItem("br7", "קְרִיאָה", "Reading", ["Cooking", "Sleeping", "Painting"]),
      idItem("br8", "הֲבָנָה", "Understanding", [
        "Forgetting",
        "Sleeping",
        "Selling",
      ]),
    ],
  },
  "2-roots": {
    kind: "mcq",
    title: "Roots across time",
    intro: "Pattern: same root, different binyan.",
    items: [
      idItem("r1", "כָּתַב", "He wrote (pa'al past)", [
        "He will write",
        "It was written",
        "Dictation",
      ]),
      idItem("r2", "נִכְתַּב", "It was written (nif'al)", [
        "He wrote",
        "I write",
        "To write",
      ]),
      idItem("r3", "לִכְתּוֹב", "To write (infinitive)", [
        "Writing (noun)",
        "Letter",
        "Book",
      ]),
      idItem("r4", "כּוֹתֵב", "Writes / is writing (present m.sg.)", [
        "Wrote",
        "Will write",
        "Written",
      ]),
      idItem("r5", "דִּבֵּר", "He spoke (pa'al past)", [
        "He will speak",
        "It was said (nif'al)",
        "To speak (inf.)",
      ]),
      idItem("r6", "יְדַבֵּר", "He will speak (future)", [
        "He spoke",
        "He speaks",
        "Speech (noun)",
      ]),
      idItem("r7", "מְדַבֵּר", "He speaks (present m.sg.)", [
        "He spoke",
        "He will speak",
        "They argued",
      ]),
      idItem("r8", "דִּבּוּר", "Speech (noun)", [
        "To speak",
        "He spoke",
        "Writer",
      ]),
      idItem("r9", "שָׁמַר", "He guarded / observed (pa'al past)", [
        "He will guard",
        "It was guarded",
        "To guard (inf.)",
      ]),
      idItem("r10", "נִשְׁמַר", "It was kept / preserved (nif'al)", [
        "He guarded",
        "They forgot",
        "To sell",
      ]),
      idItem("r11", "לִשְׁמֹר", "To guard / to observe (mitzvah)", [
        "Guard (noun)",
        "He guarded",
        "Prison",
      ]),
      idItem("r12", "שְׁמִירָה", "Preservation / guarding (noun)", [
        "To guard",
        "He spoke",
        "Letter",
      ]),
    ],
  },

  "3-ethics-1": {
    kind: "mcq",
    title: "Truth & wisdom",
    intro: "Abstract nouns in moral discourse.",
    items: [
      idItem("e1", "אֱמֶת", "Truth", ["Lie", "Silence", "Speed"]),
      idItem("e2", "חָכְמָה", "Wisdom", ["Foolishness", "War", "Metal"]),
      idItem("e3", "מִשְׁפָּט", "Justice / judgment", ["Party", "Song", "Sleep"]),
      idItem("e3b", "רַחֲמִים", "Mercy / compassion", [
        "Cruelty",
        "Metal",
        "Speed",
      ]),
      idItem("e3c", "יֹשֶׁר", "Integrity / uprightness", [
        "Crookedness",
        "Anger",
        "War",
      ]),
      idItem("e3d", "שֶׁקֶר", "Falsehood / lie", ["Truth", "Silence", "Gift"]),
      idItem("e3e", "שָׁלוֹם", "Peace / wholeness", ["War", "Noise", "Debt"]),
      idItem("e3f", "חַיִּים", "Life", ["Death", "Tool", "Color"]),
    ],
  },
  "3-ethics-2": {
    kind: "mcq",
    title: "Hope & return",
    intro: "Theological–literary lexicon.",
    items: [
      idItem("e4", "תִּקְוָה", "Hope", ["Fear", "Anger", "Noise"]),
      idItem("e5", "שׁוּבָה", "Return (n.) / repentance", [
        "Departure",
        "Silence",
        "Victory",
      ]),
      idItem("e6", "גְּאֻלָּה", "Redemption", ["Exile only", "War", "Doubt"]),
      idItem("e6b", "גָּלוּת", "Exile (n.)", ["Homecoming", "Victory", "Silence"]),
      idItem("e6c", "צִיּוֹן", "Zion", ["Egypt", "Ocean", "Desert only"]),
      idItem("e6d", "בְּרָכָה", "Blessing", ["Curse", "Silence", "War"]),
      idItem("e6e", "אוֹר", "Light", ["Darkness", "Sleep", "Debt"]),
      idItem("e6f", "חֵרוּת", "Freedom", ["Slavery", "Tool", "Noise"]),
    ],
  },
  "3-text-1": {
    kind: "mcq",
    title: "Torah study language",
    intro: "Beit midrash vocabulary.",
    items: [
      idItem("tx1", "פָּרָשָׁה", "Torah portion / paragraph", [
        "Prayer book",
        "Song",
        "Number",
      ]),
      idItem("tx2", "פֵּרוּשׁ", "Commentary / explanation", [
        "Question",
        "Curse",
        "Animal",
      ]),
      idItem("tx3", "לִשְׁאוֹל", "To ask", ["To answer", "To sell", "To sleep"]),
      idItem("tx3b", "תַּלְמוּד", "Talmud", ["Newspaper", "Novel", "Map"]),
      idItem("tx3c", "הֲלָכָה", "Jewish law / halakhah", [
        "Only legend",
        "Joke",
        "Song",
      ]),
      idItem("tx3d", "אַגָּדָה", "Aggadah / narrative tradition", [
        "Only law",
        "Invoice",
        "Tool",
      ]),
      idItem("tx3e", "בֵּית מִדְרָשׁ", "Study hall", ["Market", "Prison", "Beach"]),
      idItem("tx3f", "רַב", "Rabbi / master teacher", [
        "Soldier",
        "Baker",
        "Pirate",
      ]),
    ],
  },
  "3-text-2": {
    kind: "mcq",
    title: "Ritual & place",
    intro: "Sacred space and action.",
    items: [
      idItem("tx4", "מִקְדָּשׁ", "Sanctuary / Temple", [
        "Market",
        "School",
        "Prison",
      ]),
      idItem("tx5", "קֹדֶשׁ", "Holiness / sacred", [
        "Profane",
        "Empty",
        "Fast",
      ]),
      idItem("tx6", "זִכָּרוֹן", "Remembrance / memorial", [
        "Forgetfulness",
        "Future",
        "Tool",
      ]),
      idItem("tx6b", "תְּפִלִּין", "Tefillin / phylacteries", [
        "Tzitzit only",
        "Wallet",
        "Book",
      ]),
      idItem("tx6c", "שַׁבָּת", "Sabbath", ["Weekday", "Fast only", "Holiday"]),
      idItem("tx6d", "מִצְוָה", "Mitzvah / commandment", [
        "Sin",
        "Joke",
        "Tool",
      ]),
      idItem("tx6e", "מִקְוֶה", "Ritual bath", ["Synagogue hall", "Kitchen", "Office"]),
      idItem("tx6f", "עֲלִיָּה", "Aliyah / ascent (Torah)", [
        "Descent",
        "Recipe",
        "Bill",
      ]),
    ],
  },
  "3-bridge": {
    kind: "mcq",
    title: "Grammar & interpretation",
    intro: "Metalanguage for advanced learners.",
    items: [
      idItem("g3", "בִּנְיָן", "Binyan (verb pattern)", [
        "Gender",
        "Accent",
        "Paragraph",
      ]),
      idItem("g4", "הֲבָרָה", "Expression / utterance", [
        "Silence",
        "Color",
        "Number",
      ]),
      idItem("g5", "פָּשׁוּט", "Simple / plain (sense)", [
        "Hidden",
        "Angry",
        "Ancient",
      ]),
      idItem("g5b", "דִּקְדּוּק", "Grammar", [
        "Politics",
        "Cooking",
        "Swimming",
      ]),
      idItem("g5c", "הִגַּיון", "Logic / reasoning", [
        "Silence",
        "Color",
        "Animal",
      ]),
      idItem("g5d", "מֵיטַב", "Best / optimally", ["Worst", "Slowly", "Never"]),
      idItem("g5e", "דּוּגְמָה", "Example", ["Exception", "Silence", "War"]),
      idItem("g5f", "שׁוֹרֶשׁ", "Root (etymon)", [
        "Vowel",
        "Title",
        "Paragraph",
      ]),
    ],
  },
  "3-roots": {
    kind: "mcq",
    title: "Roots & patterns",
    intro: "Recognize families.",
    items: [
      idItem("rt1", "כָּתַב — כְּתִיבָה", "He wrote — writing (noun)", [
        "He wrote — running",
        "He wrote — sleeping",
        "He wrote — eating",
      ]),
      idItem("rt2", "דִּבֵּר — דִּבּוּר", "He spoke — speech", [
        "He spoke — bread",
        "He spoke — rain",
        "He spoke — gate",
      ]),
      idItem("rt3", "קָרָא — קְרִיאָה", "He read — reading", [
        "He read — swimming",
        "He read — painting",
        "He read — driving",
      ]),
      idItem("rt3b", "לָמַד — לִמּוּד", "He learned — study (n.)", [
        "He learned — bread",
        "He learned — rain",
        "He learned — gate",
      ]),
      idItem("rt3c", "שָׁמַע — שְׁמִיעָה", "He heard — hearing", [
        "He heard — paint",
        "He heard — run",
        "He heard — sell",
      ]),
      idItem("rt3d", "רָאָה — רְאִיָּה", "He saw — seeing", [
        "He saw — bread",
        "He saw — sleep",
        "He saw — drive",
      ]),
      idItem("rt3e", "עָשָׂה — מַעֲשֶׂה", "He did — deed", [
        "He did — soup",
        "He did — cloud",
        "He did — key",
      ]),
      idItem("rt3f", "יָדַע — יְדִיעָה", "He knew — knowledge", [
        "He knew — stone",
        "He knew — table",
        "He knew — shoe",
      ]),
      idItem("rt4", "בָּנָה — בִּנְיָן", "He built — building / construction", [
        "He built — soup",
        "He built — cloud",
        "He built — shoe",
      ]),
      idItem("rt5", "גָּדַל — גִּדּוּל", "He grew — growth", [
        "He grew — key",
        "He grew — bill",
        "He grew — joke",
      ]),
      idItem("rt6", "רָץ — רִיצָה", "He ran — running / race", [
        "He ran — bread",
        "He ran — sleep",
        "He ran — paint",
      ]),
      idItem("rt7", "פָּתַח — פְּתִיחָה", "He opened — opening", [
        "He opened — stone",
        "He opened — debt",
        "He opened — war",
      ]),
    ],
  },

  "4-public-1": {
    kind: "mcq",
    title: "Press & public voice",
    intro: "Newsroom Hebrew.",
    items: [
      idItem("p1", "כּוֹתֵב הָעִתּוֹן", "The newspaper writer / columnist", [
        "The baker",
        "The pilot",
        "The farmer",
      ]),
      idItem("p2", "כּוֹתֶרֶת", "Headline", [
        "Footnote",
        "Advertisement",
        "Recipe",
      ]),
      idItem("p3", "דֵּעָה", "Opinion", ["Fact sheet", "Recipe", "Invoice"]),
      idItem("p3b", "מַאֲמָר", "Article / essay", [
        "Headline only",
        "Advertisement",
        "Recipe",
      ]),
      idItem("p3c", "עִתּוֹן", "Newspaper", ["Library", "Hospital", "Farm"]),
      idItem("p3d", "דִּוּחַ", "Report", ["Poem", "Joke", "Song"]),
      idItem("p3e", "מוֹדִיעִין", "The news", ["Silence", "Recipe", "Color"]),
      idItem("p3f", "מַאֲמָר דֵּעָה", "Opinion piece / editorial", [
        "Weather forecast",
        "Sports score",
        "Recipe",
      ]),
    ],
  },
  "4-public-2": {
    kind: "mcq",
    title: "Law & state",
    intro: "Civic vocabulary.",
    items: [
      idItem("p4", "חֹק", "Law / statute", ["Joke", "Song", "Color"]),
      idItem("p5", "מֶמְשָׁלָה", "Government", [
        "Theater",
        "Kitchen",
        "Ocean",
      ]),
      idItem("p6", "הַסְכָּמָה", "Agreement", ["Argument", "Silence", "War"]),
      idItem("p6b", "בֵּית מִשְׁפָּט", "Court", ["Kitchen", "Theater", "Beach"]),
      idItem("p6c", "חֻקָּה", "Constitution / charter", [
        "Joke",
        "Song",
        "Color",
      ]),
      idItem("p6d", "זְכוּיוֹת", "Rights", ["Wrongs", "Debts", "Toys"]),
      idItem("p6e", "אֶזְרָח", "Citizen", ["Tourist only", "Visitor", "Child only"]),
      idItem("p6f", "בְּחִירוֹת", "Elections", ["Meals", "Songs", "Games"]),
    ],
  },
  "4-public-3": {
    kind: "mcq",
    title: "Economy & policy",
    intro: "Policy talk.",
    items: [
      idItem("p7", "כַּסְפִּי", "Monetary / fiscal", [
        "Musical",
        "Medical",
        "Military",
      ]),
      idItem("p8", "תַּקְצִיב", "Budget", ["Poem", "Bridge", "Temple"]),
      idItem("p9", "מִשְׂרָד", "Ministry / office", [
        "Restaurant",
        "Beach",
        "Forest",
      ]),
      idItem("p9b", "כֶּסֶף", "Money", ["Paper only", "Stone", "Air"]),
      idItem("p9c", "מִסחָר", "Commerce / trade", [
        "Silence",
        "War",
        "Sleep",
      ]),
      idItem("p9d", "שַׁעַר", "Exchange rate / gate", [
        "Bridge",
        "Temple",
        "Recipe",
      ]),
      idItem("p9e", "גִּרְעוֹן", "Deficit", ["Surplus", "Party", "Song"]),
      idItem("p9f", "צְמִיחָה", "Growth", ["Shrinkage", "Sleep", "Debt"]),
    ],
  },
  "4-text-1": {
    kind: "mcq",
    title: "History & ideology",
    intro: "Abstract historical terms.",
    items: [
      idItem("h1", "תְּנוּעָה", "Movement (political/cultural)", [
        "Sleep",
        "Meal",
        "Tool",
      ]),
      idItem("h2", "חֲזוֹן", "Vision / prophecy", [
        "Joke",
        "Bill",
        "Key",
      ]),
      idItem("h3", "תְּחִיָּה", "Revival / rebirth", [
        "Death",
        "Silence",
        "Debt",
      ]),
      idItem("h3b", "הִיסְטוֹרְיָה", "History", ["Future only", "Recipe", "Tool"]),
      idItem("h3c", "זְכוּת", "Right / merit", ["Wrong", "Silence", "War"]),
      idItem("h3d", "שִׁעְבּוּד", "Subjugation / bondage", [
        "Freedom feast",
        "Recipe",
        "Key",
      ]),
      idItem("h3e", "עַצְמָאוּת", "Independence", [
        "Dependence",
        "Sleep",
        "Toy",
      ]),
      idItem("h3f", "חֻרְבָּן", "Destruction / ruin", [
        "Building",
        "Party",
        "Song",
      ]),
    ],
  },
  "4-bridge": {
    kind: "mcq",
    title: "Formulation & depth",
    intro: "Precision in advanced prose.",
    items: [
      idItem("h4", "נִיּוּאַנְס", "Nuance (loanword in modern Hebrew)", [
        "Silence",
        "Grammar table",
        "Animal",
      ]),
      idItem("h5", "הֶקֵשׁ", "Analogy / a fortiori argument", [
        "Joke",
        "Recipe",
        "Color",
      ]),
      idItem("h6", "הִגָּדוֹר", "Definition / delimitation", [
        "Anger",
        "Sleep",
        "Speed",
      ]),
      idItem("h6b", "פֵּרוּשׁ שׁוֹנֶה", "A different interpretation", [
        "Same joke",
        "Silence",
        "Speed",
      ]),
      idItem("h6c", "בְּרוּר", "Clear / obvious", ["Hidden", "Angry", "Asleep"]),
      idItem("h6d", "מֻרְכָּב", "Complex", ["Simple", "Fast", "Empty"]),
      idItem("h6e", "מַמְשָׁק", "Resonance / implication", [
        "Silence",
        "Color",
        "Toy",
      ]),
      idItem("h6f", "הֶדֵק", "Tightness / precision (fig.)", [
        "Looseness",
        "Joke",
        "Animal",
      ]),
    ],
  },
  "4-nuance": {
    kind: "mcq",
    title: "Argument & connectors",
    intro: "Logical glue.",
    items: [
      idItem("n1", "אַף עַל פִּי שֶׁ", "Although / even though", [
        "Because",
        "If not",
        "Until",
      ]),
      idItem("n2", "לָכֵן", "Therefore", ["However", "Maybe", "Never"]),
      idItem("n3", "מֵאִידָךְ", "On the other hand", [
        "For example",
        "In conclusion",
        "Good morning",
      ]),
      idItem("n3b", "אֲפִלּוּ", "Even (emphatic)", [
        "Never",
        "Unless",
        "Although",
      ]),
      idItem("n3c", "אַךְ", "However / but (literary)", [
        "Therefore",
        "Because",
        "Goodbye",
      ]),
      idItem("n3d", "יוֹתֵר מִדַּי", "Too much / overly", [
        "Not enough",
        "Exactly right",
        "Never",
      ]),
      idItem("n3e", "בִּקְצָרָה", "In short", [
        "In long detail",
        "Never",
        "Tomorrow",
      ]),
      idItem("n3f", "לְמָשָׁל", "For example", [
        "In conclusion",
        "On the other hand",
        "Good night",
      ]),
    ],
  },
  "4-roots": {
    kind: "mcq",
    title: "Advanced registers",
    intro: "High register vs spoken.",
    items: [
      idItem("n4", "הִתְיַשְּׁבוּת", "Settlement / composure (contextual)", [
        "Movement",
        "Laughter",
        "Recipe",
      ]),
      idItem("n5", "הִתְנַגְּדוּת", "Opposition / resistance", [
        "Agreement",
        "Silence",
        "Friendship",
      ]),
      idItem("n6", "הִתְוַעֲדוּת", "Gathering / assembly", [
        "Separation",
        "Sleep",
        "Cooking",
      ]),
      idItem("n6b", "הִתְחַבְּרוּת", "Connection / joining", [
        "Separation",
        "Silence",
        "Recipe",
      ]),
      idItem("n6c", "הִתְקַדְּמוּת", "Progress", [
        "Regression",
        "Sleep",
        "Toy",
      ]),
      idItem("n6d", "הִתְיַצְּבוּת", "Taking a stand", [
        "Running away",
        "Cooking",
        "Painting",
      ]),
      idItem("n6e", "הִתְנַהֲגוּת", "Behavior / conduct", [
        "Silence",
        "Metal",
        "Ocean",
      ]),
      idItem("n6f", "הִתְמוֹדְדוּת", "Coping / grappling", [
        "Ignoring",
        "Sleeping",
        "Selling",
      ]),
      idItem("n7", "הִתְפַּלְּלוּ", "They prayed (hitpa'el pl.)", [
        "They argued",
        "They slept",
        "They cooked",
      ]),
      idItem("n8", "הִתְיַעֲצוּ", "They consulted (each other)", [
        "They separated",
        "They forgot",
        "They painted",
      ]),
      idItem("n9", "הִתְקַשּׁוּ", "They had difficulty / struggled", [
        "They succeeded easily",
        "They danced",
        "They sold",
      ]),
      idItem("n10", "הִתְחַזּוּ", "They held fast / braced (reflexive)", [
        "They let go",
        "They slept",
        "They laughed",
      ]),
    ],
  },
};

function idItem(
  id: string,
  promptHe: string,
  correctEn: string,
  distractorsEn: string[],
): McqItem {
  return { id, promptHe, correctEn, distractorsEn };
}
