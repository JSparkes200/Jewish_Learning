"use client";

import { useAuth } from "@clerk/nextjs";
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
  const { isLoaded, isSignedIn, userId } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn || !userId) {
      setDeveloperModeBypass(false);
      return;
    }

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
  }, [isLoaded, isSignedIn, userId]);

  return <>{children}</>;
}
