"use client";

import { SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Hebrew } from "@/components/Hebrew";

/**
 * Signed-out landing: parchment scroll unroll, שלום + Hebrew app title (RTL), auth CTAs.
 * Uses CSS grid 0fr→1fr for the unroll (clip-path is unreliable on some mobile browsers).
 */
export function WelcomeScrollHero() {
  const { isLoaded, isSignedIn } = useAuth();
  const [unrolled, setUnrolled] = useState(false);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setUnrolled(true);
      return;
    }
    const id = requestAnimationFrame(() => setUnrolled(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (isLoaded && isSignedIn) return null;

  return (
    <section
      className="mx-auto mb-8 max-w-md px-1"
      aria-labelledby="welcome-scroll-shalom"
    >
      <div className="relative">
        <div
          className="mx-auto h-2.5 max-w-[min(100%,20rem)] rounded-full bg-gradient-to-b from-amber-900/45 via-amber-950/55 to-amber-950/70 shadow-md ring-1 ring-ink/10"
          aria-hidden
        />
        <div
          className="grid overflow-hidden transition-[grid-template-rows] duration-[1150ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
          style={{ gridTemplateRows: unrolled ? "1fr" : "0fr" }}
        >
          <div className="min-h-0">
            <div
              className="relative -mt-px border-x-2 border-amber-900/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_8px_24px_rgba(44,36,22,0.12)] motion-reduce:opacity-100"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(120,90,60,0.06) 1px, transparent 0), linear-gradient(180deg,#faf6ec 0%,#ebe4d0 55%,#e5dcc6 100%)`,
                backgroundSize: "10px 10px, 100% 100%",
              }}
            >
              <div className="px-5 pb-7 pt-6 sm:px-7 sm:pb-8 sm:pt-7">
                <div className="text-center">
                  <Hebrew
                    as="p"
                    id="welcome-scroll-shalom"
                    className="welcome-shalom text-3xl font-medium text-ink sm:text-4xl"
                  >
                    שָׁלוֹם
                  </Hebrew>
                  <Hebrew
                    as="h1"
                    className="welcome-app-title mt-3 block text-xl leading-snug text-ink-muted sm:text-2xl"
                  >
                    עברית · ישיבה
                  </Hebrew>
                  <p className="mt-3 font-body text-xs leading-relaxed text-ink-faint">
                    A warm path through Hebrew — sign in to sync progress, or try
                    the Alef–Bet track as a guest.
                  </p>
                </div>

                <div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-3">
                  <SignInButton mode="modal">
                    <button
                      type="button"
                      className="btn-elevated-secondary w-full sm:w-auto sm:min-w-[8.5rem]"
                    >
                      Sign in
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button
                      type="button"
                      className="btn-elevated-rust w-full sm:w-auto sm:min-w-[8.5rem]"
                    >
                      Sign up
                    </button>
                  </SignUpButton>
                  <Link
                    href="/learn/alphabet"
                    className="btn-elevated-primary inline-flex w-full items-center justify-center sm:w-auto sm:min-w-[8.5rem]"
                  >
                    Continue as guest
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="mx-auto -mt-px h-2.5 max-w-[min(100%,20rem)] rounded-full bg-gradient-to-b from-amber-950/70 via-amber-950/55 to-amber-900/45 shadow-md ring-1 ring-ink/10"
          aria-hidden
        />
      </div>
    </section>
  );
}
