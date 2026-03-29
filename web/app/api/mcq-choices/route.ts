import { NextResponse } from "next/server";
import type { McqItem } from "@/data/section-drill-types";
import { mcqChoicesBodySchema } from "@/lib/api-schemas";
import { rateLimitIfExceeded } from "@/lib/api-rate-limit";
import { buildMcqEnglishChoices } from "@/lib/corpus-d-lookup";

/**
 * POST JSON `{ item: McqItem, corpusMaxLevel: 1 | 2 | 3 | 4 }` → `{ choices: string[] }`
 * (four shuffled options: one correct + three wrong). Runs corpus + inline logic on the server.
 */
export async function POST(req: Request) {
  const limited = await rateLimitIfExceeded(req, "mcq");
  if (limited) return limited;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = mcqChoicesBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { item, corpusMaxLevel } = parsed.data;
  const choices = buildMcqEnglishChoices(item as McqItem, corpusMaxLevel);
  return NextResponse.json({ choices });
}
