import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  DEV_SESSION_COOKIE,
  getExpectedDeveloperCredentials,
  matchesDeveloperCredentials,
  verifyDevSessionToken,
} from "@/lib/dev-session-server";

/**
 * In production, developer tools are never public: require configured
 * DEVELOPER_* env vars and a valid HttpOnly dev session. Sign in at /developer.
 * (Previously, missing env in production left tools world-readable.)
 */
export default async function DeveloperToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (process.env.NODE_ENV !== "production") {
    return <>{children}</>;
  }
  const cred = getExpectedDeveloperCredentials();
  if (!cred) {
    redirect("/");
  }
  const store = await cookies();
  const raw = store.get(DEV_SESSION_COOKIE)?.value;
  const payload = raw ? verifyDevSessionToken(raw, cred.secret) : null;
  if (!payload || !matchesDeveloperCredentials(payload)) {
    redirect("/developer");
  }
  return <>{children}</>;
}
