import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Default: require a Clerk session. Public exceptions:
 * - Home (landing)
 * - Clerk sign-in / sign-up
 * - Static legacy HTML under `/legacy/*` (place files in `public/legacy/`)
 * - Password-reset + anonymous KV progress APIs (Bearer) until migrated to Clerk + user-scoped KV
 */
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  /** Guest try-before-signup: Hebrew alphabet (Alef–Bet) track only */
  "/learn/alphabet(.*)",
  "/legacy(.*)",
  "/api/webhooks(.*)",
  "/api/auth/(.*)",
  "/api/progress(.*)",
  "/api/hebcal(.*)",
]);

const clerkAuthMiddleware = clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

/**
 * Clerk throws when keys are missing; Vercel surfaces that only as
 * MIDDLEWARE_INVOCATION_FAILED. Map configuration errors to a plain response so
 * deploys are diagnosable on-device.
 */
export default async function middleware(
  request: NextRequest,
  event: NextFetchEvent,
) {
  try {
    return await clerkAuthMiddleware(request, event);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    const looksLikeClerkConfig =
      /publishableKey|publishable key|secret key|secretKey|dashboard\.clerk\.com/i.test(
        message,
      );
    if (looksLikeClerkConfig) {
      console.error("[middleware] Clerk configuration:", message);
      return new NextResponse(
        [
          "Authentication is misconfigured for this deployment.",
          "",
          "Set CLERK_SECRET_KEY and NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY in the host environment (e.g. Vercel → Project → Settings → Environment Variables), then redeploy.",
          "",
          `Details: ${message}`,
        ].join("\n"),
        {
          status: 503,
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        },
      );
    }
    console.error("[middleware]", e);
    throw e;
  }
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
