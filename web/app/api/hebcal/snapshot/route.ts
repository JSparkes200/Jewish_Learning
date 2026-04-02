import { NextRequest, NextResponse } from "next/server";
import {
  fetchHebrewDateLine,
  fetchParshaSnapshot,
} from "@/lib/hebcal-parsha";
import {
  getHebrewDateLineLocal,
  getParshaSnapshotLocal,
} from "@/lib/parsha-local";

export const dynamic = "force-dynamic";

/**
 * Proxies Hebcal when reachable; falls back to @hebcal/core (same rules, no
 * upstream) so callers still get parsha + Hebrew date offline.
 */
export async function GET(req: NextRequest) {
  const gy = req.nextUrl.searchParams.get("gy");
  const gm = req.nextUrl.searchParams.get("gm");
  const gd = req.nextUrl.searchParams.get("gd");
  const y = gy ? parseInt(gy, 10) : NaN;
  const m = gm ? parseInt(gm, 10) : NaN;
  const d = gd ? parseInt(gd, 10) : NaN;
  if (
    !Number.isFinite(y) ||
    !Number.isFinite(m) ||
    !Number.isFinite(d) ||
    m < 1 ||
    m > 12 ||
    d < 1 ||
    d > 31
  ) {
    return NextResponse.json({ error: "invalid date" }, { status: 400 });
  }

  try {
    const [parshaNet, hebrewNet] = await Promise.all([
      fetchParshaSnapshot(y, m, d),
      fetchHebrewDateLine(y, m, d),
    ]);
    const parsha = parshaNet ?? getParshaSnapshotLocal(y, m, d);
    const hebrewDate = hebrewNet ?? getHebrewDateLineLocal(y, m, d);
    return NextResponse.json({ parsha, hebrewDate });
  } catch {
    const parsha = getParshaSnapshotLocal(y, m, d);
    const hebrewDate = getHebrewDateLineLocal(y, m, d);
    return NextResponse.json({
      parsha,
      hebrewDate,
      error: parsha || hebrewDate ? undefined : "upstream",
    });
  }
}
