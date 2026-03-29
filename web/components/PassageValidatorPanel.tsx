"use client";

import { useMemo, useState } from "react";
import { Hebrew } from "@/components/Hebrew";
import {
  HEBREW_PASSAGE_REGISTERS,
  REGISTER_PROMPT_HINTS,
  buildLLMAuthoringPrompt,
  formatValidationReport,
  suggestRegisterFromSourceNote,
  validatePassageAgainstCorpusD,
  validatePassageAgainstCorpusLevel,
  type HebrewPassageRegister,
  type LLMAuthoringPromptOptions,
  type PassageCorpusLevelValidation,
} from "@/lib/hebrew-passage-pipeline";

function registerLabel(r: HebrewPassageRegister): string {
  return REGISTER_PROMPT_HINTS[r].label;
}

type LlmRegisterChoice = "auto" | HebrewPassageRegister;
type LengthChoice = "" | NonNullable<LLMAuthoringPromptOptions["passageLength"]>;

export function PassageValidatorPanel() {
  const [text, setText] = useState(
    "בַּשָּׁבוּעַ הָרִאשׁוֹן נֹעַם לֹא הִרְגִּישׁ בַּיִת.",
  );
  const [sourceNote, setSourceNote] = useState("News-style classroom excerpt");
  const [maxLevel, setMaxLevel] = useState<string>("");
  const [llmRegister, setLlmRegister] = useState<LlmRegisterChoice>("auto");
  const [passageLength, setPassageLength] = useState<LengthChoice>("");
  const [promptCopied, setPromptCopied] = useState(false);

  const levelNum = maxLevel.trim() === "" ? null : Number(maxLevel);
  const levelOk =
    levelNum != null && Number.isInteger(levelNum) && levelNum >= 1 && levelNum <= 4;

  const result = useMemo(() => {
    const t = text.trim();
    if (!t) return null;
    if (levelOk && levelNum != null) {
      return validatePassageAgainstCorpusLevel(t, levelNum);
    }
    return validatePassageAgainstCorpusD(t);
  }, [text, levelOk, levelNum]);

  const levelResult = useMemo((): PassageCorpusLevelValidation | null => {
    if (!result || !("outOfLevelForms" in result)) return null;
    return result as PassageCorpusLevelValidation;
  }, [result]);

  const suggestedRegister = useMemo(
    () => suggestRegisterFromSourceNote(sourceNote),
    [sourceNote],
  );

  const effectiveLlmRegister = useMemo(
    (): HebrewPassageRegister =>
      llmRegister === "auto" ? suggestedRegister : llmRegister,
    [llmRegister, suggestedRegister],
  );

  const llmPromptText = useMemo(() => {
    const opts: LLMAuthoringPromptOptions = {
      sourceNote,
      ...(levelOk && levelNum != null ? { maxCorpusLevel: levelNum } : {}),
      ...(passageLength ? { passageLength } : {}),
    };
    return buildLLMAuthoringPrompt(effectiveLlmRegister, opts);
  }, [sourceNote, levelOk, levelNum, passageLength, effectiveLlmRegister]);

  const reportText = useMemo(() => {
    if (!result) return "";
    if ("outOfLevelForms" in result) {
      const v = result as PassageCorpusLevelValidation;
      const base = formatValidationReport(
        v,
        `Corpus overlap (level ≤ ${maxLevel.trim()})`,
      );
      const extra =
        v.outOfLevelForms.length > 0
          ? `\n  Above-level forms (${v.outOfLevelForms.length}): ${v.outOfLevelForms.slice(0, 60).join(", ")}${v.outOfLevelForms.length > 60 ? " …" : ""}`
          : "";
      return base + extra;
    }
    return formatValidationReport(result);
  }, [result, maxLevel]);

  const [copied, setCopied] = useState(false);

  const copyLlmPrompt = async () => {
    try {
      await navigator.clipboard.writeText(llmPromptText);
      setPromptCopied(true);
      window.setTimeout(() => setPromptCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const copyReport = async () => {
    if (!reportText) return;
    try {
      await navigator.clipboard.writeText(reportText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const pct =
    result == null
      ? null
      : Math.round(result.knownFormRatio * 1000) / 10;

  return (
    <div className="rounded-xl border border-ink/12 border-t-sage/20 bg-parchment-card/80 p-4">
      <h3 className="font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
        Hebrew passage pipeline (authoring)
      </h3>
      <p className="mt-2 text-xs text-ink-muted">
        <code className="rounded bg-parchment-deep/50 px-1 text-[11px]">
          lib/hebrew-passage-pipeline.ts
        </code>{" "}
        — overlap with dictionary headwords. CLI from{" "}
        <code className="rounded bg-parchment-deep/50 px-1 text-[11px]">web/</code>:{" "}
        <code className="rounded bg-parchment-deep/50 px-1 text-[11px]">
          npm run validate:hebrew-passage
        </code>
        . Python + Stanza:{" "}
        <code className="rounded bg-parchment-deep/50 px-1 text-[11px]">
          tools/hebrew-content-pipeline/
        </code>
        . Headless validation:{" "}
        <code className="rounded bg-parchment-deep/50 px-1 text-[11px]">
          POST /api/validate-hebrew-passage
        </code>
        .
      </p>

      <div className="mt-4 space-y-3">
        <label className="block text-[11px] text-ink-muted">
          <span className="font-label text-[10px] uppercase tracking-wide text-ink">
            Hebrew passage
          </span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            dir="rtl"
            className="mt-1 w-full rounded-lg border border-ink/15 bg-parchment-deep/30 px-3 py-2 font-hebrew text-base text-ink placeholder:text-ink-faint"
            spellCheck={false}
          />
        </label>

        <div className="flex flex-wrap items-end gap-3">
          <label className="text-[11px] text-ink-muted">
            <span className="font-label text-[10px] uppercase tracking-wide text-ink">
              Max corpus level (optional)
            </span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="1–4, empty = all levels"
              value={maxLevel}
              onChange={(e) => setMaxLevel(e.target.value)}
              className="ml-2 w-40 rounded border border-ink/15 bg-parchment-deep/30 px-2 py-1 font-mono text-xs"
            />
            {maxLevel.trim() !== "" && !levelOk ? (
              <span className="ml-2 text-rust">Use 1–4 or leave empty.</span>
            ) : null}
          </label>
        </div>

        <label className="block text-[11px] text-ink-muted">
          <span className="font-label text-[10px] uppercase tracking-wide text-ink">
            Source note (register hint)
          </span>
          <input
            type="text"
            value={sourceNote}
            onChange={(e) => setSourceNote(e.target.value)}
            className="mt-1 w-full rounded border border-ink/15 bg-parchment-deep/30 px-2 py-1 text-xs"
          />
          <span className="mt-1 block text-ink-faint">
            Suggested register:{" "}
            <span className="text-ink">{registerLabel(suggestedRegister)}</span> (
            {suggestedRegister})
          </span>
        </label>
      </div>

      <details className="mt-4 rounded-lg border border-ink/10 bg-parchment-deep/20 p-3">
        <summary className="cursor-pointer font-label text-[10px] uppercase tracking-[0.18em] text-ink">
          LLM authoring prompt (copy into your assistant)
        </summary>
        <div className="mt-3 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-[11px] text-ink-muted">
              Register
              <select
                value={llmRegister}
                onChange={(e) =>
                  setLlmRegister(e.target.value as LlmRegisterChoice)
                }
                className="ml-2 rounded border border-ink/15 bg-parchment-deep/40 px-2 py-1 text-xs"
              >
                <option value="auto">
                  Auto ({registerLabel(suggestedRegister)})
                </option>
                {HEBREW_PASSAGE_REGISTERS.map((r) => (
                  <option key={r} value={r}>
                    {REGISTER_PROMPT_HINTS[r].label}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-[11px] text-ink-muted">
              Length
              <select
                value={passageLength}
                onChange={(e) =>
                  setPassageLength(e.target.value as LengthChoice)
                }
                className="ml-2 rounded border border-ink/15 bg-parchment-deep/40 px-2 py-1 text-xs"
              >
                <option value="">(no length line)</option>
                <option value="paragraph">Short paragraph</option>
                <option value="short_multi">Two paragraphs / medium</option>
                <option value="long">Long reading</option>
              </select>
            </label>
            <button
              type="button"
              onClick={() => void copyLlmPrompt()}
              className="font-label text-[10px] uppercase tracking-wide text-sage underline"
            >
              {promptCopied ? "Copied" : "Copy prompt"}
            </button>
          </div>
          <p className="text-[10px] text-ink-faint">
            Effective register: {registerLabel(effectiveLlmRegister)} — includes
            optional level cap and source note above when set.
          </p>
          <textarea
            readOnly
            value={llmPromptText}
            rows={14}
            dir="ltr"
            className="w-full rounded-lg border border-ink/10 bg-parchment-deep/40 p-2 font-mono text-[10px] leading-relaxed text-ink"
            spellCheck={false}
          />
        </div>
      </details>

      {result ? (
        <div className="mt-4 rounded-lg border border-ink/10 bg-parchment-deep/25 p-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-label text-[10px] uppercase tracking-wide text-sage">
              Analysis
            </p>
            <button
              type="button"
              onClick={() => void copyReport()}
              className="font-label text-[10px] uppercase tracking-wide text-sage underline"
            >
              {copied ? "Copied" : "Copy report"}
            </button>
          </div>
          <p className="mt-2 font-mono text-[11px] leading-relaxed text-ink">
            Tokens: {result.tokenCount}
            {pct != null ? (
              <>
                {" "}
                · Known headword overlap:{" "}
                <span className="tabular-nums text-sage">{pct}%</span>
              </>
            ) : null}
          </p>
          {levelResult && levelResult.outOfLevelForms.length > 0 ? (
            <p className="mt-2 text-[11px] text-ink-muted">
              Above level ({levelResult.outOfLevelForms.length}):{" "}
              <span className="font-hebrew text-ink" dir="rtl">
                {levelResult.outOfLevelForms.slice(0, 24).join(" · ")}
                {levelResult.outOfLevelForms.length > 24 ? " …" : ""}
              </span>
            </p>
          ) : null}
          {result.unknownForms.length > 0 ? (
            <div className="mt-2">
              <p className="text-[10px] text-ink-muted">
                Unknown in corpus ({result.unknownForms.length}) — may include
                names, inflections, or neologisms:
              </p>
              <p className="mt-1 text-sm leading-relaxed text-ink">
                <Hebrew>
                  {result.unknownForms.slice(0, 48).join(" ")}
                  {result.unknownForms.length > 48 ? " …" : ""}
                </Hebrew>
              </p>
            </div>
          ) : (
            <p className="mt-2 text-[11px] text-sage">
              No unknown headword forms (normalized) in this sample.
            </p>
          )}
          <pre className="mt-3 max-h-36 overflow-auto whitespace-pre-wrap rounded border border-ink/10 bg-parchment-deep/40 p-2 font-mono text-[10px] text-ink-muted">
            {reportText}
          </pre>
        </div>
      ) : (
        <p className="mt-4 text-xs text-ink-faint">Enter Hebrew text to analyze.</p>
      )}
    </div>
  );
}
