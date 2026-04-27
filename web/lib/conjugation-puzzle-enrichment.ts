/**
 * Gloss + example lines for slot-drill feedback (paired with {@link CONJUGATION_PUZZLES} ids).
 */

export type ConjugationExample = { readonly he: string; readonly en: string };

export type ConjugationPuzzleEnrichment = {
  /** Short English gloss for the target surface in context. */
  glossEn: string;
  readonly examples: readonly ConjugationExample[];
};

export const CONJUGATION_ENRICHMENT: Partial<
  Record<string, ConjugationPuzzleEnrichment>
> = {
  "hlk-paal-inf": {
    glossEn: "to go / to walk (infinitive)",
    examples: [
      { he: "אֲנִי רוֹצֶה לָלֶכֶת הַבַּיְתָה.", en: "I want to walk home." },
      { he: "לָמָּה הוּא לֹא בָּא? הוּא הָלַךְ לַשּׁוּק.", en: "Why didn’t he come? He went to the market." },
    ],
  },
  "ktb-paal-inf": {
    glossEn: "to write (infinitive)",
    examples: [
      { he: "הִיא לוֹמֶדֶת לִכְתֹּב בִּמְהִירוּת.", en: "She is learning to write quickly." },
      { he: "אֵין לִי זְמַן לִכְתֹּב הַיּוֹם.", en: "I don’t have time to write today." },
    ],
  },
  "amr-paal-inf": {
    glossEn: "to say (infinitive)",
    examples: [
      { he: "מָה אַתָּה רוֹצֶה לוֹמַר?", en: "What do you want to say?" },
      { he: "קָשֶׁה לִי לוֹמַר אֶת הָאֱמֶת.", en: "It’s hard for me to tell the truth." },
    ],
  },
  "yd3-paal-inf": {
    glossEn: "to know (infinitive)",
    examples: [
      { he: "הוּא רוֹצֶה לָדַעַת אֶת הָאֱמֶת.", en: "He wants to know the truth." },
      { he: "הִיא רוֹצָה לָדַעַת יוֹתֵר.", en: "She wants to know more." },
    ],
  },
  "rah-paal-inf": {
    glossEn: "to see (infinitive)",
    examples: [
      { he: "אֲנַחְנוּ רוֹצִים לִרְאוֹת אוֹתָם.", en: "We want to see them." },
      { he: "טוֹב לִרְאוֹת אוֹתְךָ!", en: "Good to see you!" },
    ],
  },
  "shm-paal-inf": {
    glossEn: "to hear (infinitive)",
    examples: [
      { he: "הַיּוֹם אֲנִי יָכוֹל לִשְׁמֹעַ טוֹב.", en: "Today I can hear well." },
      { he: "רוֹצִים לִשְׁמֹעַ אֶת הַחֲדָשׁוֹת.", en: "They want to hear the news." },
    ],
  },
  "ahb-paal-inf": {
    glossEn: "to love (infinitive)",
    examples: [
      { he: "הֵם אוֹהֲבִים לֶאֱהֹב אֶת הַיָּם.", en: "They love the sea — literally “love to love the sea.”" },
      { he: "קַל לֶאֱהֹב אוֹתָם.", en: "It’s easy to love them." },
    ],
  },
  "bw2-paal-inf": {
    glossEn: "to come (infinitive)",
    examples: [
      { he: "מָתַי אַתָּה יָכוֹל לָבוֹא?", en: "When can you come?" },
      { he: "הוּא בָּא לְבֵית הַסֵּפֶר כָּל יוֹם.", en: "He comes to school every day." },
    ],
  },
  "ntn-paal-inf": {
    glossEn: "to give (infinitive)",
    examples: [
      { he: "אֲנִי רוֹצֶה לָתֵת לְךָ מַתָּנָה.", en: "I want to give you a gift." },
      { he: "הִיא לֹא רוֹצָה לָתֵת תְּשׁוּבָה.", en: "She doesn’t want to give an answer." },
    ],
  },
  "ktb-paal-past-ms": {
    glossEn: "he wrote (past, 3rd masc. sg.)",
    examples: [
      { he: "הוּא כָּתַב מִכְתָּב לְאִמָּא.", en: "He wrote a letter to Mom." },
      { he: "אֶתְמוֹל הוּא כָּתַב עֲבוֹדַת בַּיִת.", en: "Yesterday he wrote homework." },
    ],
  },
  "amr-paal-past-ms": {
    glossEn: "he said (past, 3rd masc. sg.)",
    examples: [
      { he: "הוּא אָמַר שֶׁהוּא עָיֵף.", en: "He said that he’s tired." },
      { he: "מִי אָמַר לְךָ?", en: "Who told you? (lit. said to you)" },
    ],
  },
  "yd3-paal-past-ms": {
    glossEn: "he knew (past, 3rd masc. sg.)",
    examples: [
      { he: "הוּא יָדַע אֶת הַתְּשׁוּבָה.", en: "He knew the answer." },
      { he: "לֹא יָדַעְתִּי שֶׁאַתָּה פֹּה.", en: "I didn’t know you were here." },
    ],
  },
  "shm-paal-past-ms": {
    glossEn: "he heard (past, 3rd masc. sg.)",
    examples: [
      { he: "הוּא שָׁמַע אֶת הַקּוֹל.", en: "He heard the sound." },
      { he: "שָׁמַעְתָּ אֶת הַחֲדָשׁוֹת?", en: "Did you hear the news?" },
    ],
  },
  "ktb-paal-pres-ms": {
    glossEn: "he writes / he is writing (present, 3rd masc. sg.)",
    examples: [
      { he: "הוּא כּוֹתֵב עַל הַלּוּחַ.", en: "He is writing on the board." },
      { he: "הַתַּלְמִיד כּוֹתֵב מִילִים חֲדָשׁוֹת.", en: "The student is writing new words." },
    ],
  },
  "hlk-paal-pres-ms": {
    glossEn: "he walks / he is walking (present, 3rd masc. sg.)",
    examples: [
      { he: "הַיֶּלֶד הוֹלֵךְ לַגַּן.", en: "The boy walks to kindergarten." },
      { he: "לָמָּה אַתָּה הוֹלֵךְ כָּל כָּךְ מַהֵר?", en: "Why are you walking so fast?" },
    ],
  },
  "ktb-hitpaal-inf": {
    glossEn: "to correspond (lit. to write to each other; hitpa‘el infinitive)",
    examples: [
      { he: "הֵם מְבַקְשִׁים לְהִתְכַּתֵּב בְּאִנְטֶרְנֶט.", en: "They want to correspond online." },
      { he: "זֶה טוֹב לְהִתְכַּתֵּב עִם חָבֵר.", en: "It’s good to correspond with a friend." },
    ],
  },
  "yd3-hifil-inf": {
    glossEn: "to inform / let know (hif‘il infinitive)",
    examples: [
      { he: "הָרוֹפֵא רוֹצֶה לְהוֹדִיעַ לָנוּ.", en: "The doctor wants to inform us." },
      { he: "תְּהוֹדִיעַ לִי מָחָר?", en: "Will you let me know tomorrow?" },
    ],
  },
  "kns-nifal-inf": {
    glossEn: "to enter (nif‘al infinitive)",
    examples: [
      { he: "אֲנַחְנוּ מַמְתִּינִים לְהִיכָּנֵס לַחֶדֶר.", en: "We’re waiting to enter the room." },
      { he: "מֻתָּר לְהִיכָּנֵס אַחֲרֵי הַבֵּדֶק.", en: "You may enter after the check." },
    ],
  },
  "slm-piel-inf": {
    glossEn: "to pay (pi‘el infinitive)",
    examples: [
      { he: "אֲנִי צָרִיךְ לְשַׁלֵּם אֶת הַחֶשְׁבּוֹן.", en: "I need to pay the bill." },
      { he: "הֵם רוֹצִים לְשַׁלֵּם בִּמְזוּמָן.", en: "They want to pay in cash." },
    ],
  },
  "shm-hifil-past-ms": {
    glossEn: "he caused to be heard / played (audio) (hif‘il past, 3rd masc. sg.)",
    examples: [
      { he: "הוּא הִשְׁמִיעַ שִׁיר יָפֶה.", en: "He played a beautiful song." },
      { he: "הַמּוֹרֶה הִשְׁמִיעַ אֶת הַהַקְלָטָה.", en: "The teacher played the recording." },
    ],
  },
  "ktb-paal-past-fs": {
    glossEn: "she wrote (past, 3rd fem. sg.)",
    examples: [
      { he: "הִיא כָּתְבָה רְשִׁימָה אֲרוּכָּה.", en: "She wrote a long list." },
      { he: "אִמָּא כָּתְבָה לָנוּ מִכְתָּב.", en: "Mom wrote us a letter." },
    ],
  },
  "amr-paal-past-fs": {
    glossEn: "she said (past, 3rd fem. sg.)",
    examples: [
      { he: "הִיא אָמְרָה לָנוּ לְהַמְתִּין.", en: "She told us to wait." },
      { he: "מֶה הִיא אָמְרָה?", en: "What did she say?" },
    ],
  },
  "rah-paal-past-fs": {
    glossEn: "she saw (past, 3rd fem. sg.)",
    examples: [
      { he: "הִיא רָאֲתָה אוֹתוֹ בַּפַּרְק.", en: "She saw him in the park." },
      { he: "לֹא רָאִיתִי — מִי רָאָה?", en: "I didn’t see — who saw?" },
    ],
  },
  "lmd-piel-inf": {
    glossEn: "to teach (pi‘el infinitive)",
    examples: [
      { he: "הִיא רוֹצָה לְלַמֵּד עִבְרִית.", en: "She wants to teach Hebrew." },
      { he: "קָשֶׁה לִי לְלַמֵּד יְלָדִים קְטַנִּים.", en: "It’s hard for me to teach little children." },
    ],
  },
  "psh-hitpaal-inf": {
    glossEn: "to undress / relax (take off layers; hitpa‘el infinitive)",
    examples: [
      { he: "אַחֲרֵי הַיּוֹם הוּא רוֹצֶה לְהִתְפַּשֵּׁט.", en: "After the day he wants to unwind / get comfortable." },
      { he: "בַּבַּיִת אֶפְשָׁר לְהִתְפַּשֵּׁט.", en: "At home you can take off layers / relax." },
    ],
  },
};

export function getConjugationEnrichment(
  puzzleId: string,
): ConjugationPuzzleEnrichment | undefined {
  return CONJUGATION_ENRICHMENT[puzzleId];
}
