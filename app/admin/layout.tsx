import type { Metadata } from "next";
import type { ReactNode } from "react";

// Belt and suspenders alongside robots.ts's Disallow: /admin — a noindex
// meta tag still applies even if a crawler ignores robots.txt or the page
// gets linked to from elsewhere.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return children;
}
