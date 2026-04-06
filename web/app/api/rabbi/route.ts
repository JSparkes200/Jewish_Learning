import { NextResponse } from "next/server";
import { rabbiBodySchema } from "@/lib/api-schemas";
import { rateLimitIfExceeded } from "@/lib/api-rate-limit";
import {
  buildRabbiUserMessage,
  generateRabbiMarkdown,
  getWebRoot,
  loadRabbiSystemPrompt,
  runLightragRetrieval,
} from "@/lib/rabbi-llm";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * POST /api/rabbi
 * Body: { targetHe, level, translit?, meaningEn?, ragContext? }
 *
 * When `ragContext` is omitted, the server uses `RABBI_LIGHTRAG_RETRIEVE_URL` (Railway)
 * when set, else local `scripts/query_lightrag.py` + `knowledge_store`. Otherwise
 * retrieval is skipped and the model uses "Context unavailable" per the Rabbi prompt.
 */
export async function POST(req: Request) {
  const limited = await rateLimitIfExceeded(req, "rabbi");
  if (limited) {
    return limited;
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OpenAI is not configured (OPENAI_API_KEY)." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = rabbiBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { targetHe, level, translit, meaningEn, ragContext, learnerQuestion } =
    parsed.data;

  let retrieval: "client" | "lightrag" | "skipped" | "empty" | "error" = "skipped";
  let ragText = ragContext?.trim() ?? "";

  if (ragText) {
    retrieval = "client";
  } else {
    const q = `${targetHe} ${meaningEn ?? ""} ${translit ?? ""}`.trim();
    const lr = await runLightragRetrieval(q);
    if (lr.ok && lr.context.trim()) {
      ragText = lr.context;
      retrieval = "lightrag";
    } else if (lr.ok) {
      retrieval = "empty";
    } else if (lr.error === "disabled" || lr.error === "missing_script_or_store") {
      retrieval = "skipped";
    } else {
      retrieval = "error";
    }
  }

  const webRoot = getWebRoot();
  const system = loadRabbiSystemPrompt(webRoot);
  const user = buildRabbiUserMessage({
    targetHe,
    level,
    translit,
    meaningEn,
    ragContext: ragText,
    learnerQuestion,
  });

  try {
    const markdown = await generateRabbiMarkdown({ system, user });
    return NextResponse.json(
      { markdown, retrieval },
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      },
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Rabbi generation failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
