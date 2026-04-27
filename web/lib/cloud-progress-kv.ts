/**
 * Server-only: Learn progress blobs in Vercel KV, keyed by Clerk userId.
 *
 * Key prefix is `v2:` to namespace away from the legacy anonymous-Bearer-token
 * scheme (`hebrew:learn:progress:<sha256-of-token>`). Legacy keys are orphaned
 * and should be purged out-of-band after migration.
 */

const KEY = (userId: string) => `hebrew:learn:progress:v2:${userId}`;

export function cloudProgressKvConfigured(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export async function kvGetProgressJson(userId: string): Promise<string | null> {
  if (!cloudProgressKvConfigured()) return null;
  try {
    const { kv } = await import("@vercel/kv");
    return (await kv.get<string>(KEY(userId))) ?? null;
  } catch {
    return null;
  }
}

export async function kvSetProgressJson(
  userId: string,
  json: string,
): Promise<void> {
  const { kv } = await import("@vercel/kv");
  await kv.set(KEY(userId), json);
}

export async function kvDeleteProgress(userId: string): Promise<void> {
  try {
    const { kv } = await import("@vercel/kv");
    await kv.del(KEY(userId));
  } catch {
    /* ignore */
  }
}
