import { ReadingPageClient } from "./ReadingPageClient";

export const metadata = {
  title: "Reading",
  description:
    "Hebrew reading — course stories, Aleph guided reading, library, and comprehension.",
};

export default function ReadingPage() {
  return <ReadingPageClient />;
}
