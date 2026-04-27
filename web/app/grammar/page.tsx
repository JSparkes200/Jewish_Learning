import { GrammarPageClient } from "./GrammarPageClient";

export const metadata = {
  title: "Grammar Reference — Hebrew Yeshiva",
  description:
    "Quick-access Hebrew grammar tables: verb conjugations, binyanim, nouns, definite article, particles, and pronominal suffixes.",
};

export default function GrammarPage() {
  return <GrammarPageClient />;
}
