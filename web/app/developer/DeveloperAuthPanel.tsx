"use client";

import { useCallback, useEffect, useState } from "react";
import { setDeveloperModeBypass } from "@/lib/developer-mode";

export function DeveloperAuthPanel() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dev/session", { credentials: "include" });
      const data = (await res.json()) as {
        authenticated?: boolean;
        configured?: boolean;
      };
      setConfigured(data.configured === true);
      const ok = data.authenticated === true;
      setAuthenticated(ok);
      setDeveloperModeBypass(ok);
    } catch {
      setConfigured(false);
      setAuthenticated(false);
      setDeveloperModeBypass(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const res = await fetch("/api/dev/auth", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setMessage(data.error ?? res.statusText);
        setDeveloperModeBypass(false);
        setAuthenticated(false);
      } else {
        setMessage("Signed in. Course gates are unlocked in this browser.");
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
        Set on the server:{" "}
        <code className="rounded bg-parchment-deep/50 px-1 text-[11px]">
          DEVELOPER_USERNAME
        </code>
        ,{" "}
        <code className="rounded bg-parchment-deep/50 px-1 text-[11px]">
          DEVELOPER_EMAIL
        </code>
        ,{" "}
        <code className="rounded bg-parchment-deep/50 px-1 text-[11px]">
          DEVELOPER_SESSION_SECRET
        </code>{" "}
        (24+ random characters). Sign in with the same username and email as in
        your allowlist; this sets an HttpOnly cookie and bypasses Learn, bridge,
        specialty, and Yiddish section locks in this browser.
      </p>
      {loading && configured === null ? (
        <p className="mt-2 text-xs text-ink-faint">Checking session…</p>
      ) : configured === false ? (
        <p className="mt-2 text-xs text-amber">
          Developer login is not configured on this deployment (set the three env
          vars on Vercel or in <code className="text-[11px]">.env.local</code>).
        </p>
      ) : authenticated ? (
        <div className="mt-3">
          <p className="text-sm text-sage">
            Developer session active — progression gates are bypassed.
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
        <form onSubmit={(e) => void onLogin(e)} className="mt-3 space-y-2">
          <label className="block text-[11px] text-ink-muted">
            Username
            <input
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full max-w-xs rounded border border-ink/15 bg-parchment-deep/30 px-2 py-1 font-mono text-xs"
            />
          </label>
          <label className="block text-[11px] text-ink-muted">
            Email
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full max-w-xs rounded border border-ink/15 bg-parchment-deep/30 px-2 py-1 font-mono text-xs"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-sage px-4 py-2 font-label text-[10px] uppercase tracking-wide text-white hover:brightness-110 disabled:opacity-50"
          >
            Sign in
          </button>
        </form>
      )}
      {message ? <p className="mt-2 text-xs text-ink-muted">{message}</p> : null}
    </div>
  );
}
