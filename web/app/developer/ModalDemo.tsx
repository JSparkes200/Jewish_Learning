"use client";

import { useAppShell } from "@/components/AppShell";

/** Sanity check for shell modal + Next up API (remove when real dev tools land). */
export function ModalDemo() {
  const { openModal, closeModal, setNextUp } = useAppShell();

  return (
    <div className="mt-8 rounded-xl border border-ink/12 bg-parchment-card/80 p-4">
      <h3 className="font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
        Shell API (dev)
      </h3>
      <p className="mt-2 text-xs text-ink-muted">
        Opens the shared modal layer from <code className="text-[11px]">AppShell</code>.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-lg border border-ink/15 bg-parchment px-3 py-2 font-label text-[10px] uppercase tracking-wide text-ink transition hover:bg-parchment-deep"
          onClick={() =>
            openModal(
              <div className="text-sm text-ink-muted">
                <p className="mb-2 font-medium text-ink">Sample modal</p>
                <p>
                  Course modals, Library, and Ask the Rabbi will render here
                  during migration.
                </p>
                <button
                  type="button"
                  className="mt-4 rounded-lg bg-sage px-4 py-2 font-label text-[10px] uppercase tracking-wide text-white"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>,
            )
          }
        >
          Open sample modal
        </button>
        <button
          type="button"
          className="rounded-lg border border-ink/15 bg-parchment px-3 py-2 font-label text-[10px] uppercase tracking-wide text-ink transition hover:bg-parchment-deep"
          onClick={() =>
            setNextUp({
              label: "Try Study — review queue",
              href: "/study",
              icon: "🔁",
            })
          }
        >
          Set Next up → Study
        </button>
        <button
          type="button"
          className="rounded-lg border border-ink/15 bg-parchment px-3 py-2 font-label text-[10px] uppercase tracking-wide text-ink transition hover:bg-parchment-deep"
          onClick={() =>
            setNextUp({
              label: "Continue in Learn — course & levels",
              href: "/learn",
              icon: "📚",
            })
          }
        >
          Reset Next up → Learn
        </button>
      </div>
    </div>
  );
}
