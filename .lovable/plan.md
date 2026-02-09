

## SEO Improvement Plan for Private Photo Studio

### Overview

This plan adds SEO-optimized content and navigation while maintaining the minimal, privacy-first aesthetic. We'll update the home page copy, metadata, and create an About page that naturally incorporates target keywords.

---

### 1. Updated Meta Tags (index.html)

**New meta title:**
```
Free AI Profile Picture Background Remover | Private Photo Studio
```

**New meta description:**
```
Remove backgrounds from profile photos for LinkedIn, CV, Instagram, Discord & more. Free AI headshot generator that runs 100% in your browser—private and secure.
```

This covers:
- Primary: "AI profile picture", "background remover"
- Long-tail: "LinkedIn", "CV", "Instagram", "Discord"
- Trust signals: "free", "private", "secure"

---

### 2. Home Page Structure Updates (HeroSection.tsx)

**Current H1:** "Remove backgrounds. Keep photos private."

**New H1:**
```
Free AI Profile Picture Background Remover
```

**New tagline (below H1):**
```
Create professional headshots for LinkedIn, CVs, and social media—100% private.
```

**Subtext stays similar:**
```
All processing happens in your browser. Nothing is uploaded.
```

**Add a short "Use Cases" section below the CTA button:**

| Icon | Heading | Description |
|------|---------|-------------|
| Briefcase | Professional Headshots | Perfect for LinkedIn, CVs, and resumes |
| Users | Social Media | Ready for Instagram, Discord, Bluesky |
| Sparkles | AI-Powered | Fast, accurate background removal |

This naturally incorporates keywords without walls of text.

---

### 3. New About Page (/about)

Create `src/pages/About.tsx` with keyword-rich, scannable sections:

**Structure:**

```text
H1: About Private Photo Studio

H2: What Is This Tool?
- Brief intro: "A free AI profile picture generator..."
- Mention: AI headshot generator, background remover

H2: Perfect For
(Grid of 4 cards)
- LinkedIn & Professional Use
  - "AI headshot for LinkedIn, CV, resume"
- Social Media
  - "Instagram, Bluesky, Discord profile picture maker"
- Privacy-First
  - "Free image background remover that never uploads"
- Any Profile Photo
  - "Online profile photo editor and background changer"

H2: How It Works
- 3 simple steps (select, process, download)
- Mention: "AI profile photo generator", "runs locally"

H2: Why Privacy Matters
- Short paragraph on browser-only processing
```

---

### 4. Navigation Header Component

Create `src/components/Header.tsx`:

```text
┌─────────────────────────────────────────────────────────┐
│ Private Photo Studio          [Editor]  [About]         │
└─────────────────────────────────────────────────────────┘
```

- Logo/app name on left (links to /)
- Two text links on right: "Editor" (/) and "About" (/about)
- Minimal styling: no background on scroll, just subtle text links
- Uses NavLink for active state styling

---

### 5. Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `index.html` | Modify | Update meta title, description, OG tags |
| `src/components/Header.tsx` | Create | Navigation with Editor/About links |
| `src/components/HeroSection.tsx` | Modify | SEO-optimized H1, tagline, use cases grid |
| `src/pages/About.tsx` | Create | Keyword-rich About page |
| `src/pages/Index.tsx` | Modify | Add Header component |
| `src/App.tsx` | Modify | Add /about route |

---

### 6. Keyword Distribution Summary

| Keyword Theme | Location |
|---------------|----------|
| AI profile picture generator | H1, About page H1, meta description |
| AI headshot generator | Use cases section, About page |
| LinkedIn profile picture | Tagline, use cases, About cards |
| CV/resume headshot | Tagline, About cards |
| Free image background remover | Meta title, About page |
| Instagram/Discord/Bluesky | Use cases grid, About cards |
| Profile photo background changer | About page cards |
| Online profile photo editor | About page |
| Professional profile photo AI | Use cases section |

---

### 7. Technical Notes

- All new components use existing Tailwind classes and design tokens
- NavLink component already exists for active route highlighting
- Keep About page lightweight (no heavy images)
- Add clear comments marking SEO-relevant copy for easy future tweaks
- Use semantic HTML (proper H1-H3 hierarchy)
- Keep existing styling intact; ensure any changes don't break existing styling; only add to existing styling and/or extend it

