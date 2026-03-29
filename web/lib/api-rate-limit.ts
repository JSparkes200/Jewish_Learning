/**
 * IP-based rate limits for public API routes. Uses Vercel KV when
 * `KV_REST_API_URL` / `KV_REST_API_TOKEN` are set; otherwise skips limiting
 * (local dev without KV).
 */

import { Ratelimit } from "@upstash/ratelimit";
import { NextResponse } from "next/server";
import { cloudProgressKvConfigured } from "@/lib/cloud-progress-kv";

export type RateLimitBucket = "mcq" | "validate" | "progress" | "auth";

type Limiters = {
  mcq: Ratelimit;
  validate: Ratelimit;
  progress: Ratelimit;
  auth: Ratelimit;
};

let limitersPromise: Promise<Limiters | null> | null = null;

function loadLimiters(): Promise<Limiters | null> {
  if (!cloudProgressKvConfigured()) return Promise.resolve(null);
  if (!limitersPromise) {
    limitersPromise = (async () => {
      const { kv } = await import("@vercel/kv");
      return {
        mcq: new Ratelimit({
          redis: kv,
          limiter: Ratelimit.slidingWindow(120, "60 s"),
          prefix: "rl:mcq",
        }),
        validate: new Ratelimit({
          redis: kv,
          limiter: Ratelimit.slidingWindow(40, "60 s"),
          prefix: "rl:validate",
        }),
        progress: new Ratelimit({
          redis: kv,
          limiter: Ratelimit.slidingWindow(60, "60 s"),
          prefix: "rl:progress",
        }),
        auth: new Ratelimit({
          redis: kv,
          limiter: Ratelimit.slidingWindow(8, "60 s"),
          prefix: "rl:auth",
        }),
      };
    })();
  }
  return limitersPromise;
}

export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first.slice(0, 128);
  }
  const real = req.headers.get("x-real-ip")?.trim();
  if (real) return real.slice(0, 128);
  return "unknown";
}

/**
 * @returns `NextResponse` with 429 if over limit, otherwise `null`.
 */
export async function rateLimitIfExceeded(
  req: Request,
  bucket: RateLimitBucket,
): Promise<NextResponse | null> {
  const limiters = await loadLimiters();
  if (!limiters) return null;
  const ip = clientIp(req);
  const rl = limiters[bucket];
  const { success, reset } = await rl.limit(`${bucket}:${ip}`);
  if (success) return null;
  const retrySec = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
  return NextResponse.json(
    { error: "Too many requests. Try again shortly." },
    {
      status: 429,
      headers: {
        "Retry-After": String(retrySec),
      },
    },
  );
}
