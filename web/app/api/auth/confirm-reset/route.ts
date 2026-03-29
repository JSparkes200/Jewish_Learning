import { NextRequest, NextResponse } from "next/server";
import { rateLimitIfExceeded } from "@/lib/api-rate-limit";
import { consumeResetCodeHash } from "@/lib/pw-reset-store";
import { sha256Hex } from "@/lib/sha256-hex";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function OPTIONS() {
  return new NextResponse(null, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  const limited = await rateLimitIfExceeded(req, "auth");
  if (limited) {
    return NextResponse.json(
      { error: "Too many requests. Try again shortly." },
      { status: 429, headers: corsHeaders },
    );
  }

  let body: { username?: string; code?: string; newPassword?: string };
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
  const code = String(body.code || "").trim();
  const np = String(body.newPassword || "");

  if (!u || !code) {
    return NextResponse.json(
      { error: "Missing fields" },
      { status: 400, headers: corsHeaders },
    );
  }
  if (np.length < 6) {
    return NextResponse.json(
      { error: "Password should be at least 6 characters" },
      { status: 400, headers: corsHeaders },
    );
  }

  const hash = await sha256Hex(code);
  const ok = await consumeResetCodeHash(u, hash);
  if (!ok) {
    return NextResponse.json(
      { error: "Invalid or expired code" },
      { status: 400, headers: corsHeaders },
    );
  }

  return NextResponse.json({ ok: true }, { headers: corsHeaders });
}
