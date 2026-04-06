import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

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

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
