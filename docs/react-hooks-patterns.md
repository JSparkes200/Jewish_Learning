# React Hooks in this repo (rules-of-hooks)

CI runs `npm run lint` in `web/`, which enables **`react-hooks/rules-of-hooks`**. A hook call is only valid when it runs **on every render** of the component, in the **same order**, and **not** after a conditional `return`.

## Red flags (search / review)

1. **`return (...)` before `useMemo` / `useCallback` / `useEffect`**  
   If a component returns early for “unknown id”, “locked section”, etc., **all** hooks must appear **above** those returns.

2. **Hooks inside `if`, `for`, or nested functions**  
   Exception: custom hooks (`useThing()`) are fine; built-in hooks must stay at the top level of the component body.

3. **Derived data that used to live after an early return**  
   Move it into `useMemo` (or compute before returns without hooks) so hooks stay grouped at the top.

## Fix pattern (Learn sections)

Reference implementation: `web/app/learn/[level]/[sectionId]/LearnSectionClient.tsx`.

1. Resolve `sec` / `unlocked` with **`useMemo`** (safe when missing).
2. Resolve packs, prep cards, **`activities`** with **`useMemo`** — depend on `sec`, `sectionId`, `level`, etc.
3. Put **`useCallback`** handlers after memos, **`useEffect`** after callbacks (or grouped with other effects — order must stay stable).
4. **Only then** `if (!sec) return …`, `if (!unlocked) return …`, then JSX that assumes `sec` is defined.

## Quick verification

```bash
cd web
npm run lint
npx vitest run
```

If lint reports “Hook is called conditionally”, open the file at the line given and move that hook (and any hooks below it) above the earliest `return` in the component.
