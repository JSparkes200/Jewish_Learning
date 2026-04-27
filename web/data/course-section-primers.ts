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
      "You’re building a tiny social toolkit. These are the core words Hebrew uses to greet, thank, and say goodbye.",
    words: [
      { he: "שָׁלוֹם", en: "hello / peace / goodbye", hint: "One word covers coming, going, and wishing well." },
      { he: "תּוֹדָה", en: "thank you" },
      { he: "בְּבַקָּשָׁה", en: "please / you're welcome" },
    ],
    grammar: [
      "Hebrew reads right to left. The vowel dots (nikkud) are training wheels—they help you sound out words until the patterns become second nature.",
      "Don’t worry about grammar yet. Learn these greetings as whole chunks.",
    ],
    ideas: [
      "Politeness in Hebrew is often about choosing the right short formula rather than adding a lot of extra words.",
    ],
  },
  "1-2": {
    intro:
      "Yes, no, and small courtesy words. These glue conversations together and show how Hebrew keeps things crisp.",
    words: [
      { he: "כֵּן", en: "yes" },
      { he: "לֹא", en: "no / not" },
      { he: "סְלִיחָה", en: "sorry / excuse me" },
    ],
    grammar: [
      "לֹא is your all-purpose 'no' and 'not'. You’ll use it to answer questions and to make sentences negative.",
      "Single-word answers are completely normal in spoken Hebrew. Tone carries the politeness.",
    ],
    ideas: [
      "סְלִיחָה is versatile. Use it to apologize, to squeeze past someone on the bus, or to get a waiter's attention.",
    ],
  },
  "1-read": {
    intro:
      "Your first story. You’ll see the greetings and family words you just learned working together in real sentences.",
    words: [
      { he: "הוּא / הִיא", en: "he / she" },
      { he: "יֶלֶד", en: "boy / child" },
      { he: "אוֹמֵר", en: "says (m. sg.)" },
    ],
    grammar: [
      "Hebrew doesn't use the word 'is' or 'am' in the present tense. 'He is a boy' is just הוּא יֶלֶד ('he boy').",
      "The word for 'the' is הַ־. It’s not a separate word; it glues directly onto the front of the next word.",
    ],
    ideas: [
      "Reading whole sentences early helps your brain lock onto the rhythm of the language, not just isolated flashcards.",
    ],
  },
  "1-3": {
    intro:
      "Time-of-day greetings. These anchor the daily rhythm, pairing a time word (morning, evening) with 'good'.",
    words: [
      { he: "בֹּקֶר טוֹב", en: "good morning" },
      { he: "עֶרֶב טוֹב", en: "good evening" },
      { he: "לַיְלָה טוֹב", en: "good night" },
    ],
    grammar: [
      "In Hebrew, the adjective comes *after* the noun. It’s 'morning good', not 'good morning'.",
      "Notice the טוֹב (good) stays the same here because morning, evening, and night are all treated as masculine words.",
    ],
    ideas: [
      "These phrases are universal. You’ll hear them in the market in Tel Aviv and read them in traditional texts.",
    ],
  },
  "1-4": {
    intro:
      "Pronouns are the skeleton of every sentence. Hebrew packs person, gender, and sometimes number into these core words.",
    words: [
      { he: "אֲנִי", en: "I" },
      { he: "אַתָּה / אַתְּ", en: "you (m.) / you (f.)" },
      { he: "אֲנַחְנוּ", en: "we" },
    ],
    grammar: [
      "Hebrew cares about who you are talking to. 'You' is אַתָּה for a man and אַתְּ for a woman.",
      "Don't stress about memorizing the whole chart at once. Anchor 'I', 'we', and the singular 'you' first.",
    ],
    ideas: [
      "Because verbs change shape based on who is doing the action, Hebrew speakers sometimes drop these pronouns entirely.",
    ],
  },
  "1-5": {
    intro:
      "Pointing words. 'This' and 'these' are incredibly useful when you don't know the name of something yet.",
    words: [
      { he: "זֶה", en: "this (m.) / it" },
      { he: "זֹאת", en: "this (f.)" },
      { he: "אֵלֶּה", en: "these" },
    ],
    grammar: [
      "You have to match 'this' to the gender of the thing you are pointing at. If it's a masculine noun, use זֶה. If feminine, use זֹאת.",
      "זֶה is also used to say 'it is' or 'this is'.",
    ],
    ideas: [
      "When in doubt at a market, point and say 'זֶה, בְּבַקָּשָׁה' (this, please).",
    ],
  },
  "1-6": {
    intro:
      "The base numbers 0–10. You need these for prices, ages, and phone numbers.",
    words: [
      { he: "אֶחָד / אַחַת", en: "one (m.) / one (f.)" },
      { he: "שְׁנַיִם / שְׁתַּיִם", en: "two (m.) / two (f.)" },
      { he: "עֶשֶׂר", en: "ten" },
    ],
    grammar: [
      "Numbers in Hebrew have masculine and feminine forms. For now, just get the sounds in your ear.",
      "When counting casually (1, 2, 3...), speakers default to the feminine forms.",
    ],
    ideas: [
      "Numbers are everywhere. Learn the base 1-10 solid, and the larger numbers will build off them predictably.",
    ],
  },
  "1-nums": {
    intro:
      "A quick ear-training break. Tie the sounds of the numbers to the digits.",
    grammar: [
      "Listen for the endings. The difference between the masculine and feminine forms is often just the final vowel sound.",
    ],
    ideas: [
      "Don't translate in your head. Try to hear 'shalosh' and immediately picture '3'.",
    ],
  },
  "1-7": {
    intro:
      "Scaling up. Once you know 1-10, the tens, hundreds, and thousands follow clear patterns.",
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
      "Family vocabulary. These are the people closest to you, and the words you'll use constantly in small talk and stories.",
    words: [
      { he: "אַבָּא / אִמָּא", en: "dad / mom" },
      { he: "אָח / אָחוֹת", en: "brother / sister" },
      { he: "מִשְׁפָּחָה", en: "family" },
    ],
    grammar: [
      "Many family words have irregular plurals (like 'fathers' or 'sisters'). Don't stress about the plurals yet; just lock in the singulars.",
      "To say 'the family', you just glue the הַ־ prefix to the front: הַמִּשְׁפָּחָה.",
    ],
    ideas: [
      "In Israel, 'brother' (אָח) is also used as a casual term of endearment for friends, much like 'bro' or 'man'.",
    ],
  },
  "1-9": {
    intro:
      "Size and color. Now you can start describing the world around you.",
    words: [
      { he: "גָּדוֹל / גְּדוֹלָה", en: "big (m.) / big (f.)" },
      { he: "קָטָן / קְטַנָּה", en: "small (m.) / small (f.)" },
      { he: "אָדוֹם", en: "red" },
    ],
    grammar: [
      "In Hebrew, the adjective always comes *after* the noun. A 'big house' is בַּיִת גָּדוֹל ('house big').",
      "Adjectives have to match the gender of the noun. Feminine adjectives usually end with an 'ah' sound (written with a ה at the end).",
    ],
    ideas: [
      "Colors and sizes are the building blocks of shopping, ordering food, and giving directions.",
    ],
  },
  "1-10": {
    intro:
      "Home and body. These are concrete, everyday nouns that anchor your physical world.",
    words: [
      { he: "רֹאשׁ / יָד", en: "head / hand" },
      { he: "בַּיִת", en: "house / home" },
      { he: "דֶּלֶת / חַלּוֹן", en: "door / window" },
    ],
    grammar: [
      "To say 'in the' or 'at the', Hebrew uses the prefix בַּ־. So 'at home' is just בַּבַּיִת.",
      "Body parts that come in pairs (like hands or eyes) are usually feminine, even if they don't end in the typical feminine ה.",
    ],
    ideas: [
      "When you have a headache, you literally say 'it hurts to me the head'. We'll get to that structure later, but the noun is the first step.",
    ],
  },
  "1-11": {
    intro:
      "The spine of curiosity. Question words and time adverbs let you ask who, what, when, and where.",
    words: [
      { he: "מָה", en: "what" },
      { he: "מִי", en: "who" },
      { he: "אֵיפֹה", en: "where" },
      { he: "מָתַי", en: "when" },
    ],
    grammar: [
      "Hebrew questions often keep the exact same word order as a regular sentence. Your tone of voice does the work of making it a question.",
      "Time words like הַיּוֹם (today) usually sit at the very beginning or the very end of the sentence.",
    ],
    ideas: [
      "If you only know 'where' and 'what', you can navigate almost any city or menu.",
    ],
  },
  "1-12": {
    intro:
      "Food and nature. These words connect daily life with ancient roots—you'll hear them at the market and at the holiday table.",
    words: [
      { he: "מַיִם / לֶחֶם", en: "water / bread" },
      { he: "עֵץ / פְּרִי", en: "tree / fruit" },
    ],
    grammar: [
      "Some words, like מַיִם (water), are always plural in Hebrew. You can't have 'one water'.",
    ],
    ideas: [
      "Because Jewish holidays are deeply tied to the agricultural cycle, nature words show up constantly in blessings and songs.",
    ],
  },
  "1-13": {
    intro:
      "Core verbs. We're starting with infinitives ('to eat', 'to sleep') because they are incredibly versatile.",
    words: [
      { he: "לֶאֱכוֹל", en: "to eat" },
      { he: "לִישׁוֹן", en: "to sleep" },
      { he: "לָלֶכֶת", en: "to go / to walk" },
    ],
    grammar: [
      "Most infinitives in Hebrew start with the letter ל (meaning 'to').",
      "Once you know how to say 'I want' or 'I need', you can just stick these infinitives right after them to make full sentences.",
    ],
    ideas: [
      "Infinitives are your cheat code. If you don't know how to conjugate a verb yet, you can often get away with using the infinitive.",
    ],
  },
  "1-14": {
    intro:
      "Common expressions. These are fixed chunks of language that Israelis use constantly.",
    grammar: [
      "Don't try to translate these word-for-word. Treat them as single, unbreakable units of meaning.",
    ],
    ideas: [
      "Throwing in a natural 'no problem' or 'of course' makes you sound much more fluent, even if your vocabulary is still small.",
    ],
  },

  "2-modern-1": {
    intro:
      "Everyday situations. Now we start looking at how Israelis actually talk, dropping pronouns and shortening sentences.",
    grammar: [
      "Present-tense verbs already tell you who is doing the action (masculine/feminine, singular/plural). Because of this, Israelis often drop the 'I' or 'we' entirely.",
      "Word order is flexible. The most important word often gets pushed to the end of the sentence for emphasis.",
    ],
    ideas: [
      "Street Hebrew is fast. Don't worry about catching every word; focus on the main verb and the tone.",
    ],
  },
  "2-modern-2": {
    intro:
      "People and character. You'll learn the adjectives and nouns needed to describe personalities and relationships.",
    grammar: [
      "The agreement chain: If you have a feminine plural noun, the adjective and the pointing word ('these') all need to match it.",
      "The prefix שֶׁ־ ('that' or 'which') is the glue that lets you stick two ideas together into one longer sentence.",
    ],
    ideas: [
      "This is the vocabulary of gossip, storytelling, and human-interest news.",
    ],
  },
  "2-text-1": {
    intro:
      "Prayer and blessing. We're stepping into traditional texts, which use a slightly older, tighter style of Hebrew.",
    grammar: [
      "When addressing God, blessings use a specific, fixed set of archaic pronouns and verb forms.",
      "Most blessings follow a very predictable formula starting with בָּרוּךְ (Blessed). Once you know the formula, you only need to learn the last few words.",
    ],
    ideas: [
      "Even if you don't know every word in a prayer, recognizing the 'skeleton' of the blessing helps you follow along in a siddur.",
    ],
  },
  "2-text-2": {
    intro:
      "Ethics and memory. This is the vocabulary of proverbs, Pirkei Avot, and Jewish moral teachings.",
    grammar: [
      "Traditional texts love parallelism—saying the same thing twice in slightly different ways for emphasis.",
      "Big, abstract concepts (like 'justice' or 'truth') are usually built from simple, familiar three-letter roots.",
    ],
    ideas: [
      "These texts are meant to be read slowly. The grammar is usually simple, but the meaning is dense.",
    ],
  },
  "2-bridge": {
    intro:
      "The Bet checkpoint. We're bringing together everything from Aleph and adding new verb agreements and roots.",
    grammar: [
      "Pay close attention to the endings of present-tense verbs. They must match the gender and number of the subject.",
      "Remember how to use the ל (to) prefix to make infinitives after words like 'want' or 'can'.",
    ],
    ideas: [
      "This is about accuracy, not speed. Take your time and look for the patterns.",
    ],
  },
  "2-roots": {
    intro:
      "The root system. Almost every Hebrew word is built on a skeleton of three consonants (the shoresh).",
    grammar: [
      "The same three-letter root can be plugged into different vowel patterns (binyanim) to create active, passive, or reflexive verbs.",
      "Sometimes one of the root letters 'hides' or disappears, but the core meaning usually remains.",
    ],
    ideas: [
      "Spotting the root is a superpower. It lets you guess the meaning of words you've never seen before.",
    ],
  },
  "2-comp": {
    intro:
      "Your first blended reading. This story mixes everyday classroom Hebrew with traditional vocabulary.",
    grammar: [
      "In stories, the verb sometimes comes *before* the subject. Keep an eye out for this flipped word order.",
      "Sentences are getting longer. You'll see location, time, and action all packed into a single phrase.",
    ],
    ideas: [
      "Don't panic if you don't know a word. Read the whole sentence first and try to guess the meaning from the context.",
    ],
  },
  "2-comp-2": {
    intro:
      "A deeper reading. We're looking at community, custom, and the language of shared meals.",
    grammar: [
      "Sentences are starting to nest inside each other using relative clauses. Break them down piece by piece.",
      "You'll see the word שֶׁל (of/belonging to) combined with pronouns to say 'mine', 'yours', 'his', etc.",
    ],
    ideas: [
      "Notice how the text uses parallel structures to build an argument. English translations of Jewish texts often do the exact same thing.",
    ],
  },

  "3-ethics-1": {
    intro:
      "Abstract nouns. We're moving from concrete objects (like 'house' and 'water') to big ideas like 'truth', 'justice', and 'wisdom'.",
    grammar: [
      "The 'construct state' (smichut) glues two nouns together. 'Derech' (way) + 'emet' (truth) becomes 'derech emet' (way of truth).",
      "Passive and reflexive verbs (like 'was done' or 'got dressed') show up a lot when talking about philosophy and ethics.",
    ],
    ideas: [
      "You'll see this vocabulary in the Prophets, in the Talmud, and in modern political speeches.",
    ],
  },
  "3-ethics-2": {
    intro:
      "Hope, return, and redemption. These are the core concepts that drive both classical Jewish texts and modern Zionism.",
    grammar: [
      "Time clauses ('when', 'until', 'after') are often followed by future tense or 'modal' verbs (like 'must' or 'can').",
      "Hebrew sometimes uses plural forms for abstract concepts where English would use a singular (like 'life' or 'mercy').",
    ],
    ideas: [
      "The same words are used to talk about spiritual return (teshuva) and physical return to the land of Israel.",
    ],
  },
  "3-text-1": {
    intro:
      "Torah study language. This is the shorthand used by rabbis and commentators to debate and analyze texts.",
    grammar: [
      "Commentators often quote a biblical verse (using biblical grammar) and then explain it using modern or rabbinic grammar.",
      "Look for the main verb. These texts are full of abbreviations and technical terms, but the verb tells you what's actually happening.",
    ],
    ideas: [
      "This is the language of the 'chevruta' (study partner). It's built for arguing, questioning, and clarifying.",
    ],
  },
  "3-text-2": {
    intro:
      "Ritual and space. We're looking at how Hebrew describes the physical layout of the Temple and the actions performed there.",
    grammar: [
      "Prepositions (in, to, from) are fused directly onto the nouns they modify: בַּבַּיִת (in the house), לַמִּזְבֵּחַ (to the altar).",
      "Lists and enumerations ('first...', 'second...') follow strict, predictable patterns.",
    ],
    ideas: [
      "This vocabulary is incredibly precise. It's used by both ancient priests and modern tour guides in Jerusalem.",
    ],
  },
  "3-bridge": {
    intro:
      "The Gimel checkpoint. You're reading longer sentences with richer connections. It's time to test your reading stamina.",
    grammar: [
      "When a sentence feels too long, look for the quotes or the 'that' (שֶׁ־) clauses and bracket them off.",
      "Double-check that your adjectives and verbs match the gender and number of the noun they describe.",
    ],
    ideas: [
      "Whether you're reading a newspaper op-ed or a midrash, the strategy is the same: parse the grammar slowly, then skim for the main idea.",
    ],
  },
  "3-roots": {
    intro:
      "Deep root families. We're looking at how a single three-letter root can spawn verbs, nouns, and adjectives across different registers of Hebrew.",
    grammar: [
      "If you know the active form of a root, you can often guess the passive form just by looking at the vowel pattern.",
      "Some roots are 'weak' and lose a letter when conjugated. We'll practice spotting the hidden root.",
    ],
    ideas: [
      "Learning roots is a long game. Every time you see a new word from a familiar family, the whole tree gets stronger.",
    ],
  },
  "3-comp": {
    intro:
      "Meaning and interpretation. This passage tests your ability to follow an argument and spot the connecting words.",
    grammar: [
      "Words like 'however', 'therefore', and 'meanwhile' are the hinges of the sentence. Pay attention to them.",
      "Conditional sentences ('if X, then Y') pack a lot of logic into a very tight grammatical space.",
    ],
    ideas: [
      "In essayistic Hebrew, you need to be able to tell the difference between what the author is saying and what they are quoting someone else as saying.",
    ],
  },
  "3-comp-2": {
    intro:
      "Halakhah and repair (tikkun). This is dense, careful language full of qualifications and legal distinctions.",
    grammar: [
      "Legal texts use parallel structures ('If he does X, then Y happens. If he does Z, then W happens.'). Find the repeating words.",
      "When a text quotes an older source, the tense and style might shift abruptly mid-paragraph.",
    ],
    ideas: [
      "Even if you've never studied Jewish law, you can follow the logic just by recognizing the grammatical patterns.",
    ],
  },

  "4-public-1": {
    intro:
      "Public register. This is the Hebrew of speeches, announcements, and institutions, which favors heavy nouns over simple verbs.",
    grammar: [
      "Instead of saying 'the government decided', formal Hebrew often says 'the decision of the government'. Look for the main noun.",
      "The construct state (smichut) is everywhere here, chaining nouns together like 'Ministry of Education' or 'Prime Minister'.",
    ],
    ideas: [
      "News headlines compress grammar to save space. The body of the article will unpack the same ideas into full sentences.",
    ],
  },
  "4-public-2": {
    intro:
      "Law and civic life. This vocabulary overlaps with biblical justice, but adds modern institutions and procedures.",
    grammar: [
      "Formal prepositions introduce who did what to whom. Map out the 'actors' and the 'receivers' of the action.",
      "You'll see a lot of the Hitpa'el (reflexive) and Nif'al (passive) verb forms here to describe processes ('was decided', 'was established').",
    ],
    ideas: [
      "This is the language of the Knesset, the courts, and the evening news broadcast.",
    ],
  },
  "4-public-3": {
    intro:
      "Economy and policy. We're looking at how Hebrew handles numbers, comparisons, and cause-and-effect.",
    grammar: [
      "Words for 'percent', 'growth', and 'comparison' follow patterns similar to English, but the word order is often flipped.",
      "To say 'should' or 'must', Hebrew often uses an impersonal phrase followed by an infinitive ('it is necessary to...').",
    ],
    ideas: [
      "Editorial pages assume you can follow an argument chain without picturing every single technical term.",
    ],
  },
  "4-text-1": {
    intro:
      "Narrative history. Modern prose often revives older, biblical vocabulary to create atmosphere.",
    grammar: [
      "When telling a story in the past tense, Hebrew loves to chain verbs together. Keep track of who the subject is across the chain.",
      "When a character speaks, the grammar might suddenly shift from formal narration to street slang.",
    ],
    ideas: [
      "Literary Hebrew rewards noticing whose perspective the narrator is adopting at any given moment.",
    ],
  },
  "4-bridge": {
    intro:
      "The Dalet milestone. You've reached the end of the foundation track. This checkpoint tests your ability to synthesize everything you've learned.",
    grammar: [
      "You'll need to navigate complex sentences with multiple clauses, passive verbs, and advanced vocabulary.",
      "Pay attention to the small connecting words ('despite', 'although', 'because of'). They carry the logic of the argument.",
    ],
    ideas: [
      "This is the level of a fluent, educated speaker. If you can read this, you can read almost anything in modern Hebrew.",
    ],
  },
  "4-nuance": {
    intro:
      "The glue of the essay. We're focusing on the words that connect ideas: contrast, concession, cause, and conclusion.",
    words: [
      { he: "אֲבָל", en: "but / however" },
      { he: "לָכֵן", en: "therefore" },
      { he: "עִם זֹאת", en: "nevertheless" },
    ],
    grammar: [
      "Some connectors sit at the beginning of a sentence; others glue two halves of a sentence together. Punctuation is your friend here.",
      "Look for parallel connectors ('on the one hand... on the other hand'). If you see the first one, start looking for the second.",
    ],
    ideas: [
      "Editorials and academic abstracts lean heavily on this toolkit. Mastering it makes you a much faster reader.",
    ],
  },
  "4-roots": {
    intro:
      "Mastering the root system. We're looking at how a single root can shift registers, appearing in journalism, halakhah, and poetry.",
    grammar: [
      "You'll learn to recognize 'frozen' forms—nouns that were built from a verb root long ago but now act independently.",
      "We'll practice spotting weak roots that lose a letter when conjugated in rare binyanim.",
    ],
    ideas: [
      "At this level, roots are less about memorizing flashcards and more about guessing the meaning of new words on the fly.",
    ],
  },
  "4-comp": {
    intro:
      "A complex, multi-paragraph essay. This passage tests your ability to follow a sustained argument across different registers of Hebrew.",
    grammar: [
      "The author will use rhetorical questions, passive voice, and complex subordination to build their case.",
      "Look for the thesis statement. It's usually hiding behind a strong, abstract noun.",
    ],
    ideas: [
      "This is the kind of reading you'd find in a university classroom or a serious journal of ideas.",
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
  "1-matres": {
    intro:
      "Nikkud is training wheels — real Hebrew in Israel is mostly unvowelled. This beat teaches the logic of what stays on the page when the dots go away.",
    grammar: [
      "Matres lectionis: vav, yod, and sometimes א / ה (final) carry part of a vowel so you can read without nikkud (כתיב מלא).",
      "The same word may be spelled with extra letters in full spelling (שֻׁלְחָן → שולחן) so the vowel is visible without dots.",
      "Mastery here is root + matres + context — not letter-by-letter English order.",
    ],
    ideas: [
      "When a word you know looks “new” unvowelled, first check: same root? same matres pattern? that’s the bridge across scripts.",
    ],
  },
  "2-prep-suf": {
    intro:
      "Hebrew doesn’t do “to us” with two free words; it fuses: ל + suffix → לנו. The suffix changes with person; the *role* of the pronoun (object vs indirect object) is not the same as English’s word “us.”",
    grammar: [
      "אִתִּי / אִתּוֹ (with) · לִי / לָנוּ (to/for) · אֹתִי / אוֹתָנוּ (object marker + pronoun) — different jobs.",
      "מִמֶּנִי / מִמֶּנּוּ (from) use מן- + doubling pattern — memorize the family as a chart, not as English glosses only.",
    ],
    ideas: [
      "When you “think in English” and say עִם for every with, you’ll sound off — the fused forms are the default.",
    ],
  },
  "3-binyan-logic": {
    intro:
      "You already know roots from the bridge; now you use the same three consonants the way a native does — as a slot machine: insert binyan, get a related meaning (active, passive, causative, reciprocal).",
    grammar: [
      "Example chain כ.ת.ב: Qal (write) — Pi'el (address / write formally) — Hif’il (dictate / cause to write) — Hitpa'el (correspond) — Nif’al (be written) — the root stays, the binyan sets the “syntax” of the event.",
      "Dagesh in the middle of a strong root in Pi'el and the /u/ vowel profile in many Pu'als are your visual anchors when reading, even before you produce them in speech.",
    ],
    ideas: [
      "This is the difference between a tourist word list and a system you can grow into: new verbs become guessable once the patterns stick.",
    ],
  },
  "3-smikhut": {
    intro:
      "Smikhut (construct) is how Hebrew glues two nouns: “X of Y” as one phrase, often with a vowel change on the first word (בית + ספר → בֵּית־…).",
    grammar: [
      "Definiteness: “the school” the institution = בֵּית־הַסֵּפֶר — ה usually associates with the second noun, not a doubled article on a fake “the-house-book.”",
      "Colloquial alternative: of-possessive with שֶׁל (הספר שֶׁל דנה) coexists with construct; both are “real” Modern Hebrew, different registers and emphasis.",
    ],
    ideas: [
      "If your English ear wants “the the” on both parts, slow down: construct is a single noun phrase, not two full nouns in a row.",
    ],
  },
  "4-passive": {
    intro:
      "Spoken day-to-day might favor active, short sentences — news, law, and formal prose love passive: what happened, who (optional) made it happen.",
    grammar: [
      "Nif’al, Pu'al, and Huf'al are the usual passive/ middle families — you recognize them in headlines before you have to form them in speech.",
      "Causative (Hif’il) in one clause and passive in the next is a common editorial rhythm: policy actors → outcomes for the public.",
    ],
    ideas: [
      "Aim for “I can read the headline” (recognition) long before “I can debate in Huf’al in real time” (production).",
    ],
  },
  "4-if-clauses": {
    intro:
      "Open conditions (if I can, I will) and counterfactuals (if I had known, I wouldn’t have come) are different branches — אִם vs אִלּוּ/לוּ, and the tense-aspect feel of the apodosis.",
    grammar: [
      "For likely futures, אִם + future (and context) is the default; for contrary-to-fact, careful Hebrew and literature use irrealis patterns with past forms in both parts.",
      "In speech, people use paraphrase (הייתי צריך, כדאי היה) when high-register counterfactual morphology is overkill — know both the formal pattern and the colloquial escape hatch.",
    ],
    ideas: [
      "Mistake one: one אִם for every English “if” — that flattens everything into one mood; hear הלו/אלו in stories and you’ll get the other branch.",
    ],
  },
};

export function getSectionLessonPrimer(sectionId: string): SectionLessonPrimer | undefined {
  return P[sectionId];
}
