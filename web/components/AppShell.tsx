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
import { Hebrew } from "./Hebrew";
import { TrialCountdownBar } from "./TrialCountdownBar";

/** Top of menu: core journey. */
const NAV_PRIMARY = [
  { href: "/", label: "Home" },
  { href: "/learn", label: "Learn" },
  { href: "/progress", label: "Progress" },
  { href: "/settings", label: "Settings" },
] as const;

/** Drills, reading, and parallel tracks. */
const NAV_PRACTICE = [
  { href: "/study", label: "Study" },
  { href: "/reading", label: "Reading" },
  { href: "/numbers", label: "Numbers" },
  { href: "/roots", label: "Roots" },
  { href: "/library", label: "Library" },
  { href: "/learn/yiddish", label: "Yiddish" },
] as const;

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
  /** Current Hebrew cue for header “Ask the Rabbi” (from drills, etc.). */
  setRabbiAskContext: (p: RabbiAskPayload | null) => void;
};

const AppShellContext = createContext<AppShellContextValue | null>(null);

export function useAppShell() {
  const ctx = useContext(AppShellContext);
  if (!ctx) {
    throw new Error("useAppShell must be used inside AppShell");
  }
  return ctx;
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <span className="relative block h-3.5 w-5" aria-hidden>
      <span
        className={`absolute left-0 top-0 block h-0.5 w-5 rounded-full bg-ink/80 transition-transform duration-200 ${
          open ? "translate-y-1.5 rotate-45" : ""
        }`}
      />
      <span
        className={`absolute left-0 top-1.5 block h-0.5 w-5 rounded-full bg-ink/80 transition-opacity duration-200 ${
          open ? "opacity-0" : "opacity-100"
        }`}
      />
      <span
        className={`absolute left-0 top-3 block h-0.5 w-5 rounded-full bg-ink/80 transition-transform duration-200 ${
          open ? "-translate-y-1.5 -rotate-45" : ""
        }`}
      />
    </span>
  );
}

function navLinkClass(active: boolean): string {
  return `block w-full whitespace-nowrap rounded-lg px-4 py-3 text-left font-label text-xs font-semibold uppercase tracking-[0.14em] text-[#2c2416] shadow-sm transition-colors ${
    active
      ? "bg-[#dce8c8] text-[#2d4a1a] ring-1 ring-[#4a6830]/35"
      : "bg-[#faf3e6] ring-1 ring-[#2c2416]/12 hover:bg-[#efe5d0] hover:text-[#1a1510]"
  }`;
}

function isNavActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavMenu({
  open,
  menuId,
  onNavigate,
}: {
  open: boolean;
  menuId: string;
  onNavigate: () => void;
}) {
  const pathname = usePathname();

  const advancedNavItems = useMemo(() => {
    if (process.env.NEXT_PUBLIC_HIDE_DEVELOPER_NAV === "true") return [];
    return [{ href: "/developer", label: "Developer" }];
  }, []);

  if (!open) return null;

  return (
    <div
      id={menuId}
      className="absolute left-0 top-full z-[100] mt-1 w-max min-w-[9.5rem] rounded-xl border-2 border-ink/20 bg-[#f5ecd8] py-2 pl-2 pr-2 shadow-[0_12px_32px_rgba(44,36,22,0.18)]"
    >
      <nav className="w-max" aria-label="Main navigation">
        <ul className="flex w-max flex-col gap-1">
          {NAV_PRIMARY.map((item) => (
            <li key={item.href} className="w-full">
              <Link
                href={item.href}
                onClick={onNavigate}
                className={navLinkClass(isNavActive(pathname, item.href))}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li
            className="px-4 pb-0 pt-2 font-label text-[9px] uppercase tracking-[0.2em] text-[#2c2416]/55"
            aria-hidden
          >
            Practice &amp; resources
          </li>
          {NAV_PRACTICE.map((item) => (
            <li key={item.href} className="w-full">
              <Link
                href={item.href}
                onClick={onNavigate}
                className={navLinkClass(isNavActive(pathname, item.href))}
              >
                {item.label}
              </Link>
            </li>
          ))}
          {advancedNavItems.length > 0 ? (
            <>
              <li
                className="px-4 pb-0 pt-2 font-label text-[9px] uppercase tracking-[0.2em] text-[#2c2416]/55"
                aria-hidden
              >
                Advanced
              </li>
              {advancedNavItems.map((item) => (
                <li key={item.href} className="w-full">
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={navLinkClass(isNavActive(pathname, item.href))}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </>
          ) : null}
        </ul>
      </nav>
    </div>
  );
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
        className="relative flex max-h-[min(90dvh,720px)] w-full max-w-lg min-h-0 flex-col overflow-hidden rounded-2xl border border-ink/15 bg-parchment-card shadow-2xl"
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

/** Stable id for the hamburger ↔ menu panel (avoids useId SSR/client drift with Clerk in the header). */
const APP_SHELL_MAIN_NAV_MENU_ID = "app-shell-main-nav-menu";

function ShellInner({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
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

  const rootRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen((v) => !v), []);

  const closeModal = useCallback(() => setModal(null), []);
  const openModal = useCallback((content: ReactNode) => {
    setModal(content);
  }, []);

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
    }),
    [
      openModal,
      closeModal,
      setNextUp,
      nextUp,
      nextUpExpanded,
      toggleNextUpPanel,
    ],
  );

  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

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

  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) closeMenu();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen, closeMenu]);

  const showNextUp = pathname !== "/" && nextUp !== null;
  const mainBottomPad =
    modal ? "pb-12" : showNextUp ? (nextUpExpanded ? "pb-28" : "pb-20") : "pb-12";

  return (
    <AppShellContext.Provider value={ctx}>
      <div ref={rootRef} className="min-h-dvh bg-parchment-grain text-ink">
        <header className="sticky top-0 z-50 border-b border-ink/12 bg-parchment/88 shadow-sm backdrop-blur-md">
          <div className="relative mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-3">
            <div className="relative shrink-0">
              <button
                type="button"
                className="flex h-10 w-10 flex-col items-center justify-center rounded-lg border border-ink/15 bg-parchment/80 shadow-sm transition hover:bg-parchment-card"
                aria-expanded={menuOpen}
                aria-controls={APP_SHELL_MAIN_NAV_MENU_ID}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                onClick={toggleMenu}
              >
                <HamburgerIcon open={menuOpen} />
              </button>
              <NavMenu
                open={menuOpen}
                menuId={APP_SHELL_MAIN_NAV_MENU_ID}
                onNavigate={closeMenu}
              />
            </div>

            <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 text-center">
              <Hebrew
                as="span"
                className="text-[11px] text-ink-faint opacity-90"
              >
                עִבְרִית
              </Hebrew>
              {displayName ? (
                <Link
                  href="/settings"
                  className="max-w-[7rem] truncate font-label text-[9px] uppercase tracking-wide text-ink-muted underline decoration-ink/20 underline-offset-2 transition hover:text-sage hover:decoration-sage/40"
                  title={`${displayName} — open settings`}
                >
                  {displayName}
                </Link>
              ) : (
                <Link
                  href="/settings"
                  className="font-label text-[9px] uppercase tracking-wide text-ink-faint underline decoration-ink/15 underline-offset-2 transition hover:text-sage hover:decoration-sage/30"
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
                onClick={() =>
                  openModal(<RabbiAskModalBody payload={rabbiAskPayload} />)
                }
                className="text-right font-label text-[8px] uppercase leading-tight tracking-[0.14em] text-sage underline decoration-sage/40 underline-offset-2 transition hover:decoration-sage sm:max-w-[7rem] sm:text-[9px]"
                title={
                  rabbiAskPayload
                    ? "Open Rabbi notes for the Hebrew on this screen"
                    : "Rabbi notes — available when a lesson sets a Hebrew cue"
                }
              >
                Ask the Rabbi
              </button>
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
            className={`mx-auto w-full max-w-2xl px-4 pt-6 transition-[padding] ${mainBottomPad}`}
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
