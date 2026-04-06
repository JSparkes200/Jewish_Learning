import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { buildWordDetailEnrichment } from "@/lib/word-detail-enrichment";

export const runtime = "nodejs";

/**
 * Signed-in learners only — keeps Wikipedia traffic bounded to real accounts.
 */
export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const he = searchParams.get("he")?.trim() ?? "";
  if (!he) {
    return NextResponse.json(
      { error: "Missing he query parameter" },
      { status: 400 },
    );
  }

  const enrichment = await buildWordDetailEnrichment(he);
  return NextResponse.json(enrichment);
}
