import { MigrationPageClient } from "./MigrationPageClient";

export const metadata = {
  title: "HTML migration roadmap",
  description:
    "Full-scope tracker for migrating hebrew-v8.2.html into the Next.js app.",
};

export default function MigrationPage() {
  return <MigrationPageClient />;
}
