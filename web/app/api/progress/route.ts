import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { rateLimitIfExceeded } from "@/lib/api-rate-limit";
import { progressPutBodySchema } from "@/lib/api-schemas";
import {
  cloudProgressKvConfigured,
  kvDeleteProgress,
  kvGetProgressJson,
  kvSetProgressJson,
} from "@/lib/cloud-progress-kv";
import { sanitizeLearnProgress } from "@/lib/learn-progress-backup";

export const runtime = "nodejs";

/**
 * Learn-progress cloud backup. Scoped by Clerk userId — one blob per user.
 *
 * Prior versions used a client-generated UUID Bearer token (anonymous). That
 * scheme was an IDOR vector: anyone with the token owned the blob. Migrated to
 * Clerk so Learn progress is tied to the authenticated account and revocable
 * via normal Clerk session controls.
 */

function kvUnavailable() {
  return NextResponse.json(
    { error: "KV not configured. Link Vercel KV and set KV_REST_API_URL / KV_REST_API_TOKEN." },
    { status: 503 },
  );
}

export async function GET(req: NextRequest) {
  const limited = await rateLimitIfExceeded(req, "progress");
  if (limited) return limited;

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!cloudProgressKvConfigured()) return kvUnavailable();

  const raw = await kvGetProgressJson(userId);
  if (!raw) {
    return NextResponse.json({ error: "No stored progress for this account." }, { status: 404 });
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

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!cloudProgressKvConfigured()) return kvUnavailable();

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
  await kvSetProgressJson(userId, JSON.stringify(progress));
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const limited = await rateLimitIfExceeded(req, "progress");
  if (limited) return limited;

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!cloudProgressKvConfigured()) return kvUnavailable();

  await kvDeleteProgress(userId);
  return NextResponse.json({ ok: true });
}
