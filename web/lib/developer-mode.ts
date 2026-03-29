/**
 * Client-side flag set only after GET /api/dev/session confirms an HttpOnly
 * cookie issued by POST /api/dev/auth. Used by gate helpers in learn-progress.
 */

export const DEVELOPER_MODE_EVENT = "hebrew-web-developer-mode-changed";

let bypass = false;

export function setDeveloperModeBypass(v: boolean): void {
  bypass = v;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(DEVELOPER_MODE_EVENT));
  }
}

/** True when signed-in as the configured developer (see server env). */
export function getDeveloperModeBypass(): boolean {
  if (typeof window === "undefined") return false;
  return bypass;
}
