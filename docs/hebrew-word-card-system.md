# Hebrew Word Card — design specification

**Status:** specification (implementation-ready)  
**Stack alignment:** Next.js App Router (`web/app`), Tailwind (`web/tailwind.config.ts`), shared tokens (`web/app/globals.css`), Hebrew wrapper (`web/components/Hebrew.tsx`), UI tone (`docs/ui-tone.txt`).

**UI/UX Pro Max workflow:** Design-system scripts were run with education-focused queries; retrieved palettes (e.g. indigo + “playful” pairings) **conflict with this product** (adult learners, warm scholarly, existing parchment/sage brand). This document **supersedes** those automated style/typography picks and keeps Pro Max **process** items: contrast checks, motion windows, focus/hover discipline, no emoji-as-icons.

---

## 1. Goals and pedagogy

| Principle | Design implication |
|-----------|-------------------|
| **Cognitive load** | Primary card shows only Hebrew + transliteration + English; deeper content lives behind “Ask the Rabbi” or progressive disclosure. |
| **Bilingual UI** | English chrome stays LTR; Hebrew content is always `dir="rtl"` `lang="he"` (use `<Hebrew>` or equivalent). Do not mirror the whole page RTL unless the route is Hebrew-only. |
| **Spaced repetition–friendly** | Card footprint stable across reviews; expansion does not reflow unrelated columns jarringly (prefer measured height or dedicated layer). |
| **Levels** | Same shell, different **density** of optional blocks (beginner → hide; advanced → show morphology/shoresh). |
| **WCAG AA** | Body text ≥ 4.5:1 on card surfaces; large Hebrew headline ≥ 3:1 vs background; focus rings visible; expansion announced to AT. |

**Competitive scan (patterns, not visual clone):**

- **Duolingo:** strong primary prompt, single CTA, celebratory feedback — adopt **clear hierarchy** and **one main action**, reject **gamified noise** for this app.
- **LingQ:** reading-first, in-context highlights — adopt **example sentences as first-class** in Rabbi content.
- **Drops:** icon-heavy, session bursts — reject **icon-for-every-word**; use **text + optional audio** only.
- **Memrise:** mnemonics/community — optional future `communityNote`; keep **editorial voice** (“Rabbi”) distinct.

**Innovation vs. generic flashcards:** combine **manuscript / commentary** metaphor (secondary insight as “margin”) with **level-aware density** and **phrase-aware layout** (multi-line RTL blocks, stable baselines for nikkud).

---

## 2. Design tokens (integrate with existing theme)

Map to Tailwind theme colors already in `tailwind.config.ts`: `parchment`, `ink`, `sage`, `rust`, `burg`, `amber`. Prefer utilities over new hex unless a role is missing.

### 2.1 Spacing scale (card-specific)

Use a **4px base** consistent with current cards (`p-4`, `gap-2`).

| Token | Value | Use |
|-------|-------|-----|
| `hwc-space-xs` | 4px | Tight stacks (label to text) |
| `hwc-space-sm` | 8px | Inner groups |
| `hwc-space-md` | 16px | Section gaps inside card |
| `hwc-space-lg` | 24px | Primary ↔ secondary zones |
| `hwc-space-xl` | 32px | Card padding on large screens |

**Tailwind mapping:** `gap-1`, `gap-2`, `gap-4`, `gap-6`, `p-4 md:p-6`.

### 2.2 Typography

| Role | Spec | Tailwind-style mapping |
|------|------|-------------------------|
| Hebrew headline | 24–32px mobile, 28–36px desktop; `line-height` ≥ 1.35 for nikkud | `text-2xl md:text-3xl font-hebrew font-medium leading-relaxed` |
| Transliteration | 13–14px; Latin; muted | `text-sm text-ink-muted font-body tracking-wide` |
| English gloss | 16–18px; sentence case | `text-base md:text-lg text-ink font-body` |
| Rabbi label | 10px uppercase label | `font-label text-[10px] uppercase tracking-[0.18em] text-sage` |
| Rabbi body | 14–15px relaxed | `text-sm leading-relaxed text-ink-muted` |
| Example Hebrew | 15–17px RTL | `font-hebrew text-base text-ink` |
| Example English | 13–14px | `text-xs sm:text-sm text-ink-muted` |

**Pairings (directions differ slightly; default app pairing):** keep **`font-hebrew`** for all Hebrew; **UI labels** `font-label`; **English body** `font-body` / Georgia stack per `tailwind.config.ts`.

### 2.3 Color roles

| Role | Token | Existing mapping |
|------|--------|------------------|
| Card surface | `hwc-surface` | `bg-parchment-card/90` or `surface-elevated` |
| Primary border | `hwc-border` | `border-ink/12` |
| Accent / Rabbi | `hwc-accent` | `border-sage/20`, `text-sage`, `bg-sage/5` |
| Warning / optional “advanced” badge | `hwc-warm` | `amber` or `rust` sparingly |
| Focus ring | `hwc-focus` | `ring-2 ring-sage ring-offset-2 ring-offset-parchment-card` |

### 2.4 Elevation

| Layer | Use |
|-------|-----|
| Primary card | `surface-elevated` or `shadow-elevated` + `rounded-2xl` |
| Rabbi panel (elevated) | `shadow-elevated-lg`, `border-sage/25` when expanded |
| Inline expansion | **No** extra shadow; `border-t border-ink/10` separator |

### 2.5 RTL-specific

- Hebrew blocks: `dir="rtl"` on element or `<Hebrew>`.
- Transliteration and English gloss: `dir="ltr"` explicitly on those nodes if nested inside RTL container.
- **Logical properties:** prefer `ps-` / `pe-` / `ms-` / `me-` for padding/margin when mixing scripts in one row.
- **Icons** (chevron for expand): mirror in RTL if it implies “forward”; or use **plus/minus** to avoid direction ambiguity.

### 2.6 Motion

- **Duration:** 150–200ms (micro), 200–250ms (panel open).
- **Easing:** `ease-out` for enter, `ease-in` for leave (or `transition-colors` only for hovers).
- **`prefers-reduced-motion: reduce`:** swap height animation for instant show/hide; keep color transitions ≤ 150ms or disable.

---

## 3. Component anatomy (textual diagram)

### 3.1 Primary card (collapsed)

```
┌─────────────────────────────────────────────┐
│  [optional] Level badge / phrase chip         │
│                                             │
│           שָׁלוֹם   ← RTL Hebrew headline      │
│                                             │
│   shalom          ← LTR transliteration     │
│                                             │
│   peace, hello    ← English gloss           │
│                                             │
│   [ optional: audio / save word ]            │
│                                             │
│ ───────────────────────────────────────────  │
│   [ Ask the Rabbi ▼ ]  ← single primary CTA  │
└─────────────────────────────────────────────┘
```

### 3.2 Secondary (Rabbi) content — logical blocks

Order for **beginner → advanced** (hide empty blocks):

1. `examples[]` — Hebrew line + English gloss each  
2. `root` / `shoresh` — only if pedagogically relevant  
3. `morphology` / `grammarNotes[]`  
4. `denotation`, `nuance`, `alternatives[]`, `contextNotes[]`  
5. `furtherReading[]` (URLs optional, styled as links)

---

## 4. Variants

| Variant | When | Layout notes |
|---------|------|--------------|
| `level: beginner \| intermediate \| advanced` | Curriculum | Controls which optional fields render; same chrome. |
| `kind: lemma \| phrase \| idiom \| collocation` | Content type | **Phrase:** allow multi-line Hebrew; slightly smaller headline or two-line clamp; chip “Phrase”. |
| `density: comfortable \| compact` | Lists / grids | Compact: smaller padding, hide transliteration on xs optional. |
| `interactive: static \| flippable` | Deck mode | Flippable reserved for SRS decks; Rabbi still separate control. |

---

## 5. Five design directions

Each uses the **same data model**; differences are layout, hierarchy, expansion pattern, and type/color emphasis.

### A. Warm academic (recommended — matches current app)

- **Visual:** Parchment card, `surface-elevated`, sage accent on Rabbi zone.  
- **Layout:** Vertical stack; Hebrew centered or right-aligned in a fixed “script block”.  
- **Hierarchy:** Hebrew largest; English gloss medium; transliteration smallest between them.  
- **Rabbi interaction:** **Inline expansion** below CTA with `border-t` (see §6.1).  
- **Typography:** Default `font-hebrew` + `font-body` + `font-label`.  
- **Palette:** Existing `parchment` / `ink` / `sage`.  
- **Pros:** Consistent with `McqDrill` / `ComprehensionDrill` / Library; low implementation risk.  
- **Cons:** Long Rabbi content makes the card tall; needs “max height + scroll” on small screens.

### B. Minimal modern

- **Visual:** Flat `bg-parchment-card`, **no** heavy shadow; 1px `border-ink/12`.  
- **Layout:** Generous whitespace; Hebrew left margin aligned for RTL block (not centered).  
- **Hierarchy:** English gloss **above** transliteration (unusual; tests reading-first).  
- **Rabbi:** **Slide-up sheet** (see §6.2) to avoid endless vertical scroll.  
- **Typography:** Slightly smaller Hebrew (`text-xl`), larger English.  
- **Palette:** Monochrome ink + single sage CTA.  
- **Pros:** Calm, low cognitive load; good for dense lesson pages.  
- **Cons:** Less “warm”; hierarchy flip may confuse users expecting Hebrew-first.

### C. Manuscript-inspired

- **Visual:** Subtle inner border (`double` or second `ring-1` in sage/ink); optional **margin column** for Rabbi on `lg+`.  
- **Layout:** Primary in “text block”; Rabbi as **right rail** (LTR UI) commentary.  
- **Hierarchy:** Transliteration in **small caps** Latin feel (`tracking-widest text-xs uppercase`).  
- **Rabbi:** **Side-by-side** on desktop; collapses to inline on mobile (see §6.3).  
- **Typography:** Slightly more serif-forward English (already Georgia in stack).  
- **Palette:** `parchment-deep` panels for Rabbi rail.  
- **Pros:** Culturally resonant; separates “text” from “commentary.”  
- **Cons:** Desktop-only payoff; mobile collapses to complex stacked layout.

### D. Split bilingual column

- **Visual:** Vertical divider at `md+`.  
- **Layout:** **LTR column:** transliteration + English + Rabbi summary. **RTL column:** Hebrew + examples in Hebrew.  
- **Hierarchy:** Equal columns; Hebrew column slightly wider (55/45).  
- **Rabbi:** Primary CTA in LTR column opens detail **below** LTR column only.  
- **Typography:** Strict `dir` per column.  
- **Palette:** Sage divider `border-sage/20`.  
- **Pros:** Excellent for **intermediate** bilingual brains; clear script separation.  
- **Cons:** Narrow phones = stacked variant mandatory; more CSS logic.

### E. Editorial / magazine

- **Visual:** Strong contrast: Hebrew as **display** size; English as **deck** line.  
- **Layout:** Rabbi content as **pull-quote** (`border-l-4 border-sage pl-4`).  
- **Hierarchy:** One “hero” line of Hebrew; everything else secondary.  
- **Rabbi:** Inline expansion with animated **opacity** only (no height spring).  
- **Typography:** Larger line-height for “editorial” feel.  
- **Palette:** `burg` or `rust` accent for quotes (sparingly).  
- **Pros:** Memorable, good for **idioms** and **phrases**.  
- **Cons:** Can feel heavy for simple vocabulary drills.

---

## 6. Three interaction models for “Ask the Rabbi”

### 6.1 Inline expansion (within the card)

- **Behavior:** `<button>` toggles `aria-expanded`; region `id` linked via `aria-controls`; content in DOM (or lazy-rendered on first open).  
- **Pros:** Simplest a11y, no focus trap, works offline, good for **beginner** short copy.  
- **Cons:** Card height spikes; push layout down; needs `max-h` + `overflow-y-auto` for long content.

### 6.2 Slide-up secondary card / sheet

- **Behavior:** Fixed or sticky bottom sheet on mobile; centered modal on tablet (`AppShell` modal pattern like `ReadingPageClient` help).  
- **Pros:** Preserves page layout; familiar on phones; good for **intermediate/advanced** long Rabbi content.  
- **Cons:** Focus trap + Esc to close required; more implementation work; two scroll contexts.

### 6.3 Side-by-side dual card (desktop)

- **Behavior:** Grid `lg:grid-cols-2`; primary left (LTR UI) or right depending on preference — **recommend** primary **start** side = Hebrew block for RTL script prominence in reading apps.  
- **Pros:** Scanning without expansion click; excellent for **desktop study**.  
- **Cons:** Mobile must degrade to stack or sheet; duplicate titles for AT unless `aria-labelledby` carefully set.

---

## 7. Interaction states

| State | Primary card | Rabbi CTA |
|-------|--------------|-----------|
| Default | `border-ink/12` | `btn-elevated-secondary` or sage outline variant |
| Hover | `hover:border-sage/30` (subtle) | brightness / border deepen |
| Focus visible | ring sage | ring sage |
| Expanded | optional `ring-1 ring-sage/30` | `aria-expanded=true`, label “Hide Rabbi note” |
| Loading (async Rabbi) | skeleton lines | `aria-busy=true` on region |
| Error | `role="alert"` | retry button |

---

## 8. Responsive behavior

| Breakpoint | Rule |
|------------|------|
| `< 640px` | Single column; Rabbi full width; touch targets ≥ 44px height for CTA. |
| `sm–md` | Optional two-column **examples** (Hebrew / English) if space allows. |
| `lg+` | Enable manuscript **rail** or **split bilingual** variants only if product chooses those directions. |

**Container:** `max-w-lg` for standalone study; `max-w-2xl` for phrase/advanced if examples are wide.

---

## 9. TypeScript data models

Three interfaces are defined in **`web/types/hebrew-word-card.ts`**:

1. **`HebrewWordCardBeginner`** — `he`, `transliteration`, `meaningEn`, short `examples`, optional `rabbiShort`.  
2. **`HebrewWordCardIntermediate`** — adds `root`, `grammarHints`, richer `examples`, `rabbi` object.  
3. **`HebrewWordCardAdvanced`** — full morphology, shoresh, denotation, nuance, alternatives, multi-sentence examples, nested metadata.

Implementations may use a **single union type** `HebrewWordCardContent` + `level` to pick allowed fields at runtime.

---

## 10. Implementation notes (Next.js + Tailwind + RTL + a11y)

- **Server vs client:** Card can be server-rendered if static; **expansion** and **audio** require `"use client"` — split `HebrewWordCard.tsx` (client shell) vs presentational children or pass slots.  
- **Tailwind:** Reuse `Hebrew`, `font-hebrew`, `font-label`, `surface-elevated`, `btn-elevated-*` from `globals.css`.  
- **RTL:** Never set `dir="rtl"` on `<html>` for bilingual routes; scope to Hebrew nodes.  
- **Accessibility:**  
  - Rabbi toggle is a **button**, not `div`.  
  - Expanding region: `aria-expanded`, `aria-controls`, stable `id`.  
  - Use `aria-live="polite"` only if content streams in after delay; static expansion usually unnecessary if focus moves to region heading.  
- **Performance:** Lazy-load heavy Rabbi JSON or MDX with `dynamic()` if bundle size grows.  
- **Testing:** Visual regression on Hebrew with **dagesh + nikkud**; check **no clipping** of combining marks.

---

## 11. Suggested file layout (future PR)

```
web/components/hebrew-word-card/
  HebrewWordCard.tsx          # client: expansion + optional audio
  HebrewWordCardPrimary.tsx   # presentational
  HebrewWordCardRabbi.tsx     # presentational + sections by level
  hebrew-word-card-tokens.ts  # optional: string constants mirroring §2
```

**Shipped primitives:** `web/components/RabbiCard.tsx`, `web/app/api/rabbi/route.ts`, `web/lib/rabbi-llm.ts`, `scripts/query_lightrag.py`.

**Related docs:** `docs/ui-patterns-learn.md` (quiz/reading patterns), `docs/ui-tone.txt` (voice for Rabbi copy), `web/prompts/ask-the-rabbi-word-card-system.md` (LLM system prompt for Ask the Rabbi + LightRAG).
