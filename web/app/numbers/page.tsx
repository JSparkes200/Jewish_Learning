import { NumbersPageClient } from "./NumbersPageClient";

export const metadata = {
  title: "Numbers & counting",
  description:
    "Hebrew numbers, ordinals, days, time words, and price phrases — practice hub.",
};

export default function NumbersPage() {
  return <NumbersPageClient />;
}
