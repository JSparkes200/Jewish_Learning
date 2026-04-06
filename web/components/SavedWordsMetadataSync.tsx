"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useRef } from "react";
import {
  loadSavedWords,
  mergeSavedWordLists,
  saveSavedWords,
  SAVED_WORDS_EVENT,
  type SavedWordEntry,
} from "@/lib/saved-words";

const PUSH_DEBOUNCE_MS = 2200;

/**
 * Pulls a capped copy of saved lemmas from Clerk `privateMetadata` after sign-in,
 * merges into localStorage, and pushes debounced updates when the list changes.
 */
export function SavedWordsMetadataSync() {
  const { isLoaded, userId } = useAuth();
  const pulledRef = useRef<string | null>(null);
  const pushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isLoaded || !userId) {
      pulledRef.current = null;
      return;
    }

    if (pulledRef.current !== userId) {
      pulledRef.current = userId;
      void (async () => {
        try {
          const res = await fetch("/api/user/saved-lemmas");
          if (!res.ok) return;
          const data = (await res.json()) as { items?: SavedWordEntry[] };
          if (!Array.isArray(data.items) || data.items.length === 0) return;
          const local = loadSavedWords();
          const merged = mergeSavedWordLists(local, data.items);
          if (JSON.stringify(merged) !== JSON.stringify(local)) {
            saveSavedWords(merged);
          }
        } catch {
          /* offline */
        }
      })();
    }
  }, [isLoaded, userId]);

  useEffect(() => {
    if (!isLoaded || !userId) return;

    const schedulePush = () => {
      if (pushTimerRef.current) clearTimeout(pushTimerRef.current);
      pushTimerRef.current = setTimeout(() => {
        pushTimerRef.current = null;
        void (async () => {
          try {
            const items = loadSavedWords();
            await fetch("/api/user/saved-lemmas", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ items }),
            });
          } catch {
            /* ignore */
          }
        })();
      }, PUSH_DEBOUNCE_MS);
    };

    const onSaved = () => schedulePush();
    window.addEventListener(SAVED_WORDS_EVENT, onSaved);
    return () => {
      window.removeEventListener(SAVED_WORDS_EVENT, onSaved);
      if (pushTimerRef.current) clearTimeout(pushTimerRef.current);
    };
  }, [isLoaded, userId]);

  return null;
}
