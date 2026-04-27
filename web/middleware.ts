import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";

function clerkEnvDiagnostic(): string | null {
  const pk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim();
  const sk = process.env.CLERK_SECRET_KEY?.trim();
  if (!pk) {
    return "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is missing or empty. Add it in Vercel (Production), redeploy, and ensure the project Root Directory is `web`.";
  }
  if (!sk) {
    return "CLERK_SECRET_KEY is missing or empty. Add it in Vercel (Production) and redeploy.";
  }
  const pkOk = pk.startsWith("pk_test_") || pk.startsWith("pk_live_");
  const skOk = sk.startsWith("sk_test_") || sk.startsWith("sk_live_");
  if (!pkOk) {
    return "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY must start with pk_test_ or pk_live_.";
  }
  if (!skOk) {
    return "CLERK_SECRET_KEY must start with sk_test_ or sk_live_.";
  }
  const pkTest = pk.startsWith("pk_test_");
  const skTest = sk.startsWith("sk_test_");
  if (pkTest !== skTest) {
    return "Clerk keys must match: use both test keys (pk_test_ + sk_test_) or both live keys (pk_live_ + sk_live_).";
  }
  return null;
}

function middlewareFailureResponse(message: string, hint?: string) {
  const lines = [
    "Middleware could not run Clerk authentication.",
    "",
    message,
    "",
    hint ??
      "If this is Vercel: confirm env vars on the deployment, redeploy after changes, and check Root Directory = `web`. In Clerk, add your site URL under Domains / allowed origins.",
  ];
  return new NextResponse(lines.join("\n"), {
    status: 503,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

/**
 * Default: require a Clerk session. Public exceptions:
 * - Home (landing)
 * - Clerk sign-in / sign-up
 * - Guest try-before-signup: Hebrew alphabet (Alef–Bet) track only
 * - Static legacy HTML under `/legacy/*` (place files in `public/legacy/`)
 * - Clerk webhook ingress
 * - Hebcal snapshot (read-only calendar data)
 */
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/learn/alphabet(.*)",
  "/legacy(.*)",
  "/api/webhooks(.*)",
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
  const envIssue = clerkEnvDiagnostic();
  if (envIssue) {
    console.error("[middleware] Clerk env:", envIssue);
    return middlewareFailureResponse(envIssue);
  }

  try {
    return await clerkAuthMiddleware(request, event);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("[middleware] Clerk error:", e);
    // Never rethrow: Vercel only shows MIDDLEWARE_INVOCATION_FAILED for throws.
    const handshakeHint =
      message.includes("handshake") || message.includes("Handshake")
        ? "Often fixed by Clerk dashboard URLs (exact production https URL, no trailing slash mismatch), or upgrading @clerk/nextjs. See Clerk → Configure → URLs."
        : undefined;
    return middlewareFailureResponse(`Details: ${message}`, handshakeHint);
  }
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
