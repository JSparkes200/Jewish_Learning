"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import "./globals.css";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en" dir="ltr">
      <body className="font-body min-h-dvh bg-parchment-grain p-6 text-ink antialiased">
        <h1 className="text-lg font-semibold">Something slipped</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Try a refresh — if it keeps happening, step away for a moment and come
          back; your local progress is usually still in the browser.
        </p>
      </body>
    </html>
  );
}
