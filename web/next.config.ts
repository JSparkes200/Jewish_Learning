import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

/**
 * Content-Security-Policy.
 *
 * React + React-Markdown do not require inline scripts, but Next.js App Router
 * emits inline hydration bootstrap scripts that need 'unsafe-inline' OR a nonce.
 * We use 'unsafe-inline' here for compatibility; Clerk, Sentry, and OpenAI are
 * allowlisted by connect/script origin so any future injection can't exfil to
 * an attacker-controlled domain.
 *
 * If you tighten this later, prefer a per-request nonce via middleware.
 */
const CSP_DIRECTIVES = [
  "default-src 'self'",
  // Clerk + Sentry ship their client SDKs from CDNs. No third-party analytics.
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.accounts.dev https://*.clerk.com https://clerk.*.com https://*.clerk.dev https://*.sentry.io https://*.ingest.sentry.io https://*.ingest.us.sentry.io https://*.ingest.de.sentry.io",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://img.clerk.com https://*.clerk.com",
  "font-src 'self' data:",
  "connect-src 'self' https://*.clerk.accounts.dev https://*.clerk.com https://clerk.*.com https://*.clerk.dev https://api.openai.com https://www.sefaria.org https://he.wikipedia.org https://www.hebcal.com https://*.sentry.io https://*.ingest.sentry.io https://*.ingest.us.sentry.io https://*.ingest.de.sentry.io",
  "frame-src 'self' https://*.clerk.accounts.dev https://*.clerk.com https://challenges.cloudflare.com",
  "worker-src 'self' blob:",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const SITE_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "Content-Security-Policy", value: CSP_DIRECTIVES },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-site" },
];

/** Headers applied to every API + admin route — marks these as uncacheable and noindex. */
const SENSITIVE_HEADERS = [
  { key: "Cache-Control", value: "no-store" },
  { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
];

/** Vercel: default Node build (no static export). */
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: SITE_HEADERS,
      },
      {
        source: "/api/:path*",
        headers: SENSITIVE_HEADERS,
      },
      {
        source: "/developer/:path*",
        headers: SENSITIVE_HEADERS,
      },
    ];
  },
};

const sentryUploadEnabled = Boolean(
  process.env.SENTRY_AUTH_TOKEN &&
    process.env.SENTRY_ORG &&
    process.env.SENTRY_PROJECT,
);

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  sourcemaps: sentryUploadEnabled ? undefined : { disable: true },
});
