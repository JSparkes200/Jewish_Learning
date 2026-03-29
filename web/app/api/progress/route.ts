import { NextRequest, NextResponse } from "next/server";
import { rateLimitIfExceeded } from "@/lib/api-rate-limit";
import { progressPutBodySchema } from "@/lib/api-schemas";
import {
  cloudProgressKvConfigured,
  kvDeleteProgress,
  kvGetProgressJson,
  kvSetProgressJson,
} from "@/lib/cloud-progress-kv";
import { hashProgressToken } from "@/lib/hash-progress-token";
import { sanitizeLearnProgress } from "@/lib/learn-progress-backup";

/** Uses `node:crypto` via hash-progress-token. */
export const runtime = "nodejs";

function bearerToken(req: NextRequest): string | null {
  const h = req.headers.get("authorization");
  if (!h?.toLowerCase().startsWith("bearer ")) return null;
  return h.slice(7).trim();
}

function kvUnavailable() {
  return NextResponse.json(
    { error: "KV not configured. Link Vercel KV and set KV_REST_API_URL / KV_REST_API_TOKEN." },
    { status: 503 },
  );
}

export async function GET(req: NextRequest) {
  const limited = await rateLimitIfExceeded(req, "progress");
  if (limited) return limited;

  if (!cloudProgressKvConfigured()) return kvUnavailable();
  const token = bearerToken(req);
  if (!token || token.length < 16) {
    return NextResponse.json({ error: "Missing or invalid Bearer token." }, { status: 401 });
  }
  const hash = hashProgressToken(token);
  const raw = await kvGetProgressJson(hash);
  if (!raw) {
    return NextResponse.json({ error: "No stored progress for this token." }, { status: 404 });
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    return NextResponse.json({ error: "Stored data corrupted." }, { status: 500 });
  }
  if (!parsed || typeof parsed !== "object") {
    return NextResponse.json({ error: "Invalid stored shape." }, { status: 500 });
  }
  const progress = sanitizeLearnProgress(parsed as Record<string, unknown>);
  return NextResponse.json({ progress });
}

export async function PUT(req: NextRequest) {
  const limited = await rateLimitIfExceeded(req, "progress");
  if (limited) return limited;

  if (!cloudProgressKvConfigured()) return kvUnavailable();
  const token = bearerToken(req);
  if (!token || token.length < 16) {
    return NextResponse.json({ error: "Missing or invalid Bearer token." }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const parsed = progressPutBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid body", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const progress = sanitizeLearnProgress(
    parsed.data.progress as Record<string, unknown>,
  );
  const hash = hashProgressToken(token);
  await kvSetProgressJson(hash, JSON.stringify(progress));
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const limited = await rateLimitIfExceeded(req, "progress");
  if (limited) return limited;

  if (!cloudProgressKvConfigured()) return kvUnavailable();
  const token = bearerToken(req);
  if (!token || token.length < 16) {
    return NextResponse.json({ error: "Missing or invalid Bearer token." }, { status: 401 });
  }
  const hash = hashProgressToken(token);
  await kvDeleteProgress(hash);
  return NextResponse.json({ ok: true });
}
