import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  isOperatorGateEnabled,
  isOperatorUnlockedForUser,
  OPERATOR_UNLOCK_COOKIE,
} from "@/lib/operator-unlock-cookie";

/**
 * When OPERATOR_APPROVAL_CODE is set, returns 403 unless the user has a valid unlock cookie.
 */
export async function requireOperatorUnlocked(
  userId: string,
): Promise<NextResponse | null> {
  if (!isOperatorGateEnabled()) return null;
  const store = await cookies();
  const raw = store.get(OPERATOR_UNLOCK_COOKIE)?.value;
  if (isOperatorUnlockedForUser(raw, userId)) return null;
  return NextResponse.json(
    { error: "Owner approval required", needsOperatorUnlock: true as const },
    { status: 403, headers: { "Cache-Control": "no-store" } },
  );
}
