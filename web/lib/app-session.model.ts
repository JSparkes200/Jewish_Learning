/**
 * Cross-route activity: last resumable URL + short visit log. Stored in
 * {@link LearnProgressState.appSession} and synced with cloud progress backup.
 */

export const APP_SESSION_VISIT_LOG_MAX = 25;

export type AppPathEntry = {
  path: string;
  label: string;
  at: number;
};

export type AppSession = {
  /** Newest resumable full path (incl. query); omitted when only Home/auth nav occurred. */
  lastResume?: AppPathEntry;
  /** Newest-first ring buffer of meaningful visits (incl. Home). */
  visitLog: AppPathEntry[];
};

export function createEmptyAppSession(): AppSession {
  return { visitLog: [] };
}

const DANGEROUS = new Set(["..", "\\", "javascript:"]);

function hasDangerousSegment(path: string): boolean {
  const lower = path.toLowerCase();
  for (const d of DANGEROUS) {
    if (lower.includes(d)) return true;
  }
  return false;
}

const AUTH_PREFIX = new Set([
  "/sign-in",
  "/sign-up",
]);

function isAuthPathname(pathname: string): boolean {
  for (const p of AUTH_PREFIX) {
    if (pathname === p || pathname.startsWith(`${p}/`)) return true;
  }
  return false;
}

/**
 * Returns normalized path (pathname + search) for in-app use, or `null` if unsafe / external.
 */
export function validateResumePath(input: string): string | null {
  if (typeof input !== "string" || !input.trim()) return null;
  const t = input.trim();
  if (t.length > 400) return null;
  if (!t.startsWith("/")) return null;
  if (t.startsWith("//")) return null;
  if (t.includes("://")) return null;
  if (t.includes("..") || t.includes("%2e%2e") || t.includes("..%")) return null;
  if (hasDangerousSegment(t)) return null;
  if (t.startsWith("/api/") || t.startsWith("/_next/") || t.startsWith("/_vercel/"))
    return null;
  if (t.startsWith("/.well-known/")) return null;
  const q = t.indexOf("?");
  const pathname = q < 0 ? t : t.slice(0, q);
  if (isAuthPathname(pathname)) return null;
  if (t === "/" || t === "" || t === "?" || t === "/?") return null;
  return t;
}

function isSafeLogPath(s: string): boolean {
  if (typeof s !== "string" || s.length > 400 || !s.startsWith("/")) return false;
  if (s.includes("..") || s.startsWith("//") || s.includes("://")) return false;
  const pathname = s.split("?")[0] ?? s;
  return !isAuthPathname(pathname);
}

export function canAppendVisitLog(
  pathname: string,
  fullPath: string,
): boolean {
  if (isAuthPathname(pathname)) return false;
  if (fullPath === "/" || fullPath.startsWith("/?")) return true;
  return isSafeLogPath(fullPath);
}

export function canSetAsResume(
  pathname: string,
  fullPath: string,
): boolean {
  if (pathname === "/" || fullPath === "/") return false;
  if (isAuthPathname(pathname)) return false;
  const v = validateResumePath(fullPath);
  return v != null;
}

/** Heuristic labels for common routes. */
export function labelForPathname(pathname: string): string {
  if (pathname === "/") return "Home";
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] === "learn") {
    if (parts[1] === "yiddish" && parts[2]) return `Yiddish · ${decodeURIComponent(parts[2])}`;
    if (parts[1] === "yiddish") return "Yiddish";
    if (parts[1] === "bridge") return "Bridge";
    if (parts[1] === "alphabet") return "Alphabet";
    if (parts[1] === "placement") return "Placement";
    if (parts[1] === "foundation-exit") return "Foundation exit";
    if (parts[1] === "fluency") return "Fluency";
    if (parts[1] === "tracks") {
      if (parts[2] && parts[3]) return `Track · ${parts[2]} · ${parts[3]}`;
      if (parts[2]) return `Track · ${parts[2]}`;
      return "Specialty tracks";
    }
    if (parts[1] && /^\d+$/.test(parts[1])) {
      if (parts[2] && parts[2] !== "story")
        return `Learn L${parts[1]} · ${parts[2]}`;
      if (parts[2] === "story") return `Story · L${parts[1]}`;
      return `Learn · level ${parts[1]}`;
    }
    return "Learn home";
  }
  const map: Record<string, string> = {
    reading: "Reading",
    study: "Study",
    progress: "Progress",
    settings: "Settings",
    library: "Library",
    grammar: "Grammar",
    roots: "Roots",
    numbers: "Numbers",
    migration: "Import",
    developer: "Developer",
  };
  const head = parts[0] ?? "";
  if (map[head]) {
    if (head === "developer" && parts[1] === "tools") return "Developer tools";
    return map[head];
  }
  if (head === "fundraising-path") return "Milestones path";
  return `Page · ${pathname.length > 32 ? `${pathname.slice(0, 28)}…` : pathname}`;
}

export function reduceAppSession(
  prev: AppSession | undefined,
  fullPath: string,
  pathname: string,
): AppSession {
  const at = Date.now();
  const label = labelForPathname(pathname);
  const next: AppSession = {
    visitLog: [...(prev?.visitLog ?? [])],
  };
  if (canAppendVisitLog(pathname, fullPath) && !isAuthPathname(pathname)) {
    const log = next.visitLog;
    if (log[0]?.path === fullPath) {
      log[0] = { path: fullPath, label, at };
    } else {
      log.unshift({ path: fullPath, label, at });
    }
    next.visitLog = log.slice(0, APP_SESSION_VISIT_LOG_MAX);
  }
  if (canSetAsResume(pathname, fullPath) && validateResumePath(fullPath)) {
    next.lastResume = { path: fullPath, label, at };
  } else {
    if (prev?.lastResume) next.lastResume = prev.lastResume;
  }
  return next;
}

export function parseAppSessionField(raw: unknown): AppSession | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const o = raw as Record<string, unknown>;
  const logRaw = o.visitLog;
  const visitLog: AppPathEntry[] = [];
  if (Array.isArray(logRaw)) {
    for (const row of logRaw) {
      if (!row || typeof row !== "object") continue;
      const r = row as Record<string, unknown>;
      if (typeof r.path !== "string" || r.path.length > 400) continue;
      if (typeof r.label !== "string" || r.label.length > 200) continue;
      if (!isSafeLogPath(r.path)) continue;
      const at = typeof r.at === "number" && Number.isFinite(r.at) ? r.at : 0;
      visitLog.push({
        path: r.path.slice(0, 400),
        label: r.label.slice(0, 200),
        at,
      });
    }
  }
  const trimmed = visitLog
    .sort((a, b) => b.at - a.at)
    .slice(0, APP_SESSION_VISIT_LOG_MAX);

  let lastResume: AppPathEntry | undefined;
  const lr = o.lastResume;
  if (lr && typeof lr === "object") {
    const l = lr as Record<string, unknown>;
    if (
      typeof l.path === "string" &&
      typeof l.label === "string" &&
      typeof l.at === "number" &&
      Number.isFinite(l.at)
    ) {
      const p = validateResumePath(l.path);
      if (p) lastResume = { path: p, label: l.label.slice(0, 200), at: l.at };
    }
  }
  if (trimmed.length === 0 && !lastResume) return undefined;
  const vl =
    trimmed.length > 0 ? trimmed : lastResume ? [{ ...lastResume }] : [];
  return { lastResume, visitLog: vl };
}

export function mergeAppSessionFields(
  a: AppSession | undefined,
  b: AppSession | undefined,
): AppSession | undefined {
  if (!a && !b) return undefined;
  const visit: AppPathEntry[] = [...(a?.visitLog ?? []), ...(b?.visitLog ?? [])];
  visit.sort((x, y) => y.at - x.at);
  const byPath = new Map<string, AppPathEntry>();
  for (const e of visit) {
    if (!e.path.startsWith("/")) continue;
    const cur = byPath.get(e.path);
    if (!cur || e.at > cur.at) byPath.set(e.path, e);
  }
  const sorted = Array.from(byPath.values()).sort((x, y) => y.at - x.at);
  const visitLog = sorted.slice(0, APP_SESSION_VISIT_LOG_MAX);
  const lrA = a?.lastResume;
  const lrB = b?.lastResume;
  let lastResume: AppPathEntry | undefined;
  if (lrA && lrB) {
    lastResume = lrA.at >= lrB.at ? lrA : lrB;
  } else {
    lastResume = lrA ?? lrB;
  }
  if (lastResume) {
    const v = validateResumePath(lastResume.path);
    if (v) lastResume = { ...lastResume, path: v };
    else lastResume = undefined;
  }
  if (visitLog.length === 0 && !lastResume) return undefined;
  return { lastResume, visitLog: visitLog.length ? visitLog : (lastResume ? [lastResume] : []) };
}
