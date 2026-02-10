

## Add Feedback FAQ Item

### Overview

Add a new FAQ entry about being open to feedback, with links to the GitHub issues page, personal website, and email address.

### Changes

#### `src/pages/FAQ.tsx` -- Add new FAQ item

Append a new item to the `faqItems` array after the "commercial" entry:

- **id**: `"feedback"`
- **question**: "Are you open to feedback and suggestions?"
- **answer**: Yes, very much so. Links to:
  - GitHub Issues: `https://github.com/raoulcapello/private-photo-studio/issues`
  - Website: `https://raoulcapello.nl` (matching existing footer links)
  - Email: `raoul@raoulcapello.nl` (mailto link)

The answer will encourage users to file feature requests or bug reports on GitHub, or reach out directly via email or the website.

### Files to modify

| File | Change |
|------|--------|
| `src/pages/FAQ.tsx` | Add "feedback" FAQ item to the array |

