"use client";

import {
  SignInButton,
  SignUpButton,
  UserButton,
  useAuth,
} from "@clerk/nextjs";

export function ClerkHeaderAuth() {
  const { isLoaded, isSignedIn } = useAuth();

  return (
    <div className="flex shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-2">
      {!isLoaded ? (
        <span className="h-9 w-9 shrink-0 rounded-full bg-parchment/50" aria-hidden />
      ) : isSignedIn ? (
        <UserButton
          appearance={{
            elements: {
              userButtonAvatarBox: "h-9 w-9",
            },
          }}
        />
      ) : (
        <>
          <SignInButton mode="modal">
            <button
              type="button"
              className="rounded-lg border border-sage/30 bg-parchment/90 px-2.5 py-1.5 font-label text-[8px] uppercase tracking-[0.12em] text-sage shadow-sm transition hover:bg-sage/10 sm:text-[9px]"
            >
              Sign in
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button
              type="button"
              className="rounded-lg border border-rust/35 bg-rust/10 px-2.5 py-1.5 font-label text-[8px] uppercase tracking-[0.12em] text-rust shadow-sm transition hover:bg-rust/15 sm:text-[9px]"
            >
              Sign up
            </button>
          </SignUpButton>
        </>
      )}
    </div>
  );
}
