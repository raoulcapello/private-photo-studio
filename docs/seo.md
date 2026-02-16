# SEO approach

This doc describes how we handle SEO in this project and why we avoid meta-tag libraries for now.

## What we need

- **Per-route meta:** Each route (`/`, `/faq`, `/about`) should have its own `<title>`, `<meta name="description">`, and `<link rel="canonical">` so crawlers and shares see distinct pages and no duplicate-content issues.
- **Single HTML:** The app is a client-rendered SPA with one `index.html`. All routes are served that same file; meta must be updated in the DOM when the route changes.

## How we do it: manual hook, no library

We use a small custom hook, **`usePageMeta`**, that runs in each page component and updates the document in place:

- `document.title`
- The existing `<meta name="description">` (from `index.html`) — update `content`
- `<link rel="canonical">` — create if missing, update `href` if exists
- Optionally Open Graph and Twitter meta when we want shares to reflect the current URL

The hook is a single `useEffect` that queries these elements and sets their attributes. No new dependencies, no extra abstraction. Each page calls `usePageMeta({ title, description, canonical })` once at the top of the component.

See the implementation in `src/hooks/usePageMeta.ts` and its usage in `src/pages/Index.tsx`, `src/pages/FAQ.tsx`, and `src/pages/About.tsx`.

**Official guidance:** React's [`useEffect` Hook](https://react.dev/reference/react/useEffect) is the standard way to handle side effects like updating `document.title`. The React docs state that side effects should run in Effects, not during render, to keep components pure. Our hook follows this pattern: it uses `useEffect` to update document meta when route data changes.

## Why not react-helmet-async (for now)

Libraries like **react-helmet-async** are built for:

- Apps with many meta tags or complex, per-page Open Graph / Twitter / JSON-LD.
- Server-side rendering, where the initial HTML must already contain the correct meta.

Our case is simpler:

- Three routes, three things to set: title, description, canonical (and optionally OG/twitter for the same values).
- No SSR; everything is client-side after one `index.html`.

A small imperative hook is enough and stays easy to read and maintain. Adding a dependency and a declarative API would add complexity without a clear benefit for this project size. If we later introduce SSR, many more routes, or non-developers editing meta, we can reassess and consider a library then.

**React 18 vs 19:** We stay on React 18 for now. The hook approach uses [`useEffect`](https://react.dev/reference/react/useEffect) for side effects, which is the standard React pattern. React 19 adds built-in `<title>` and `<meta>` that React hoists to the head ([React docs: `<title>`](https://react.dev/reference/react-dom/components/title), [React docs: `<meta>`](https://react.dev/reference/react-dom/components/meta)), so we could drop the hook and use declarative meta when we upgrade—but we don't upgrade just for that; the benefit doesn't justify the migration cost. Revisit React 19 when we have other reasons to upgrade (e.g. Actions, `use()`), then switch to native document metadata if we want.

## Additional SEO Considerations

### Canonical URLs

Canonical URLs are set entirely via JavaScript using the `usePageMeta` hook—there is no canonical tag in the initial HTML. This avoids conflicting signals between initial HTML and JavaScript-rendered content. Each route (`/`, `/faq`, `/about`) sets its own self-referencing canonical when the page component mounts.

**Official guidance:** [Ahrefs: Canonical Tags](https://ahrefs.com/blog/canonical-tags/) ([JavaScript section](https://ahrefs.com/blog/canonical-tags#mistake-6-having-multiple-relcanonical-tags)) states: "If you have no canonical URL specified in the HTML response and then add a rel=canonical tag with JavaScript then it should be respected when Google renders the page." This approach is acceptable for SPAs without SSR, though Google prefers canonicals in initial HTML when possible.

### Redirects

Hosting (e.g. Cloudflare) should 301 redirect `http` and `www` to `https://privatephoto.studio/`. See [Ahrefs: 301 Redirects Explained](https://ahrefs.com/blog/301-redirects/) for best practices.

### Sitemap

All routes are included in `sitemap.xml` since there are no conflicting canonical signals. Google, Ahrefs, and other JavaScript-executing crawlers will see the correct self-canonical URLs after rendering.

### H1 Tags

The homepage H1 is in the React tree (HeroSection). For crawlers that don't run JS, we add a visually hidden H1 in `index.html` using the `sr-only` class.

### Internal Links and Content

The app nav and main content are rendered by React, so the initial HTML has no `<a>` links and minimal text. To fix "Page has no outgoing links", "Canonical URL has no incoming internal links", and "Low word count" issues, we add a `<noscript>` block in `index.html` with:

- Static links to `/`, `/faq`, `/about`
- A descriptive paragraph (50+ words) explaining what the app does

Crawlers that parse raw HTML see these links and content; with JS enabled the React app is shown and the noscript is hidden.

**Official guidance:** [Google Search Central: Links Crawlable](https://developers.google.com/search/docs/crawling-indexing/links-crawlable) states that "Google can only crawl your link if it's an `<a>` HTML element (also known as anchor element) with an `href` attribute." [Google Search Central: JavaScript SEO Basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics) explains that Google can render JavaScript and parse HTML links during crawling. [Ahrefs: Crawling JavaScript](https://ahrefs.com/blog/crawling-javascript/) notes that most crawlers cannot execute JavaScript (only Ahrefs and a few others can), so static links in the initial HTML ensure discoverability across all crawler types.

### Structured Data

Optional; a single JSON-LD block (e.g. `WebApplication`) in `index.html` can be added later if we want richer snippets.
