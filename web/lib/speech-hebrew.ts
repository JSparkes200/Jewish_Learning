/** Browser speech synthesis for Hebrew practice (best-effort). */
export type SpeakHebrewOpts = {
  /** 0.1–10; default aligns with learner-friendly pace (~0.88). */
  rate?: number;
};

export function cancelHebrewSpeech(): void {
  if (typeof window === "undefined") return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    /* ignore */
  }
}

export function speakHebrew(text: string, opts?: SpeakHebrewOpts): void {
  if (typeof window === "undefined") return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "he-IL";
    u.rate = opts?.rate ?? 0.88;
    window.speechSynthesis.speak(u);
  } catch {
    /* ignore */
  }
}
