# Hebrew — Next.js app (primary target after parity)

This folder is the **main app** once feature parity with `hebrew-v8.2.html` is reached. Until then, both can coexist in the repo.

## Stack

- **Next.js 15** (App Router) — optimized for **Vercel**
- **React 19**, **TypeScript**, **Tailwind CSS 3**

**Course unlocks:** `unlockMastered` uses the **higher** of (a) completed subsections on that level and (b) course target words with `vocabLevels[h]≥2` (`course-mastery-words.ts`). `vocabLevels` comes from **legacy import** (`ivrit_lr` → Developer) and from **MCQ practice** in Learn (each graded answer adjusts the prompt Hebrew ±1, capped 0–5; ≥2 counts).

**Backup:** Developer → **Download JSON** / merge or replace file (`lib/learn-progress-backup.ts`). Legacy HTML progress: Developer → merge `ivrit_lr`.

**Library:** Save Hebrew snippets (`hebrew-web-library-saved-v1`). Merge from legacy `ivrit_lib` (and scoped key) via Library or Developer — see `lib/legacy-library-import.ts`.

## Local dev

```bash
cd web
npm install
npm run dev
```

`npm run dev` uses **Turbopack** (recommended in Next 15). Use `npm run dev:webpack` only if you need the Webpack dev server.

### `TypeError: __webpack_modules__[moduleId] is not a function`

This usually comes from a **stale dev cache** or **Fast Refresh** getting out of sync (common with **two browser tabs/windows** on the same dev URL).

1. Stop the dev server.
2. Run **`npm run clean`** (deletes the `web/.next` folder).
3. Start again with **`npm run dev`** (Turbopack).

If you still use **`npm run dev:webpack`**, do a **hard refresh** (Ctrl+Shift+R) in every open tab after big edits, or keep a **single** tab open while developing.

## Deploy on Vercel (GitHub import)

1. Import the **same GitHub repo** you already use.
2. In the Vercel project **Settings → General → Root Directory**, set **`web`**.
3. Framework preset: **Next.js** (auto-detected).
4. Deploy — no `output: "export"`; this is a standard Node build.

## UI conventions

- **Document:** `lang="en"` `dir="ltr"`.
- **Hebrew copy:** wrap in `<Hebrew>` (`components/Hebrew.tsx`) so those nodes get `dir="rtl"` `lang="he"` and the Hebrew font.
- **Shell:** `AppShell` (`components/AppShell.tsx`) — sticky top bar, hamburger → **Home, Learn, Study, Numbers, Roots, Library, Reading, Progress, Roadmap, Developer**.
- **Modal host:** `useAppShell().openModal(node)` / `closeModal()` — full-screen dim + dialog card (used for course/Library/Rabbi during migration).
- **Next up:** Collapsed 📚 FAB bottom-left; tap to expand strip. Hidden on **/**. Target is derived from **Learn** progress (first incomplete unlocked section); updates when you save progress or change routes. Expanded/collapsed state persists in `localStorage` (`hebrew-web-next-up-expanded`). You can still call `useAppShell().setNextUp(...)` for demos; it resets on the next navigation or progress save.

## Build

```bash
npm run build
npm start
```

Output is `.next/` + server start (Vercel runs this for you).

## PWA / home screen

`app/manifest.ts` + `public/hebrew-icon.svg` support **Add to Home Screen** on many browsers.

In **production** builds only, `public/sw.js` registers and caches **`/_next/static/*`** hashed assets for faster repeat visits. It does not cache HTML or RSC. Dev mode skips registration so HMR stays reliable.

Set **`NEXT_PUBLIC_SITE_URL`** (see `.env.example`) on Vercel for correct Open Graph URLs.

## APIs & environment

| Route | Env vars | Data in repo |
| --- | --- | --- |
| `POST /api/mcq-choices` | None | `data/corpus-d.ts` (regenerate: `npm run extract:corpus-d`) |
| `POST /api/auth/request-reset` | `AUTH_RESET_EMAIL_MAP`, optional `RESEND_*`, `DEMO_RESET_CODE`, optional `AUTH_CORS_ORIGINS` | Template: `data/auth-reset-email-map.example.json` (real map only on Vercel). **Production** returns **503** without KV. |
| `POST /api/auth/confirm-reset` | Same KV + CORS as request-reset | — |
| Sentry | Optional `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_DSN`, build-time `SENTRY_ORG` / `SENTRY_PROJECT` / `SENTRY_AUTH_TOKEN` | Error reporting + optional source maps |

**Full Vercel checklist:** [`docs/vercel-environment.md`](../docs/vercel-environment.md) (what to add in the dashboard; nothing auto-uploads from Git except your code).

**Legacy → Next backup (Phase A):** [`docs/legacy-retirement-plan.md`](../docs/legacy-retirement-plan.md) — `npm run merge:legacy-backup` in `web/` merges a localStorage JSON dump into schema **v3** (optional `savedWords`, library file). Example dump: [`docs/legacy-localstorage-dump.example.json`](../docs/legacy-localstorage-dump.example.json).

## Password reset API (optional)

Used by the legacy HTML app when `localStorage.ivrit_api_origin` points at this deployment.

- Set **`AUTH_RESET_EMAIL_MAP`** (one-line JSON) and optionally **`RESEND_API_KEY`** / **`RESEND_FROM`** on Vercel.
- Link **Vercel KV** so codes persist across serverless instances.
- Copy **`web/.env.example`** → `.env.local` for local tests.

## Next steps

See `docs/next-migration.md`, `docs/auth-security.md`, and `docs/vercel-environment.md` in the repo root.
