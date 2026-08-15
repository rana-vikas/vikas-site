import Link from "next/link";
import { mainNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-[18px] py-12 sm:px-8 lg:flex-row lg:items-start lg:justify-between lg:px-12">
        <div className="max-w-xs">
          <p className="text-sm font-semibold tracking-[0.08em] text-foreground">
            {siteConfig.name.toUpperCase()}
          </p>
          <p className="mt-2 text-sm text-muted">{siteConfig.description}</p>
        </div>

        <nav
          aria-label="Footer"
          className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted"
        >
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-[1200px] px-[18px] py-6 text-xs text-muted sm:px-8 lg:px-12">
          © {new Date().getFullYear()} {siteConfig.name}
        </div>
      </div>
    </footer>
  );
}
