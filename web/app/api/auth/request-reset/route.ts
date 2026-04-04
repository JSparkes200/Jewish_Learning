import * as Sentry from "@sentry/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { rateLimitIfExceeded } from "@/lib/api-rate-limit";
import { authCorsHeaders, isAuthCorsBlocked } from "@/lib/auth-cors";
import { deleteResetCodeHash, saveResetCodeHash } from "@/lib/pw-reset-store";
import { sha256Hex } from "@/lib/sha256-hex";

const GENERIC_OK = {
  ok: true,
  message: "If an account matches, you will receive a code shortly.",
} as const;

export function OPTIONS(req: NextRequest) {
  const h = authCorsHeaders(req);
  if (isAuthCorsBlocked(req)) {
    return new NextResponse(null, { status: 403, headers: h });
  }
  return new NextResponse(null, { headers: h });
}

function parseAllowlist(): Record<string, string> {
  const raw = process.env.AUTH_RESET_EMAIL_MAP || "{}";
  try {
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return {};
  }
}

function demoResetCodeAllowed(): boolean {
  if (process.env.DEMO_RESET_CODE !== "1") return false;
  if (process.env.NODE_ENV === "production") return false;
  return true;
}

export async function POST(req: NextRequest) {
  const cors = authCorsHeaders(req);
  if (isAuthCorsBlocked(req)) {
    return new NextResponse(null, { status: 403, headers: cors });
  }

  const limited = await rateLimitIfExceeded(req, "auth");
  if (limited) {
    const retry = limited.headers.get("Retry-After");
    const headers: Record<string, string> = { ...cors };
    if (retry) headers["Retry-After"] = retry;
    return NextResponse.json(
      { error: "Too many requests. Try again shortly." },
      { status: 429, headers },
    );
  }

  let body: { username?: string; email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON" },
      { status: 400, headers: cors },
    );
  }

  const u = String(body.username || "")
    .toLowerCase()
    .trim();
  const e = String(body.email || "")
    .toLowerCase()
    .trim();
  const allow = parseAllowlist();
  const match = allow[u] === e;

  if (!match) {
    return NextResponse.json(GENERIC_OK, { headers: cors });
  }

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const hash = await sha256Hex(code);
  await saveResetCodeHash(u, hash);

  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || "onboarding@resend.dev";

  if (resendKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `Hebrew Learning <${from}>`,
          to: [e],
          subject: "Your password reset code",
          text: `Your one-time code is ${code}. It expires in 15 minutes.\n\nIf you did not request this, ignore this email.`,
        }),
      });
      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        await deleteResetCodeHash(u);
        Sentry.captureMessage("Resend API returned non-OK for password reset", {
          level: "error",
          extra: { status: res.status, body: errText.slice(0, 500) },
        });
      }
    } catch (err) {
      await deleteResetCodeHash(u);
      Sentry.captureException(err);
    }
  }

  const payload: Record<string, unknown> = { ...GENERIC_OK };
  if (demoResetCodeAllowed()) {
    payload._demoCode = code;
  }

  return NextResponse.json(payload, { headers: cors });
}
