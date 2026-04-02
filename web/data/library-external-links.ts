/**
 * External resources for Library — shared by list view and cover carousel.
 *
 * `iconSrc` points to original theme SVGs in `/public/brand/` (see ATTRIBUTION.txt).
 */
export type LibraryExternalLink = {
  href: string;
  label: string;
  desc: string;
  tags: string;
  /** Decorative icon for carousel / list (path under public/) */
  iconSrc: string;
};

export const LIBRARY_EXTERNAL_LINKS: readonly LibraryExternalLink[] = [
  {
    href: "https://www.sefaria.org/texts",
    label: "Sefaria",
    desc: "Tanakh, Talmud, commentaries — bilingual",
    tags: "text bible talmud",
    iconSrc: "/brand/scroll-texts.svg",
  },
  {
    href: "https://pealim.com/",
    label: "Pealim",
    desc: "Verb conjugations & Hebrew dictionary",
    tags: "verbs grammar dictionary",
    iconSrc: "/brand/verb-grid.svg",
  },
  {
    href: "https://nakdan.dicta.org.il/",
    label: "Dicta Nakdan",
    desc: "Add niqqud to Hebrew text",
    tags: "nikkud vocalization",
    iconSrc: "/brand/nikkud-mark.svg",
  },
  {
    href: "https://www.nli.org.il/en/discover/manuscripts",
    label: "National Library of Israel",
    desc: "Manuscripts & digital collections",
    tags: "manuscripts archive",
    iconSrc: "/brand/manuscript.svg",
  },
  {
    href: "https://www.morfix.co.il/",
    label: "Morfix",
    desc: "Hebrew–English dictionary & usage",
    tags: "dictionary translation",
    iconSrc: "/brand/dictionary-book.svg",
  },
  {
    href: "https://hebrew-academy.org.il/",
    label: "Hebrew Language Academy",
    desc: "Official norms, terminology, and resources",
    tags: "grammar academy standard",
    iconSrc: "/brand/academy-pillar.svg",
  },
  {
    href: "https://www.english.dicta.org.il/",
    label: "Dicta (English)",
    desc: "Lexicon, morphology, and text tools with an English UI",
    tags: "dicta grammar morphology",
    iconSrc: "/brand/language-tools.svg",
  },
  {
    href: "https://context.reverso.net/translation/hebrew-english",
    label: "Reverso Context",
    desc: "Real-world Hebrew–English phrase examples",
    tags: "examples translation phrases bilingual",
    iconSrc: "/brand/phrase-bubbles.svg",
  },
  {
    href: "https://forvo.com/languages/he/",
    label: "Forvo — Hebrew",
    desc: "Native speaker recordings for pronunciation",
    tags: "pronunciation audio speaking listening",
    iconSrc: "/brand/audio-wave.svg",
  },
  {
    href: "https://www.ktiv.co.il/",
    label: "Ktiv",
    desc: "Hebrew spelling and word forms (Israeli standard)",
    tags: "spelling orthography writing",
    iconSrc: "/brand/spelling-pen.svg",
  },
];
