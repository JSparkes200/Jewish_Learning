import { describe, expect, it } from "vitest";
import { getGrammarParityLegacyFixtureText } from "@/lib/grammar-legacy-corpus-fixture";
import {
  getGrammarDrillTopicById,
  type GrammarDrillTopic,
} from "@/data/grammar-drills";
import {
  EXPECTED_GRAMMAR_G21_LEGACY_ALIGNED,
  EXPECTED_GRAMMAR_G22_LEGACY_ALIGNED,
  EXPECTED_GRAMMAR_G23_LEGACY_ALIGNED,
  EXPECTED_GRAMMAR_G24_LEGACY_ALIGNED,
  EXPECTED_GRAMMAR_G25_LEGACY_ALIGNED,
  EXPECTED_GRAMMAR_G26_LEGACY_ALIGNED,
  EXPECTED_GRAMMAR_G27_LEGACY_ALIGNED,
  EXPECTED_GRAMMAR_G28_LEGACY_ALIGNED,
} from "@/data/grammar-g21-g28-legacy-expected";

function topicEquals(a: GrammarDrillTopic, b: GrammarDrillTopic): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

describe("grammar g21–g28 vs legacy corpus (advanced / fluent)", () => {
  it("g21 press & public voice fixtures + anchors", () => {
    const g21 = getGrammarDrillTopicById("g21");
    expect(topicEquals(g21!, EXPECTED_GRAMMAR_G21_LEGACY_ALIGNED)).toBe(true);
    const legacy = getGrammarParityLegacyFixtureText();
    expect(legacy).toContain(`{h:"כְּתָבָה",p:"ktava",e:"article / report",l:4}`);
    expect(legacy).toContain(`{h:"כּוֹתֶרֶת",p:"koteret",e:"headline",l:4}`);
    expect(legacy).toContain(`{h:"מַאֲמָר",p:"ma'amar",e:"article / essay",l:4}`);
    expect(legacy).toContain(`{h:"שַׁדְרָן",p:"shadran",e:"broadcaster",l:4}`);
  });

  it("g22 procedural nuance fixtures + anchors", () => {
    const g22 = getGrammarDrillTopicById("g22");
    expect(topicEquals(g22!, EXPECTED_GRAMMAR_G22_LEGACY_ALIGNED)).toBe(true);
    const legacy = getGrammarParityLegacyFixtureText();
    expect(legacy).toContain(`{h:"לְכַתְּחִלָּה",p:"lechatchila",e:"from the outset / ideally",l:4}`);
    expect(legacy).toContain(`{h:"בְּדִיעֲבַד",p:"bedi'avad",e:"after the fact / retrospectively",l:4}`);
    expect(legacy).toContain(`{h:"דַּוְקָא",p:"davka",e:"specifically / on purpose / ironically",l:4`);
    expect(legacy).toContain(`{h:"כִּבְיָכוֹל",p:"kivyachol",e:"as it were / so to speak",l:4}`);
  });

  it("g23 argument metalanguage fixtures + anchors", () => {
    const g23 = getGrammarDrillTopicById("g23");
    expect(topicEquals(g23!, EXPECTED_GRAMMAR_G23_LEGACY_ALIGNED)).toBe(true);
    const legacy = getGrammarParityLegacyFixtureText();
    expect(legacy).toContain(`{h:"קַל וָחֹמֶר",p:"kal vachomer",e:"a fortiori / all the more",l:4`);
    expect(legacy).toContain(`{h:"כְּדַי",p:"kedai",e:"worth it / worthwhile",l:4`);
    expect(legacy).toContain(
      `מְרַצָּה אַחַת טָעֲנָה שֶׁקַל וָחֹמֶר שֶׁאִם יֵשׁ לְתַעֵד בְּדִקְדּוּק אֵירוּעַ קָטָן`,
    );
    expect(legacy).toContain(`מַה שָּׁוֶה לְשַׁמֵּר וּמַה צָרִיךְ לְתַקֵּן`);
  });

  it("g24 Torah–Talmud study frame fixtures + anchors", () => {
    const g24 = getGrammarDrillTopicById("g24");
    expect(topicEquals(g24!, EXPECTED_GRAMMAR_G24_LEGACY_ALIGNED)).toBe(true);
    const legacy = getGrammarParityLegacyFixtureText();
    expect(legacy).toContain(`{h:"מִשְׁנָה",p:"Mishna",e:"Mishna",l:3}`);
    expect(legacy).toContain(`{h:"תַּלְמוּד",p:"Talmud",e:"Talmud",l:3}`);
    expect(legacy).toContain(`{h:"הֲלָכָה",p:"halacha",e:"Jewish law",l:3}`);
    expect(legacy).toContain(
      `אֶחָד מֵהֶם אָמַר שֶׁהַפֵּרוּשׁ שֶׁל רַשִּׁי עוֹזֵר לוֹ לִרְאוֹת אֵיךְ הֲלָכָה וְאַגָּדָה נִפְגָּשׁוֹת`,
    );
  });

  it("g25 deontic fixtures + anchors", () => {
    const g25 = getGrammarDrillTopicById("g25");
    expect(topicEquals(g25!, EXPECTED_GRAMMAR_G25_LEGACY_ALIGNED)).toBe(true);
    const legacy = getGrammarParityLegacyFixtureText();
    expect(legacy).toContain(`{h:"מֻתָּר",p:"mutar",e:"permitted (m.)",l:1}`);
    expect(legacy).toContain(`{h:"אָסוּר",p:"asur",e:"forbidden (m.)",l:1}`);
    expect(legacy).toContain(`{h:"חַיָּב",p:"chayav",e:"must / obligated (m.)",l:1}`);
    expect(legacy).toContain(`{h:"מִן הָרָאוּי",p:"min hara'ui",e:"it is appropriate / fitting",l:2}`);
  });

  it("g26 editorial verbs fixtures + anchors", () => {
    const g26 = getGrammarDrillTopicById("g26");
    expect(topicEquals(g26!, EXPECTED_GRAMMAR_G26_LEGACY_ALIGNED)).toBe(true);
    const legacy = getGrammarParityLegacyFixtureText();
    expect(legacy).toContain(`{h:"לְנַסֵּח",p:"lenasech",e:"to formulate / draft",l:4}`);
    expect(legacy).toContain(`{h:"לְהַקְצוֹת",p:"lehaktzot",e:"to allocate",l:4}`);
    expect(legacy).toContain(`{h:"לְתַעֵד",p:"leta'ed",e:"to document",l:4}`);
    expect(legacy).toContain(`{h:"לְהַרְחִיב",p:"leharchiv",e:"to expand / elaborate",l:4}`);
  });

  it("g27 academic discourse fixtures + anchors", () => {
    const g27 = getGrammarDrillTopicById("g27");
    expect(topicEquals(g27!, EXPECTED_GRAMMAR_G27_LEGACY_ALIGNED)).toBe(true);
    const legacy = getGrammarParityLegacyFixtureText();
    expect(legacy).toContain(`בְּכֻנְסִיָּה אֲקָדֶמִית עַל חֶבְרָה וְהִיסְטוֹרְיָה דִּבְּרוּ חוֹקְרִים`);
    expect(legacy).toContain(`מְרַצֶּה אַחֵר בִּיקֵּשׁ לְהִסְתַּיֵּג`);
    expect(legacy).toContain(`כְּדַי לְהַעֲמִיק בַּוִּכּוּחַ מִשּׁוּם שֶׁרַק כָּךְ`);
  });

  it("g28 text-study fluency fixtures + anchors", () => {
    const g28 = getGrammarDrillTopicById("g28");
    expect(topicEquals(g28!, EXPECTED_GRAMMAR_G28_LEGACY_ALIGNED)).toBe(true);
    const legacy = getGrammarParityLegacyFixtureText();
    expect(legacy).toContain(
      `שֶׁלִּמּוּד כָּזֶה יָכוֹל לְהָבִיא לְתִקּוּן עוֹלָם קָטָן`,
    );
    expect(legacy).toContain(
      `וְשֶׁכְּדֵי לְפָרֵשׁ אוֹתָהּ צָרִיךְ לְהָבִין גַּם אֶת הַשֹּׁרֶשׁ וְגַם אֶת הַבִּנְיָן`,
    );
    expect(legacy).toContain(
      `תְּשׁוּבָה אֵינֶנָּה רַק תְּשׁוּבָה לִשְׁאֵלָה, אֶלָּא גַּם חֲזָרָה לַדֶּרֶךְ`,
    );
  });
});
