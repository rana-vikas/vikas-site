import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

// For plain-text meta descriptions derived from Tiptap-authored HTML fields.
export function stripHtml(html: string, maxLength = 200): string {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}

export function pageMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description?: string;
  path: string;
  image?: string;
}): Metadata {
  const url = `${siteConfig.url}${path}`;
  const description_ = description ?? siteConfig.description;

  return {
    title,
    description: description_,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: description_,
      url,
      siteName: siteConfig.name,
      type: "website",
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description: description_,
      ...(image ? { images: [image] } : {}),
    },
  };
}
