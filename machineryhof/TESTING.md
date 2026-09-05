# Machinery Hof Website Testing

Per the project constitution's Testing Standards, this is a manual checklist (no automated test framework). This file records what has actually been verified and how, and honestly what still needs a human with a real browser, since browser automation was unavailable in the environment this was built in.

## What was verified (automated/static checks, run 2026-09-05)

- **HTML well-formedness**: every page (`index.html`, `about.html`, `products.html`, `equipment.html`, `solutions.html`, `resources.html`, `contact.html`, `privacy.html`, `terms.html`, `sitemap.html`) parsed with no unclosed/mismatched tags. ✅
- **Heading hierarchy** (FR-014): checked programmatically for skipped levels across all 10 pages. Found and fixed 4 real bugs: `equipment.html` and 3 placeholder pages jumped straight from `<h1>` to `<h3>` with no `<h2>`. Re-checked clean after the fix. ✅
- **Internal link integrity** (SC-005): every `href="*.html"` across all pages resolves to a file that exists. ✅ Same-page `href="#id"` anchors all resolve to a real `id` on that page. ✅ Cross-page anchors (e.g. `equipment.html` and the footer linking into `products.html#cold-milling` etc.) were checked programmatically too; every cross-page anchor resolves to a real `id` on its target page. ✅
- **JS syntax**: `js/nav.js`, `js/contact-form.js`, and `functions/api/contact.js` all parse with no syntax errors (`node --check`). ✅
- **CSS syntax**: brace-balanced, no obvious structural errors. ✅
- **HTTP smoke test**: served the site with `python3 -m http.server` and confirmed `index.html` returns `200 OK`. ✅

## Not yet verified: needs a human with a browser

Browser automation was disabled in the environment this was built in, so none of the following were actually exercised, only reasoned about from the code:

- **Responsive breakpoints** (375px / 768px / 1200px+): CSS includes breakpoints at 600px/768px/900px targeting this, but no visual check was done at any width.
- **Contact form, full path**: client-side validation logic was written and syntax-checked, but never actually submitted in a browser. In particular: does the empty/invalid-field error state actually show/hide correctly, does a valid submission actually reach `/api/contact`, and does MailChannels actually deliver an email; the last one *cannot* be tested without deploying to Cloudflare Pages (MailChannels needs the DNS TXT record on `machineryhofgmbh.com` first) or running `wrangler pages dev` locally, neither of which was done here.
- **Keyboard navigation**: skip link, nav toggle, form fields, and FAQ `<details>` elements were all built to be keyboard-operable (native semantics, visible `:focus-visible` outlines), but tab order was never walked through by hand.
- **Console errors**: no browser was opened, so no DevTools console was ever actually checked.
- **Cross-browser** (Chrome/Firefox/Safari): not checked in any browser at all.
- **WCAG AA contrast**: colors were chosen to look high-contrast (navy/white, dark gray text on white/light gray) but no contrast-ratio tool was run against the actual rendered page.
- **Lighthouse Performance/SEO ≥ 90** (SC-002/SC-003): not run: needs a real Lighthouse pass against a deployed or locally-served instance.

## How to actually run these before launch

1. `cd machineryhof && python3 -m http.server 8000`, open `http://localhost:8000` in Chrome/Firefox/Safari and walk every page, every link, and the Contact form by hand.
2. Resize the browser (or use DevTools device toolbar) to 375px, 768px, and 1200px+ and confirm layout holds.
3. Tab through each page with the mouse untouched; confirm focus order and visibility.
4. Open DevTools console on every page; confirm zero errors/warnings.
5. Run Lighthouse (Chrome DevTools → Lighthouse tab) against the Home page.
6. For the Contact form's real email delivery: either `wrangler pages dev machineryhof` locally, or deploy to a Cloudflare Pages preview and submit a real test inquiry, and confirm it arrives at `sales@machineryhof.com`.

## Known content gaps (not testing issues, but will affect what you see)

- Equipment page images are placeholders: real photography needs to be supplied (see `specs/001-machinery-hof-website/spec.md` Clarifications).
- `privacy.html` / `terms.html` are placeholders pending legal review.
