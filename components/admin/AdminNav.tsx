import Link from "next/link";
import { SignOutButton } from "@/components/admin/SignOutButton";

const adminNav = [
  { label: "Dashboard", href: "/admin" },
  { label: "Career", href: "/admin/career" },
  { label: "Fitness", href: "/admin/fitness" },
  { label: "Cricket", href: "/admin/cricket" },
  { label: "Travel", href: "/admin/travel" },
  { label: "Photography", href: "/admin/photography" },
  { label: "Media", href: "/admin/media" },
  { label: "Settings", href: "/admin/settings" },
];

export function AdminNav() {
  return (
    <header className="border-b border-white/10">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <nav className="flex gap-6 text-sm text-muted">
          {adminNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <SignOutButton />
      </div>
    </header>
  );
}
