/**
 * Rate limits for public + user-scoped API routes. Uses Vercel KV when
 * `KV_REST_API_URL` / `KV_REST_API_TOKEN` are set; otherwise skips limiting
 * (local dev without KV).
 *
 * Two axes:
 *   - `rateLimitIfExceeded(req, bucket)`           — IP-keyed (public/anonymous)
 *   - `rateLimitUserIfExceeded(userId, bucket)`    — Clerk-userId-keyed (authenticated)
 *   - `dailyUserQuotaIfExceeded(userId, bucket, n)` — simple daily counter per user
 */

import { Ratelimit } from "@upstash/ratelimit";
import { NextResponse } from "next/server";
import { cloudProgressKvConfigured } from "@/lib/cloud-progress-kv";

export type RateLimitBucket =
  | "mcq"
  | "validate"
  | "progress"
  | "auth"
  | "hebcal"
  | "rabbi"
  | "wordDetail"
  | "parsha";

type Limiters = {
  mcq: Ratelimit;
  validate: Ratelimit;
  progress: Ratelimit;
  auth: Ratelimit;
  hebcal: Ratelimit;
  rabbi: Ratelimit;
  wordDetail: Ratelimit;
  parsha: Ratelimit;
  // Per-user counterparts (tighter, userId-keyed).
  rabbiUser: Ratelimit;
  wordDetailUser: Ratelimit;
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
        hebcal: new Ratelimit({
          redis: kv,
          limiter: Ratelimit.slidingWindow(60, "60 s"),
          prefix: "rl:hebcal",
        }),
        rabbi: new Ratelimit({
          redis: kv,
          limiter: Ratelimit.slidingWindow(24, "60 s"),
          prefix: "rl:rabbi",
        }),
        wordDetail: new Ratelimit({
          redis: kv,
          limiter: Ratelimit.slidingWindow(60, "60 s"),
          prefix: "rl:wordDetail",
        }),
        parsha: new Ratelimit({
          redis: kv,
          limiter: Ratelimit.slidingWindow(30, "60 s"),
          prefix: "rl:parsha",
        }),
        rabbiUser: new Ratelimit({
          redis: kv,
          limiter: Ratelimit.slidingWindow(12, "60 s"),
          prefix: "rl:rabbi:u",
        }),
        wordDetailUser: new Ratelimit({
          redis: kv,
          limiter: Ratelimit.slidingWindow(120, "60 s"),
          prefix: "rl:wordDetail:u",
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
 * IP-keyed rate limit (public/anonymous routes).
 * @returns `NextResponse` with 429 if over limit, otherwise `null`.
 */
export async function rateLimitIfExceeded(
  req: Request,
  bucket: RateLimitBucket,
): Promise<NextResponse | null> {
  const limiters = await loadLimiters();
  if (!limiters) {
    // KV not configured:
    // - "auth" bucket is defensively hard-failed in production so unconfigured
    //   deployments don't silently run auth endpoints without per-IP limits.
    // - Other buckets: silent pass in local dev only.
    if (bucket === "auth" && process.env.NODE_ENV === "production") {
      return NextResponse.json(
        {
          error:
            "Rate limiter unavailable. Link Vercel KV (KV_REST_API_URL / KV_REST_API_TOKEN) for this deployment.",
        },
        { status: 503 },
      );
    }
    return null;
  }
  const ip = clientIp(req);
  const rl = limiters[bucket as keyof Limiters] as Ratelimit;
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

/**
 * Clerk userId-keyed rate limit (authenticated routes).
 * Tighter than IP limits; prevents one bad actor with a single account from
 * sustained abuse across many IPs.
 */
export async function rateLimitUserIfExceeded(
  userId: string,
  bucket: "rabbi" | "wordDetail",
): Promise<NextResponse | null> {
  const limiters = await loadLimiters();
  if (!limiters) return null;
  const key = bucket === "rabbi" ? "rabbiUser" : "wordDetailUser";
  const rl = limiters[key];
  const { success, reset } = await rl.limit(`${key}:${userId}`);
  if (success) return null;
  const retrySec = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
  return NextResponse.json(
    { error: "You're sending requests too quickly. Slow down and try again." },
    {
      status: 429,
      headers: {
        "Retry-After": String(retrySec),
      },
    },
  );
}

/** Daily cap for expensive per-user calls (Rabbi OpenAI). Resets at UTC midnight. */
export async function dailyUserQuotaIfExceeded(
  userId: string,
  bucket: "rabbi",
  limit: number,
): Promise<NextResponse | null> {
  if (!cloudProgressKvConfigured()) return null;
  const { kv } = await import("@vercel/kv");
  const day = new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
  const key = `quota:${bucket}:${day}:${userId}`;
  // INCR + expire ~26h from now. First write initializes; subsequent writes
  // refresh the TTL (harmless — still one day of rolling history).
  const n = await kv.incr(key);
  if (n === 1) {
    await kv.expire(key, 60 * 60 * 26);
  }
  if (n > limit) {
    return NextResponse.json(
      {
        error:
          "Daily usage limit reached for this feature. Please come back tomorrow.",
      },
      { status: 429, headers: { "Retry-After": "3600" } },
    );
  }
  return null;
}
