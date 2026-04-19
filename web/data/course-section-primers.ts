/**
 * Short teaching copy shown at the top of each Learn section (Aleph–Dalet).
 * Complements drill prep flashcards and MCQ intros — aims for themes, grammar, and key lemmas.
 */

export type SectionLessonPrimerWord = {
  he: string;
  en: string;
  hint?: string;
};

export type SectionLessonPrimer = {
  intro: string;
  words?: SectionLessonPrimerWord[];
  grammar?: string[];
  ideas?: string[];
};

const P: Record<string, SectionLessonPrimer> = {
  "1-1": {
    intro:
      "You are building a tiny social toolkit: how Hebrew greets, thanks, and says goodbye in one word or short phrase.",
    words: [
      { he: "שָׁלוֹם", en: "hello / peace / goodbye", hint: "Same word for hello and goodbye in many situations." },
      { he: "תּוֹדָה", en: "thank you" },
      { he: "בְּבַקָּשָׁה", en: "please / you're welcome" },
    ],
    grammar: [
      "Hebrew reads right to left; vowel dots (nikkud) help you pronounce new words until you internalize patterns.",
      "Many greetings are fixed phrases — learn them as chunks first, then notice repeating sounds.",
    ],
    ideas: [
      "Modern Israeli Hebrew and traditional texts share a lot of this core vocabulary; politeness stays compact.",
    ],
  },
  "1-2": {
    intro:
      "Yes/no, softeners, and small courtesy words glue conversations together and mirror how Hebrew shortens thought into crisp replies.",
    words: [
      { he: "כֵּן", en: "yes" },
      { he: "לֹא", en: "no / not" },
      { he: "סְלִיחָה", en: "sorry / excuse me" },
    ],
    grammar: [
      "לֹא often negates what follows; later you will see it before verbs as “do not / does not.”",
      "Single-word answers are normal in spoken Hebrew — register is carried by tone and context.",
    ],
    ideas: [
      "Politeness is often about choosing the right short formula rather than long explanations.",
    ],
  },
  "1-read": {
    intro:
      "This first story rehearses greetings and family words in running text. Read for meaning, then let the drills test recognition.",
    words: [
      { he: "הוּא / הִיא", en: "he / she" },
      { he: "יֶלֶד", en: "boy / child" },
      { he: "אוֹמֵר", en: "says (m. sg.)", hint: "Present tense pattern you will see again." },
    ],
    grammar: [
      "Hebrew often drops “is” where English needs a linking verb: הוּא יֶלֶד = “he (is) a child.”",
      "The definite article הַ־ (“the”) attaches to the next word as a prefix.",
    ],
    ideas: [
      "Children’s vignettes mirror how native materials introduce high-frequency verbs and nouns together.",
    ],
  },
  "1-3": {
    intro:
      "Time-of-day greetings and partings anchor daily rhythm; many pair a noun (morning, evening) with an adjective (good).",
    words: [
      { he: "בֹּקֶר טוֹב", en: "good morning" },
      { he: "עֶרֶב טוֹב", en: "good evening" },
      { he: "לַיְלָה טוֹב", en: "good night" },
    ],
    grammar: [
      "Adjectives often follow the noun they describe and agree in gender and number — you will see agreement patterns grow in Bet.",
      "לְ־ as a prefix often means “to” or “for” on the word that follows (e.g. לְדָנִי “to Dani”). In לַיְלָה טוֹב “good night,” the ל is the first letter of לַיְלָה “night,” not that standalone preposition.",
    ],
    ideas: [
      "Jewish communities worldwide use these phrases in both secular and liturgical settings.",
    ],
  },
  "1-4": {
    intro:
      "Pronouns are the skeleton of every sentence; Hebrew packs person, gender, and often number into one word.",
    words: [
      { he: "אֲנִי", en: "I" },
      { he: "אַתָּה / אַתְּ", en: "you (m.) / you (f.)" },
      { he: "אֲנַחְנוּ", en: "we" },
    ],
    grammar: [
      "Second person distinguishes masculine and feminine singular — listening for the ending helps disambiguate אַתָּה vs אַתְּ.",
      "Plural forms will add more endings; for now, anchor the singular set.",
    ],
    ideas: [
      "Prayer and study texts reuse these pronouns constantly — mastering them speeds every future lesson.",
    ],
  },
  "1-5": {
    intro:
      "Demonstratives (“this / these”) point at things in speech; Hebrew uses different shapes for masculine, feminine, and plural.",
    words: [
      { he: "זֶה", en: "this (m.) / it" },
      { he: "זֹאת", en: "this (f.)" },
      { he: "אֵלֶּה", en: "these" },
    ],
    grammar: [
      "זֶה / זֹאת often introduce “it is…” style statements before a noun or adjective.",
      "Gender on the demonstrative should match the noun it refers to, not the speaker.",
    ],
    ideas: [
      "Pointing words are high-frequency in classroom Hebrew, shopping, and storytelling.",
    ],
  },
  "1-6": {
    intro:
      "Digits 0–10 appear in prices, ages, addresses, and liturgical counting; feminine and masculine counting forms diverge later — here you learn the base shapes.",
    words: [
      { he: "אֶחָד / אַחַת", en: "one (m.) / one (f.)" },
      { he: "שְׁנַיִם / שְׁתַּיִם", en: "two (m.) / two (f.)" },
      { he: "עֶשֶׂר", en: "ten" },
    ],
    grammar: [
      "Numbers often agree with the counted noun’s gender — Aleph gives you the forms; Bet tightens the rules.",
      "Construct phrases (like “ten shekels”) stack words without “of” as in English.",
    ],
    ideas: [
      "Hebrew math and calendar talk reuse the same number words you learn for everyday conversation.",
    ],
  },
  "1-nums": {
    intro:
      "The numbers drill stresses listening and recognition — tie sounds to digits before you worry about full gender agreement in phrases.",
    grammar: [
      "Listen for final consonants and stress; many number pairs differ by a vowel or ending.",
      "When you hear a sequence, chunk it (tens + ones) the way Hebrew speakers do in prices.",
    ],
    ideas: [
      "Oral practice here supports later money, time, and age sentences.",
    ],
  },
  "1-7": {
    intro:
      "Larger numbers build from tens and hundreds; you learn how Hebrew stacks units to express quantities and dates.",
    words: [
      { he: "עֶשְׂרִים", en: "twenty" },
      { he: "מֵאָה", en: "hundred" },
      { he: "אֶלֶף", en: "thousand" },
    ],
    grammar: [
      "Multiples of ten + single digits often appear as two words: עֶשְׂרִים וְאֶחָד “twenty-one.”",
      "מֵאָה and אֶלֶף behave like nouns in many constructions — more in later levels.",
    ],
    ideas: [
      "News, budgets, and historical dates all assume comfort with these scales.",
    ],
  },
  "1-8": {
    intro:
      "Family vocabulary is emotionally loaded and grammatically rich — possessives and “my / your” will attach to these nouns in Bet.",
    words: [
      { he: "אַבָּא / אִמָּא", en: "dad / mom" },
      { he: "אָח / אָחוֹת", en: "brother / sister" },
      { he: "מִשְׁפָּחָה", en: "family" },
    ],
    grammar: [
      "Many kinship terms have irregular plurals — memorize the singular set first.",
      "The definite article + noun patterns you practiced with זֶה return in “the family,” הַמִּשְׁפָּחָה.",
    ],
    ideas: [
      "Blessings and lifecycle events lean heavily on these words — liturgy and small talk overlap.",
    ],
  },
  "1-9": {
    intro:
      "Size and color adjectives describe nouns; agreement in gender/number is the main new habit.",
    words: [
      { he: "גָּדוֹל / גְּדוֹלָה", en: "big (m.) / big (f.)" },
      { he: "קָטָן / קְטַנָּה", en: "small (m.) / small (f.)" },
      { he: "אָדוֹם", en: "red" },
    ],
    grammar: [
      "Attributive adjectives usually follow the noun: בַּיִת גָּדוֹל “a big house.”",
      "Feminine singular adjectives often end in ה־ (written ה) — not a hard rule for every adjective, but a strong tendency.",
    ],
    ideas: [
      "Descriptions anchor shopping, clothing, food, and children’s stories.",
    ],
  },
  "1-10": {
    intro:
      "Body and home nouns pair with prepositions you will deepen later (in, on, under); here you stock the concrete vocabulary.",
    words: [
      { he: "רֹאשׁ / יָד", en: "head / hand" },
      { he: "בַּיִת", en: "house / home" },
      { he: "דֶּלֶת / חַלּוֹן", en: "door / window" },
    ],
    grammar: [
      "Many place phrases use בְּ־ “in/at” + noun: בַּבַּיִת “at home” (literally “in-the-house”).",
      "Compound senses (body part + pain, etc.) build on these lemmas in colloquial speech.",
    ],
    ideas: [
      "Health, hospitality, and household halakhah all reuse this cluster.",
    ],
  },
  "1-11": {
    intro:
      "Question words and time adverbs let you ask who, what, when, and where — the spine of curiosity in a new language.",
    words: [
      { he: "מָה", en: "what" },
      { he: "מִי", en: "who" },
      { he: "אֵיפֹה", en: "where" },
      { he: "מָתַי", en: "when" },
    ],
    grammar: [
      "Hebrew questions often keep normal word order; intonation or question words carry the force.",
      "Time words like הַיּוֹם “today” and עַכְשָׁו “now” slot at sentence edges or after the verb.",
    ],
    ideas: [
      "Interview-style comprehension passages love this vocabulary — news and study texts too.",
    ],
  },
  "1-12": {
    intro:
      "Food and nature vocabulary connects daily life with biblical echoes — many roots are ancient, meanings modern.",
    words: [
      { he: "מַיִם / לֶחֶם", en: "water / bread" },
      { he: "עֵץ / פְּרִי", en: "tree / fruit" },
    ],
    grammar: [
      "Collective and plural shapes (especially for animals and plants) appear in drills — watch singular/plural on adjectives later.",
      "Partitive “some” ideas often use כֹּל or quantity words you will meet in context.",
    ],
    ideas: [
      "In real life you hear these words most around food, nature, and holiday tables — blessings and seasonal cycles keep them in daily Jewish speech.",
    ],
  },
  "1-13": {
    intro:
      "The לִ… infinitive pattern (“to …”) unlocks verb families; Aleph stresses recognition of the prefix לְ + stem.",
    words: [
      { he: "לֶאֱכוֹל", en: "to eat" },
      { he: "לִישׁוֹן", en: "to sleep" },
      { he: "לָלֶכֶת", en: "to go / to walk" },
    ],
    grammar: [
      "Binyanim (verb patterns) change vowels around a root; the infinitive often shows ל + a predictable stem shape.",
      "After a modal (“want,” “can”) Hebrew usually chains the infinitive directly.",
    ],
    ideas: [
      "Prayer books stack infinitives in legal and ethical lists — same forms, elevated register.",
    ],
  },
  "1-14": {
    intro:
      "Fixed expressions bundle culture and grammar; many are shortenings of longer biblical or rabbinic lines.",
    grammar: [
      "Some phrases are opaque if translated word-for-word — treat them as idioms.",
      "Particle words like נָא “please” (archaic/liturgical) still appear in fixed blessings.",
    ],
    ideas: [
      "Recognizing these chunks helps you follow synagogue Hebrew and polite conversation at once.",
    ],
  },

  "2-modern-1": {
    intro:
      "Colloquial blocks model how Israelis shorten sentences, drop pronouns, and layer slang on polite cores.",
    grammar: [
      "Present-tense verbs already encode person in their endings — subject pronouns are often omitted when clear.",
      "Word order flexes for emphasis; the last stressed word often carries new information.",
    ],
    ideas: [
      "Street Hebrew and textbook Hebrew share grammar but differ in fillers and pace — both are worth imitating.",
    ],
  },
  "2-modern-2": {
    intro:
      "Talking about people — character, relationships, and social types — pulls adjectives, nouns, and light subordination together.",
    grammar: [
      "Agreement chains: noun + adjective + demonstrative should match in gender and number when possible.",
      "שֶׁ־ “that/which” begins relative clauses you will see more in comprehension passages.",
    ],
    ideas: [
      "Modern fiction and podcasts lean on this vocabulary; it also appears in human-interest news.",
    ],
  },
  "2-text-1": {
    intro:
      "Prayer and blessing phrasing uses archaisms and tighter word order; compare with spoken forms you learned in Aleph.",
    grammar: [
      "Second-person address to God uses archaic pronouns and verb forms in fixed liturgy.",
      "Blessing formulas often open with בָּרוּךְ and follow predictable syntactic slots.",
    ],
    ideas: [
      "Recognizing the skeleton of a blessing helps you navigate siddurim even when vocabulary is new.",
    ],
  },
  "2-text-2": {
    intro:
      "Ethical and memory vocabulary ties to proverbs, Pirkei Avot-style lines, and short mussar excerpts.",
    grammar: [
      "Parallelism (pair of phrases) signals rhetoric in many traditional sentences.",
      "Abstract nouns often derive from familiar roots — look for the three-letter core inside longer words.",
    ],
    ideas: [
      "These texts reward slow reading: grammar is simple, meaning is dense.",
    ],
  },
  "2-bridge": {
    intro:
      "The Bet checkpoint mixes grammar review, production drills, and your first sustained roots work — expect everything from Aleph plus new verb agreements.",
    grammar: [
      "Check present-tense endings for gender/number on verbs and adjectives.",
      "Review ל + infinitive after רוֹצֶה, יָכוֹל, and similar helpers.",
    ],
    ideas: [
      "Treat this as a confidence gate: speed matters less than accuracy and pattern recognition.",
    ],
  },
  "2-roots": {
    intro:
      "Roots (usually three consonants) generate verb stems and nouns; spotting the root cuts memorization load.",
    grammar: [
      "The same root may appear in pi’el, hif’il, etc. — vowel patterns signal binyan.",
      "Shared root letters can be hidden by weak letters (vav/yod) or assimilation — drills highlight common cases.",
    ],
    ideas: [
      "Biblical and modern Hebrew share roots; meaning shifts are learnable once you see the family.",
    ],
  },
  "2-comp": {
    intro:
      "This comprehension weaves home life, practice routines, and blessing language — read once for gist, then mine details for questions.",
    grammar: [
      "Watch subject–verb agreement when the subject follows the verb (common in narrative).",
      "Prepositional phrases stack: location + time + manner can all appear in one clause.",
    ],
    ideas: [
      "Comprehension points often test function words and connectors, not only content vocabulary.",
    ],
  },
  "2-comp-2": {
    intro:
      "A second Bet passage stresses guidance, custom, and domestic settings — compare sentence length with the first comprehension.",
    grammar: [
      "Relative clauses and infinitive complements may nest — parse from the main verb outward.",
      "Possessive של + pronoun phrases recap Aleph family words in fuller sentences.",
    ],
    ideas: [
      "Jewish English explanations often mirror these Hebrew connectors — notice parallel argument structure.",
    ],
  },

  "3-ethics-1": {
    intro:
      "Abstract nouns (truth, justice, wisdom) appear in elevated register; roots like צ־ד־ק and א־מ־ת recur across texts.",
    grammar: [
      "Construct states chain abstract nouns: “way of truth,” “pursuit of justice,” etc.",
      "Passive and reflexive stems surface more often in philosophical prose.",
    ],
    ideas: [
      "Prophetic and legal Hebrew both claim this vocabulary — tone differs, lemmas overlap.",
    ],
  },
  "3-ethics-2": {
    intro:
      "Hope, return, and redemption vocabulary underpins modern Zionist essays and classical sources alike.",
    grammar: [
      "Temporal clauses (when, until, after) bundle with future and modal verbs.",
      "Watch plural abstracts — Hebrew pluralizes some concepts where English uses singular mass nouns.",
    ],
    ideas: [
      "Political and theological readings share keywords; context disambiguates.",
    ],
  },
  "3-text-1": {
    intro:
      "Torah-study phrases mix Aramaic loans, rabbinic shorthand, and biblical citations — focus on recurring frame expressions.",
    grammar: [
      "Quoted snippets may preserve biblical tense systems inside modern commentary frames.",
      "Abbreviation and technical terms stack — identify the verb carrying the main claim first.",
    ],
    ideas: [
      "Chevruta-style discussion leans on these frames even when content changes.",
    ],
  },
  "3-text-2": {
    intro:
      "Ritual and place vocabulary ties space to action (altar, courtyard, direction); prepositions carry legal weight.",
    grammar: [
      "Locatives often use בְּ־, לְ־, מִ־ with fused forms (בַּבַּיִת, לַמִּזְבֵּחַ).",
      "Enumerations (first… second…) follow patterns you can recognize without translating every item cold.",
    ],
    ideas: [
      "Tour guides and halakhic writing both need this precision — register shifts, roots stay stable.",
    ],
  },
  "3-bridge": {
    intro:
      "Gimel checkpoint: longer sentences, richer subordination, and reading stamina — review roots and comprehension strategies before pushing forward.",
    grammar: [
      "If a sentence feels long, bracket embedded quotes and relative clauses first.",
      "Revisit gender/number agreement on participles — common slip at this level.",
    ],
    ideas: [
      "Newspaper op-eds and midrashic lines both reward the same slow parse-then-skim habit.",
    ],
  },
  "3-roots": {
    intro:
      "Deeper root families connect verbs, nouns, and adjectives across registers; expect weak roots and assimilated letters.",
    grammar: [
      "Compare active vs passive stems for the same root to guess meaning from context.",
      "Memorize a few high-frequency “template” roots that illustrate each binyan.",
    ],
    ideas: [
      "Root study is a long game — each passage adds another branch to the same tree.",
    ],
  },
  "3-comp": {
    intro:
      "Themes of meaning, return, and textual interpretation — questions may hinge on a single connector or modal.",
    grammar: [
      "Discourse markers (however, therefore, meanwhile) may be one-word adverbs or short phrases.",
      "Watch conditional if/then structures — they compress tense logic tightly.",
    ],
    ideas: [
      "Essayistic Hebrew rewards noticing who is quoted vs who is speaking in the author’s voice.",
    ],
  },
  "3-comp-2": {
    intro:
      "Halakhah, commentary, and repair (תיקון) language — dense nouns, careful qualification.",
    grammar: [
      "Legal lists use parallel “if X then Y” scaffolding; find the repeated function words.",
      "Citation formulas introduce another voice — tense may shift mid-paragraph.",
    ],
    ideas: [
      "Even if jurisprudence is new to you, pattern recognition carries most of the drill load.",
    ],
  },

  "4-public-1": {
    intro:
      "Public register: speeches, announcements, and institutional Hebrew favor nominal sentences and elevated lexicon.",
    grammar: [
      "Passive participles and noun-heavy clauses replace colloquial verbs — identify the head noun per phrase.",
      "Smichut (construct) stacks multiple nouns: “ministry of X affairs.”",
    ],
    ideas: [
      "News headlines compress grammar — body paragraphs unpack the same ideas in fuller clauses.",
    ],
  },
  "4-public-2": {
    intro:
      "Law and civic vocabulary overlaps with biblical justice terms but adds modern institutions and procedures.",
    grammar: [
      "Formal prepositional phrases introduce agents, beneficiaries, and scopes — map who did what to whom.",
      "Legal Hebrew loves abstract plurals and Latin/Greek loans — pronunciation follows Israeli norms.",
    ],
    ideas: [
      "Court reporting and Knesset transcripts are practice fodder for this register.",
    ],
  },
  "4-public-3": {
    intro:
      "Economy and policy talk mixes numbers, comparatives, and causal connectors — attention to scale words matters.",
    grammar: [
      "Percent, growth, and comparison adjectives often appear in patterns parallel to English but with different default word order.",
      "Subjunctive-style “should/must” uses modals + infinitive or impersonal constructions.",
    ],
    ideas: [
      "Editorial pages assume you can follow an argument chain without picturing every technical term.",
    ],
  },
  "4-text-1": {
    intro:
      "Narrative history in modern prose revives older lexical choices for atmosphere; tense shifts mark flashback.",
    grammar: [
      "Past narratives favor sequential verbs with shared subjects; track the subject across clauses.",
      "Quoted speech may revert to colloquial grammar inside formal frames.",
    ],
    ideas: [
      "Literary Hebrew rewards noticing whose perspective the narrator adopts.",
    ],
  },
  "4-bridge": {
    intro:
      "Dalet checkpoint before capstone comprehension — consolidate argument vocabulary, connectors, and long-distance agreement.",
    grammar: [
      "Outline the passage: thesis, evidence, counterpoint — Hebrew essays telegraph structure with signpost words.",
      "If comprehension stalls, reread the first and last sentence of each paragraph.",
    ],
    ideas: [
      "Foundation completion is about endurance and strategy, not perfection on every rare word.",
    ],
  },
  "4-nuance": {
    intro:
      "Connectors and argumentation: contrast, concession, cause, and conclusion — the glue of essay Hebrew.",
    words: [
      { he: "אֲבָל", en: "but / however" },
      { he: "לָכֵן", en: "therefore" },
      { he: "עִם זֹאת", en: "nevertheless" },
    ],
    grammar: [
      "Some connectors are sentence-initial; others glue clauses inside a sentence — punctuation hints help.",
      "Parallel connectors (on the one hand / on the other) appear in pairs — find both halves.",
    ],
    ideas: [
      "Editorials and academic abstracts lean on this toolkit; liturgical poetry uses some of the same contrast patterns.",
    ],
  },
  "4-roots": {
    intro:
      "Advanced root work stresses register shifts: the same root in journalism, halakhah, and poetry.",
    grammar: [
      "Recognize frozen forms (nouns that no longer behave like their source verb).",
      "Weak roots in rare binyanim — use vowel templates from known analogs.",
    ],
    ideas: [
      "At Dalet, roots are less about drills and more about reading speed and inference.",
    ],
  },
  "4-comp": {
    intro:
      "Editorial tone and nuance — authorial distance, irony, and hedging show up in adverbs and modality.",
    grammar: [
      "Modal stacking (“might have been able”) compresses into compact Hebrew auxiliaries — identify the core verb.",
      "Attribution verbs (claims, argues, denies) introduce embedded clauses — bracket them.",
    ],
    ideas: [
      "Compare the headline claim to the body’s qualifications — comprehension items often target that gap.",
    ],
  },
  "4-comp-2": {
    intro:
      "Law, history, and argument in one passage — expect dense noun phrases and layered citations.",
    grammar: [
      "Long smichut chains can be read right-to-left in chunks: start from the last noun before הַ־.",
      "Footnote-style abbreviations may appear — treat them like unknown tokens unless defined in the text.",
    ],
    ideas: [
      "This is capstone reading: prioritize structure, then polish vocabulary on a second pass.",
    ],
  },
};

export function getSectionLessonPrimer(sectionId: string): SectionLessonPrimer | undefined {
  return P[sectionId];
}
