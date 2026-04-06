"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import {
  maybeMigrateGuestSavedWordsToClerkUser,
  setSavedWordsClerkUserId,
} from "@/lib/saved-words";

/**
 * Binds saved-lemmas localStorage to the signed-in Clerk user and runs a
 * one-time guest → user bucket copy (see {@link maybeMigrateGuestSavedWordsToClerkUser}).
 */
export function SavedWordsClerkSync() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return;
    const id = user?.id;
    if (id) {
      maybeMigrateGuestSavedWordsToClerkUser(id);
      setSavedWordsClerkUserId(id);
    } else {
      setSavedWordsClerkUserId(null);
    }
  }, [isLoaded, user?.id]);

  return null;
}
