import { NextResponse } from "next/server";
import { z } from "zod";
import { rateLimitIfExceeded } from "@/lib/api-rate-limit";
import {
  DEV_SESSION_COOKIE,
  getExpectedDeveloperCredentials,
  signDevSession,
} from "@/lib/dev-session-server";

const bodySchema = z.object({
  username: z.string().min(1).max(128),
  email: z.string().email().max(256),
});

/**
 * POST — verify username/email match server env; set HttpOnly session cookie.
 */
export async function POST(req: Request) {
  const limited = await rateLimitIfExceeded(req, "auth");
  if (limited) return limited;

  const cred = getExpectedDeveloperCredentials();
  if (!cred) {
    return NextResponse.json(
      {
        error:
          "Developer login is not configured. Set DEVELOPER_USERNAME, DEVELOPER_EMAIL, and DEVELOPER_SESSION_SECRET (24+ chars) on the server.",
      },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid body", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const u = parsed.data.username.trim().toLowerCase();
  const e = parsed.data.email.trim().toLowerCase();

  if (u !== cred.username || e !== cred.email) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const token = signDevSession(u, e, cred.secret);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(DEV_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
