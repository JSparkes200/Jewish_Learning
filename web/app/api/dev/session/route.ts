import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  DEV_SESSION_COOKIE,
  getExpectedDeveloperCredentials,
  matchesDeveloperCredentials,
  verifyDevSessionToken,
} from "@/lib/dev-session-server";

/**
 * GET — whether the browser has a valid signed developer session cookie.
 */
export async function GET() {
  const cred = getExpectedDeveloperCredentials();
  if (!cred) {
    return NextResponse.json({ authenticated: false, configured: false });
  }
  const store = await cookies();
  const raw = store.get(DEV_SESSION_COOKIE)?.value;
  if (!raw) {
    return NextResponse.json({ authenticated: false, configured: true });
  }
  const payload = verifyDevSessionToken(raw, cred.secret);
  const authenticated =
    payload != null && matchesDeveloperCredentials(payload);
  return NextResponse.json({ authenticated, configured: true });
}
