import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import {
  DEV_SESSION_COOKIE,
  getDevSessionConfig,
  matchesClerkSession,
  verifyDevSessionToken,
} from "@/lib/dev-session-server";

/**
 * Developer tools are NEVER world-readable in production.
 * Two independent gates must pass:
 *   1. Caller's Clerk userId is in DEVELOPER_CLERK_USER_IDS allowlist.
 *   2. Valid dev-session cookie bound to the same Clerk {userId, sessionId}.
 *
 * Non-production (dev): gate 2 is skipped but gate 1 still applies if configured.
 * When dev auth is unconfigured in production we return 404 to avoid advertising
 * the route's existence.
 */
export default async function DeveloperToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cfg = getDevSessionConfig();

  if (process.env.NODE_ENV !== "production") {
    // Local dev: allow through if no config, otherwise still enforce allowlist.
    if (cfg) {
      const { userId } = await auth();
      if (!userId || !cfg.allowedUserIds.includes(userId)) {
        notFound();
      }
    }
    return <>{children}</>;
  }

  if (!cfg) {
    // Dev auth disabled on this deployment — pretend nothing is here.
    notFound();
  }

  const { userId, sessionId } = await auth();
  if (!userId || !sessionId) {
    redirect("/sign-in?redirect_url=/developer");
  }

  if (!cfg.allowedUserIds.includes(userId)) {
    notFound();
  }

  const store = await cookies();
  const raw = store.get(DEV_SESSION_COOKIE)?.value;
  const payload = raw ? verifyDevSessionToken(raw, cfg.secret) : null;
  if (!payload || !matchesClerkSession(payload, { userId, sessionId })) {
    redirect("/developer");
  }

  return <>{children}</>;
}
