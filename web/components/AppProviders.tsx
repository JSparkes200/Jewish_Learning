"use client";

import { ClerkProvider } from "@clerk/nextjs";
import type { ReactNode } from "react";
import { LearnProgressCloudSync } from "@/components/LearnProgressCloudSync";
import { PostSignInResumeModal } from "@/components/PostSignInResumeModal";
import { SavedWordsClerkSync } from "@/components/SavedWordsClerkSync";
import { SavedWordsMetadataSync } from "@/components/SavedWordsMetadataSync";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <LearnProgressCloudSync />
      <PostSignInResumeModal />
      <SavedWordsClerkSync />
      <SavedWordsMetadataSync />
      {children}
    </ClerkProvider>
  );
}
