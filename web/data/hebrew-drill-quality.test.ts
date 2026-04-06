import { describe, expect, it } from "vitest";
import { GRAMMAR_DRILLS } from "@/data/grammar-drills";
import {
  HEBREW_APP_GRAMMAR_CURRICULUM,
  IAHLT_UD_HEBREW,
} from "@/lib/hebrew-linguistic-sources";
import { validateGrammarDrillTopic } from "@/lib/hebrew-drill-validation";

describe("grammar drill structural quality (IAHLT-style plausibility gate)", () => {
  it("every GRAMMAR_DRILLS topic passes Hebrew + MCQ invariants", () => {
    const all = GRAMMAR_DRILLS.flatMap((t) => validateGrammarDrillTopic(t));
    expect(all, all.join("\n")).toEqual([]);
  });

  it("intermediate curriculum ids exist in GRAMMAR_DRILLS", () => {
    const ids = new Set(GRAMMAR_DRILLS.map((t) => t.id));
    for (const id of HEBREW_APP_GRAMMAR_CURRICULUM.beginnerGrammarIds) {
      expect(ids.has(id), `missing beginner ${id}`).toBe(true);
    }
    for (const id of HEBREW_APP_GRAMMAR_CURRICULUM.intermediateGrammarIds) {
      expect(ids.has(id), `missing intermediate ${id}`).toBe(true);
    }
    for (const id of HEBREW_APP_GRAMMAR_CURRICULUM.bridgeToAdvancedGrammarIds) {
      expect(ids.has(id), `missing bridge ${id}`).toBe(true);
    }
    for (const id of HEBREW_APP_GRAMMAR_CURRICULUM.advancedFluentGrammarIds) {
      expect(ids.has(id), `missing advanced/fluent ${id}`).toBe(true);
    }
  });

  it("IAHLT UD reference stays documented for treebank-driven QA", () => {
    expect(IAHLT_UD_HEBREW.repo).toMatch(/^https:\/\/github\.com\/IAHLT\/UD_Hebrew$/);
    expect(IAHLT_UD_HEBREW.wikiTrack).toContain("UD_Hebrew-IAHLT");
  });
});
