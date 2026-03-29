/**
 * Reading comprehension passages + questions (ported from `hebrew-v8.2.html` BLENDED_LEVEL_SECTIONS).
 */

export type ComprehensionQuestion = {
  q: string;
  opts: string[];
  /** Index of correct option in `opts` */
  ans: number;
  note: string;
};

export type ComprehensionPassage = {
  source: string;
  h: string;
  e: string;
  note: string;
  questions: ComprehensionQuestion[];
};

export const COMPREHENSION_BY_SECTION: Record<string, ComprehensionPassage> = {
  "2-comp": {
    source: "Blended modern spoken + textual Hebrew",
    h: "בַּשָּׁבוּעַ הָרִאשׁוֹן בַּכִּתָּה הַחֲדָשָׁה נֹעַם לֹא הִרְגִּישׁ בַּיִת. הַמּוֹרָה הָיְתָה דּוֹגְרִי, אֲבָל גַּם נְעִימָה, וְהִיא הִדְרִיכָה אֶת הַתַּלְמִידִים לְתַרְגֵּל בְּיַחַד. לְאַט לְאַט הוּא מָצָא אֶת הַמָּקוֹם שֶׁלּוֹ וְהִרְגִּישׁ נִינוֹחַ. בְּסוֹף הַשִּׁעוּר הֵם אָמְרוּ תְּפִלָּה קְצָרָה וּבְרָכָה לִפְנֵי הָאֹכֶל. הַמּוֹרָה הִסְבִּירָה שֶׁמָּסוֹרֶת וּתְּפִלָּה יְכוֹלוֹת לָתֵת לָאָדָם שֹׁרֶשׁ וְגַם אֹפִּי.",
    e: "During his first week in the new class, Noam did not feel at home. The teacher was direct, but also pleasant, and she guided the students to practise together. Little by little he found his place and felt at ease. At the end of the lesson they said a short prayer and a blessing before eating. The teacher explained that tradition and prayer can give a person both roots and character.",
    note: "This passage blends spoken Israeli classroom language with text-and-tradition vocabulary so the learner can feel both registers working together.",
    questions: [
      {
        q: "How did Noam feel at the very beginning?",
        opts: [
          "Completely relaxed",
          "Not at home yet",
          "Angry at the teacher",
          "Ready to leave immediately",
        ],
        ans: 1,
        note: "The first sentence says he did not yet feel at home.",
      },
      {
        q: "What did the teacher ask the students to do together?",
        opts: [
          "Argue with each other",
          "Practise together",
          "Go to the market",
          "Read a newspaper",
        ],
        ans: 1,
        note: "She guided them to practise together.",
      },
      {
        q: "What happened at the end of the lesson?",
        opts: [
          "They went home silently",
          "They read a news article",
          "They said a short prayer and blessing",
          "They wrote a long exam",
        ],
        ans: 2,
        note: "The passage says they said a short prayer and a blessing before eating.",
      },
      {
        q: "According to the teacher, what can tradition and prayer give a person?",
        opts: [
          "Money and status",
          "Roots and character",
          "Fame and power",
          "Only quiet",
        ],
        ans: 1,
        note: "The final sentence connects tradition and prayer with roots and character.",
      },
      {
        q: "How is the teacher described?",
        opts: [
          "Only strict and cold",
          "Direct but also pleasant",
          "Absent most of the time",
          "Angry with Noam",
        ],
        ans: 1,
        note: "She is direct (דוגרי) but also pleasant (נעימה).",
      },
      {
        q: "How did Noam feel by the end of the first week?",
        opts: [
          "Still uncomfortable",
          "At ease",
          "Ready to quit",
          "Angry",
        ],
        ans: 1,
        note: "He found his place and felt at ease (נינוח).",
      },
    ],
  },
  "2-comp-2": {
    source: "Level 2 follow-up reading with community and study language",
    h: "בְּיוֹם שִׁשִּׁי הַכִּתָּה הִתְכּוֹנְנָה לְאֲרוּחָה מְשֻׁתֶּפֶת. לִפְנֵי הָאֹכֶל הַמּוֹרָה הוֹצִיאָה סִדּוּר קָטָן וְהִנְחָתָה אֶת הַתַּלְמִידִים לוֹמַר בְּרָכָה בְּיַחַד. אַחַר כָּךְ הִיא דִּבְּרָה עַל מִנְהָג וְעַל מָסוֹרֶת, וְאָמְרָה שֶׁהֵם יְכוֹלִים לְחַנֵּךְ אֶת הָאָדָם לְמוּסָר וְלֶאֱמוּנָה. נֹעַם חִיֵּךְ וְאָמַר שֶׁעַכְשָׁו הוּא בֶּאֱמֶת מַרְגִּישׁ בַּיִת.",
    e: "On Friday the class prepared for a shared meal. Before eating, the teacher took out a small prayerbook and guided the students to say a blessing together. Afterwards she spoke about custom and tradition, and said that they can educate a person toward ethics and faith. Noam smiled and said that now he truly feels at home.",
    note: "This second Level 2 passage reinforces belonging while expanding the learner’s feel for communal and ritual language.",
    questions: [
      {
        q: "What did the teacher take out before the meal?",
        opts: [
          "A newspaper",
          "A small prayerbook",
          "A school test",
          "A market list",
        ],
        ans: 1,
        note: "The passage says she took out a small siddur.",
      },
      {
        q: "What did the students do together first?",
        opts: [
          "Left the room",
          "Argued about custom",
          "Said a blessing",
          "Read a story",
        ],
        ans: 2,
        note: "Before eating, they said a blessing together.",
      },
      {
        q: "What did the teacher say tradition and custom can teach?",
        opts: [
          "Only grammar",
          "Ethics and faith",
          "How to travel",
          "How to buy food",
        ],
        ans: 1,
        note: "She says they can educate a person toward ethics and faith.",
      },
      {
        q: "How did Noam describe himself at the end?",
        opts: [
          "Still confused",
          "Ready to leave",
          "Truly feeling at home",
          "Too tired to study",
        ],
        ans: 2,
        note: "He says that now he truly feels at home.",
      },
      {
        q: "On which day did the class prepare for the shared meal?",
        opts: ["Sunday", "Friday", "Monday", "Wednesday"],
        ans: 1,
        note: "The passage begins with יום שישי — Friday.",
      },
      {
        q: "What two topics did the teacher speak about before the meal?",
        opts: [
          "Grammar and spelling",
          "Custom and tradition",
          "Sports and music",
          "Travel and food shopping",
        ],
        ans: 1,
        note: "She spoke about מנהג and מסורת.",
      },
    ],
  },
  "3-comp": {
    source: "Blended Jewish-study Hebrew + interpretive language",
    h: "בְּשִׁעוּר תּוֹרָה הָרַב קָרָא מִשְׁנָה קְצָרָה וְאַחַר כָּךְ הוּא הוֹדִיעַ שֶׁהַיּוֹם נִלְמַד גַּם פֵּרוּשׁ שֶׁל רַשִּׁי. הַתַּלְמִידִים דִּבְּרוּ עַל אֱמֶת, צֶדֶק וְרַחֲמִים, וְשָׁאֲלוּ אֵיךְ הָרַעְיוֹנוֹת הָאֵלֶּה מִתְפַּתְּחִים בַּתַּלְמוּד. בְּסוֹף הַשִּׁעוּר הָרַב אָמַר שֶׁתְּשׁוּבָה אֵינֶנָּה רַק תְּשׁוּבָה לִשְׁאֵלָה, אֶלָּא גַּם חֲזָרָה לַדֶּרֶךְ. הַכִּתָּה יָצְאָה מִן הַשִּׁעוּר בְּתִקְוָה וּבְהַרְגָּשָׁה שֶׁל חֵרוּת פְּנִימִית.",
    e: "In Torah class, the rabbi read a short Mishnah and then announced that today they would also study a commentary of Rashi. The students discussed truth, justice, and compassion, and asked how these ideas develop in the Talmud. At the end of the lesson, the rabbi said that teshuvah is not only an answer to a question, but also a return to the right path. The class left with hope and a feeling of inner freedom.",
    note: "This section moves the learner from isolated Jewish-study words into connected classroom and interpretation language.",
    questions: [
      {
        q: "What extra text did the class study after the Mishnah?",
        opts: [
          "A newspaper article",
          "A poem by Bialik",
          "A commentary of Rashi",
          "A legal contract",
        ],
        ans: 2,
        note: "The rabbi said they would also learn a commentary of Rashi.",
      },
      {
        q: "Which ideas were discussed by the students?",
        opts: [
          "Food and travel",
          "Truth, justice, and compassion",
          "Only grammar terms",
          "Politics and budgets",
        ],
        ans: 1,
        note: "The passage explicitly lists truth, justice, and compassion.",
      },
      {
        q: "How does the rabbi define teshuvah here?",
        opts: [
          "Only a written reply",
          "A ritual meal",
          "Both an answer and a return",
          "A political slogan",
        ],
        ans: 2,
        note: "He explains that teshuvah is both an answer and a return.",
      },
      {
        q: "How did the class leave the lesson?",
        opts: [
          "Confused and tired",
          "With hope and inner freedom",
          "In silence and fear",
          "Ready for a test",
        ],
        ans: 1,
        note: "The final line says they left with hope and a feeling of inner freedom.",
      },
      {
        q: "What did they study in addition to the Mishnah?",
        opts: [
          "A newspaper column",
          "A commentary of Rashi",
          "A cookbook",
          "A travel guide",
        ],
        ans: 1,
        note: "The rabbi announced they would learn a פירוש of Rashi.",
      },
      {
        q: "According to the rabbi, what is teshuvah besides an answer to a question?",
        opts: [
          "A political slogan",
          "A return to the right path",
          "A type of song",
          "A grammar rule",
        ],
        ans: 1,
        note: "He says it is also חזרה לדרך — a return to the path.",
      },
    ],
  },
  "3-comp-2": {
    source: "Level 3 follow-up reading with study hall and interpretive Hebrew",
    h: "בְּבֵית הַמִּדְרָשׁ שְׁנֵי תַּלְמִידִים קָרְאוּ קָטָע מִן הַתַּלְמוּד. אֶחָד מֵהֶם אָמַר שֶׁהַפֵּרוּשׁ שֶׁל רַשִּׁי עוֹזֵר לוֹ לִרְאוֹת אֵיךְ הֲלָכָה וְאַגָּדָה נִפְגָּשׁוֹת בְּאוֹתוֹ מָקוֹם. הַשֵּׁנִי הוֹסִיף שֶׁכָל מִלָּה נִכְתַּבָה בְּכַוָּנָה, וְשֶׁכְּדֵי לְפָרֵשׁ אוֹתָהּ צָרִיךְ לְהָבִין גַּם אֶת הַשֹּׁרֶשׁ וְגַם אֶת הַבִּנְיָן. לִפְנֵי שֶׁיָּצְאוּ הֵם אָמְרוּ שֶׁלִּמּוּד כָּזֶה יָכוֹל לְהָבִיא לְתִקּוּן עוֹלָם קָטָן, אַף אִם הוּא מַתְחִיל רַק בַּכִּתָּה.",
    e: "In the study hall, two students read a passage from the Talmud. One of them said that Rashi’s commentary helps him see how halakhah and aggadah meet in the same place. The second added that every word was written with intention, and that in order to interpret it one must understand both the root and the verb pattern. Before leaving they said that this kind of learning can lead to a small repairing of the world, even if it begins only in the classroom.",
    note: "This second Level 3 reading strengthens the move from vocabulary knowledge into genuine interpretive habits.",
    questions: [
      {
        q: "What text were the students reading?",
        opts: [
          "A government report",
          "A Talmud passage",
          "A travel diary",
          "A newspaper editorial",
        ],
        ans: 1,
        note: "The first sentence says they read a passage from the Talmud.",
      },
      {
        q: "What does Rashi help one see?",
        opts: [
          "How to avoid study",
          "How halakhah and aggadah meet",
          "How to write headlines",
          "How to run a market",
        ],
        ans: 1,
        note: "One student says Rashi helps him see how halakhah and aggadah meet.",
      },
      {
        q: "What two language tools did the second student say are needed?",
        opts: [
          "Budget and policy",
          "Root and verb pattern",
          "Hope and freedom",
          "Blessing and custom",
        ],
        ans: 1,
        note: "He says interpretation needs both the root and the binyan.",
      },
      {
        q: "What broader goal did they connect to study?",
        opts: [
          "Winning an argument",
          "Repairing the world in a small way",
          "Finishing quickly",
          "Leaving tradition",
        ],
        ans: 1,
        note: "They say that such learning can lead to a small tikkun olam.",
      },
      {
        q: "Where were the two students studying?",
        opts: [
          "In a market",
          "In the study hall (beit midrash)",
          "On a bus",
          "In a gym",
        ],
        ans: 1,
        note: "They were in בית המדרש.",
      },
      {
        q: "What did the second student say every word was written with?",
        opts: [
          "Haste",
          "Intention (כוונה)",
          "Humor",
          "Fear",
        ],
        ans: 1,
        note: "He says every word was written בכוונה — with intention.",
      },
    ],
  },
  "4-comp": {
    source: "Advanced public Hebrew + high-register nuance",
    h: "בְּמַאֲמָר דֵּעָה חָדָשׁ הָעוֹרֵךְ נִסָּה לְנַסֵּחַ עֶמְדָה מְאֻזֶּנֶת בְּנֹגֵעַ לַחֲקִיקָה חֲדָשָׁה. הוּא טָעַן שֶׁלְּכַתְּחִלָּה יֵשׁ לְהַקְצוֹת מַשְׁאָבִים לְחִינּוּךְ וּלְתַעֵד אֶת תּוֹצְאוֹת הַמְּדִינִיּוּת, וְרַק אַחַר כָּךְ לְהַרְחִיב אֶת הַתּוֹכְנִית. כְּתָב אַחֵר עָנָה שֶׁבְּדִיעֲבַד, מִשּׁוּם שֶׁהָאִינְפְּלַצְיָה עוֹלָה וְהַצְּמִיחָה נֶחְלֶשֶׁת, לֹא כָּל הֶסְכֵּם חָדָשׁ שָׁוֶה אֶת הַמְּחִיר. הַשַּׁדְרָן סִכֵּם וְאָמַר שֶׁדַּוְקָא בִּזְמַן שֶׁל בָּלַגָן צִבּוּרִי צָרִיךְ לְהַעֲמִיק וְלֹא רַק לְהַגִּיב בְּכּוֹתֶרֶת.",
    e: "In a new opinion essay, the editor tried to formulate a balanced position regarding new legislation. He argued that ideally resources should first be allocated to education and the policy results should be documented, and only afterwards should the program be expanded. Another writer responded that, after the fact, because inflation is rising and growth is weakening, not every new agreement is worth the price. The broadcaster concluded that דווקא in a time of public chaos, one must deepen the discussion and not merely react to the headline.",
    note: "This passage trains the learner to move between media language, policy language, and harder connector words that carry argument and nuance.",
    questions: [
      {
        q: "What did the editor try to do in the essay?",
        opts: [
          "Write a children’s story",
          "Formulate a balanced position",
          "Reject all media",
          "Describe a holiday meal",
        ],
        ans: 1,
        note: "The first sentence says he tried to formulate a balanced position.",
      },
      {
        q: "What did he say should happen first?",
        opts: [
          "Expand the program immediately",
          "Allocate resources and document results",
          "Cancel the agreement",
          "Reduce all education spending",
        ],
        ans: 1,
        note: "He says resources should be allocated and results documented first.",
      },
      {
        q: "Why did the second writer hesitate about a new agreement?",
        opts: [
          "Because there was no broadcaster",
          "Because inflation was rising and growth weakening",
          "Because the editor resigned",
          "Because the headline was too short",
        ],
        ans: 1,
        note: "The response mentions rising inflation and weakening growth.",
      },
      {
        q: "What was the broadcaster’s final point?",
        opts: [
          "Only headlines matter",
          "Chaos means discussion should stop",
          "One should deepen the discussion, not just react",
          "Every compromise is bad",
        ],
        ans: 2,
        note: "He says that in a time of public chaos, we need deeper discussion rather than headline reactions.",
      },
      {
        q: "What kind of text is described at the start?",
        opts: [
          "A children’s poem",
          "A new opinion essay",
          "A weather report",
          "A recipe",
        ],
        ans: 1,
        note: "It is a מאמר דעה — opinion essay.",
      },
      {
        q: "What economic problems did the second writer mention?",
        opts: [
          "Low prices and fast growth",
          "Rising inflation and weakening growth",
          "No problems at all",
          "Only education cuts",
        ],
        ans: 1,
        note: "He cites אינפלציה עולה and צמיחה נחלשת.",
      },
    ],
  },
  "4-comp-2": {
    source: "Level 4 follow-up reading with legal register and high-level connectors",
    h: "בְּכֻנְסִיָּה אֲקָדֶמִית עַל חֶבְרָה וְהִיסְטוֹרְיָה דִּבְּרוּ חוֹקְרִים עַל הַקֶּשֶׁר בֵּין חֻרְבָּן, תְּחִיָּה וְצִיּוֹנוּת. מְרַצָּה אַחַת טָעֲנָה שֶׁקַל וָחֹמֶר שֶׁאִם יֵשׁ לְתַעֵד בְּדִקְדּוּק אֵירוּעַ קָטָן, צָרִיךְ לְתַעֵד גַּם תַּהֲלִיךְ לְאֻמִּי רָחָב. מְרַצֶּה אַחֵר בִּיקֵּשׁ לְהִסְתַּיֵּג וְאָמַר שֶׁכִּבְיָכוֹל אֵין לְנַסֵּחַ הֶסְכֵּם עַל כָּל פֵּרוּשׁ הִיסְטוֹרִי. לְבַסּוֹף הַיּוֹשֵׁב רֹאשׁ סִכֵּם שֶׁכְּדַי לְהַעֲמִיק בַּוִּכּוּחַ מִשּׁוּם שֶׁרַק כָּךְ הַצִּבּוּר יָכוֹל לְהָבִין מַה שָּׁוֶה לְשַׁמֵּר וּמַה צָרִיךְ לְתַקֵּן.",
    e: "At an academic conference on society and history, researchers spoke about the connection between destruction, revival, and Zionism. One lecturer argued that all the more so, if one must carefully document a small event, one must also document a broad national process. Another lecturer asked to qualify that claim and said that, so to speak, it is impossible to formulate agreement on every historical interpretation. In the end, the chair concluded that it is worthwhile to deepen the debate, because only in that way can the public understand what is worth preserving and what needs repair.",
    note: "This second Level 4 passage pushes the learner into argument structure, qualification, and abstract historical register.",
    questions: [
      {
        q: "What three themes were discussed at the conference?",
        opts: [
          "Food, travel, and music",
          "Destruction, revival, and Zionism",
          "Weather, farming, and sport",
          "Prayer, blessing, and custom",
        ],
        ans: 1,
        note: "The opening sentence names destruction, revival, and Zionism.",
      },
      {
        q: "What was the first lecturer’s argument?",
        opts: [
          "Small events should be ignored",
          "Documentation is unnecessary",
          "If we document a small event, all the more so a broad national process should be documented",
          "All agreements are impossible",
        ],
        ans: 2,
        note: "She uses kal vachomer to argue for documenting a broad national process.",
      },
      {
        q: "What caution did the second lecturer raise?",
        opts: [
          "History should not be studied",
          "Agreement on every historical interpretation cannot really be formulated",
          "Only law matters",
          "The conference should end early",
        ],
        ans: 1,
        note: "He says one cannot formulate agreement on every historical interpretation.",
      },
      {
        q: "Why did the chair say the debate should deepen?",
        opts: [
          "To entertain the audience",
          "So the public can understand what is worth preserving and repairing",
          "To avoid documentation",
          "Because compromise is always wrong",
        ],
        ans: 1,
        note: "The closing sentence says deeper debate helps the public understand what to preserve and repair.",
      },
      {
        q: "What argumentative tool did the first lecturer use?",
        opts: [
          "A joke",
          "Kal vachomer (all the more so)",
          "A song",
          "Silence",
        ],
        ans: 1,
        note: "The passage says קל וחומר — if we document a small event, all the more a broad process.",
      },
      {
        q: "What did the second lecturer say was impossible כביכול?",
        opts: [
          "Teaching Hebrew",
          "Formulating agreement on every historical interpretation",
          "Holding a conference",
          "Reading the Talmud",
        ],
        ans: 1,
        note: "He says one cannot formulate הסכם on every historical פירוש.",
      },
    ],
  },
};

export function getComprehensionForSection(
  sectionId: string,
): ComprehensionPassage | null {
  return COMPREHENSION_BY_SECTION[sectionId] ?? null;
}
