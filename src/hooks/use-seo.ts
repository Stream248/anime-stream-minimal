import { useEffect } from "react";
import { SITE_NAME, getSiteUrl, getShareImageUrl } from "@/lib/site";

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`,
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function setJsonLd(id: string, data: unknown | null) {
  const existing = document.getElementById(id);
  if (existing) existing.remove();
  if (!data) return;
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.id = id;
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

export interface SeoInput {
  title: string;
  description: string;
  path: string;
  /** Optional route-specific structured data, swapped on navigation. */
  jsonLd?: { id: string; data: unknown } | null;
}

/**
 * Keeps <head> in sync with the active route. SPA navigation replaces the
 * document title, meta description, canonical URL, Open Graph / Twitter tags,
 * and route structured data, so crawlers and link previews always see the
 * right metadata for the page being viewed. URLs are built from the origin
 * the app is actually served from (see getSiteUrl in lib/site.ts).
 */
export function useSeo({ title, description, path, jsonLd }: SeoInput) {
  useEffect(() => {
    const base = getSiteUrl();
    const fullTitle = title.includes(SITE_NAME)
      ? title
      : `${title} — ${SITE_NAME}`;
    const url = `${base}${path}`;

    document.title = fullTitle;
    setMeta("name", "description", description);
    setLink("canonical", url);

    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", url);

    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);

    // Share image as an absolute URL against the live origin, as required
    // by social platforms.
    const shareImage = getShareImageUrl();
    setMeta("property", "og:image", shareImage);
    setMeta("name", "twitter:image", shareImage);

    if (jsonLd) {
      setJsonLd(jsonLd.id, jsonLd.data);
    }

    return () => {
      if (jsonLd) {
        setJsonLd(jsonLd.id, null);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, path, jsonLd?.id, jsonLd?.data]);
}
