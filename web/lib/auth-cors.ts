import type { NextRequest } from "next/server";

const METHODS = "POST, OPTIONS";
const HEADERS = "Content-Type";

/**
 * CORS for legacy HTML password-reset callers.
 * - If `AUTH_CORS_ORIGINS` is unset: `Access-Control-Allow-Origin: *` (backward compatible).
 * - If set (comma-separated origins): reflect allowed `Origin` only; browser calls from other origins fail.
 */
export function authCorsHeaders(req: NextRequest): Record<string, string> {
  const raw = process.env.AUTH_CORS_ORIGINS?.trim();
  if (!raw) {
    return {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": METHODS,
      "Access-Control-Allow-Headers": HEADERS,
    };
  }
  const allowed = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const origin = req.headers.get("origin");
  if (origin && allowed.includes(origin)) {
    return {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": METHODS,
      "Access-Control-Allow-Headers": HEADERS,
      "Vary": "Origin",
    };
  }
  if (!origin) {
    return {
      "Access-Control-Allow-Methods": METHODS,
      "Access-Control-Allow-Headers": HEADERS,
    };
  }
  return {
    "Access-Control-Allow-Methods": METHODS,
    "Access-Control-Allow-Headers": HEADERS,
  };
}

export function isAuthCorsBlocked(req: NextRequest): boolean {
  const raw = process.env.AUTH_CORS_ORIGINS?.trim();
  if (!raw) return false;
  const allowed = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const origin = req.headers.get("origin");
  if (!origin) return false;
  return !allowed.includes(origin);
}
