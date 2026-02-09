
## Update PrivacyFooter to Include Contribution, Disclaimer, Donation, and Feedback Info

### Current State
The footer currently only displays a privacy promise. It's a simple, centered card with a lock icon and brief explanation.

### Proposed Changes
Expand the `PrivacyFooter` component to include four new sections while maintaining the minimal, calm design:

1. **Privacy Section** (existing)
   - Keep the lock icon and privacy message as-is

2. **Model Attribution Section**
   - Add a small text note crediting BRIA AI
   - Include a link to https://huggingface.co/briaai
   - Use a subtle link style to maintain visual calm

3. **Disclaimer Section**
   - Add a warning about model limitations
   - Message: "The model may not handle all pictures equally well—try different pictures and see what works best"
   - Use a smaller, muted text style to avoid alarming users

4. **Support & Feedback Section**
   - Donation link: "Support development: https://liberapay.com/raoul/donate"
   - Feedback email: "Feedback welcome at: raoulcapello@proton.me"
   - Make these appear as subtle links/text

### Design Approach
- Keep the existing centered, vertical layout
- Use consistent spacing (gap-3 or gap-4) between sections
- Maintain `text-sm` and `text-muted-foreground` for consistency with privacy message
- Use `lucide-react` icons where helpful:
  - `Gift` or `Heart` for donation
  - `Mail` for feedback email
  - Keep these icons subtle and smaller (h-4 w-4)
- Separate sections with visual breathing room (dividers or just whitespace)
- Ensure all links are proper `<a>` tags with `rel="noopener noreferrer"` for security

### Structure in Code
```
<footer>
  <div className="container">
    <!-- Privacy section (existing) -->
    <div>
      <Lock icon + privacy text>
    </div>
    
    <!-- Divider or spacing -->
    
    <!-- Model section -->
    <div>
      Model by BRIA AI | Link
    </div>
    
    <!-- Disclaimer section -->
    <div>
      Warning icon + disclaimer text
    </div>
    
    <!-- Support section -->
    <div>
      Donation link + Feedback link
    </div>
  </div>
</footer>
```

### Implementation Details
- Add icons: Import `Gift`, `Mail`, and optionally `AlertCircle` from lucide-react
- All links open in new tabs (`target="_blank"`)
- Maintain mobile responsiveness with the existing max-w-2xl container
- Use consistent color variables (text-primary, text-muted-foreground) to align with design system
