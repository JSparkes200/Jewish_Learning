import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  DEV_SESSION_COOKIE,
  getExpectedDeveloperCredentials,
  matchesDeveloperCredentials,
  verifyDevSessionToken,
} from "@/lib/dev-session-server";

/**
 * In production, when developer env credentials are configured, require a valid
 * HttpOnly dev session before showing storage/import tools. Sign in at /developer.
 */
export default async function DeveloperToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cred = getExpectedDeveloperCredentials();
  if (process.env.NODE_ENV === "production" && cred) {
    const store = await cookies();
    const raw = store.get(DEV_SESSION_COOKIE)?.value;
    const payload = raw ? verifyDevSessionToken(raw, cred.secret) : null;
    if (!payload || !matchesDeveloperCredentials(payload)) {
      redirect("/developer");
    }
  }
  return <>{children}</>;
}
