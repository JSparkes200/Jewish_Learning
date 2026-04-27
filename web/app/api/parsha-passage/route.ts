import { NextResponse } from "next/server";
import { rateLimitIfExceeded } from "@/lib/api-rate-limit";
import { fetchParshaPassageForDate } from "@/lib/sefaria-parsha";

export const dynamic = "force-dynamic";

/**
 * Returns Hebrew + English verses for this week’s Torah reading (Diaspora),
 * sourced from Sefaria’s calendar + texts APIs. Rate-limited per IP to
 * protect the shared upstream quota.
 */
export async function GET(req: Request) {
  const limited = await rateLimitIfExceeded(req, "parsha");
  if (limited) return limited;

  const { searchParams } = new URL(req.url);
  const y = Number(searchParams.get("y"));
  const m = Number(searchParams.get("m"));
  const d = Number(searchParams.get("d"));

  if (
    !Number.isFinite(y) ||
    !Number.isFinite(m) ||
    !Number.isFinite(d) ||
    m < 1 ||
    m > 12 ||
    d < 1 ||
    d > 31
  ) {
    return NextResponse.json(
      { error: "Invalid or missing y, m, d query parameters." },
      { status: 400 },
    );
  }

  try {
    const payload = await fetchParshaPassageForDate(y, m, d, {
      next: { revalidate: 3600 },
    });
    if (!payload) {
      return NextResponse.json(
        { error: "Could not load weekly portion text." },
        { status: 404 },
      );
    }
    return NextResponse.json(payload);
  } catch {
    return NextResponse.json(
      { error: "Upstream text request failed." },
      { status: 502 },
    );
  }
}
