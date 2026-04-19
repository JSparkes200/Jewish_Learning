"use client";

import { SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Hebrew } from "@/components/Hebrew";

// ─── types ────────────────────────────────────────────────────────────────────

type Phase = "loading" | "error" | "cinematic" | "form";

type Props = {
  /**
   * Passed from `auth()` on the server so the overlay is completely absent on
   * the first paint when the user is already signed in.
   */
  serverSignedIn?: boolean;
};

// ─── animation config ─────────────────────────────────────────────────────────

/** Background pulls back from a tight crop toward full frame before the scroll unrolls. */
const ZOOM_DURATION = 5;

// ─── small presentational components ─────────────────────────────────────────

function LoadingBeam() {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center bg-black"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeOut" } }}
    >
      {/* Expanding light */}
      <motion.div
        className="relative rounded-full bg-white"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1, 100], opacity: [0, 1, 1] }}
        transition={{ duration: 1, times: [0, 0.7, 1], ease: "easeIn" }}
        style={{
          width: "20px",
          height: "20px",
          boxShadow:
            "0 0 60px 30px rgba(255,255,255,1), 0 0 150px 80px rgba(219,234,254,0.8)",
        }}
      />
      {/* Full screen whiteout at the end */}
      <motion.div
        className="absolute inset-0 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.6, ease: "easeIn" }}
      />
    </motion.div>
  );
}

function ErrorCard({ msg, onRetry }: { msg: string; onRetry: () => void }) {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55 }}
    >
      <div className="w-full max-w-sm rounded-2xl border border-red-900/35 bg-black/85 px-8 py-10 text-center shadow-2xl backdrop-blur-md">
        <Hebrew as="p" className="text-xl font-medium text-red-300">
          שגיאה בטעינת האפליקציה
        </Hebrew>
        <p className="mt-1 font-label text-[10px] uppercase tracking-widest text-red-400/60">
          Error Loading App
        </p>
        <p className="mt-5 font-body text-sm leading-relaxed text-white/55">
          {msg}
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-8 cursor-pointer rounded-xl border border-red-500/30 bg-red-950/40 px-7 py-2.5 font-label text-xs uppercase tracking-wider text-red-300 transition hover:bg-red-900/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500"
        >
          נסה שוב&ensp;/&ensp;Retry
        </button>
      </div>
    </motion.div>
  );
}

/**
 * Renders a grid of blocks that scale and fade in sequentially from top-left to bottom-right,
 * creating an "assembling in bits" wave effect for the login card background.
 */
function BitsBackground() {
  const rows = 12;
  const cols = 12;
  const bits = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Top-left start for a left-to-right wave
      const dist = r + c;
      bits.push(
        <motion.div
          key={`${r}-${c}`}
          initial={{ opacity: 0, scale: 0.2, borderRadius: "4px" }}
          animate={{ opacity: 1, scale: 1.05, borderRadius: "0px" }}
          transition={{
            delay: dist * 0.025,
            duration: 0.4,
            ease: "backOut",
          }}
          className="bg-parchment-card"
        />
      );
    }
  }

  return (
    <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 overflow-hidden rounded-2xl border border-amber-900/25 bg-white/5 shadow-elevated-lg backdrop-blur-md">
      {bits}
    </div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export function CinematicIntro({ serverSignedIn = false }: Props) {
  const { isLoaded, isSignedIn } = useAuth();

  const [phase, setPhase] = useState<Phase>("loading");
  const [errorMsg, setErrorMsg] = useState("");

  /** Guards against double-triggering the cinematic phase on re-render. */
  const revealTriggered = useRef(false);

  // ── retry / reset ──────────────────────────────────────────────────────────
  const retry = useCallback(() => {
    revealTriggered.current = false;
    setPhase("loading");
    setErrorMsg("");
  }, []);

  // ── 12 s hard timeout – Clerk never loaded ─────────────────────────────────
  useEffect(() => {
    if (phase !== "loading") return;
    let cancelled = false;
    const id = window.setTimeout(() => {
      if (cancelled) return;
      setPhase((cur) => (cur === "loading" ? "error" : cur));
      setErrorMsg(
        "The authentication service took too long to respond. Check your connection and try again.",
      );
    }, 12000);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [phase]);

  // ── Clerk ready → short pulse, then begin cinematic ───────────────────────
  useEffect(() => {
    if (phase !== "loading" || !isLoaded || revealTriggered.current) return;
    revealTriggered.current = true;
    const id = window.setTimeout(() => setPhase("cinematic"), 1000);
    return () => clearTimeout(id);
  }, [phase, isLoaded]);

  // ── already signed in ─────────────────────────────────────────────────────
  if (serverSignedIn || (isLoaded && isSignedIn)) return null;

  const inScene = phase === "cinematic" || phase === "form";

  return (
    <div
      className="fixed inset-0 overflow-hidden bg-black"
      style={{ zIndex: 300 }}
      aria-live="polite"
    >
      {/* ═══════════════════════════════════════════════════════════════════
          Phase 1 — Loading beam
      ═══════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {phase === "loading" && <LoadingBeam key="beam" />}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════════
          Phase 2a — Error card
      ═══════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {phase === "error" && (
          <ErrorCard key="err" msg={errorMsg} onRetry={retry} />
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════════
          Phases 2b–4 — Cinematic scene
      ═══════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {inScene && (
          <motion.div
            key="scene"
            className="absolute inset-0 flex h-full min-h-dvh w-full flex-col overflow-hidden"
          >
            {/* ── Zooming bimah background ───────────────────────────── */}
            <motion.div
              className="absolute inset-0 z-0"
              style={{ transformOrigin: "50% 36%" }}
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 1, scale: 1.15 }}
              transition={{
                scale: { duration: ZOOM_DURATION, ease: "easeOut" },
              }}
              onAnimationComplete={() => setPhase("form")}
            >
              <Image
                src="/bimah-scroll.png"
                alt="Torah scroll open on a bimah"
                fill
                className="object-cover"
                style={{ objectPosition: "50% 28%" }}
                priority
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.20) 36%, rgba(0,0,0,0.55) 100%)",
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse 78% 65% at 50% 38%, transparent 0%, rgba(0,0,0,0.42) 100%)",
                }}
              />
            </motion.div>

            {/* ── Login overlay after zoom completes ───────────────── */}
            <AnimatePresence>
              {phase === "form" && (
                <motion.div
                  key="login-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 px-4 py-8"
                >
                  <div className="relative w-full max-w-sm">
                    {/* The "assembling in bits" background layer */}
                    <BitsBackground />

                    {/* The form content (staggered fade-in) */}
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.55,
                        delay: 0.4, // Waits for the bits to partially assemble
                        ease: "easeOut",
                      }}
                      className="relative z-10 p-6 sm:p-8"
                    >
                      <div className="mb-6 text-center">
                        <Hebrew
                          as="p"
                          id="cinematic-shalom"
                          className="text-3xl font-medium text-ink sm:text-4xl"
                        >
                          שָׁלוֹם
                        </Hebrew>
                        <Hebrew
                          as="h1"
                          className="mt-2 block text-xl leading-snug text-ink-muted sm:text-2xl"
                        >
                          עברית · ישיבה
                        </Hebrew>
                        <p className="mt-2 font-body text-xs leading-relaxed text-ink-faint">
                          A guide towards Hebrew fluency
                        </p>
                      </div>

                      <div className="mt-8 flex flex-col gap-3">
                        <SignInButton mode="modal">
                          <button
                            type="button"
                            className="btn-elevated-secondary w-full cursor-pointer py-3"
                          >
                            Sign in
                          </button>
                        </SignInButton>
                        <SignUpButton mode="modal">
                          <button
                            type="button"
                            className="btn-elevated-rust w-full cursor-pointer py-3"
                          >
                            Sign up
                          </button>
                        </SignUpButton>
                        <div className="my-2 flex items-center gap-3">
                          <div className="h-px flex-1 bg-amber-900/20" />
                          <span className="font-label text-[9px] uppercase tracking-widest text-ink-faint/70">
                            or
                          </span>
                          <div className="h-px flex-1 bg-amber-900/20" />
                        </div>
                        <Link
                          href="/learn/alphabet"
                          className="btn-elevated-primary inline-flex w-full cursor-pointer items-center justify-center py-3"
                        >
                          Continue as guest
                        </Link>
                      </div>

                      <p className="mt-4 text-center font-body text-[10px] leading-relaxed text-ink-faint">
                        Sign in to sync progress across devices.
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
