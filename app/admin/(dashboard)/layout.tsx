import type { ReactNode } from "react";
import { AdminNav } from "@/components/admin/AdminNav";

export default function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div>
      <AdminNav />
      <main className="mx-auto max-w-5xl px-6 pb-12 pt-20">{children}</main>
    </div>
  );
}
