
## Update About Page and Footer

### Overview
Add visual hierarchy and clarity to the About page, move the model limitation disclaimer from footer to a new dedicated section, and update footer links.

### Changes to `src/pages/About.tsx`

**1. Update "Why Privacy Matters" heading (line 119)**
   - Add a `Shield` icon in the header (similar to the "Free & Open Source" section style)
   - The section already uses `Shield` in the use case cards, but will add it here for visual consistency

**2. Add new "Model Accuracy" section (after "Why Privacy Matters", before "Free & Open Source")**
   - Insert a new section with heading: "Model Accuracy & Limitations"
   - Add an appropriate icon (suggestion: `AlertCircle` or `Image` for visual representation)
   - Move the disclaimer text: "The model may not handle all pictures equally well—try different pictures and see what works best."
   - Expand the explanation to contextualize why this happens
   - Keep the same styling pattern as "Free & Open Source" section

**3. Import additional icon**
   - Add `AlertCircle` (or `Image`) to the lucide-react imports at line 4

### Changes to `src/components/PrivacyFooter.tsx`

**1. Remove Disclaimer paragraph (lines 30-34)**
   - Delete the entire disclaimer section with the text about model limitations

**2. Update "Feedback welcome" link (line 47-53)**
   - Change `href="mailto:raoulcapello@proton.me"` to `href="https://github.com/raoulcapello/private-photo-studio/issues"`
   - Keep the text "Feedback welcome" (or could change to "Report issues" for clarity, but keeping current text)

**3. Update "More about me" label (line 70)**
   - Change text from "More about me" to "About the developer"

### File Structure Summary

```text
About.tsx sections (top to bottom):
1. Header/Title
2. What Is This Tool?
3. Perfect For (use cases grid)
4. How It Works (steps)
5. Why Privacy Matters ← add Shield icon to heading
6. Model Accuracy & Limitations ← NEW SECTION with AlertCircle/Image icon
7. Free & Open Source
```

```text
PrivacyFooter.tsx structure:
1. Privacy Section (Lock icon)
2. Model Attribution (BRIA AI link)
3. Support & Feedback links:
   - Support development (Liberapay)
   - Feedback welcome (GitHub Issues) ← URL updated
   - Source code (GitHub)
   - About the developer ← label updated
```

### Implementation Details

**Icon choice for "Model Accuracy & Limitations"**: `AlertCircle` provides a clear visual signal about limitations/considerations. Alternative: `Image` to stay thematic with photos.

**Content for new section**:
```
Heading: Model Accuracy & Limitations
Icon: AlertCircle
Body: Keep the existing disclaimer text, optionally expanded with brief explanation of why model accuracy varies (e.g., lighting, pose, clothing contrast).
```

### Technical Notes
- All changes use existing Tailwind classes and lucide-react icons
- Maintains consistent spacing (mb-16 for sections before the last one, mb-8 for the last section)
- Keeps the same heading style (text-2xl font-semibold) and icon styling pattern (p-2 rounded-lg bg-primary/10)
- No breaking changes to component props or exports

