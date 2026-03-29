import { NextResponse } from "next/server";
import { DEV_SESSION_COOKIE } from "@/lib/dev-session-server";

/** POST — clear developer session cookie. */
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(DEV_SESSION_COOKIE, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return res;
}
