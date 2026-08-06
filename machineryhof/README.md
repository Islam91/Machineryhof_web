# Machinery Hof — Website

A static, single-page marketing site for **Machinery Hof GmbH**, a Bremen-based supplier of technical spare parts, engineering solutions and raw materials for construction machinery.

## Run it

No build step, no server, no dependencies. Just open the file:

1. Double-click `index.html`, or
2. Right-click → Open With → your browser of choice.

To preview with a local server instead (optional, only needed if you want clean relative-URL behavior for testing):

```bash
cd project
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Structure

```
project/
├── index.html        Single-page site: header, hero, features, about, products,
│                      benefits, contact form, footer
├── css/
│   └── styles.css     All styling — design tokens, layout, responsive breakpoints
├── js/
│   └── script.js       Mobile nav toggle + contact form validation (client-side only)
├── README.md
└── TESTING.md
```

## Notes

- **Contact form** validates client-side and shows a success message on submit. It does not send data anywhere — there is no backend.
- **No external dependencies.** No CDN scripts, no web fonts, no analytics. Everything (including icons and the hero diagram) is hand-drawn inline SVG.
- **Content source.** Copy is drawn directly from the Machinery Hof company profile brochure and the website structure document — company description, key features, product segments and benefits are reproduced from those source materials rather than invented. No fabricated statistics (customer counts, years in business, etc.) are shown, since the source materials didn't provide them.
