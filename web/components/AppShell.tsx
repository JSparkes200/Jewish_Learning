"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { RabbiAskPayload } from "@/components/RabbiCard";
import { RabbiAskModalBody } from "@/components/RabbiAskModalBody";
import { RabbiTipBody } from "@/components/RabbiTipBody";
import { getNextLearnUp } from "@/lib/learn-next-up";
import { getRabbiTip } from "@/lib/rabbi-tips";
import {
  LEARN_PROGRESS_EVENT,
  loadLearnProgress,
  NEXT_UP_EXPANDED_STORAGE_KEY,
} from "@/lib/learn-progress";
import {
  YIDDISH_PROGRESS_EVENT,
  loadYiddishProgress,
} from "@/lib/yiddish-progress";
import {
  LOCAL_PROFILE_EVENT,
  loadLocalProfile,
} from "@/lib/local-profile";
import {
  TRIAL_SESSION_EVENT,
  isTrialActive,
  loadTrialSession,
} from "@/lib/trial-session";
import { ClerkHeaderAuth } from "@/components/ClerkHeaderAuth";
import { DeveloperModeProvider } from "@/components/DeveloperModeProvider";
import { HubHeaderMezuzah } from "@/components/HubHeaderMezuzah";
import { Hebrew } from "./Hebrew";
import { TrialCountdownBar } from "./TrialCountdownBar";

export type NextUpSuggestion = {
  label: string;
  href: string;
  icon?: string;
};

type AppShellContextValue = {
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
  setNextUp: (s: NextUpSuggestion | null) => void;
  nextUp: NextUpSuggestion | null;
  nextUpExpanded: boolean;
  toggleNextUpPanel: () => void;
  /** Current Hebrew cue for Ask the Rabbi (from drills, story panels, etc.). */
  setRabbiAskContext: (p: RabbiAskPayload | null) => void;
  rabbiAskPayload: RabbiAskPayload | null;
  /** Opens the Rabbi sheet with the latest registered cue (or empty-state help). */
  openAskRabbiModal: () => void;
};

const AppShellContext = createContext<AppShellContextValue | null>(null);

export function useAppShell() {
  const ctx = useContext(AppShellContext);
  if (!ctx) {
    throw new Error("useAppShell must be used inside AppShell");
  }
  return ctx;
}

function ModalLayer({
  content,
  onClose,
}: {
  content: ReactNode;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center bg-ink/45 px-4 pt-[max(1rem,env(safe-area-inset-top,0px))] pb-[max(1rem,env(safe-area-inset-bottom,0px))] backdrop-blur-[2px] sm:items-center"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="parchment-pane--modal relative flex max-h-[min(90dvh,720px)] w-full max-w-lg min-h-0 flex-col overflow-hidden rounded-2xl shadow-2xl"
      >
        <button
          ref={closeRef}
          type="button"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 bg-parchment/90 text-xl leading-none text-ink-muted transition hover:bg-parchment-deep hover:text-ink"
          aria-label="Close dialog"
          onClick={onClose}
        >
          ×
        </button>
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain px-5 pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] pt-12 [scrollbar-gutter:stable]">
          {content}
        </div>
      </div>
    </div>
  );
}

function NextUpBar({
  suggestion,
  expanded,
  onToggle,
  onGo,
}: {
  suggestion: NextUpSuggestion | null;
  expanded: boolean;
  onToggle: () => void;
  onGo: () => void;
}) {
  const pathname = usePathname();
  if (pathname === "/" || !suggestion) return null;

  const icon = suggestion.icon ?? "📚";

  if (!expanded) {
    return (
      <div className="fixed bottom-3 left-3 z-[90]">
        <button
          type="button"
          onClick={onToggle}
          className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-ink/20 bg-gradient-to-br from-rust to-rust/85 text-xl text-white shadow-[0_10px_28px_rgba(30,18,8,0.18)] transition hover:brightness-110"
          aria-label="Expand Next up"
          aria-expanded="false"
        >
          {icon}
        </button>
      </div>
    );
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[90] border-t border-ink/15 bg-gradient-to-b from-[#f8f0e0] to-[#efe5cc] px-3 py-2 shadow-[0_-6px_24px_rgba(30,18,8,0.08)]"
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto flex max-w-2xl items-center gap-2">
        <button
          type="button"
          onClick={onToggle}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rust to-rust/85 text-lg text-white shadow-md transition hover:brightness-110"
          aria-label="Collapse Next up"
          aria-expanded="true"
        >
          {icon}
        </button>
        <button
          type="button"
          onClick={onGo}
          className="min-w-0 flex-1 text-left"
        >
          <div className="font-label text-[11px] uppercase tracking-[0.18em] text-ink">
            Next up
          </div>
          <span className="block truncate text-xs text-ink-muted">
            {suggestion.label}
          </span>
        </button>
        <button
          type="button"
          onClick={onGo}
          className="shrink-0 px-2 text-2xl text-rust transition hover:opacity-80"
          aria-label="Go to suggestion"
        >
          →
        </button>
      </div>
    </div>
  );
}

function ShellInner({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<ReactNode>(null);
  const [nextUpExpanded, setNextUpExpanded] = useState(false);
  const [nextUp, setNextUpState] = useState<NextUpSuggestion | null>({
    label: "Continue in Learn — course & levels",
    href: "/learn",
    icon: "📚",
  });
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [trialActive, setTrialActive] = useState(false);
  const [rabbiAskPayload, setRabbiAskContext] = useState<RabbiAskPayload | null>(
    null,
  );

  const pathname = usePathname();
  const router = useRouter();

  const closeModal = useCallback(() => setModal(null), []);
  const openModal = useCallback((content: ReactNode) => {
    setModal(content);
  }, []);

  const openAskRabbiModal = useCallback(() => {
    openModal(<RabbiAskModalBody payload={rabbiAskPayload} />);
  }, [openModal, rabbiAskPayload]);

  const setNextUp = useCallback((s: NextUpSuggestion | null) => {
    setNextUpState(s);
  }, []);

  const toggleNextUpPanel = useCallback(() => {
    setNextUpExpanded((e) => {
      const next = !e;
      try {
        localStorage.setItem(NEXT_UP_EXPANDED_STORAGE_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const goNextUp = useCallback(() => {
    if (nextUp?.href) router.push(nextUp.href);
  }, [nextUp, router]);

  const ctx = useMemo<AppShellContextValue>(
    () => ({
      openModal,
      closeModal,
      setNextUp,
      nextUp,
      nextUpExpanded,
      toggleNextUpPanel,
      setRabbiAskContext,
      rabbiAskPayload,
      openAskRabbiModal,
    }),
    [
      openModal,
      closeModal,
      setNextUp,
      nextUp,
      nextUpExpanded,
      toggleNextUpPanel,
      setRabbiAskContext,
      rabbiAskPayload,
      openAskRabbiModal,
    ],
  );

  useEffect(() => {
    try {
      const v = localStorage.getItem(NEXT_UP_EXPANDED_STORAGE_KEY);
      if (v === "1") setNextUpExpanded(true);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const syncNextUp = () => {
      setNextUpState(
        getNextLearnUp(loadLearnProgress(), {
          yiddishProgress: loadYiddishProgress(),
        }),
      );
    };
    syncNextUp();
    window.addEventListener(LEARN_PROGRESS_EVENT, syncNextUp);
    window.addEventListener(YIDDISH_PROGRESS_EVENT, syncNextUp);
    return () => {
      window.removeEventListener(LEARN_PROGRESS_EVENT, syncNextUp);
      window.removeEventListener(YIDDISH_PROGRESS_EVENT, syncNextUp);
    };
  }, [pathname]);

  useEffect(() => {
    const syncProfile = () => {
      setDisplayName(loadLocalProfile().displayName ?? null);
    };
    syncProfile();
    window.addEventListener(LOCAL_PROFILE_EVENT, syncProfile);
    return () => window.removeEventListener(LOCAL_PROFILE_EVENT, syncProfile);
  }, []);

  useEffect(() => {
    const syncTrial = () => {
      setTrialActive(isTrialActive(loadTrialSession()));
    };
    syncTrial();
    window.addEventListener(TRIAL_SESSION_EVENT, syncTrial);
    return () => window.removeEventListener(TRIAL_SESSION_EVENT, syncTrial);
  }, []);

  const isHome = pathname === "/" || pathname === "";
  const showNextUp = pathname !== "/" && nextUp !== null;
  const mainBottomPad =
    modal ? "pb-12" : showNextUp ? (nextUpExpanded ? "pb-28" : "pb-20") : "pb-12";

  return (
    <AppShellContext.Provider value={ctx}>
      <div className="min-h-dvh text-ink">
        <header className="parchment-header-strip sticky top-0 z-50 backdrop-blur-md backdrop-saturate-125">
          <div className="relative mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-3">
            <div className="relative shrink-0">
              {isHome ? (
                <div
                  className="w-[4.5rem] shrink-0 sm:w-20"
                  aria-hidden
                />
              ) : (
                <div className="relative -ml-1 pt-0.5">
                  <HubHeaderMezuzah />
                </div>
              )}
            </div>

            <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 text-center">
              <Hebrew
                as="span"
                className="text-[14px] text-ink-faint opacity-90"
              >
                עִבְרִית
              </Hebrew>
              {displayName ? (
                <Link
                  href="/settings"
                  className="max-w-[7rem] truncate font-label text-[12px] uppercase tracking-wide text-ink-muted underline decoration-ink/20 underline-offset-2 transition hover:text-sage hover:decoration-sage/40"
                  title={`${displayName} — open settings`}
                >
                  {displayName}
                </Link>
              ) : (
                <Link
                  href="/settings"
                  className="font-label text-[12px] uppercase tracking-wide text-ink-faint underline decoration-ink/15 underline-offset-2 transition hover:text-sage hover:decoration-sage/30"
                  title="Settings and local profile"
                >
                  Account
                </Link>
              )}
            </div>

            <div className="flex shrink-0 flex-col items-end gap-1.5 sm:flex-row sm:items-center sm:gap-2">
              <ClerkHeaderAuth />
              <button
                type="button"
                aria-label={
                  trialActive
                    ? "Quick tip — trial includes AI access when available"
                    : "Quick tip for this screen"
                }
                title={
                  trialActive
                    ? "Trial active: Rabbi tips now; full AI when connected"
                    : "Short tip for this page"
                }
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-sm font-semibold shadow-sm transition hover:bg-sage/10 ${
                  trialActive
                    ? "border-rust/35 bg-rust/10 text-rust"
                    : "border-sage/25 bg-parchment/90 text-sage"
                }`}
                onClick={() =>
                  openModal(
                    <RabbiTipBody
                      tip={getRabbiTip(pathname)}
                      onClose={closeModal}
                    />,
                  )
                }
              >
                ?
              </button>
            </div>
          </div>
          <TrialCountdownBar />
        </header>

        <DeveloperModeProvider>
          <main
            className={`app-main-reading mx-auto w-full max-w-2xl px-4 pt-6 transition-[padding] ${mainBottomPad}`}
          >
            {children}
          </main>
        </DeveloperModeProvider>
      </div>

      {modal ? <ModalLayer content={modal} onClose={closeModal} /> : null}

      <NextUpBar
        suggestion={nextUp}
        expanded={nextUpExpanded}
        onToggle={toggleNextUpPanel}
        onGo={goNextUp}
      />
    </AppShellContext.Provider>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return <ShellInner>{children}</ShellInner>;
}
