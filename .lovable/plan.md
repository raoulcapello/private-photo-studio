

## Add Source Code and Personal Website Links to Footer

### Changes to Make

Update `src/components/PrivacyFooter.tsx` to add two new links in the "Support & Feedback" section:

1. **Source code link**
   - Text: "Source code"
   - URL: `https://github.com/raoulcapello/private-photo-studio/tree/main`
   - Icon: `Github` from lucide-react

2. **More about me link**
   - Text: "More about me"
   - URL: `https://www.raoulcapello.nl/`
   - Icon: `User` from lucide-react (represents a personal profile appropriately)

### Implementation Details

- Import `Github` and `User` icons from lucide-react (adding to existing `Lock`, `Heart`, `Mail` imports)
- Add both links to the existing flex container on lines 37-54
- Use identical styling as the existing links (`inline-flex items-center gap-1.5 underline underline-offset-2 hover:text-foreground transition-colors`)
- Both links open in new tabs with `target="_blank"` and `rel="noopener noreferrer"`
- The four links will wrap naturally on smaller screens thanks to `flex-wrap`

### Updated Link Order
The footer links section will display:
1. Support development (Heart icon)
2. Feedback welcome (Mail icon)
3. Source code (Github icon)
4. More about me (User icon)

