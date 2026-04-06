import { describe, expect, it } from "vitest";
import { getGrammarParityLegacyFixtureText } from "@/lib/grammar-legacy-corpus-fixture";
import {
  getGrammarDrillTopicById,
  type GrammarDrillTopic,
} from "@/data/grammar-drills";
import { EXPECTED_GRAMMAR_G9_LEGACY_ALIGNED } from "@/data/grammar-g9-legacy-expected";

function topicEquals(a: GrammarDrillTopic, b: GrammarDrillTopic): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

describe("grammar g9 vs legacy question words", () => {
  it("matches the frozen legacy-aligned fixture", () => {
    const g9 = getGrammarDrillTopicById("g9");
    expect(g9).toBeDefined();
    expect(topicEquals(g9!, EXPECTED_GRAMMAR_G9_LEGACY_ALIGNED)).toBe(true);
  });

  it("anchors מַה נִּשְׁמַע, אֵיפֹה, אֵיךְ, לָמָּה to legacy corpus D", () => {
    const legacy = getGrammarParityLegacyFixtureText();
    expect(legacy).toContain(
      `{h:"מַה נִּשְׁמַע",p:"ma nishma",e:"what's up / what's new",l:1`,
    );
    expect(legacy).toContain(`{h:"אֵיפֹה",p:"eifo",e:"where",l:1}`);
    expect(legacy).toContain(`{h:"אֵיךְ",p:"eich",e:"how",l:1}`);
    expect(legacy).toContain(`{h:"לָמָּה",p:"lama",e:"why",l:1}`);

    const g9 = getGrammarDrillTopicById("g9");
    expect(g9?.items[0]?.opts[g9.items[0]!.ans]).toBe("מַה");
    expect(g9?.items[1]?.opts[g9.items[1]!.ans]).toBe("אֵיפֹה");
    expect(g9?.items[2]?.opts[g9.items[2]!.ans]).toBe("אֵיךְ");
    expect(g9?.items[3]?.opts[g9.items[3]!.ans]).toBe("לָמָּה");
  });
});
