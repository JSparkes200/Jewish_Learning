/** Browser speech synthesis for Hebrew practice (best-effort). */
export function speakHebrew(text: string): void {
  if (typeof window === "undefined") return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "he-IL";
    u.rate = 0.88;
    window.speechSynthesis.speak(u);
  } catch {
    /* ignore */
  }
}
