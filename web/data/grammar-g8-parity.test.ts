import { describe, expect, it } from "vitest";
import { getGrammarParityLegacyFixtureText } from "@/lib/grammar-legacy-corpus-fixture";
import {
  getGrammarDrillTopicById,
  type GrammarDrillTopic,
} from "@/data/grammar-drills";
import { EXPECTED_GRAMMAR_G8_LEGACY_ALIGNED } from "@/data/grammar-g8-legacy-expected";

function topicEquals(a: GrammarDrillTopic, b: GrammarDrillTopic): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

describe("grammar g8 vs legacy future + ROOTS", () => {
  it("matches the frozen legacy-aligned fixture", () => {
    const g8 = getGrammarDrillTopicById("g8");
    expect(g8).toBeDefined();
    expect(topicEquals(g8!, EXPECTED_GRAMMAR_G8_LEGACY_ALIGNED)).toBe(true);
  });

  it("anchors יֵלֵךְ / אֹכַל / נֵלֵךְ to L1 future rows in legacy corpus D", () => {
    const legacy = getGrammarParityLegacyFixtureText();
    expect(legacy).toContain(
      `{h:"יֵלֵךְ",p:"yelech",e:"he will go",l:1},{h:"נֵלֵךְ",p:"nelech",e:"we will go",l:1}`,
    );
    expect(legacy).toContain(
      `{h:"אֹכַל",p:"ochal",e:"I will eat",l:1},{h:"תֹּאכַל",p:"tochal",e:"you will eat",l:1},{h:"יֹאכַל",p:"yochal",e:"he will eat",l:1}`,
    );

    const g8 = getGrammarDrillTopicById("g8");
    expect(g8?.items[0]?.opts[g8.items[0]!.ans]).toBe("יֵלֵךְ");
    expect(g8?.items[1]?.opts[g8.items[1]!.ans]).toBe("אֹכַל");
    expect(g8?.items[2]?.opts[g8.items[2]!.ans]).toBe("נֵלֵךְ");
  });

  it("anchors יִרְאוּ and ROOTS יִרְאֶה to legacy corpus D", () => {
    const legacy = getGrammarParityLegacyFixtureText();
    expect(legacy).toContain(
      `{h:"יִרְאוּ",p:"yir'u",e:"they will see",l:1}`,
    );
    expect(legacy).toContain(
      `{h:"יִרְאֶה",p:"yir'e",e:"will see (m.)",l:2,shoresh:"ראה"}`,
    );

    const g8 = getGrammarDrillTopicById("g8");
    expect(g8?.items[3]?.opts[g8.items[3]!.ans]).toBe("יִרְאוּ");
  });
});
