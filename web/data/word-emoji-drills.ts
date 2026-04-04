/**
 * Hebrew ↔ emoji matching (legacy `EMOJIS` in `hebrew-v8.2.html`).
 * Uses Unicode emoji only — no image assets.
 */

export type WordEmojiDrillItem = {
  h: string;
  p: string;
  e: string;
  em: string;
};

export const WORD_EMOJI_DRILLS: readonly WordEmojiDrillItem[] = [
  { h: "כֶּלֶב", p: "kelev", e: "dog", em: "🐕" },
  { h: "חָתוּל", p: "chatul", e: "cat", em: "🐈" },
  { h: "צִפּוֹר", p: "tzipor", e: "bird", em: "🐦" },
  { h: "דָּג", p: "dag", e: "fish", em: "🐠" },
  { h: "תַּפּוּחַ", p: "tapuach", e: "apple", em: "🍎" },
  { h: "בָּנָנָה", p: "banana", e: "banana", em: "🍌" },
  { h: "שֶׁמֶשׁ", p: "shemesh", e: "sun", em: "☀️" },
  { h: "יָרֵחַ", p: "yareach", e: "moon", em: "🌙" },
  { h: "בַּיִת", p: "bayit", e: "house", em: "🏠" },
  { h: "סֵפֶר", p: "sefer", e: "book", em: "📚" },
  { h: "מְכוֹנִית", p: "mechonit", e: "car", em: "🚗" },
  { h: "כּוֹכָב", p: "kochav", e: "star", em: "⭐" },
];
