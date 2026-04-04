import Link from "next/link";

const PREVIEW_LINKS = [
  { href: "/", label: "Home" },
  { href: "/learn", label: "Learn" },
  { href: "/reading", label: "Reading" },
  { href: "/study", label: "Study" },
  { href: "/library", label: "Library" },
  { href: "/progress", label: "Progress" },
] as const;

/**
 * Parity notes for hebrew-v8.2.html Developer tabs that are not fully ported here.
 */
export function DeveloperLegacyHtmlTools() {
  return (
    <div className="rounded-xl border border-ink/12 border-t-amber/20 bg-parchment-card/80 p-4">
      <h3 className="font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
        Legacy HTML developer tools
      </h3>
      <div className="mt-3 space-y-3 text-xs text-ink-muted">
        <p>
          <strong className="text-ink">Rabbi / pose lab</strong> — The single-file app&apos;s Developer tab
          includes image and GIF tooling for poses. This Next app does not ship that pipeline (product
          choice: no in-app Rabbi GIFs). For pose export or batch work, use{" "}
          <code className="rounded bg-parchment-deep/50 px-1 text-[11px]">hebrew-v8.2.html</code> in your
          environment, or treat poses as external assets.
        </p>
        <p>
          <strong className="text-ink">Design preview</strong> — The HTML &ldquo;window preview&rdquo; was a
          magnified mock of learner chrome. Here, use real routes for visual QA:
        </p>
        <ul className="flex flex-wrap gap-2">
          {PREVIEW_LINKS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="inline-block rounded-lg border border-ink/12 bg-parchment-deep/40 px-3 py-1.5 font-label text-[10px] uppercase tracking-wide text-sage no-underline transition hover:border-sage/35 hover:bg-sage/10"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
