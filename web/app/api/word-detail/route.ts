import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  rateLimitIfExceeded,
  rateLimitUserIfExceeded,
} from "@/lib/api-rate-limit";
import { buildWordDetailEnrichment } from "@/lib/word-detail-enrichment";

export const runtime = "nodejs";

/**
 * Dictionary lookups are open, but Wikipedia extracts are for signed-in learners only
 * to keep traffic bounded to real accounts.
 *
 * Rate limits:
 *  - Anonymous: IP bucket (wordDetail, 60/min/IP) — guards upstream (Sefaria)
 *    against botnet abuse that would otherwise take out our shared quota.
 *  - Signed-in: additionally capped per Clerk userId (120/min).
 */
export async function GET(req: Request) {
  const ipLimited = await rateLimitIfExceeded(req, "wordDetail");
  if (ipLimited) return ipLimited;

  const { userId } = await auth();
  if (userId) {
    const userLimited = await rateLimitUserIfExceeded(userId, "wordDetail");
    if (userLimited) return userLimited;
  }

  const { searchParams } = new URL(req.url);
  const he = searchParams.get("he")?.trim() ?? "";
  if (!he) {
    return NextResponse.json(
      { error: "Missing he query parameter" },
      { status: 400 },
    );
  }
  if (he.length > 200) {
    return NextResponse.json(
      { error: "Query too long" },
      { status: 400 },
    );
  }

  const enrichment = await buildWordDetailEnrichment(he, !!userId);
  return NextResponse.json(enrichment);
}
