"use client";

import { SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Hebrew } from "@/components/Hebrew";

const SCROLL_PANEL_STYLE = {
  backgroundImage: `radial-gradient(circle at 1px 1px, rgba(120,90,60,0.06) 1px, transparent 0), linear-gradient(180deg,#faf6ec 0%,#ebe4d0 55%,#e5dcc6 100%)`,
  backgroundSize: "10px 10px, 100% 100%",
} as const;

type Props = {
  /** Set from `auth()` in `page.tsx` so the welcome is omitted on first paint when already signed in. */
  serverSignedIn?: boolean;
  /** `landing` fills the first screen and plays an unroll animation; `inline` is the compact home card. */
  variant?: "inline" | "landing";
};

function ScrollBody() {
  return (
    <div className="px-5 pb-7 pt-6 sm:px-7 sm:pb-8 sm:pt-7">
      <div className="text-center">
        <Hebrew
          as="p"
          id="welcome-scroll-shalom"
          className="text-3xl font-medium text-ink sm:text-4xl"
        >
          שָׁלוֹם
        </Hebrew>
        <Hebrew
          as="h1"
          className="mt-3 block text-xl leading-snug text-ink-muted sm:text-2xl"
        >
          עברית · ישיבה
        </Hebrew>
        <p className="mt-3 font-body text-xs leading-relaxed text-ink-faint">
          A guide towards Hebrew fluency — sign in to sync progress, or try the
          Alef–Bet track as a guest.
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
  );
}

/**
 * Signed-out landing: parchment scroll, שלום + Hebrew app title (RTL), auth CTAs.
 * Content is always visible in the DOM (no collapsed grid / opacity-0 animations that can stick hidden).
 */
export function WelcomeScrollHero({
  serverSignedIn = false,
  variant = "inline",
}: Props) {
  const { isLoaded, isSignedIn } = useAuth();

  if (serverSignedIn || (isLoaded && isSignedIn)) return null;

  const topRoll = (
    <div
      className="mx-auto h-2.5 max-w-[min(100%,20rem)] rounded-full bg-gradient-to-b from-ink/40 via-ink-muted/50 to-ink-muted/65 shadow-md ring-1 ring-ink/10"
      aria-hidden
    />
  );

  const parchmentAndBottomRoll = (
    <>
      <div
        className="relative -mt-px border-x-2 border-ink/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_8px_24px_rgba(44,36,22,0.12)]"
        style={SCROLL_PANEL_STYLE}
      >
        <ScrollBody />
      </div>
      <div
        className="mx-auto -mt-px h-2.5 max-w-[min(100%,20rem)] rounded-full bg-gradient-to-b from-ink-muted/65 via-ink-muted/50 to-ink/40 shadow-md ring-1 ring-ink/10"
        aria-hidden
      />
    </>
  );

  if (variant === "landing") {
    return (
      <section
        className="welcome-scroll-root welcome-scroll-root--landing text-ink"
        aria-labelledby="welcome-scroll-shalom"
      >
        <div className="flex min-h-dvh w-full flex-col">
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 pb-6 pt-[max(0.5rem,env(safe-area-inset-top,0px))]">
            <div className="w-full max-w-lg px-1">
              <div className="relative">
                {topRoll}
                <div className="welcome-scroll-unroll will-change-[clip-path]">
                  {parchmentAndBottomRoll}
                </div>
              </div>
            </div>
          </div>
          <p className="pb-[max(1rem,env(safe-area-inset-bottom,0px))] text-center font-body text-[10px] text-ink-faint/90">
            Scroll for courses, parsha, and progress
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="welcome-scroll-root welcome-scroll-root--inline mx-auto mb-8 max-w-md px-1"
      aria-labelledby="welcome-scroll-shalom"
    >
      <div className="relative">
        {topRoll}
        {parchmentAndBottomRoll}
      </div>
    </section>
  );
}
