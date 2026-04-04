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
        <h1 className="text-lg font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Please refresh the page or try again later.
        </p>
      </body>
    </html>
  );
}
