

## Add FOSS Section and MIT License

### Overview

Add a "Free & Open Source" section to the About page explaining the project's open-source nature and MIT license, plus create the appropriate license file.

---

### 1. License Choice: MIT

- MIT is highly permissive and simple (use, copy, modify, distribute, even commercially) as long as recipients get the copyright notice and license text.

- Keeping the code MIT while treating RMBG‑1.4 as a separately licensed asset avoids any implication that the model is “open source” or under MIT, which it is not.

---

### 2. New License File

Create `LICENSE` in the project root:

```text
The MIT License (MIT)

Copyright (c) 2026 Raoul Capello

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

---

### 3. New Section in About Page

Add below "Why Privacy Matters" (after line 128):

**Section: Free & Open Source**

```text
H2: Free & Open Source

This project is Free and Open Source Software (FOSS), released under the 
MIT license. You're welcome to view the source code, learn from it, 
and contribute improvements.

Key points:
• Free to use for personal and non-commercial purposes
• Source code available on GitHub
• Contributions and feedback welcome
• Commercial use requires permission

[Link to license on GitHub repository]
[Link to GitHub repository]
```

Uses the `Code` icon from lucide-react for visual consistency with the existing section style.

---

### 4. Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `LICENSE` | Create | MIT license file |
| `src/pages/About.tsx` | Modify | Add "Free & Open Source" section after "Why Privacy Matters" |

---

### 5. Technical Notes

- Import `Code` icon from lucide-react (already available in the package)
- Use same section styling as existing sections (mb-16, text-2xl heading, etc.)
- Include external links to license and GitHub with proper `target="_blank"` and `rel="noopener noreferrer"`
- Keep copy concise with bullet points for scannability

