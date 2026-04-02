import { Hebrew } from "@/components/Hebrew";
import { DeveloperTools } from "./DeveloperTools";
import { ModalDemo } from "./ModalDemo";

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
        Storage, backups, imports, and builder-only shortcuts. Learners do not
        need this page — it is for you and for testing.
      </p>
      <ModalDemo />
      <DeveloperTools />
    </div>
  );
}
