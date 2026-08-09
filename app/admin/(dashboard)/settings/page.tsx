import { db } from "@/lib/db";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const profile = await db.profile.findFirst({
    include: { resumeMedia: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
      <SettingsForm profile={profile} />
    </div>
  );
}
