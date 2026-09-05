# Machinery Hof Website

A static, multi-page marketing site for **Machinery Hof GmbH**, a Bremen-based supplier of technical spare parts, engineering solutions and raw materials for construction machinery.

## Run it locally

No build step, no npm install. Just serve the folder:

```bash
cd machineryhof
python3 -m http.server 8000
# then visit http://localhost:8000
```

Opening `index.html` directly (double-click) also works, except the Contact form's `/api/contact` call, which needs the Cloudflare Pages Functions runtime (see below); it won't do anything useful from `file://` or a plain static server.

## Structure

```
machineryhof/
├── index.html        Home
├── about.html         Company, key strengths, product segments, team
├── products.html      All 7 product categories
├── equipment.html      5 equipment types + compatible parts
├── solutions.html      Engineering services, custom solutions, case studies, support
├── resources.html      Catalog request + FAQ
├── contact.html         Quote request form + contact info
├── privacy.html          Placeholder: needs legal review before launch
├── terms.html            Placeholder: needs legal review before launch
├── sitemap.html
├── css/styles.css        All design tokens, layout, components, responsive breakpoints
├── js/nav.js             Mobile nav toggle (shared by every page)
├── js/contact-form.js    Contact form validation + submission
└── assets/               (reserved for future images)

../functions/api/contact.js   Cloudflare Pages Function, the Contact form's only
                              server-side code (see below)
```

## Contact form → email delivery

The Contact form POSTs to `/api/contact`, a single Cloudflare Pages Function (at the repository root, in `functions/api/contact.js`; Cloudflare requires this directory at the project root, not inside `machineryhof/`). It validates the payload again server-side, then sends it by email to `sales@machineryhof.com` via [MailChannels](https://www.mailchannels.net) (free from Cloudflare Workers/Pages, no API key required, but it does need a DNS TXT record on `machineryhofgmbh.com` before it will actually deliver; see MailChannels' Cloudflare domain-lockdown docs). The function is stateless: it never stores or logs a submission, it only forwards it.

If you'd rather use a transactional email API (e.g. Resend) instead of MailChannels, swap the `fetch` call in `functions/api/contact.js` and add the provider's API key as a Cloudflare Pages secret (never commit it).

## Deploying to Cloudflare Pages

1. Connect this GitHub repo to a Cloudflare Pages project.
2. Build settings: no build command, build output directory = `machineryhof`.
3. Cloudflare auto-detects `functions/` at the repo root; no extra config needed for the Contact form endpoint.
4. Add the MailChannels DNS TXT record (or your chosen provider's secret) before relying on the form in production.
5. Set the custom domain to `machineryhofgmbh.com`.

## Notes

- **No external dependencies.** No CDN scripts, no web fonts, no analytics: everything (icons, feature graphics) is inline SVG. Per the project constitution (v1.3.0+), external CDN/third-party scripts *are* allowed if a future need justifies one; none are used today.
- **Content source.** Copy is drawn from the Machinery Hof company profile brochure, the website structure document, and its structured JSON companion; see `specs/001-machinery-hof-website/spec.md` for exactly how conflicts between those sources were resolved. No fabricated statistics, testimonials, or case studies are shown.
- **Known gaps, pending your input**: real equipment photography (Equipment page currently ships clearly-marked placeholders), and legal review of `privacy.html`/`terms.html` before public launch.
