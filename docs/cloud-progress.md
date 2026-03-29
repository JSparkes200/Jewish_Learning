# Cloud Learn progress (Vercel KV)

Optional **server-side backup** of the Next app’s Learn state (`LEARN_PROGRESS_KEY`), using the same **Vercel KV** database as password-reset code hashes when `KV_REST_API_URL` and `KV_REST_API_TOKEN` are set.

## API

| Method | Path | Auth | Behavior |
| --- | --- | --- | --- |
| `PUT` | `/api/progress` | `Authorization: Bearer <sync-key>` | Stores **sanitized** progress JSON (see `sanitizeLearnProgress` in `web/lib/learn-progress-backup.ts`). |
| `GET` | `/api/progress` | Same | Returns `{ progress }` or **404** if none. |
| `DELETE` | `/api/progress` | Same | Removes the KV entry for that key (local device unchanged). |

The server **never stores the raw Bearer token** in KV; it uses **SHA-256** (`web/lib/hash-progress-token.ts`) as the KV key suffix.

## Client sync key

- **Storage key:** `hebrew-web-cloud-sync-v1` (see `web/lib/cloud-sync-token.ts`).
- **Value:** A **UUID** generated on first use. This is **not** a user account; it is a shared secret between this browser and KV.
- **Developer tools:** Push, merge/replace restore, copy/paste key, regenerate key, delete cloud copy (`web/app/developer/DeveloperTools.tsx`).

## Security model (read this)

- **Whoever has the sync key** can read or overwrite the cloud backup. Protect it like a recovery code.
- There is **no email login** in this flow. For managed identity (Clerk, etc.), plan a separate migration.
- **Regenerating** the key on one device orphans the old KV blob unless you kept the old key.
- **Local-first:** Offline use still works; cloud is optional.

## Environment

Same KV variables as password reset — see [`vercel-environment.md`](./vercel-environment.md). No extra env vars are required for `/api/progress` beyond KV being linked.

## Parity / migration

Brings the Next app closer to a **durable** progress story while legacy HTML remains `localStorage`-only. Full account sync is still future work (see `docs/next-migration.md`).
