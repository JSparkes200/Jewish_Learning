# Legacy HTML retirement plan (`hebrew-v8.2.html` → `web/`)

**Goal:** Port remaining learner- and platform-critical behavior into Next.js, then **archive** the single-file app and **collapse** auth/storage to one model (managed accounts + server progress, or intentional anonymous-only).

**Sources of truth for gaps:** `web/lib/legacy-parity.ts` (product parity %), `web/lib/html-full-migration.ts` (route/subsystem map), and `hebrew-v8.2.html` (`go('…')` routes, `ivrit_*` keys).

---

## 1. What Next already covers (high level)

- **Shell:** Nav, modals, Next up, PWA/SW, Rabbi **tips** (route-based, not AI).
- **Learn:** Section MCQ + comprehension + stories, alphabet track, gates (alphabet / foundation exit / bridge), specialty tiers, Yiddish track (Next-only product slice).
- **Study:** Practice hub with multiple game types (MCQ, fill, tap, correct sentence, match, translate, word+emoji, grammar) via `StudyPracticeGames`.
- **Reading / Numbers / Roots / Library / Progress:** Hubs and drills exist; some UX depth and data wiring differ from HTML.
- **Developer (Next):** JSON backups, legacy merges (`ivrit_lr`, `ivrit_lib`), passage validator, corpus browse, optional KV sync — **not** HTML’s pose/GIF lab or runtime lexicon “master edits.”

---

## 2. Core features still meaningfully on the legacy side

| Area | Legacy behavior | Next.js today | Gap severity |
|------|-----------------|---------------|--------------|
| **Accounts & session** | Login/create user, `ivrit_users_v1`, `ivrit_session_v1`, per-user scoped keys (`ivrit_lr__user`, …) | Local-first **guest**; optional **anonymous** KV sync (`/api/progress`); dev-only gate bypass | **High** — different trust model |
| **Password + reset** | SHA-256 in browser, reset via Next API when `ivrit_api_origin` set | Same API; Next app does not use `ivrit_users_v1` | **High** until accounts unified |
| **Saved words list** | `ivrit_saved` — bookmarked lemmas, **Saved** screen, flows from reading | No equivalent key or UI (only **saved passages** / `hebrew-web-library-saved-v1`) | **Medium** for 1:1 learners |
| **User vocab from library** | `ivrit_uv` — words extracted from library passages | Not ported | **Medium** (depends on product need) |
| **“Texts” reading mode** | `go('texts')` / `rTexts` — JT category strip + prev/next | Reading hub overlaps (JT, RD, saves) but not necessarily the same IA | **Low–medium** |
| **Word detail / Rabbi** | `openWordDetails()`, corpus examples + **Ask the Rabbi** with optional OpenAI key | Tips only; no in-drill AI or `ivrit_openai_key` | **Medium** if you rely on AI Rabbi |
| **Mastery & pools** | `getSectionPool` / full `D`-driven pools, richer `ivrit_lr` workflows | Section packs in TS + `POST /api/mcq-choices`; `vocabLevels` + `unlockMastered` aligned but not identical | **Medium** (quality/depth) |
| **Progress dashboard** | `rDash` widgets | Progress + Study + specialty badges; “full widget parity” called out as partial | **Low–medium** |
| **Developer power tools** | Pose sheet extract, GIF/home anim pipeline, **master edits** to words/sentences/grammar (`ivrit_dev_master_edits_v1`), design page simulator | Explicitly **out of scope** for product (`DeveloperLegacyHtmlTools`); validator + static data in repo | **Low** for learners; **high** if you still author via HTML |
| **NLI / source prefs** | `ivrit_source_prefs`, Rabbi source cache | Not in Next | **Low** unless Dictionary features return |
| **Home media / poses** | `ivrit_home_media_v1`, Rabbi pose classes tied to assets | Next home uses different hero/carousel | **Low** (branding) |

`web/lib/html-full-migration.ts` still lists **grammar (`GRAM`)** and some **Study** details as behind HTML; several Study modes **do** exist in Next now — treat that file as living: update statuses when retiring HTML.

---

## 3. Migration phases (recommended order)

### Phase A — Data continuity (no learner left behind)

1. **CLI merge (implemented):** From `web/`, run  
   `npm run merge:legacy-backup -- --legacy <dump.json> --out <app-backup.json>`  
   Optional: `--base` / `--base-library` (existing Next exports), `--library-out`, `--saved-words port|drop`.  
   Logic lives in `web/lib/phase-a-legacy-merge.ts`. Example dump shape: `docs/legacy-localstorage-dump.example.json`.
2. **App backup schema:** New exports use **schema v3** (`web/lib/learn-progress-backup.ts`): Hebrew + optional Yiddish + optional `savedWords` (from legacy `ivrit_saved`). **v2 files still import.** Saved words persist under `hebrew-web-saved-words-v1` when merged/restored from Developer.
3. **`ivrit_openai_key`:** Never written into backup JSON. If present in the dump, the CLI prints a reminder to set **`OPENAI_API_KEY`** on the server (Vercel) for the future Ask Rabbi API — see `docs/vercel-environment.md`.
4. **Saved words (`ivrit_saved`):** Use `--saved-words port` (default) to map legacy rows into `savedWords`; use `drop` to omit them from the output (Next progress/library still merge).
5. **`ivrit_uv`:** Still optional follow-up (not in this CLI); fold into Study/corpus or a later import if needed.

### “Burn the bridge” date (delete legacy dev paths)

Pick **one** trigger so the team does not defer forever:

| Strategy | When to delete `hebrew-v8.2.html`, HTML-only Developer copy, and `ivrit_*` merge UI |
|----------|----------------------------------------------------------------------------------------|
| **Calendar** | **90 days** after you announce “Next-only” (e.g. blog + in-app banner). On that date, tag a release `legacy-cutoff`, archive the HTML to `archive/`, remove primary links. |
| **Metric** | When **&lt; 1%** of weekly active use is the static HTML (measure via analytics or support volume) **for four consecutive weeks**, schedule deletion the following sprint. |
| **Quarterly** | If neither is instrumented yet, use the **first deploy Monday of Q+1** as a default deadline and adjust once metrics exist. |

After the burn: keep **one** migration story only — JSON v3 restore in Developer or support-assisted import — then delete redundant legacy merge code in a second PR to avoid blocking the file removal.

### Phase B — Learner feature parity (shrink reasons to open HTML)

4. **Reading IA:** Reconcile **Texts** vs `/reading` (JT tabs, navigation) so JT-heavy users are not pulled back to HTML.
5. **Mastery / pools:** Optional pass to align hardest legacy cases (Bet–Dalet pool size, word-detail affordances) with `corpus-d.ts` and section data — driven by support feedback, not theory.
6. **Progress dashboard:** Close gaps called out in `legacy-parity` / `html-full-migration` if any widget is still a user request.

### Phase C — Platform: one auth + storage story

7. **Pick direction** (see §4): e.g. **Clerk / Supabase Auth / Auth0** (recommended in `docs/auth-security.md`) **or** deliberate **anonymous + KV only** with clear limits.
8. **Implement:** Server-side user id; map progress + library + (if any) saved words to **one** backing store; deprecate `ivrit_*` scoping and client-side password hashes for the main app.
9. **Password reset:** Keep Resend + allowlist only for **legacy HTML during transition**; after retirement, reset flows belong to the auth provider.
10. **Remove dual wiring:** Drop `IVRIT_API_ORIGIN` / `ivrit_api_origin` from docs and HTML; single deployment URL for APIs.

### Phase D — Retire the file

11. **Freeze** `hebrew-v8.2.html` (tag release + “last HTML build”).
12. **Replace GitHub Pages** (if used) with redirect or static “moved” page → Vercel Next app.
13. **Archive** HTML to `archive/hebrew-v8.2.html` or a branch; remove from default deploy.
14. **Update** `docs/next-migration.md`, `README.md`, and parity trackers to “Next-only.”

### Phase E — Authoring tools (optional)

15. If you still need **poses / GIF / master edits**, either **one-off scripts** in `web/scripts/` or a **minimal internal** Next route behind strong auth — not a learner-facing duplicate of the old Developer tab.

---

## 4. Simplifying auth & storage after cutover

| Today (dual) | Target (single) |
|--------------|-----------------|
| HTML: `ivrit_users_v1` + scoped `ivrit_lr__*` | Provider user id → **one** progress document (Postgres/KV/edge) keyed by `userId` |
| Next: many `hebrew-web-*` keys + optional KV Bearer | Same keys **namespaced by account** or replaced by server state + thin client cache |
| Reset: allowlist JSON + 6-digit codes for HTML | Provider-managed reset + optional admin tooling |
| “Developer” unlock cookie | Keep for **builders only**; never a substitute for learner auth |

**Principle:** Learners should never depend on two localStorage schemas; builders migrate once via Developer export, then HTML goes away.

---

## 5. Success criteria

- No production link serves `hebrew-v8.2.html` as the primary app.
- Parity items you care about (saved words, AI Rabbi, etc.) are either **shipped in Next** or **explicitly retired** with a short user-facing note.
- **One** auth and **one** progress persistence story documented in `docs/vercel-environment.md` / `docs/auth-security.md`.
- `computeLegacyParity()` / `computeHtmlFullMigration()` updated to reflect Next-only or deleted once trackers are obsolete.

---

## 6. Immediate next steps (this week)

1. Confirm **must-have** legacy features with anyone still on HTML (saved words? AI Rabbi? multi-user on one device?).
2. Update **`html-full-migration.ts`** Study + grammar rows to match current `StudyPracticeGames` (avoid planning against stale “not ported” notes).
3. Schedule **Phase C** auth spike (one provider, proof-of-concept `/api/progress` → user-scoped).
