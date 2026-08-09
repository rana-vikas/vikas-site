import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto max-w-5xl px-6 py-6 text-sm text-muted">
        © {new Date().getFullYear()} {siteConfig.name}
      </div>
    </footer>
  );
}
