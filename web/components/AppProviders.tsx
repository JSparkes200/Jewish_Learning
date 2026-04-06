"use client";

import { ClerkProvider } from "@clerk/nextjs";
import type { ReactNode } from "react";
import { SavedWordsClerkSync } from "@/components/SavedWordsClerkSync";
import { SavedWordsMetadataSync } from "@/components/SavedWordsMetadataSync";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <SavedWordsClerkSync />
      <SavedWordsMetadataSync />
      {children}
    </ClerkProvider>
  );
}
