import { describe, expect, it } from "vitest";

import {
  GRAMMAR_DRILLS,
  getGrammarDrillTopicById,
} from "@/data/grammar-drills";
import { looksLikeUnmetathesizedSibilantHitpael } from "@/lib/hebrew-hitpael-metathesis";

/**
 * Pedagogy-oriented checks on curated grammar drills (not a full Hebrew grammar validator).
 * Complements `hebrew-drill-quality.test.ts` (structural / Hebrew-letter invariants).
 */

describe("grammar corpus structure", () => {
  it("all topics have valid structure", () => {
    expect(GRAMMAR_DRILLS.length).toBeGreaterThan(0);

    for (const t of GRAMMAR_DRILLS) {
      expect(typeof t.id).toBe("string");
      expect(typeof t.topic).toBe("string");
      expect(typeof t.prompt).toBe("string");
      expect(Array.isArray(t.items)).toBe(true);

      for (const item of t.items) {
        expect(typeof item.h).toBe("string");
        expect(typeof item.cue).toBe("string");
        expect(typeof item.note).toBe("string");
        expect(Array.isArray(item.opts)).toBe(true);
        expect(typeof item.ans).toBe("number");
        expect(item.ans).toBeGreaterThanOrEqual(0);
        expect(item.ans).toBeLessThan(item.opts.length);
      }
    }
  });
});

describe("g11 — smikhut rules", () => {
  const g11 = getGrammarDrillTopicById("g11");

  it("includes the classic בית הספר vs *הבית ספר contrast", () => {
    const hasSchoolPhrase = g11?.items.some(
      (it) =>
        it.opts.some((o) => o.includes("בֵּית הַסֵּפֶר")) &&
        it.opts.some((o) => o.includes("הַבֵּית סֵפֶר")),
    );
    expect(hasSchoolPhrase).toBe(true);

    const schoolItem = g11?.items.find((it) =>
      it.opts.includes("בֵּית הַסֵּפֶר"),
    );
    expect(schoolItem?.opts[schoolItem.ans]).toBe("בֵּית הַסֵּפֶר");
  });

  it("never includes definite article on the first noun in any correct answer", () => {
    for (const it of g11?.items ?? []) {
      const correct = it.opts[it.ans];
      expect(correct.startsWith("הַ")).toBe(false);
    }
  });

  it("includes multi-word smikhut chains and marks them correctly", () => {
    const chain = g11?.items.find((it) =>
      it.opts.includes("בֵּית סֵפֶר הָעִיר"),
    );
    if (chain) {
      expect(chain.opts[chain.ans]).toBe("בֵּית סֵפֶר הָעִיר");
    }
  });
});

describe("g12 — definite object rules", () => {
  const g12 = getGrammarDrillTopicById("g12");

  it("marks proper nouns as definite objects requiring אֶת", () => {
    const dani = g12?.items.find((it) => it.h.includes("דָּנִי"));
    expect(dani?.opts[dani.ans]).toBe("אֶת");
  });

  it("when the drill marks a possessed noun (suffix), אֶת is still correct", () => {
    const item = g12?.items.find((it) => it.h.includes("סִפְרִי"));
    if (item) {
      expect(item.opts[item.ans]).toBe("אֶת");
    }
  });

  it("never uses אֶת when the blank is not before a definite object (heuristic)", () => {
    for (const it of g12?.items ?? []) {
      const correct = it.opts[it.ans];
      const objectLooksDefinite =
        /הַ|הָ/.test(it.h) || /דָּנִי|יִשְׂרָאֵל/.test(it.h);

      if (!objectLooksDefinite) {
        expect(correct).not.toBe("אֶת");
      }
    }
  });
});

describe("g14 — Hitpael metathesis (infinitive לְהִתְ + sibilant)", () => {
  const g14 = getGrammarDrillTopicById("g14");

  it("detects unmetathesized infinitives correctly", () => {
    expect(looksLikeUnmetathesizedSibilantHitpael("לְהִתְסַדֵּר")).toBe(true);
    expect(looksLikeUnmetathesizedSibilantHitpael("לְהִסְתַּדֵּר")).toBe(false);
  });

  it("includes correct vs incorrect metathesis options", () => {
    const met = g14?.items.find(
      (it) =>
        it.opts.includes("לְהִסְתַּדֵּר") &&
        it.opts.includes("לְהִתְסַדֵּר"),
    );
    expect(met?.opts[met.ans]).toBe("לְהִסְתַּדֵּר");
  });

  it("correct answers never use unmetathesized sibilant Hitpael spellings", () => {
    for (const it of g14?.items ?? []) {
      const correct = it.opts[it.ans];
      expect(
        looksLikeUnmetathesizedSibilantHitpael(correct),
        `unexpected wrong Hitpa'el spelling as correct: ${correct}`,
      ).toBe(false);
    }
  });
});

describe("cross-topic consistency", () => {
  it("no topic outside g14 contains unmetathesized Hitpael infinitives as correct answers", () => {
    const rest = GRAMMAR_DRILLS.filter((t) => t.id !== "g14");

    for (const t of rest) {
      for (const it of t.items) {
        const correct = it.opts[it.ans];
        expect(
          looksLikeUnmetathesizedSibilantHitpael(correct),
          `Unexpected unmetathesized Hitpael infinitive in topic ${t.id}: ${correct}`,
        ).toBe(false);
      }
    }
  });
});

describe("metathesis detector edge cases", () => {
  it("flags לְהִתְ + sibilant + … as unmetathesized", () => {
    for (const r1 of ["ס", "ש", "צ", "ז"] as const) {
      const wrong = `לְהִתְ${r1}ַדֵּר`;
      expect(looksLikeUnmetathesizedSibilantHitpael(wrong)).toBe(true);
    }
  });
});
