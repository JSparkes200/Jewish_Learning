import { NextRequest, NextResponse } from "next/server";
import { rateLimitIfExceeded } from "@/lib/api-rate-limit";
import { saveResetCodeHash } from "@/lib/pw-reset-store";
import { sha256Hex } from "@/lib/sha256-hex";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function OPTIONS() {
  return new NextResponse(null, { headers: corsHeaders });
}

function parseAllowlist(): Record<string, string> {
  const raw = process.env.AUTH_RESET_EMAIL_MAP || "{}";
  try {
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return {};
  }
}

export async function POST(req: NextRequest) {
  const limited = await rateLimitIfExceeded(req, "auth");
  if (limited) {
    return NextResponse.json(
      { error: "Too many requests. Try again shortly." },
      { status: 429, headers: corsHeaders },
    );
  }

  let body: { username?: string; email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON" },
      { status: 400, headers: corsHeaders },
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

  const generic = {
    ok: true,
    message: "If an account matches, you will receive a code shortly.",
  };

  if (!match) {
    return NextResponse.json(generic, { headers: corsHeaders });
  }

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const hash = await sha256Hex(code);
  await saveResetCodeHash(u, hash);

  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || "onboarding@resend.dev";

  if (resendKey) {
    try {
      await fetch("https://api.resend.com/emails", {
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
    } catch {
      /* non-fatal */
    }
  }

  const payload: Record<string, unknown> = {
    ok: true,
    message: resendKey
      ? "Check your email for the code."
      : "Code issued. Add RESEND_API_KEY on Vercel to send email (see docs).",
  };

  if (process.env.DEMO_RESET_CODE === "1") {
    payload._demoCode = code;
  }

  return NextResponse.json(payload, { headers: corsHeaders });
}
