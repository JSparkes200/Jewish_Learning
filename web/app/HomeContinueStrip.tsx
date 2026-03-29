"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getNextLearnUp } from "@/lib/learn-next-up";
import {
  LEARN_PROGRESS_EVENT,
  loadLearnProgress,
} from "@/lib/learn-progress";
import {
  YIDDISH_PROGRESS_EVENT,
  loadYiddishProgress,
} from "@/lib/yiddish-progress";

export function HomeContinueStrip() {
  const [tip, setTip] = useState({ label: "Continue in Learn", href: "/learn" });

  useEffect(() => {
    const sync = () => {
      setTip(
        getNextLearnUp(loadLearnProgress(), {
          yiddishProgress: loadYiddishProgress(),
        }),
      );
    };
    sync();
    window.addEventListener(LEARN_PROGRESS_EVENT, sync);
    window.addEventListener(YIDDISH_PROGRESS_EVENT, sync);
    return () => {
      window.removeEventListener(LEARN_PROGRESS_EVENT, sync);
      window.removeEventListener(YIDDISH_PROGRESS_EVENT, sync);
    };
  }, []);

  return (
    <section className="mb-8 rounded-2xl border border-sage/25 bg-sage/5 px-4 py-4 text-center shadow-sm">
      <p className="font-label text-[9px] uppercase tracking-[0.2em] text-sage">
        Pick up where you left off
      </p>
      <Link
        href={tip.href}
        className="mt-2 inline-block text-sm font-medium text-ink underline decoration-sage/50 decoration-2 underline-offset-2 hover:decoration-sage"
      >
        {tip.label} →
      </Link>
    </section>
  );
}
