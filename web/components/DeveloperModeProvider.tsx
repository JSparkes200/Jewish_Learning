"use client";

import { useEffect } from "react";
import { setDeveloperModeBypass } from "@/lib/developer-mode";

/**
 * Loads GET /api/dev/session on mount and syncs {@link setDeveloperModeBypass}.
 */
export function DeveloperModeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/dev/session", { credentials: "include" });
        const data = (await res.json()) as { authenticated?: boolean };
        if (!cancelled) setDeveloperModeBypass(data.authenticated === true);
      } catch {
        if (!cancelled) setDeveloperModeBypass(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return <>{children}</>;
}
