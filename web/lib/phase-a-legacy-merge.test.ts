import { describe, expect, it } from "vitest";
import { mergePhaseALegacyDump } from "@/lib/phase-a-legacy-merge";

describe("mergePhaseALegacyDump", () => {
  it("ports ivrit_saved when mode is port", () => {
    const r = mergePhaseALegacyDump({
      legacyDump: {
        ivrit_saved: [
          { h: "סֵפֶר", p: "sefer", e: "book" },
        ],
      },
      savedWords: "port",
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.stats.savedWordsPorted).toBe(1);
    const app = JSON.parse(r.appJson) as {
      schemaVersion: number;
      savedWords?: { he: string }[];
    };
    expect(app.schemaVersion).toBe(3);
    expect(app.savedWords?.some((w) => w.he === "סֵפֶר")).toBe(true);
  });

  it("drops ivrit_saved when mode is drop", () => {
    const r = mergePhaseALegacyDump({
      legacyDump: {
        ivrit_saved: [{ h: "סֵפֶר", p: "sefer", e: "book" }],
      },
      savedWords: "drop",
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.stats.savedWordsPorted).toBe(0);
    const app = JSON.parse(r.appJson) as { savedWords?: unknown };
    expect(app.savedWords).toBeUndefined();
  });

  it("detects openai key without emitting it", () => {
    const r = mergePhaseALegacyDump({
      legacyDump: {
        ivrit_openai_key: "secret-should-not-appear-in-output",
      },
      savedWords: "drop",
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.stats.legacyOpenaiKeyPresent).toBe(true);
    expect(r.appJson).not.toContain("secret-should-not-appear");
  });
});
