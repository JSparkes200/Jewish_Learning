import { describe, expect, it } from "vitest";
import {
  LANGUAGETOOL_HEBREW,
  NAKDIMON,
  YAP_HEBREW_PARSER,
} from "@/lib/hebrew-linguistic-sources";

const RUN_LT = process.env.RUN_LANGUAGETOOL_HE === "1";

/**
 * Optional live checks against public LanguageTool (rate-limited).
 * Enable: `RUN_LANGUAGETOOL_HE=1 npx vitest run data/hebrew-nlp-optional.integration.test.ts`
 *
 * YAP and Nakdimon are not invoked here: they need a Go server or Python env.
 * See `hebrew-linguistic-sources.ts` for links; wire `YAP_BASE_URL` in CI when available.
 */
describe.skipIf(!RUN_LT)("LanguageTool Hebrew (optional, network)", () => {
  it("returns JSON for a simple modern Hebrew sentence", async () => {
    const text = "אֲנִי הוֹלֵךְ לַשּׁוּק הַיּוֹם.";
    const body = new URLSearchParams();
    body.set("text", text);
    body.set("language", LANGUAGETOOL_HEBREW.languageCode);

    const res = await fetch(LANGUAGETOOL_HEBREW.publicApi, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    expect(res.ok, `LT HTTP ${res.status}`).toBe(true);
    const data = (await res.json()) as { matches?: unknown[] };
    expect(Array.isArray(data.matches)).toBe(true);
  });
});

describe("NLP tooling references (offline)", () => {
  it("documents YAP and Nakdimon entry points for future subprocess / server tests", () => {
    expect(YAP_HEBREW_PARSER.repos[0]).toContain("github.com");
    expect(NAKDIMON.repo).toContain("elazarg/nakdimon");
  });
});
