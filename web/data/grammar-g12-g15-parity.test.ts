import { describe, expect, it } from "vitest";
import { getGrammarParityLegacyFixtureText } from "@/lib/grammar-legacy-corpus-fixture";
import {
  getGrammarDrillTopicById,
  type GrammarDrillTopic,
} from "@/data/grammar-drills";
import {
  EXPECTED_GRAMMAR_G12_LEGACY_ALIGNED,
  EXPECTED_GRAMMAR_G13_LEGACY_ALIGNED,
  EXPECTED_GRAMMAR_G14_LEGACY_ALIGNED,
  EXPECTED_GRAMMAR_G15_LEGACY_ALIGNED,
} from "@/data/grammar-g12-g15-legacy-expected";

function topicEquals(a: GrammarDrillTopic, b: GrammarDrillTopic): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

describe("grammar g12–g15 vs legacy corpus anchors", () => {
  it("g12 frozen fixture + אֶת phrases in legacy parity fixture", () => {
    const g12 = getGrammarDrillTopicById("g12");
    expect(g12).toBeDefined();
    expect(topicEquals(g12!, EXPECTED_GRAMMAR_G12_LEGACY_ALIGNED)).toBe(true);

    const legacy = getGrammarParityLegacyFixtureText();
    expect(legacy).toContain(
      `sentence:"שָׁמַעְתָּ אֶת הַחֲדָשׁוֹת?"`,
    );
    expect(legacy).toContain(`מְבָרֶכֶת אֶת הַנֵּרוֹת`);
    expect(legacy).toContain(
      `{h:"לְסַדֵּר אֶת הַבַּיִת",p:"lesader et habayit",e:"to tidy the house",l:1}`,
    );
    expect(legacy).toContain(
      `{h:"עָבַר אֶת הַמִּבְחָן",p:"avar et hamivkhan",e:"passed the test",l:2}`,
    );
    expect(legacy).toContain(`אוֹהֲבִים אֶת דָּנִי`);
  });

  it("g13 frozen fixture + function-word rows", () => {
    const g13 = getGrammarDrillTopicById("g13");
    expect(topicEquals(g13!, EXPECTED_GRAMMAR_G13_LEGACY_ALIGNED)).toBe(true);
    const legacy = getGrammarParityLegacyFixtureText();
    expect(legacy).toContain(`{h:"כִּי",p:"ki",e:"because / that",l:1}`);
    expect(legacy).toContain(`{h:"כְּשֶׁ",p:"kshe",e:"when (conj.)",l:1}`);
    expect(legacy).toContain(
      `{h:"לִפְנֵי שֶׁ",p:"lifnei she",e:"before (conj.)",l:1}`,
    );
    expect(legacy).toContain(`{h:"אִם",p:"im",e:"if",l:1}`);
    expect(legacy).toContain(`{h:"מֵאַחַר שֶׁ",p:"me'achar she",e:"since / because",l:2}`);
  });

  it("g14 frozen fixture + Hitpa'el infinitive rows", () => {
    const g14 = getGrammarDrillTopicById("g14");
    expect(topicEquals(g14!, EXPECTED_GRAMMAR_G14_LEGACY_ALIGNED)).toBe(true);
    const legacy = getGrammarParityLegacyFixtureText();
    expect(legacy).toContain(
      `{h:"לְהִתְרַכֵּז",p:"lehitrackez",e:"to concentrate / focus",l:2,shoresh:"רכז"}`,
    );
    expect(legacy).toContain(
      `{h:"לְהִתְעוֹרֵר",p:"lehit'orer",e:"to wake up",l:2},`,
    );
    expect(legacy).toContain(
      `{h:"לְהִתְנַצֵּל",p:"lehitnatzeln",e:"to apologise",l:2,shoresh:"נצל"}`,
    );
    expect(legacy).toContain(
      `{h:"לְהִתְפַּלֵּל",p:"lehitpalel",e:"to pray",l:1,shoresh:"פלל"}`,
    );
    expect(legacy).toContain(
      `{h:"לְהִסְתַּדֵּר",p:"lehistader",e:"to manage / get by",l:1`,
    );
  });

  it("g15 frozen fixture + time-word list", () => {
    const g15 = getGrammarDrillTopicById("g15");
    expect(topicEquals(g15!, EXPECTED_GRAMMAR_G15_LEGACY_ALIGNED)).toBe(true);
    const legacy = getGrammarParityLegacyFixtureText();
    expect(legacy).toContain(`{h:"אֶתְמוֹל",p:"etmol",e:"yesterday",l:1}`);
    expect(legacy).toContain(`{h:"מָחָר",p:"machar",e:"tomorrow",l:1}`);
    expect(legacy).toContain(`{h:"עַכְשָׁו",p:"achshav",e:"now",l:1}`);
    expect(legacy).toContain(`{h:"הַלַּיְלָה",p:"halayla",e:"tonight",l:1}`);
    expect(legacy).toContain(`{h:"מָתַי",p:"matai",e:"when",l:1}`);
    expect(legacy).toContain(
      `'עַכְשָׁו','הַיּוֹם','אֶתְמוֹל','מָחָר'`,
    );
  });
});
