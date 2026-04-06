import { buildWordDetailEnrichment } from "@/lib/word-detail-enrichment";

/**
 * Async server component: use on server pages where `he` is known at render time
 * (e.g. static examples). Interactive flows use `GET /api/word-detail` from the client.
 */
export async function WordDetailEnrichmentServer({ he }: { he: string }) {
  const detail = await buildWordDetailEnrichment(he);
  return (
    <aside className="mt-4 rounded-2xl border border-sage/20 bg-parchment-deep/30 p-4 text-sm text-ink">
      <p className="font-label text-[9px] uppercase tracking-[0.18em] text-sage">
        Word context
      </p>
      {detail.rootFamily ? (
        <div className="mt-2 space-y-1">
          <p className="text-xs text-ink-muted">
            Root <span className="font-hebrew text-ink">{detail.rootFamily.root}</span>
            {" — "}
            {detail.rootFamily.meaning}
          </p>
          {detail.rootFamily.sentenceHe ? (
            <p className="font-hebrew text-right text-sm text-ink">
              {detail.rootFamily.sentenceHe}
            </p>
          ) : null}
          {detail.rootFamily.sentenceEn ? (
            <p className="text-xs text-ink-muted">{detail.rootFamily.sentenceEn}</p>
          ) : null}
        </div>
      ) : null}
      {detail.wikiExtract ? (
        <div className={detail.rootFamily ? "mt-3 border-t border-ink/10 pt-3" : "mt-2"}>
          <p className="font-label text-[9px] uppercase tracking-wide text-ink-faint">
            Hebrew Wikipedia{detail.wikiTitle ? ` — ${detail.wikiTitle}` : ""}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-ink-muted">
            {detail.wikiExtract}
          </p>
        </div>
      ) : null}
      {!detail.rootFamily && !detail.wikiExtract ? (
        <p className="mt-2 text-xs text-ink-faint">No extra context found for this form.</p>
      ) : null}
    </aside>
  );
}
