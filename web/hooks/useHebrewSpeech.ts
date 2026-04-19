"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type SpeechRate = 0.5 | 0.75 | 1.0;

export interface HebrewVoice {
  voice: SpeechSynthesisVoice;
  label: string;
  /** Guessed gender from voice name heuristics */
  gender: "female" | "male" | "unknown";
}

/** Heuristic gender detection from voice name */
function guessGender(name: string): "female" | "male" | "unknown" {
  const n = name.toLowerCase();
  // Common Hebrew/Israeli voice names
  if (/carmit|yael|tamar|miriam|noa|female|woman/i.test(n)) return "female";
  if (/asaf|itai|yoav|uri|male|man/i.test(n)) return "male";
  return "unknown";
}

function buildVoiceLabel(v: SpeechSynthesisVoice): string {
  // Strip "(he-IL)" / "Hebrew (Israel)" clutter and use a clean name
  const name = v.name
    .replace(/\(he[-_]IL\)/gi, "")
    .replace(/Hebrew \(Israel\)/gi, "")
    .replace(/Microsoft\s+/i, "")
    .replace(/Google\s+/i, "Google ")
    .trim();
  const gender = guessGender(v.name);
  const genderTag = gender === "female" ? " ♀" : gender === "male" ? " ♂" : "";
  return `${name}${genderTag}`;
}

function loadHebrewVoices(): HebrewVoice[] {
  if (typeof window === "undefined") return [];
  const all = window.speechSynthesis.getVoices();
  const he = all.filter((v) => v.lang.startsWith("he") || v.lang === "iw");
  if (he.length === 0) return [];
  return he.map((v) => ({
    voice: v,
    label: buildVoiceLabel(v),
    gender: guessGender(v.name),
  }));
}

/** Split Hebrew text into tokens preserving spaces so we can reconstruct */
function tokenize(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean);
}

export interface UseHebrewSpeechReturn {
  voices: HebrewVoice[];
  selectedVoice: HebrewVoice | null;
  setSelectedVoice: (v: HebrewVoice) => void;
  rate: SpeechRate;
  setRate: (r: SpeechRate) => void;
  /** Currently speaking utterance key (null = idle) */
  activeKey: string | null;
  /** Index of the word currently being spoken within the active utterance */
  activeWordIndex: number;
  speak: (text: string, key: string) => void;
  stop: () => void;
}

const VOICE_STORAGE_KEY = "hebrew-tts-voice";
const RATE_STORAGE_KEY = "hebrew-tts-rate";

export function useHebrewSpeech(): UseHebrewSpeechReturn {
  const [voices, setVoices] = useState<HebrewVoice[]>([]);
  const [selectedVoice, setSelectedVoiceState] = useState<HebrewVoice | null>(
    null,
  );
  const [rate, setRateState] = useState<SpeechRate>(0.75);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [activeWordIndex, setActiveWordIndex] = useState(-1);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load voices (async in Chrome — fires voiceschanged)
  useEffect(() => {
    if (typeof window === "undefined") return;

    function update() {
      const loaded = loadHebrewVoices();
      setVoices(loaded);

      // Restore persisted voice selection
      const saved = localStorage.getItem(VOICE_STORAGE_KEY);
      if (saved && loaded.length > 0) {
        const match = loaded.find((v) => v.voice.name === saved);
        setSelectedVoiceState(match ?? loaded[0] ?? null);
      } else if (loaded.length > 0) {
        setSelectedVoiceState(loaded[0] ?? null);
      }
    }

    update();
    window.speechSynthesis.addEventListener("voiceschanged", update);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", update);
    };
  }, []);

  // Restore persisted rate
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(RATE_STORAGE_KEY);
    if (saved === "0.5" || saved === "0.75" || saved === "1") {
      setRateState(parseFloat(saved) as SpeechRate);
    }
  }, []);

  const stop = useCallback(() => {
    if (typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    setActiveKey(null);
    setActiveWordIndex(-1);
    utteranceRef.current = null;
  }, []);

  const speak = useCallback(
    (text: string, key: string) => {
      if (typeof window === "undefined") return;

      // Toggle off if same word is playing
      if (activeKey === key) {
        stop();
        return;
      }

      window.speechSynthesis.cancel();
      setActiveWordIndex(-1);

      const u = new SpeechSynthesisUtterance(text);
      u.lang = "he-IL";
      u.rate = rate;

      if (selectedVoice) {
        u.voice = selectedVoice.voice;
      }

      let wordCount = -1;

      u.addEventListener("boundary", (e: SpeechSynthesisEvent) => {
        if (e.name === "word") {
          wordCount += 1;
          setActiveWordIndex(wordCount);
        }
      });

      u.addEventListener("end", () => {
        setActiveKey(null);
        setActiveWordIndex(-1);
        utteranceRef.current = null;
      });

      u.addEventListener("error", () => {
        setActiveKey(null);
        setActiveWordIndex(-1);
        utteranceRef.current = null;
      });

      utteranceRef.current = u;
      setActiveKey(key);
      window.speechSynthesis.speak(u);
    },
    [activeKey, rate, selectedVoice, stop],
  );

  const setSelectedVoice = useCallback((v: HebrewVoice) => {
    setSelectedVoiceState(v);
    localStorage.setItem(VOICE_STORAGE_KEY, v.voice.name);
  }, []);

  const setRate = useCallback((r: SpeechRate) => {
    setRateState(r);
    localStorage.setItem(RATE_STORAGE_KEY, String(r));
  }, []);

  // Cancel on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") window.speechSynthesis.cancel();
    };
  }, []);

  return {
    voices,
    selectedVoice,
    setSelectedVoice,
    rate,
    setRate,
    activeKey,
    activeWordIndex,
    speak,
    stop,
  };
}

/** Tokenise Hebrew text for highlighted playback — exported for component use */
export { tokenize as tokenizeHebrew };
