import Link from "next/link";
import { Hebrew } from "@/components/Hebrew";
import { DeveloperAuthPanel } from "./DeveloperAuthPanel";

export default function DeveloperPage() {
  return (
    <div className="mx-auto max-w-lg">
      <h1 className="font-label text-xs uppercase tracking-[0.2em] text-ink-muted">
        Developer
      </h1>
      <Hebrew as="h2" className="mt-1 block text-xl text-ink">
        פִּתּוּחַ
      </Hebrew>
      <p className="mt-2 text-sm text-ink-muted">
        Sign in below when your server has developer credentials set. Then open
        the full tools page (backups, imports, corpus).
      </p>
      <DeveloperAuthPanel />
      <p className="mt-6 text-center">
        <Link
          href="/developer/tools"
          className="font-label text-xs font-semibold uppercase tracking-[0.14em] text-sage underline decoration-sage/40 underline-offset-4 hover:decoration-sage"
        >
          Open developer tools
        </Link>
      </p>
    </div>
  );
}
