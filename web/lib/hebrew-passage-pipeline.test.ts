import { describe, expect, it } from "vitest";
import {
  normalizeHebrewToken,
  tokenizeHebrewWords,
  validatePassageAgainstCorpusD,
} from "@/lib/hebrew-passage-pipeline";

describe("hebrew-passage-pipeline", () => {
  it("tokenizeHebrewWords extracts script spans", () => {
    expect(tokenizeHebrewWords("שלום, עולם.")).toEqual(["שלום", "עולם"]);
  });

  it("normalizeHebrewToken strips nikkud", () => {
    expect(normalizeHebrewToken("שָׁלוֹם")).toBe("שלום");
  });

  it("validatePassageAgainstCorpusD returns metrics", () => {
    const v = validatePassageAgainstCorpusD("שלום");
    expect(v.tokenCount).toBeGreaterThanOrEqual(1);
    expect(typeof v.knownFormRatio).toBe("number");
    expect(Array.isArray(v.unknownForms)).toBe(true);
  });
});
