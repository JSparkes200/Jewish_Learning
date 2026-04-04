/**
 * Stores short-lived password-reset code hashes.
 * - If Vercel KV is linked (KV_* env), codes survive across serverless instances.
 * - Otherwise uses in-memory fallback (unreliable on Vercel prod — see docs/auth-security.md).
 */

type Entry = { hash: string; exp: number };

const mem = new Map<string, Entry>();

const KEY = (u: string) => `ivrit:pwreset:${u.toLowerCase()}`;

function kvConfigured(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export async function saveResetCodeHash(
  username: string,
  codeHash: string,
): Promise<void> {
  const u = username.toLowerCase().trim();
  const ex = 900;
  if (kvConfigured()) {
    try {
      const { kv } = await import("@vercel/kv");
      await kv.set(KEY(u), codeHash, { ex });
      return;
    } catch {
      /* KV misconfigured — fall back */
    }
  }
  mem.set(u, { hash: codeHash, exp: Date.now() + ex * 1000 });
}

export async function deleteResetCodeHash(username: string): Promise<void> {
  const u = username.toLowerCase().trim();
  if (kvConfigured()) {
    try {
      const { kv } = await import("@vercel/kv");
      await kv.del(KEY(u));
      return;
    } catch {
      /* fall through */
    }
  }
  mem.delete(u);
}

export async function consumeResetCodeHash(
  username: string,
  codeHash: string,
): Promise<boolean> {
  const u = username.toLowerCase().trim();
  if (kvConfigured()) {
    try {
      const { kv } = await import("@vercel/kv");
      const key = KEY(u);
      const stored = await kv.get<string>(key);
      if (!stored || stored !== codeHash) return false;
      await kv.del(key);
      return true;
    } catch {
      /* fall through to memory */
    }
  }
  const rec = mem.get(u);
  if (!rec || Date.now() > rec.exp) {
    mem.delete(u);
    return false;
  }
  if (rec.hash !== codeHash) return false;
  mem.delete(u);
  return true;
}
