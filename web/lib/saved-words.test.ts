import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  MAX_SAVED_WORDS,
  MAX_WORD_FIELD_CHARS,
  SAVED_WORDS_STORAGE_KEY,
  __resetSavedWordsClerkUserIdForTests,
  clampWordField,
  isIdentitySaved,
  loadSavedWords,
  removeSavedWordByIdentity,
  sanitizeSavedWordsFromJson,
  savedWordIdentityKey,
  setSavedWordsClerkUserId,
  toggleSavedWordIdentity,
} from "./saved-words";

function installWindowWithStorage() {
  const store = new Map<string, string>();
  const localStorage = {
    getItem(key: string) {
      return store.has(key) ? store.get(key)! : null;
    },
    setItem(key: string, value: string) {
      store.set(key, value);
    },
    removeItem(key: string) {
      store.delete(key);
    },
    clear() {
      store.clear();
    },
    get length() {
      return store.size;
    },
    key(i: number) {
      return [...store.keys()][i] ?? null;
    },
  } as Storage;

  vi.stubGlobal("localStorage", localStorage);
  vi.stubGlobal("window", {
    localStorage,
    dispatchEvent: vi.fn(),
  } as unknown as Window & typeof globalThis);
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("saved-words", () => {
  beforeEach(() => {
    installWindowWithStorage();
    __resetSavedWordsClerkUserIdForTests();
  });

  it("clampWordField trims and caps length", () => {
    expect(clampWordField("  hi  ")).toBe("hi");
    expect(clampWordField("x".repeat(MAX_WORD_FIELD_CHARS + 50)).length).toBe(
      MAX_WORD_FIELD_CHARS,
    );
  });

  it("savedWordIdentityKey is stable for same inputs", () => {
    expect(savedWordIdentityKey({ he: "שלום", en: "hello" })).toBe(
      savedWordIdentityKey({ he: "שלום", en: "hello" }),
    );
    expect(savedWordIdentityKey({ he: "שלום", en: "hello" })).not.toBe(
      savedWordIdentityKey({ he: "שלום", en: "shalom" }),
    );
  });

  it("sanitizeSavedWordsFromJson drops invalid and caps list", () => {
    const raw = [
      { he: "א", en: "a", source: "hebrew-web" },
      { he: "", en: "b", source: "hebrew-web" },
      ...Array.from({ length: MAX_SAVED_WORDS + 5 }, (_, i) => ({
        he: `w${i}`,
        en: "",
        source: "hebrew-web" as const,
      })),
    ];
    const out = sanitizeSavedWordsFromJson(raw);
    expect(out).not.toBeNull();
    expect(out!.length).toBeLessThanOrEqual(MAX_SAVED_WORDS);
    expect(out!.every((w) => w.he.length > 0)).toBe(true);
  });

  it("toggleSavedWordIdentity adds and removes", () => {
    const pick = { he: "בוקר", en: "morning" as string | undefined };
    removeSavedWordByIdentity(pick);
    const empty = loadSavedWords();
    expect(isIdentitySaved(empty, pick)).toBe(false);
    const add = toggleSavedWordIdentity(pick);
    expect(add.saved).toBe(true);
    expect(isIdentitySaved(loadSavedWords(), pick)).toBe(true);
    const rm = toggleSavedWordIdentity(pick);
    expect(rm.saved).toBe(false);
    expect(isIdentitySaved(loadSavedWords(), pick)).toBe(false);
  });

  it("persists under storage key", () => {
    toggleSavedWordIdentity({ he: "לילה", en: "night" });
    const raw = window.localStorage.getItem(SAVED_WORDS_STORAGE_KEY);
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw!) as unknown;
    const list = sanitizeSavedWordsFromJson(parsed);
    expect(list?.some((w) => w.he === "לילה")).toBe(true);
  });

  it("persists under Clerk-scoped key when user id is set", () => {
    setSavedWordsClerkUserId("user_test_clerk");
    toggleSavedWordIdentity({ he: "יום", en: "day" });
    const scoped = `${SAVED_WORDS_STORAGE_KEY}:uid:user_test_clerk`;
    const raw = window.localStorage.getItem(scoped);
    expect(raw).toBeTruthy();
    expect(window.localStorage.getItem(SAVED_WORDS_STORAGE_KEY)).toBeNull();
  });
});
