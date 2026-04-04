import { Hebrew } from "@/components/Hebrew";
import { SettingsPageClient } from "./SettingsPageClient";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-lg">
      <h1 className="font-label text-xs uppercase tracking-[0.2em] text-ink-muted">
        Settings
      </h1>
      <Hebrew as="h2" className="mt-1 block text-xl text-ink">
        הַגְּדָרוֹת
      </Hebrew>
      <p className="mt-2 text-sm text-ink-muted">
        Local profile and how this app relates to legacy login and backups.
      </p>
      <div className="mt-6">
        <SettingsPageClient />
      </div>
    </div>
  );
}
