/**
 * Server-only: Learn progress blobs in Vercel KV (same KV as password-reset codes).
 */

const KEY = (tokenHash: string) => `hebrew:learn:progress:${tokenHash}`;

export function cloudProgressKvConfigured(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export async function kvGetProgressJson(tokenHash: string): Promise<string | null> {
  if (!cloudProgressKvConfigured()) return null;
  try {
    const { kv } = await import("@vercel/kv");
    return (await kv.get<string>(KEY(tokenHash))) ?? null;
  } catch {
    return null;
  }
}

export async function kvSetProgressJson(
  tokenHash: string,
  json: string,
): Promise<void> {
  const { kv } = await import("@vercel/kv");
  await kv.set(KEY(tokenHash), json);
}

export async function kvDeleteProgress(tokenHash: string): Promise<void> {
  try {
    const { kv } = await import("@vercel/kv");
    await kv.del(KEY(tokenHash));
  } catch {
    /* ignore */
  }
}
