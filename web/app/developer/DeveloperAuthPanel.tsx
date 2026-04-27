"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { setDeveloperModeBypass } from "@/lib/developer-mode";

/**
 * One-click developer session panel. The caller must already be signed in to
 * Clerk with an allowlisted userId. There is no username/email input — the
 * server derives identity from the Clerk session and issues a cookie bound to it.
 */
export function DeveloperAuthPanel() {
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [operatorGate, setOperatorGate] = useState(false);
  const [operatorUnlocked, setOperatorUnlocked] = useState(true);
  const [operatorCode, setOperatorCode] = useState("");
  const [operatorBusy, setOperatorBusy] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dev/session", {
        credentials: "include",
        cache: "no-store",
      });
      const data = (await res.json()) as {
        authenticated?: boolean;
        configured?: boolean;
        operatorGate?: boolean;
        operatorUnlocked?: boolean;
      };
      setConfigured(data.configured === true);
      const ok = data.authenticated === true;
      setAuthenticated(ok);
      setDeveloperModeBypass(ok);
      setOperatorGate(data.operatorGate === true);
      setOperatorUnlocked(data.operatorUnlocked !== false);
    } catch {
      setConfigured(false);
      setAuthenticated(false);
      setDeveloperModeBypass(false);
      setOperatorGate(false);
      setOperatorUnlocked(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const onSubmitOperator = async () => {
    setMessage(null);
    setOperatorBusy(true);
    try {
      const res = await fetch("/api/operator/unlock", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: operatorCode }),
      });
      if (!res.ok) {
        const d = (await res.json().catch(() => ({}))) as { error?: string };
        setMessage(d.error ?? "Approval failed");
        return;
      }
      setOperatorCode("");
      setOperatorUnlocked(true);
      setMessage("Owner approval saved for this browser session.");
      void refresh();
    } catch {
      setMessage("Network error");
    } finally {
      setOperatorBusy(false);
    }
  };

  const onLogin = async () => {
    setMessage(null);
    setLoading(true);
    try {
      const res = await fetch("/api/dev/auth", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        // Never reveal whether the reason was "not configured" vs "not allowlisted";
        // both surface as the same generic message.
        setMessage("Developer access is not available for this account.");
        setDeveloperModeBypass(false);
        setAuthenticated(false);
      } else {
        setMessage("Signed in. Course gates are unlocked in this browser for 24 hours.");
        setAuthenticated(true);
        setDeveloperModeBypass(true);
      }
    } catch {
      setMessage("Network error");
    } finally {
      setLoading(false);
    }
  };

  const onLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/dev/logout", { method: "POST", credentials: "include" });
      setAuthenticated(false);
      setDeveloperModeBypass(false);
      setMessage("Signed out.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-ink/12 border-t-amber/25 bg-parchment-card/80 p-4">
      <h3 className="font-label text-[10px] uppercase tracking-[0.2em] text-ink-muted">
        Developer mode (owner unlock)
      </h3>
      <p className="mt-2 text-xs text-ink-muted">
        Bound to your Clerk account. If your Clerk user ID is in the server-side
        allowlist, clicking <em>Start developer session</em> issues a 24-hour
        HttpOnly cookie that bypasses Learn, bridge, specialty, and Yiddish
        section locks in this browser only. Signing out of Clerk invalidates
        this session.
      </p>
      {loading && configured === null ? (
        <p className="mt-2 text-xs text-ink-faint">Checking session…</p>
      ) : configured === false ? (
        <p className="mt-2 text-xs text-amber">
          Developer access isn&apos;t available on this deployment for your
          account.
        </p>
      ) : operatorGate && !operatorUnlocked ? (
        <div className="mt-3 space-y-2">
          <p className="text-xs text-amber">
            This deployment requires an owner approval code (server env{" "}
            <code className="rounded bg-ink/5 px-1">OPERATOR_APPROVAL_CODE</code>
            ) before developer tools or paid APIs can be used. Enter the code once;
            it is not stored in the app bundle.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <input
              type="password"
              value={operatorCode}
              onChange={(e) => setOperatorCode(e.target.value)}
              autoComplete="off"
              placeholder="Approval code"
              className="w-full max-w-sm rounded-lg border border-ink/15 bg-parchment-deep/30 px-3 py-2 text-sm text-ink placeholder:text-ink-faint"
            />
            <button
              type="button"
              disabled={operatorBusy || !operatorCode.trim()}
              onClick={() => void onSubmitOperator()}
              className="rounded-lg border border-amber/40 bg-amber/10 px-3 py-2 font-label text-[10px] uppercase tracking-wide text-ink hover:bg-amber/20 disabled:opacity-50"
            >
              {operatorBusy ? "…" : "Save approval"}
            </button>
          </div>
        </div>
      ) : authenticated ? (
        <div className="mt-3">
          <p className="text-sm text-sage">
            Developer session active — progression gates are bypassed.
          </p>
          <p className="mt-2">
            <Link
              href="/developer/tools"
              className="font-label text-[10px] font-semibold uppercase tracking-[0.14em] text-sage underline decoration-sage/40 underline-offset-4 hover:decoration-sage"
            >
              Open developer tools
            </Link>
          </p>
          <button
            type="button"
            className="mt-2 rounded-lg border border-ink/15 px-3 py-2 font-label text-[10px] uppercase tracking-wide text-ink hover:bg-parchment-deep/40"
            onClick={() => void onLogout()}
          >
            Sign out
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={loading}
          onClick={() => void onLogin()}
          className="mt-3 rounded-lg bg-sage px-4 py-2 font-label text-[10px] uppercase tracking-wide text-white hover:brightness-110 disabled:opacity-50"
        >
          Start developer session
        </button>
      )}
      {message ? <p className="mt-2 text-xs text-ink-muted">{message}</p> : null}
    </div>
  );
}
