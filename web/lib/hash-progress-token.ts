import { createHash } from "node:crypto";

/** Stable KV key segment; never store the raw bearer token in KV. */
export function hashProgressToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}
