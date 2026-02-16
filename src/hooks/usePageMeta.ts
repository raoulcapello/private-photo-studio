import { useEffect } from "react";

/**
 * SEO: Per-route document meta (title, description, canonical, Open Graph, Twitter).
 * Updates the existing elements from index.html so each route has distinct meta for crawlers and shares.
 * See docs/seo.md for the project's SEO approach.
 */
export type PageMeta = {
  title: string;
  description: string;
  canonical: string;
  ogTitle?: string;
  ogDescription?: string;
};

export function usePageMeta(meta: PageMeta): void {
  useEffect(() => {
    document.title = meta.title;

    const descriptionEl = document.querySelector('meta[name="description"]');
    if (descriptionEl) descriptionEl.setAttribute("content", meta.description);

    // Canonical: create if doesn't exist, update if it does
    let canonicalEl = document.querySelector('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement("link");
      canonicalEl.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute("href", meta.canonical);

    const ogTitle = meta.ogTitle ?? meta.title;
    const ogDescription = meta.ogDescription ?? meta.description;

    const setMeta = (selector: string, attribute: string, value: string) => {
      const el = document.querySelector(selector);
      if (el) el.setAttribute(attribute, value);
    };

    setMeta('meta[property="og:url"]', "content", meta.canonical);
    setMeta('meta[property="og:title"]', "content", ogTitle);
    setMeta('meta[property="og:description"]', "content", ogDescription);
    setMeta('meta[name="twitter:title"]', "content", ogTitle);
    setMeta('meta[name="twitter:description"]', "content", ogDescription);
  }, [meta.title, meta.description, meta.canonical, meta.ogTitle, meta.ogDescription]);
}
