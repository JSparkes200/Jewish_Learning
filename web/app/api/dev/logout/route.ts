import { NextResponse } from "next/server";
import { DEV_SESSION_COOKIE } from "@/lib/dev-session-server";

/** POST — clear developer session cookie (always 200; no info leak). */
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(DEV_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  res.headers.set("Cache-Control", "no-store");
  return res;
}
