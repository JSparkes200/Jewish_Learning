import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  buildClerkMetadataPayload,
  CLERK_PRIVATE_SAVED_WORDS_KEY,
  parseClerkSavedWordsMetadata,
} from "@/lib/clerk-saved-words-metadata";
import { clampWordField, type SavedWordEntry } from "@/lib/saved-words";

export const runtime = "nodejs";

function parseBodyItems(raw: unknown): SavedWordEntry[] | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (!Array.isArray(o.items)) return null;
  const out: SavedWordEntry[] = [];
  for (const row of o.items) {
    if (!row || typeof row !== "object") continue;
    const r = row as Record<string, unknown>;
    const he = typeof r.he === "string" ? clampWordField(r.he) : "";
    if (!he) continue;
    const source =
      r.source === "legacy-ivrit_saved" || r.source === "hebrew-web"
        ? r.source
        : "hebrew-web";
    const importedAt =
      typeof r.importedAt === "number" && r.importedAt > 0
        ? r.importedAt
        : Date.now();
    out.push({
      he,
      ...(typeof r.translit === "string"
        ? { translit: clampWordField(r.translit) }
        : {}),
      ...(typeof r.en === "string" ? { en: clampWordField(r.en) } : {}),
      ...(typeof r.colloquial === "string"
        ? { colloquial: clampWordField(r.colloquial) }
        : {}),
      source,
      importedAt,
    });
  }
  return out;
}

/** GET — return saved lemmas from Clerk privateMetadata (merged shape for client). */
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const raw = user.privateMetadata?.[CLERK_PRIVATE_SAVED_WORDS_KEY];
  const items = parseClerkSavedWordsMetadata(raw) ?? [];
  return NextResponse.json({ items });
}

/**
 * PUT — store a capped snapshot of the client list in Clerk privateMetadata.
 * Body: `{ items: SavedWordEntry[] }`.
 */
export async function PUT(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const incoming = parseBodyItems(body);
  if (!incoming) {
    return NextResponse.json({ error: "Expected { items: [...] }" }, { status: 400 });
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  const payload = buildClerkMetadataPayload(incoming);
  if (!payload) {
    return NextResponse.json(
      { error: "Saved list too large for Clerk metadata; keep fewer bookmarks or rely on local export." },
      { status: 413 },
    );
  }

  await client.users.updateUser(userId, {
    privateMetadata: {
      ...user.privateMetadata,
      [CLERK_PRIVATE_SAVED_WORDS_KEY]: payload,
    },
  });

  return NextResponse.json({ ok: true, itemCount: payload.items.length });
}
