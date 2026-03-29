import { NextResponse } from "next/server";
import { validateHebrewPassageBodySchema } from "@/lib/api-schemas";
import { rateLimitIfExceeded } from "@/lib/api-rate-limit";
import {
  validatePassageAgainstCorpusD,
  validatePassageAgainstCorpusLevel,
} from "@/lib/hebrew-passage-pipeline";

/**
 * POST JSON `{ text: string, maxLevel?: 1 | 2 | 3 | 4 }` → corpus overlap stats
 * (same logic as `lib/hebrew-passage-pipeline` + Developer panel). For scripts
 * and CI; browser UI can stay client-side.
 */
export async function POST(req: Request) {
  const limited = await rateLimitIfExceeded(req, "validate");
  if (limited) return limited;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = validateHebrewPassageBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { text, maxLevel } = parsed.data;

  if (maxLevel === undefined) {
    const validation = validatePassageAgainstCorpusD(text);
    return NextResponse.json({ validation });
  }

  const validation = validatePassageAgainstCorpusLevel(text, maxLevel);
  return NextResponse.json({ validation });
}
