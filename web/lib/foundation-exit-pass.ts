/** Default foundation exit pass line (product spec: 90%). */
export const FOUNDATION_EXIT_MIN_PCT = 0.9;

/**
 * True if `correct`/`total` meets at least `minPct` (e.g. 5/5, 9/10, 18/20).
 */
export function meetsFoundationExitPassPercent(
  correct: number,
  total: number,
  minPct: number = FOUNDATION_EXIT_MIN_PCT,
): boolean {
  if (total <= 0 || correct < 0 || correct > total) return false;
  return correct >= Math.ceil(minPct * total - 1e-9);
}
