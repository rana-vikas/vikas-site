import Link from "next/link";
import { mainNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { getAdminSession } from "@/lib/auth/session";

export async function Nav() {
  const session = await getAdminSession();

  return (
    <header className="border-b border-white/10">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-semibold tracking-tight text-foreground">
          {siteConfig.name}
        </Link>
        <nav className="flex gap-6 text-sm text-muted">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          {session?.user && (
            <Link
              href="/admin"
              className="transition-colors hover:text-foreground"
            >
              Admin
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
