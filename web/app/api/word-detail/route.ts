import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { buildWordDetailEnrichment } from "@/lib/word-detail-enrichment";

export const runtime = "nodejs";

/**
 * Dictionary lookups are open, but Wikipedia extracts are for signed-in learners only
 * to keep traffic bounded to real accounts.
 */
export async function GET(req: Request) {
  const { userId } = await auth();

  const { searchParams } = new URL(req.url);
  const he = searchParams.get("he")?.trim() ?? "";
  if (!he) {
    return NextResponse.json(
      { error: "Missing he query parameter" },
      { status: 400 },
    );
  }

  const enrichment = await buildWordDetailEnrichment(he, !!userId);
  return NextResponse.json(enrichment);
}
