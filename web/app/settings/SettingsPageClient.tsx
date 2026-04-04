"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  LOCAL_PROFILE_EVENT,
  loadLocalProfile,
  saveLocalProfile,
} from "@/lib/local-profile";

export function SettingsPageClient() {
  const [draft, setDraft] = useState("");

  const sync = useCallback(() => {
    setDraft(loadLocalProfile().displayName ?? "");
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener(LOCAL_PROFILE_EVENT, sync);
    return () => window.removeEventListener(LOCAL_PROFILE_EVENT, sync);
  }, [sync]);

  return (
    <div className="space-y-6">
      <section className="surface-elevated p-4">
        <p className="font-label text-[10px] uppercase tracking-[0.18em] text-sage">
          Learner name
        </p>
        <p className="mt-1 text-xs text-ink-muted">
          Shown under the Hebrew title in the header. Stored only in this browser (
          <code className="text-[10px]">localStorage</code>
          ). Not sent to a server account.
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="e.g. Dov"
            maxLength={48}
            className="input-inset min-w-0 flex-1 px-3 py-2 text-sm"
          />
          <button
            type="button"
            className="btn-elevated-primary shrink-0"
            onClick={() => saveLocalProfile({ displayName: draft })}
          >
            Save
          </button>
          <button
            type="button"
            className="btn-elevated-secondary shrink-0"
            onClick={() => {
              setDraft("");
              saveLocalProfile({});
            }}
          >
            Clear
          </button>
        </div>
      </section>

      <section className="surface-elevated p-4">
        <p className="font-label text-[10px] uppercase tracking-[0.18em] text-sage">
          How sign-in works here
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-4 text-sm text-ink-muted">
          <li>
            <strong className="text-ink">Guest / local</strong> — Progress, library saves, and study data
            live in this browser unless you use backup or cloud tools.
          </li>
          <li>
            <strong className="text-ink">Legacy HTML</strong> — The older single-page app used{" "}
            <code className="text-[11px]">ivrit_session_v1</code> and scoped keys such as{" "}
            <code className="text-[11px]">ivrit_lr__&lt;user&gt;</code>. Imports from that storage are on{" "}
            <Link href="/developer" className="text-sage underline hover:text-sage/90">
              Developer
            </Link>
            .
          </li>
          <li>
            <strong className="text-ink">Developer session</strong> — When your deploy sets server env vars
            for dev login, signing in on Developer sets an HttpOnly cookie to bypass course gates for
            testing. That is not end-user auth.
          </li>
          <li>
            <strong className="text-ink">Cloud backup</strong> — Optional Learn progress sync uses an
            anonymous sync key in this browser, not a password. See{" "}
            <Link
              href="/developer/tools#dev-cloud-backup"
              className="text-sage underline hover:text-sage/90"
            >
              Developer → Cloud backup
            </Link>
            .
          </li>
        </ul>
      </section>
    </div>
  );
}
