"use client";

import { mergeLearnProgressStates } from "@/lib/learn-progress-backup";
import {
  loadLearnProgress,
  saveLearnProgress,
  type LearnProgressState,
} from "@/lib/learn-progress";
import { getOrCreateCloudSyncToken } from "@/lib/cloud-sync-token";

export async function pushProgressToCloud(): Promise<
  { ok: true } | { ok: false; error: string }
> {
  const progress = loadLearnProgress();
  const token = getOrCreateCloudSyncToken();
  if (!token) {
    return { ok: false, error: "Could not read sync token." };
  }
  const res = await fetch("/api/progress", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ progress }),
  });
  if (res.status === 503) {
    return {
      ok: false,
      error: "Cloud backup is not configured (link Vercel KV on the server).",
    };
  }
  if (!res.ok) {
    const j = (await res.json().catch(() => ({}))) as { error?: string };
    return { ok: false, error: j.error ?? res.statusText };
  }
  return { ok: true };
}

export async function pullProgressFromCloud(
  mode: "merge" | "replace",
): Promise<{ ok: true } | { ok: false; error: string }> {
  const token = getOrCreateCloudSyncToken();
  if (!token) {
    return { ok: false, error: "Could not read sync token." };
  }
  const res = await fetch("/api/progress", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 503) {
    return {
      ok: false,
      error: "Cloud backup is not configured (link Vercel KV on the server).",
    };
  }
  if (res.status === 404) {
    return {
      ok: false,
      error: "No backup found for this browser’s sync key yet.",
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

export async function deleteCloudProgress(): Promise<
  { ok: true } | { ok: false; error: string }
> {
  const token = getOrCreateCloudSyncToken();
  if (!token) {
    return { ok: false, error: "Could not read sync token." };
  }
  const res = await fetch("/api/progress", {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 503) {
    return {
      ok: false,
      error: "Cloud backup is not configured (link Vercel KV on the server).",
    };
  }
  if (!res.ok) {
    const j = (await res.json().catch(() => ({}))) as { error?: string };
    return { ok: false, error: j.error ?? res.statusText };
  }
  return { ok: true };
}
