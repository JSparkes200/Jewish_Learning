import { describe, expect, it } from "vitest";
import { getGrammarParityLegacyFixtureText } from "@/lib/grammar-legacy-corpus-fixture";
import {
  getGrammarDrillTopicById,
  type GrammarDrillTopic,
} from "@/data/grammar-drills";
import { EXPECTED_GRAMMAR_G10_LEGACY_ALIGNED } from "@/data/grammar-g10-legacy-expected";

function topicEquals(a: GrammarDrillTopic, b: GrammarDrillTopic): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

describe("grammar g10 vs legacy plural adjective rows", () => {
  it("matches the frozen legacy-aligned fixture", () => {
    const g10 = getGrammarDrillTopicById("g10");
    expect(g10).toBeDefined();
    expect(topicEquals(g10!, EXPECTED_GRAMMAR_G10_LEGACY_ALIGNED)).toBe(true);
  });

  it("anchors גְּדוֹלִים / גְּדוֹלוֹת agreement notes in legacy corpus D", () => {
    const legacy = getGrammarParityLegacyFixtureText();
    expect(legacy).toContain(
      `{h:"גְּדוֹלִים",p:"gdolim",e:"big (m. pl.)",l:2,gram:"Masculine plural adjective — ים suffix"}`,
    );
    expect(legacy).toContain(
      `{h:"גְּדוֹלוֹת",p:"gdolot",e:"big (f. pl.)",l:2,gram:"Feminine plural adjective — וֹת suffix"}`,
    );
    expect(legacy).toContain(
      `{h:"חֲדָשִׁים",p:"chadashim",e:"new (m. pl.)",l:2},{h:"חֲדָשׁוֹת",p:"chadashot",e:"new (f. pl.)",l:2}`,
    );

    const g10 = getGrammarDrillTopicById("g10");
    expect(g10?.items[0]?.opts[g10.items[0]!.ans]).toBe("גְּדוֹלִים");
    expect(g10?.items[1]?.opts[g10.items[1]!.ans]).toBe("יָפוֹת");
    expect(g10?.items[2]?.opts[g10.items[2]!.ans]).toBe("חֲדָשִׁים");
    expect(g10?.items[3]?.opts[g10.items[3]!.ans]).toBe("טוֹבוֹת");
  });
});
