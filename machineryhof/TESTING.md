# Testing Report — Machinery Hof Website

Environment note: this build/test session ran in a sandboxed environment without a controllable browser (no screenshot-capable browser tool, headless display). Every test below that could be verified programmatically was actually run against the real files (not eyeballed) — results are pasted from real command output, not assumed. A short manual checklist is included at the end for a final human pass in an actual browser.

## 1. HTML structural integrity

| Check | Method | Result |
|---|---|---|
| Tag balance / nesting | Python `html.parser`, full document walk | **PASS** — 0 unclosed tags, 0 mismatches |
| Duplicate IDs | Same parser, id collision check | **PASS** — 27 unique ids, 0 duplicates |
| Internal anchor targets (`#about`, `#products`, etc.) | Cross-referenced every `href="#..."` against existing ids | **PASS** — all 6 anchor targets resolve |
| `for=` / `aria-labelledby` / `aria-describedby` targets | Cross-referenced against ids | **PASS** — 0 missing references |
| Inline SVG well-formedness | Parsed all 13 inline `<svg>` blocks as XML | **PASS** (see note below) |
| Favicon data-URI | Decoded and parsed as SVG | **PASS** — valid |

Note: one SVG (`.blueprint` hero diagram) uses `&nbsp;`, which is a valid HTML5 named character reference but not valid in strict XML without a DTD — a strict-XML parser flags it, a browser's HTML parser does not. This is expected, not a bug.

## 2. JavaScript

| Check | Method | Result |
|---|---|---|
| Syntax validity | `node --check js/script.js` | **PASS** |
| DOM selectors resolve | Cross-referenced every `getElementById`/`querySelector` target against actual markup | **PASS** — all resolve (`has-error` is intentionally a runtime-only class) |
| Email regex correctness | 7 unit cases run directly in Node (empty, malformed, no-TLD, spaces, valid) | **PASS** — 7/7 |
| No debug leftovers | Grepped for `console.*` / `debugger` | **PASS** — none found |

## 3. Form validation (logic-level, see manual checklist for interactive pass)

- Empty **name** / **email** / **message** → each shows an inline error and blocks submit (verified in code path: `validateField` runs for all three required fields before allowing success state).
- Invalid email format (`missing@domain`, `a@b`, `with space@x.com`) → rejected by regex, confirmed via unit tests above.
- Valid input on all required fields → `form.reset()` runs, success banner (`#formSuccess`) is un-hidden and focused, error state cleared.
- Nothing is submitted anywhere — `event.preventDefault()` is unconditional; there is no `fetch`/`XMLHttpRequest`/`action` in the codebase (confirmed via grep).

## 4. Link integrity

- All internal links (`#top`, `#about`, `#products`, `#benefits`, `#contact`) resolve to real ids — confirmed above.
- `tel:` and `mailto:` links use the real numbers/addresses from the source documents.
- The one external link (Google Maps) carries `target="_blank" rel="noopener noreferrer"` — confirmed via grep, this is the only external `href` in the document.
- No broken/placeholder (`href="#"` or `javascript:void`) links exist anywhere.

## 5. Accessibility

| Check | Method | Result |
|---|---|---|
| Heading hierarchy | Extracted every `h1`–`h3` in document order | **PASS** — single `h1`, logical `h2`→`h3` nesting, no skipped levels |
| Keyboard traps / tabindex hacks | Grepped for non-`"0"` tabindex | **PASS** — none |
| Form field name collisions | Checked all `name=` attributes | **PASS** — all unique |
| Skip-to-content link | Present, becomes visible on focus | **PASS** |
| Focus-visible styling | `:focus-visible` outline defined globally | **PASS** |
| `prefers-reduced-motion` respected | Media query disables animation/transition durations | **PASS** |
| Decorative SVGs hidden from AT | All icon SVGs carry `aria-hidden="true"`; the one meaningful SVG (hero diagram) has `role="img"` + `<title>`/`<desc>` | **PASS** |
| Color contrast (WCAG AA) | Computed relative-luminance contrast ratios for every foreground/background text pairing in the stylesheet (22 pairs) | **PASS after 1 fix** — see below |

**Contrast fix applied during testing:** the `.eyebrow` label color and the contact-info label color (`--gold-600`, `#D68C12`) measured **2.53:1** on the page background — below the 4.5:1 AA minimum for small text. Introduced a dedicated text-safe token `--gold-700: #8A5809` (**5.54:1** on `--paper`) and switched both usages to it. `--gold-600` remains in use only as a button *background* (with dark navy text on top, 6.22:1 — unaffected). All 22 checked text/background pairs now pass AA-normal (≥4.5:1); several exceed AAA.

## 6. Performance / hygiene

| Check | Result |
|---|---|
| External CDN scripts/styles/fonts | **0** — grepped `@import`, `url()`, and all `src`/`href` values; only local files, anchors, `mailto:`, `tel:`, and one Maps link exist |
| `console.log`/`debugger` leftovers | **0** |
| Total payload (HTML+CSS+JS) | **48 KB** uncompressed, well under any reasonable budget |
| CSS brace balance | 149 open / 149 close — **balanced** |

## 7. Responsive design (reviewed at code level for 375px / 768px / 1200px)

- **375px (mobile-first base):** single-column stacked sections, hamburger nav (`.nav-toggle` visible, `.main-nav` collapses to a slide-down panel), full-width buttons in the contact form, 1-column feature list/product grid/benefits grid.
- **768px (`min-width: 768px`):** hamburger hidden, horizontal nav restored; hero becomes 2-column (copy + diagram side by side); about section becomes 2-column (narrative + spec table); product grid becomes 2 columns; benefits grid becomes 2 columns; contact section becomes 2 columns; footer becomes 4 columns.
- **1200px (`min-width: 1200px`):** feature strip and benefits grid expand to their full multi-column layout (5 across), product grid becomes 3 columns, headline scales up to 54px.

*Not yet confirmed with an actual rendered screenshot in this session* — see manual checklist below.

## 8. Manual checklist (for you to run in a real browser — 5 minutes)

- [ ] Open `index.html` directly (double-click) and confirm it renders with no missing assets.
- [ ] Resize the window through ~375px, ~768px, and ~1200px+ and confirm the layout changes described in §7 actually happen visually (no overlap, no horizontal scrollbar).
- [ ] Tab through the whole page from the top and confirm focus is always visible and follows a sane order (skip link → nav → hero CTAs → sections → form fields → footer links).
- [ ] Submit the contact form empty → see 3 inline errors, no success message. Fill only an invalid email → see the email error. Fill everything validly → see the green success message and an empty, reset form.
- [ ] Open DevTools console and confirm there are 0 errors/warnings on load or on interaction.
- [ ] Click the Google Maps footer link and confirm it opens in a **new tab**.
- [ ] Test in Chrome, Firefox, and Safari (or whichever engines you have available) — the CSS uses only widely-supported features (Grid, Flexbox, `clamp()`, CSS custom properties, `:focus-visible`), so no polyfills should be needed.
