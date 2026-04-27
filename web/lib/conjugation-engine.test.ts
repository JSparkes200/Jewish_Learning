import { describe, expect, it } from "vitest";
import {
  buildConjugationMcqChoices,
  conjugationAnswerMatches,
  conjugationBareKey,
  validateConjugationAnswer,
  CONJUGATION_PUZZLES,
} from "@/lib/conjugation-engine";

describe("conjugationAnswerMatches", () => {
  it("accepts exact nikkud match", () => {
    expect(conjugationAnswerMatches("לִכְתֹּב", ["לִכְתֹּב"])).toBe(true);
  });

  it("accepts unvowelled typing against vowelled expected (ktiv haser)", () => {
    expect(conjugationAnswerMatches("לכתב", ["לִכְתֹּב"])).toBe(true);
  });
});

describe("validateConjugationAnswer", () => {
  it("grades hitpaél infinitive for כתב", () => {
    const p = CONJUGATION_PUZZLES.find((x) => x.id === "ktb-hitpaal-inf")!;
    expect(validateConjugationAnswer("לְהִתְכַּתֵּב", p)).toBe(true);
    expect(validateConjugationAnswer("להתכתב", p)).toBe(true);
    expect(validateConjugationAnswer("לכתוב", p)).toBe(false);
  });
});

describe("buildConjugationMcqChoices", () => {
  it("returns four surfaces with one correct index", () => {
    const p = CONJUGATION_PUZZLES.find((x) => x.id === "ktb-paal-inf")!;
    const { choices, correctIndex } = buildConjugationMcqChoices(p, 4, () => 0.42);
    expect(choices).toHaveLength(4);
    const bare = new Set(choices.map((c) => conjugationBareKey(c)));
    expect(bare.size).toBe(4);
    expect(validateConjugationAnswer(choices[correctIndex]!, p)).toBe(true);
  });
});
