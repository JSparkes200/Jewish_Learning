"use client";

import { useCallback, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Hebrew } from "@/components/Hebrew";
import type { RabbiLevel } from "@/lib/rabbi-types";
import {
  RABBI_QUICK_FOLLOW_UPS,
  RABBI_STUDY_INVITE_EN,
  RABBI_STUDY_INVITE_HE,
} from "@/lib/rabbi-legacy-quicks";
import type { WordDetailEnrichment } from "@/lib/word-detail-enrichment";

/** Payload registered from drills and passed into the shell modal. */
export type RabbiAskPayload = {
  targetHe: string;
  learnerLevel: RabbiLevel;
  translit?: string;
  meaningEn?: string;
  ragContext?: string;
};

export type RabbiCardProps = RabbiAskPayload & {
  className?: string;
  /** Use tighter padding when nested inside another card */
  embedded?: boolean;
  /**
   * `inline` — expand/collapse in place (lesson cards).
   * `sheet` — used inside the app modal; fetches on open / when props change.
   */
  variant?: "inline" | "sheet";
};

type ApiOk = { markdown: string; retrieval: string };
type ApiErr = { error: string };

export function RabbiCard({
  targetHe,
  learnerLevel,
  translit,
  meaningEn,
  ragContext,
  className = "",
  embedded = false,
  variant = "inline",
}: RabbiCardProps) {
  const [open, setOpen] = useState(false);
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [retrieval, setRetrieval] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wordDetail, setWordDetail] = useState<WordDetailEnrichment | null>(
    null,
  );
  const [wordDetailUnauthorized, setWordDetailUnauthorized] = useState(false);
  const [followUpText, setFollowUpText] = useState("");
  const [needsOperator, setNeedsOperator] = useState(false);
  const [operatorCode, setOperatorCode] = useState("");
  const [unlockBusy, setUnlockBusy] = useState(false);

  const runAsk = useCallback(
    async (learnerQuestion?: string) => {
      setLoading(true);
      setError(null);
      setNeedsOperator(false);
      try {
        const res = await fetch("/api/rabbi", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            targetHe,
            level: learnerLevel,
            translit,
            meaningEn,
            ragContext,
            learnerQuestion: learnerQuestion?.trim() || undefined,
          }),
        });
        const data = (await res.json()) as ApiErr & {
          needsOperatorUnlock?: boolean;
        } & ApiOk;
        if (!res.ok) {
          if (res.status === 403 && data.needsOperatorUnlock) {
            setNeedsOperator(true);
            setError(
              data.error ?? "This deployment needs a one-time owner approval.",
            );
          } else {
            setError("error" in data ? data.error : "Request failed");
          }
          return;
        }
        if ("markdown" in data) {
          setMarkdown(data.markdown);
          setRetrieval(data.retrieval ?? null);
        }
        setOpen(true);
      } catch {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    },
    [targetHe, learnerLevel, translit, meaningEn, ragContext],
  );

  const submitOperatorUnlock = useCallback(async () => {
    setUnlockBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/operator/unlock", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: operatorCode }),
      });
      if (!res.ok) {
        const d = (await res.json().catch(() => ({}))) as { error?: string };
        setError(d.error ?? "Unlock failed");
        return;
      }
      setOperatorCode("");
      setNeedsOperator(false);
      void runAsk(undefined);
    } catch {
      setError("Network error");
    } finally {
      setUnlockBusy(false);
    }
  }, [operatorCode, runAsk]);

  useEffect(() => {
    if (variant !== "sheet") return;
    setMarkdown(null);
    setError(null);
    setOpen(false);
    setFollowUpText("");
    setNeedsOperator(false);
    setOperatorCode("");
    void runAsk(undefined);
  }, [variant, targetHe, learnerLevel, translit, meaningEn, ragContext, runAsk]);

  useEffect(() => {
    if (variant !== "sheet" || !targetHe.trim()) {
      setWordDetail(null);
      setWordDetailUnauthorized(false);
      return;
    }
    let cancelled = false;
    setWordDetail(null);
    setWordDetailUnauthorized(false);
    void (async () => {
      try {
        const res = await fetch(
          `/api/word-detail?he=${encodeURIComponent(targetHe.trim())}`,
        );
        if (res.status === 401) {
          if (!cancelled) {
            setWordDetail(null);
            setWordDetailUnauthorized(true);
          }
          return;
        }
        if (!res.ok) {
          if (!cancelled) {
            setWordDetail(null);
            setWordDetailUnauthorized(false);
          }
          return;
        }
        const data = (await res.json()) as WordDetailEnrichment;
        if (!cancelled) {
          setWordDetail(data);
          setWordDetailUnauthorized(false);
        }
      } catch {
        if (!cancelled) {
          setWordDetail(null);
          setWordDetailUnauthorized(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [variant, targetHe]);

  const pad = embedded ? "p-3.5" : "p-5";
  const isSheet = variant === "sheet";
  const showArticle = isSheet ? markdown != null : open && markdown != null;

  const shellClass = isSheet
    ? className.trim()
    : `rounded-3xl border-2 border-sage/20 bg-gradient-to-br from-parchment-card/95 to-parchment-deep/35 shadow-sm ${pad} ${className}`.trim();

  return (
    <div className={shellClass}>
      {isSheet ? (
        <>
          <p className="font-label text-[10px] uppercase tracking-[0.2em] text-sage">
            Ask the Rabbi
          </p>
          <Hebrew
            as="p"
            className="mt-2 text-right text-xl font-medium leading-relaxed text-ink"
          >
            {targetHe}
          </Hebrew>
          {meaningEn ? (
            <p className="mt-1 text-xs text-ink-muted">
              You&apos;re exploring: <span className="text-ink">{meaningEn}</span>
            </p>
          ) : null}
          <div className="mt-3 rounded-2xl border border-amber/25 bg-amber/5 px-3 py-2.5">
            <Hebrew
              as="p"
              className="text-center text-base font-medium leading-relaxed text-ink"
            >
              {RABBI_STUDY_INVITE_HE}
            </Hebrew>
            <p className="mt-1 text-center text-[11px] text-ink-muted">
              {RABBI_STUDY_INVITE_EN}
            </p>
          </div>
          {wordDetail?.rootFamily || wordDetail?.wikiExtract ? (
            <div className="mt-4 rounded-2xl border border-ink/10 bg-parchment-deep/35 p-3 text-left text-xs text-ink-muted">
              <p className="font-label text-[9px] uppercase tracking-[0.15em] text-sage">
                Dictionary context
              </p>
              {wordDetail.rootFamily ? (
                <p className="mt-2">
                  Root{" "}
                  <span className="font-hebrew text-ink">
                    {wordDetail.rootFamily.root}
                  </span>
                  {" — "}
                  {wordDetail.rootFamily.meaning}
                  {wordDetail.rootFamily.sentenceHe ? (
                    <>
                      <br />
                      <span className="font-hebrew text-sm text-ink">
                        {wordDetail.rootFamily.sentenceHe}
                      </span>
                    </>
                  ) : null}
                  {wordDetail.rootFamily.sentenceEn ? (
                    <>
                      <br />
                      <span className="text-ink-faint">
                        {wordDetail.rootFamily.sentenceEn}
                      </span>
                    </>
                  ) : null}
                </p>
              ) : null}
              {wordDetail.wikiExtract ? (
                <p
                  className={
                    wordDetail.rootFamily ? "mt-2 border-t border-ink/10 pt-2" : "mt-2"
                  }
                >
                  <span className="font-label text-[8px] uppercase tracking-wide text-ink-faint">
                    Hebrew Wikipedia
                    {wordDetail.wikiTitle ? ` · ${wordDetail.wikiTitle}` : ""}
                  </span>
                  <br />
                  {wordDetail.wikiExtract}
                </p>
              ) : null}
            </div>
          ) : null}
          {variant === "sheet" && wordDetailUnauthorized ? (
            <p className="mt-2 text-[11px] text-ink-faint">
              Sign in to load root-family notes and a short Hebrew Wikipedia intro
              for this headword.
            </p>
          ) : null}
        </>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-label text-[10px] uppercase tracking-[0.18em] text-sage">
            Ask the Rabbi
          </p>
          <button
            type="button"
            onClick={() => {
              if (!open && markdown == null && !loading) {
                void runAsk(undefined);
              } else {
                setOpen((v) => !v);
              }
            }}
            disabled={loading}
            aria-expanded={open}
            className="cursor-pointer rounded-2xl border-2 border-sage/25 bg-parchment-deep/40 px-4 py-2 font-label text-[10px] uppercase tracking-wide text-ink-muted shadow-sm transition hover:border-sage/45 hover:bg-parchment-deep/60 hover:text-ink hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 focus-visible:ring-offset-parchment-card disabled:cursor-wait disabled:opacity-60"
          >
            {loading ? "Thinking…" : open ? "Hide" : "Expand"}
          </button>
        </div>
      )}

      <p className="mt-2 text-xs text-ink-muted">
        These are language and culture notes — warm context, not halachic or
        theological rulings.
      </p>

      {isSheet && loading && !markdown ? (
        <div
          className="mt-5 space-y-2 rounded-2xl border border-sage/15 bg-parchment-deep/30 p-4"
          aria-busy="true"
        >
          <div className="h-3 w-[78%] animate-pulse rounded-full bg-parchment-deep/60" />
          <div className="h-3 w-full animate-pulse rounded-full bg-parchment-deep/50" />
          <div className="h-3 w-5/6 animate-pulse rounded-full bg-parchment-deep/50" />
          <p className="pt-1 text-[11px] text-ink-faint">
            Pulling notes that match your level and this headword…
          </p>
        </div>
      ) : null}

      {error ? (
        <p className="mt-3 text-sm text-rust" role="alert">
          {error}
        </p>
      ) : null}

      {needsOperator ? (
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end">
          <input
            type="password"
            value={operatorCode}
            onChange={(e) => setOperatorCode(e.target.value)}
            autoComplete="off"
            placeholder="Owner approval code"
            className="w-full max-w-sm rounded-lg border border-ink/15 bg-parchment-deep/30 px-3 py-2 text-sm text-ink placeholder:text-ink-faint"
          />
          <button
            type="button"
            disabled={unlockBusy || !operatorCode.trim()}
            onClick={() => void submitOperatorUnlock()}
            className="rounded-lg border border-amber/40 bg-amber/10 px-3 py-2 font-label text-[10px] uppercase tracking-wide text-ink hover:bg-amber/20 disabled:opacity-50"
          >
            {unlockBusy ? "…" : "Unlock"}
          </button>
        </div>
      ) : null}

      {showArticle && markdown ? (
        <div className="mt-4 border-t border-sage/20 pt-4">
          {retrieval ? (
            <p className="mb-3 font-label text-[9px] uppercase tracking-wide text-ink-faint">
              Retrieval: {retrieval}
            </p>
          ) : null}
          <article className="rabbi-md max-w-none font-hebrew text-ink" dir="auto">
            <ReactMarkdown
              components={{
                h2: ({ children }) => (
                  <h2 className="mt-6 border-b border-ink/10 pb-1 font-label text-[11px] uppercase tracking-[0.15em] text-sage first:mt-0">
                    {children}
                  </h2>
                ),
                p: ({ children }) => (
                  <p className="mt-2 text-sm leading-relaxed text-ink">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="mt-2 list-outside list-disc space-y-2 ps-6 text-sm marker:text-sage/80">
                    {children}
                  </ul>
                ),
                li: ({ children }) => <li className="leading-relaxed ps-1">{children}</li>,
                strong: ({ children }) => (
                  <strong className="font-medium text-ink">{children}</strong>
                ),
              }}
            >
              {markdown}
            </ReactMarkdown>
          </article>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => {
                setFollowUpText("");
                void runAsk(undefined);
              }}
              disabled={loading}
              className="cursor-pointer text-xs text-sage underline hover:text-sage/90 disabled:opacity-50"
            >
              Refresh overview
            </button>
          </div>
          <div className="mt-6 border-t border-sage/20 pt-4">
            <p className="font-label text-[9px] uppercase tracking-[0.15em] text-ink-muted">
              Ask in your own words
            </p>
            <p className="mt-1 text-[11px] text-ink-faint">
              Same quick prompts as the legacy study app — or type below and tap
              Guide me.
            </p>
            <textarea
              id="rabbi-follow-up"
              rows={3}
              value={followUpText}
              onChange={(e) => setFollowUpText(e.target.value)}
              placeholder="e.g. What is the root? Why is this form used? Give me another example."
              className="mt-2 w-full resize-y rounded-xl border border-ink/15 bg-parchment-deep/30 px-3 py-2 text-sm text-ink placeholder:text-ink-faint"
            />
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {RABBI_QUICK_FOLLOW_UPS.map((q) => (
                <button
                  key={q.label}
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    setFollowUpText(q.prompt);
                    void runAsk(q.prompt);
                  }}
                  className="rounded-xl border border-ink/12 bg-parchment-deep/40 px-2 py-2 font-label text-[8px] uppercase tracking-wide text-ink-muted transition hover:border-sage/35 hover:bg-sage/10 hover:text-ink disabled:opacity-50"
                >
                  {q.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              disabled={loading || !followUpText.trim()}
              onClick={() => void runAsk(followUpText)}
              className="btn-elevated-primary mt-3 w-full disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Teaching…" : "Guide me"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
