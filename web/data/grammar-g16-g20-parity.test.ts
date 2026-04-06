import { describe, expect, it } from "vitest";
import { getGrammarParityLegacyFixtureText } from "@/lib/grammar-legacy-corpus-fixture";
import {
  getGrammarDrillTopicById,
  type GrammarDrillTopic,
} from "@/data/grammar-drills";
import {
  EXPECTED_GRAMMAR_G16_LEGACY_ALIGNED,
  EXPECTED_GRAMMAR_G17_LEGACY_ALIGNED,
  EXPECTED_GRAMMAR_G18_LEGACY_ALIGNED,
  EXPECTED_GRAMMAR_G19_LEGACY_ALIGNED,
  EXPECTED_GRAMMAR_G20_LEGACY_ALIGNED,
} from "@/data/grammar-g16-g20-legacy-expected";

function topicEquals(a: GrammarDrillTopic, b: GrammarDrillTopic): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

describe("grammar g16–g20 vs legacy corpus (bridge to advanced)", () => {
  it("g16 Pi'el fixtures + anchors", () => {
    const g16 = getGrammarDrillTopicById("g16");
    expect(topicEquals(g16!, EXPECTED_GRAMMAR_G16_LEGACY_ALIGNED)).toBe(true);
    const legacy = getGrammarParityLegacyFixtureText();
    expect(legacy).toContain(`{h:"לְדַבֵּר",p:"ledaber",e:"to speak / to talk",l:1,shoresh:"דבר"}`);
    expect(legacy).toContain(
      `{h:"לְלַמֵּד",p:"lelameid",e:"to teach",l:2,shoresh:"למד"}`,
    );
    expect(legacy).toContain(`{h:"לְחַזֵּק",p:"lechazek",e:"to strengthen",l:4}`);
    expect(legacy).toContain(`{h:"לְנַקּוֹת",p:"lenakot",e:"to clean",l:2,shoresh:"נקה"}`);
  });

  it("g17 Hif'il fixtures + anchors", () => {
    const g17 = getGrammarDrillTopicById("g17");
    expect(topicEquals(g17!, EXPECTED_GRAMMAR_G17_LEGACY_ALIGNED)).toBe(true);
    const legacy = getGrammarParityLegacyFixtureText();
    expect(legacy).toContain(
      `{h:"לְהַקְשִׁיב",p:"lehakshiv",e:"to listen carefully",l:1,shoresh:"קשב"}`,
    );
    expect(legacy).toContain(`{h:"לְהַמְשִׁיךְ",p:"lehamshich",e:"to continue",l:1,shoresh:"משך"}`);
    expect(legacy).toContain(`{h:"לְהַעֲמִיק",p:"leha'amik",e:"to deepen",l:2,shoresh:"עמק"}`);
    expect(legacy).toContain(`לְהַגִּיב בְּכּוֹתֶרֶת`);
  });

  it("g18 Nif'al fixtures + anchors", () => {
    const g18 = getGrammarDrillTopicById("g18");
    expect(topicEquals(g18!, EXPECTED_GRAMMAR_G18_LEGACY_ALIGNED)).toBe(true);
    const legacy = getGrammarParityLegacyFixtureText();
    expect(legacy).toContain(`{h:"נֶאֱמַר",p:"ne'emar",e:"was said",l:3,shoresh:"אמר"}`);
    expect(legacy).toContain(`{h:"נִבְנָה",p:"nivna",e:"was built",l:3,gram:"Nif'al — passive binyan"}`);
    expect(legacy).toContain(`נִכְתַּבָה בְּכַוָּנָה`);
    expect(legacy).toContain(`{h:"נִשְׁמַע",p:"nishma",e:"was heard / sounds",l:3,shoresh:"שמע"`);
  });

  it("g19 purpose/cause fixtures + anchors", () => {
    const g19 = getGrammarDrillTopicById("g19");
    expect(topicEquals(g19!, EXPECTED_GRAMMAR_G19_LEGACY_ALIGNED)).toBe(true);
    const legacy = getGrammarParityLegacyFixtureText();
    expect(legacy).toContain(`מִשּׁוּם שֶׁהָאִינְפְּלַצְיָה עוֹלָה`);
    expect(legacy).toContain(`{h:"לְמַעַן",p:"lema'an",e:"for the sake of",l:1}`);
    expect(legacy).toContain(`{h:"כְּדֵי שֶׁ",p:"kedei she",e:"so that / in order to",l:1}`);
    expect(legacy).toContain(`{h:"בִּגְלַל",p:"biglal",e:"because of",l:1`);
  });

  it("g20 discourse fixtures + anchors", () => {
    const g20 = getGrammarDrillTopicById("g20");
    expect(topicEquals(g20!, EXPECTED_GRAMMAR_G20_LEGACY_ALIGNED)).toBe(true);
    const legacy = getGrammarParityLegacyFixtureText();
    expect(legacy).toContain(`{h:"אַף עַל פִּי שֶׁ",p:"af al pi she",e:"although / even though",l:1}`);
    expect(legacy).toContain(`{h:"אַף עַל פִּי כֵן",p:"af al pi chen",e:"nevertheless",l:1}`);
    expect(legacy).toContain(`מִשּׁוּם שֶׁרַק כָּךְ הַצִּבּוּר יָכוֹל לְהָבִין`);
    expect(legacy).toContain(`{h:"לְמַרוֹת",p:"lemarat",e:"despite",l:1}`);
  });
});
