# Next.js migration tracker

## Location

- **New app:** `web/` (Next.js 15, App Router, Tailwind, TypeScript).
- **Legacy:** `hebrew-v8.2.html` (unchanged for now).

## Conventions

- Keep **small, related components in the same file** when it stays readable (e.g. `app/page.tsx` for the home shell).
- Prefer **TypeScript** and **Tailwind**; avoid raw HTML strings in app code.

## Hosting

- **Vercel:** set project **Root Directory** to `web`. Next config uses the default Node build (no static `export`).
- **Env vars & API data for Vercel:** [`docs/vercel-environment.md`](./vercel-environment.md).
- Legacy GitHub Pages from the single HTML file can stay until you cut over DNS / main URL to Vercel.

## Canonical app

- After **feature parity**, treat **`web/`** as the only shipped UI; retire or archive `hebrew-v8.2.html`.

## Document direction

- Root: **`dir="ltr"`** / `lang="en"`.
- Hebrew strings: **`Hebrew`** wrapper → `dir="rtl"` `lang="he"` on that subtree only.

## Parity score (UI)

- Weighted checklist + %: **`web/lib/legacy-parity.ts`** (source of truth).
- **Progress** shows a compact card; **Developer** shows the full breakdown (anchor `#legacy-parity`). Update item `status` there as features ship.

## Phase checklist

- [x] Scaffold `web/` (package.json, Tailwind, TS, ESLint).
- [x] Home shell + routes: `/learn`, `/study`, `/library`, `/progress`, `/developer`.
- [x] Shared **`AppShell`** + hamburger **main nav** (matches legacy tabs).
- [x] **Modal layer** (`openModal` / `closeModal` via `useAppShell()`).
- [x] **Next up** bar (collapsed FAB / expanded strip; hidden on `/`; default suggestion → Learn).
- [x] Wire Next up from Learn progress (`getNextLearnUp` + `hebrew-web-learn-progress` event); persist expanded preference (`hebrew-web-next-up-expanded`).
- [~] **Header identity:** optional local **display name** (`hebrew-web-local-profile`) in Developer — not server auth.
- [x] **Cloud Learn backup:** Vercel KV + `/api/progress` + Developer sync key (Bearer); Progress page links to it; not a full account system — see [`docs/cloud-progress.md`](./cloud-progress.md).
- [ ] Auth + user-scoped storage abstraction (Clerk / accounts when needed).
- [x] **Alphabet track** (`/learn/alphabet`): print 22 + sofit 5, trace + final exam; optional gate.
- [~] **Learn:** MCQ + comprehension + level stories. Aleph **1-read** has story + vocab MCQ; **1-nums** expanded; `/learn/[n]/story` has mini-quiz (uses `1-read` pack on level 1). Bet–Dalet MCQs in `section-drills-upper-levels.ts` (~8+ items/section on roots packs); comprehension 6 questions each. **Learn home** (`LearnPageClient`): per-level **course prompts lv≥2** line + **`LEARN_PROGRESS_EVENT`** sync. **Course mastery list** (`getMasteryWordListForLevel`) recomputes each call (no stale cache when drills change). **Unlocks:** `unlockIds` + `unlockAfter` match legacy; `unlockMastered` uses **max(subsections completed on level, course target words with `vocabLevels≥2`)** when `vocabLevels` exists; **`vocabLevels` from** legacy `ivrit_lr` merge **and** in-app MCQ (`recordVocabPracticeForPrompt`). **Still in legacy:** dedicated mastery UI, full corpus `D` depth, roots drill UX, richer `ivrit_lr__*` workflows.
- [x] **Progress** page: Learn completion stats + **daily streak** (UTC, aligned with legacy; MCQ/comprehension answers + mark complete) + **word-level / gate summary** (per-level course prompts at lv≥2, effective gate score vs max `unlockMastered`).
- [x] **Study** page: suggested next, streak + MCQ lifetime tally, **word-level / gate snapshot** (active level), active-level snapshot, story shortcuts (`StudyPageClient`).
- [x] **Library** page: curated links + filter + **local saved passages** (`lib/library-saved.ts`, key `hebrew-web-library-saved-v1`) + **merge from legacy** `ivrit_lib` / `ivrit_lib__<user>` (`lib/legacy-library-import.ts`, Developer + Library UI).
- [x] **Developer:** `DeveloperTools` — storage keys, reset Learn/Next-up, drill section list, **merge legacy `ivrit_lr` / `ivrit_lv`**, **merge legacy `ivrit_lib`**, **JSON Learn backup** (`lib/learn-progress-backup.ts`), **Library saves JSON**, **cloud KV Learn backup** (`/api/progress`, `docs/cloud-progress.md`).
- [x] **Rabbi:** header **?** → modal with route-based tips (`lib/rabbi-tips.ts` + `RabbiTipBody`).
- [x] **PWA-ish:** `app/manifest.ts`, `public/hebrew-icon.svg`, `app/icon.tsx`, `appleWebApp` metadata (install / home-screen friendly).
- [x] **Service worker (prod):** `public/sw.js` caches `/_next/static/*` only; `ServiceWorkerRegister` skips in dev.

## Open questions (answer when ready)

1. **Deploy target:** stay on GitHub Pages (`out/`) or move to Vercel?
2. **`dir` on `<html>`:** RTL globally vs LTR shell with RTL blocks only?
