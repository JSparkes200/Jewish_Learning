import { NextRequest, NextResponse } from "next/server";
import { rateLimitIfExceeded } from "@/lib/api-rate-limit";
import { authCorsHeaders, isAuthCorsBlocked } from "@/lib/auth-cors";
import { consumeResetCodeHash } from "@/lib/pw-reset-store";
import { sha256Hex } from "@/lib/sha256-hex";

export function OPTIONS(req: NextRequest) {
  const h = authCorsHeaders(req);
  if (isAuthCorsBlocked(req)) {
    return new NextResponse(null, { status: 403, headers: h });
  }
  return new NextResponse(null, { headers: h });
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

  let body: { username?: string; code?: string; newPassword?: string };
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
  const code = String(body.code || "").trim();
  const np = String(body.newPassword || "");

  if (!u || !code) {
    return NextResponse.json(
      { error: "Missing fields" },
      { status: 400, headers: cors },
    );
  }
  if (np.length < 6) {
    return NextResponse.json(
      { error: "Password should be at least 6 characters" },
      { status: 400, headers: cors },
    );
  }

  const hash = await sha256Hex(code);
  const ok = await consumeResetCodeHash(u, hash);
  if (!ok) {
    return NextResponse.json(
      { error: "Invalid or expired code" },
      { status: 400, headers: cors },
    );
  }

  return NextResponse.json({ ok: true }, { headers: cors });
}
