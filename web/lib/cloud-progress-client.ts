"use client";

import { mergeLearnProgressStates } from "@/lib/learn-progress-backup";
import {
  loadLearnProgress,
  saveLearnProgress,
  type LearnProgressState,
} from "@/lib/learn-progress";

/**
 * Learn-progress cloud backup client. Uses the caller's Clerk session (sent as
 * cookies by the browser); there is no separate Bearer token. `credentials:
 * "include"` is belt-and-braces — `/api/progress` is same-origin so cookies
 * ship by default, but we set it explicitly so this works under stricter
 * fetch policies too.
 */

type Result = { ok: true } | { ok: false; error: string };

function notSignedIn(): Result {
  return { ok: false, error: "Sign in to sync Learn progress." };
}

function kvUnavailable(): Result {
  return {
    ok: false,
    error: "Cloud backup is not configured (link Vercel KV on the server).",
  };
}

export async function pushProgressToCloud(): Promise<Result> {
  const progress = loadLearnProgress();
  const res = await fetch("/api/progress", {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ progress }),
  });
  if (res.status === 401) return notSignedIn();
  if (res.status === 503) return kvUnavailable();
  if (!res.ok) {
    const j = (await res.json().catch(() => ({}))) as { error?: string };
    return { ok: false, error: j.error ?? res.statusText };
  }
  return { ok: true };
}

export async function pullProgressFromCloud(
  mode: "merge" | "replace",
): Promise<Result> {
  const res = await fetch("/api/progress", {
    method: "GET",
    credentials: "include",
  });
  if (res.status === 401) return notSignedIn();
  if (res.status === 503) return kvUnavailable();
  if (res.status === 404) {
    return {
      ok: false,
      error: "No cloud backup found for your account yet.",
    };
  }
  if (!res.ok) {
    return { ok: false, error: "Could not load cloud backup." };
  }
  const data = (await res.json()) as { progress?: LearnProgressState };
  const remote = data.progress;
  if (!remote || typeof remote !== "object") {
    return { ok: false, error: "Invalid cloud response." };
  }
  if (mode === "replace") {
    saveLearnProgress(remote);
    return { ok: true };
  }
  const merged = mergeLearnProgressStates(loadLearnProgress(), remote);
  saveLearnProgress(merged);
  return { ok: true };
}

export async function deleteCloudProgress(): Promise<Result> {
  const res = await fetch("/api/progress", {
    method: "DELETE",
    credentials: "include",
  });
  if (res.status === 401) return notSignedIn();
  if (res.status === 503) return kvUnavailable();
  if (!res.ok) {
    const j = (await res.json().catch(() => ({}))) as { error?: string };
    return { ok: false, error: j.error ?? res.statusText };
  }
  return { ok: true };
}
