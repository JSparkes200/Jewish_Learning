import { describe, expect, it } from "vitest";
import { getGrammarParityLegacyFixtureText } from "@/lib/grammar-legacy-corpus-fixture";
import {
  getGrammarDrillTopicById,
  type GrammarDrillTopic,
} from "@/data/grammar-drills";
import { EXPECTED_GRAMMAR_G7_LEGACY_ALIGNED } from "@/data/grammar-g7-legacy-expected";

function topicEquals(a: GrammarDrillTopic, b: GrammarDrillTopic): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

describe("grammar g7 vs legacy corpus strings", () => {
  it("matches the frozen legacy-aligned fixture", () => {
    const g7 = getGrammarDrillTopicById("g7");
    expect(g7).toBeDefined();
    expect(topicEquals(g7!, EXPECTED_GRAMMAR_G7_LEGACY_ALIGNED)).toBe(true);
  });

  it("anchors masculine present אכל to legacy corpus D row", () => {
    const legacy = getGrammarParityLegacyFixtureText();
    expect(legacy).toContain('{h:"אוֹכֵל",p:"ochel",e:"eats (m. pres.)",l:1}');

    const g7 = getGrammarDrillTopicById("g7");
    const eat = g7?.items[0];
    expect(eat?.opts[eat.ans]).toBe("אוֹכֵל");
  });

  it("anchors feminine present הלך / ראה / דבר to legacy rows", () => {
    const legacy = getGrammarParityLegacyFixtureText();
    expect(legacy).toContain(
      '{h:"הוֹלֶכֶת",p:"holechet",e:"going / walking (f. pres.)",l:2,shoresh:"הלך",gram:"Feminine present — ת suffix"}',
    );
    expect(legacy).toContain('{h:"רוֹאָה",p:"ro\'a",e:"sees (f. pres.)",l:1}');
    expect(legacy).toContain(
      '{h:"מְדַבֵּר",p:"medaber",e:"speaking (m. pres.)",l:2,shoresh:"דבר"}',
    );

    const g7 = getGrammarDrillTopicById("g7");
    expect(g7?.items[1]?.opts[g7.items[1]!.ans]).toBe("הוֹלֶכֶת");
    expect(g7?.items[2]?.opts[g7.items[2]!.ans]).toBe("רוֹאָה");
    expect(g7?.items[3]?.opts[g7.items[3]!.ans]).toBe("מְדַבֵּר");
  });
});
