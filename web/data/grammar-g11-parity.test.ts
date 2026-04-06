import { describe, expect, it } from "vitest";
import { getGrammarParityLegacyFixtureText } from "@/lib/grammar-legacy-corpus-fixture";
import {
  getGrammarDrillTopicById,
  type GrammarDrillTopic,
} from "@/data/grammar-drills";
import { EXPECTED_GRAMMAR_G11_LEGACY_ALIGNED } from "@/data/grammar-g11-legacy-expected";

function topicEquals(a: GrammarDrillTopic, b: GrammarDrillTopic): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

describe("grammar g11 vs legacy smichut compounds", () => {
  it("matches the frozen legacy-aligned fixture", () => {
    const g11 = getGrammarDrillTopicById("g11");
    expect(g11).toBeDefined();
    expect(topicEquals(g11!, EXPECTED_GRAMMAR_G11_LEGACY_ALIGNED)).toBe(true);
  });

  it("anchors בֵּית סֵפֶר, בֵּית קָפֶה, חֲנוּת מִכּוֹלֶת, תַּחֲנַת מִשְׁטָרָה", () => {
    const legacy = getGrammarParityLegacyFixtureText();
    expect(legacy).toContain(
      `{h:"בֵּית סֵפֶר",p:"beit sefer",e:"school",l:1}`,
    );
    expect(legacy).toContain(
      `{h:"בֵּית קָפֶה",p:"beit kafe",e:"café",l:1}`,
    );
    expect(legacy).toContain(
      `{h:"חֲנוּת מִכּוֹלֶת",p:"chanut micholet",e:"grocery store",l:1}`,
    );
    expect(legacy).toContain(
      `{h:"תַּחֲנַת מִשְׁטָרָה",p:"tachanat mishtara",e:"police station",l:1}`,
    );
    expect(legacy).toContain(
      `{h:"נִסְמָךְ",p:"nismach",e:"construct (smichut)",l:1}`,
    );
    expect(legacy).toContain(
      `{h:"סְמִיכוּת",p:"smichut",e:"construct state",l:1}`,
    );

    const g11 = getGrammarDrillTopicById("g11");
    expect(g11?.items[0]?.opts[g11.items[0]!.ans]).toBe("בֵּית הַסֵּפֶר");
    expect(g11?.items[1]?.opts[g11.items[1]!.ans]).toBe("סֵפֶר");
    expect(g11?.items[2]?.opts[g11.items[2]!.ans]).toBe("קָפֶה");
    expect(g11?.items[3]?.opts[g11.items[3]!.ans]).toBe("מִכּוֹלֶת");
    expect(g11?.items[4]?.opts[g11.items[4]!.ans]).toBe("מִשְׁטָרָה");
  });
});
