import Link from "next/link";
import { Hebrew } from "@/components/Hebrew";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <p className="font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
        404
      </p>
      <Hebrew as="h1" className="mt-2 block text-2xl text-ink">
        לֹא נִמְצָא
      </Hebrew>
      <p className="mt-3 text-sm text-ink-muted">
        That page is not in this app yet, or the link is wrong.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/"
          className="rounded-xl bg-sage px-5 py-3 font-label text-[10px] uppercase tracking-wide text-white hover:brightness-110"
        >
          Home
        </Link>
        <Link
          href="/learn"
          className="rounded-xl border border-ink/15 px-5 py-3 font-label text-[10px] uppercase tracking-wide text-ink-muted hover:bg-parchment-deep/40"
        >
          Learn
        </Link>
      </div>
    </div>
  );
}
