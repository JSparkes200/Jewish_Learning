import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { OPERATOR_UNLOCK_COOKIE } from "@/lib/operator-unlock-cookie";

/**
 * POST /api/operator/revoke — clear operator unlock cookie (stays signed in to Clerk).
 */
export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(OPERATOR_UNLOCK_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  res.headers.set("Cache-Control", "no-store");
  return res;
}
