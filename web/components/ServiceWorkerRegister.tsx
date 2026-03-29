"use client";

import { useEffect } from "react";

/**
 * Registers the service worker in production only so dev / HMR stay smooth.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    const ctrl = navigator.serviceWorker.controller;
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((reg) => {
        if (ctrl === null && reg.waiting === null && reg.installing === null) {
          /* fresh registration */
        }
      })
      .catch(() => {
        /* ignore blocked / unsupported */
      });
  }, []);

  return null;
}
