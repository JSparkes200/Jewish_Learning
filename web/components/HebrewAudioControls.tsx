"use client";

import type { HebrewVoice, SpeechRate } from "@/hooks/useHebrewSpeech";

/**
 * Compact speed + Hebrew voice controls (shared by lesson primer, parsha hero, etc.).
 */
export function HebrewAudioControls({
  rate,
  setRate,
  voices,
  selectedVoice,
  setSelectedVoice,
}: {
  rate: SpeechRate;
  setRate: (r: SpeechRate) => void;
  voices: HebrewVoice[];
  selectedVoice: HebrewVoice | null;
  setSelectedVoice: (v: HebrewVoice) => void;
}) {
  const rates: { value: SpeechRate; label: string }[] = [
    { value: 0.5, label: "½×" },
    { value: 0.75, label: "¾×" },
    { value: 1.0, label: "1×" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 border-t border-ink/12 bg-gradient-to-b from-parchment-card/75 to-parchment-deep/65 px-4 py-2 backdrop-blur-md backdrop-saturate-125">
      <div className="flex items-center gap-1">
        <span className="font-label text-[9px] uppercase tracking-wide text-ink-faint">
          Speed
        </span>
        <div className="ml-1.5 flex gap-0.5">
          {rates.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => setRate(r.value)}
              className={`rounded px-1.5 py-0.5 font-label text-[9px] transition ${
                rate === r.value
                  ? "bg-sage/20 text-sage"
                  : "text-ink-faint hover:bg-ink/5 hover:text-ink-muted"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {voices.length > 1 && selectedVoice && (
        <>
          <div className="mx-1 h-3 w-px bg-ink/10" />
          <div className="flex items-center gap-1.5">
            <span className="font-label text-[9px] uppercase tracking-wide text-ink-faint">
              Voice
            </span>
            <select
              value={selectedVoice.voice.name}
              onChange={(e) => {
                const v = voices.find((x) => x.voice.name === e.target.value);
                if (v) setSelectedVoice(v);
              }}
              className="max-w-[120px] truncate rounded border-0 bg-transparent font-label text-[9px] text-ink-muted outline-none ring-0 focus:ring-0"
            >
              {voices.map((v) => (
                <option key={v.voice.name} value={v.voice.name}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      {voices.length === 0 && (
        <span className="font-label text-[9px] text-ink-faint">
          No Hebrew voice found on this device
        </span>
      )}
    </div>
  );
}
