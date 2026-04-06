import { describe, expect, it } from "vitest";
import { getGrammarParityLegacyFixtureText } from "@/lib/grammar-legacy-corpus-fixture";
import {
  getGrammarDrillTopicById,
  type GrammarDrillTopic,
} from "@/data/grammar-drills";
import { EXPECTED_GRAMMAR_G6_LEGACY_ALIGNED } from "@/data/grammar-g6-legacy-expected";

function topicEquals(a: GrammarDrillTopic, b: GrammarDrillTopic): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

describe("grammar g6 vs legacy sources", () => {
  it("matches the frozen legacy-aligned fixture (BASIC VERBS + ROOTS infinitives)", () => {
    const g6 = getGrammarDrillTopicById("g6");
    expect(g6).toBeDefined();
    expect(topicEquals(g6!, EXPECTED_GRAMMAR_G6_LEGACY_ALIGNED)).toBe(true);
  });

  it("uses the same eat-infinitive spelling as legacy corpus D (frozen JSON)", () => {
    const legacy = getGrammarParityLegacyFixtureText();
    expect(legacy).toContain(
      `{h:"לֶאֱכֹל",p:"le'echol",e:"to eat",l:1,shoresh:"אכל"}`,
    );

    const g6 = getGrammarDrillTopicById("g6");
    const eat = g6?.items[0];
    expect(eat?.opts[eat.ans]).toBe("לֶאֱכֹל");
  });

  it("uses הלך and ראה infinitives that appear in legacy corpus D", () => {
    const legacy = getGrammarParityLegacyFixtureText();
    expect(legacy).toContain(
      '{h:"לָלֶכֶת",p:"lalachet",e:"to go / to walk",l:1,shoresh:"הלך"}',
    );
    expect(legacy).toContain(
      '{h:"לִרְאוֹת",p:"lirot",e:"to see",l:1,shoresh:"ראה"}',
    );

    const g6 = getGrammarDrillTopicById("g6");
    const go = g6?.items[1];
    const see = g6?.items[2];
    expect(go?.opts[go.ans]).toBe("לָלֶכֶת");
    expect(see?.opts[see.ans]).toBe("לִרְאוֹת");
  });
});
