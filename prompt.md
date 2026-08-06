You are building a website based on a business plan and brochure. Follow this workflow:

## PHASE 1: DOCUMENT ANALYSIS
1. Extract and summarize the key information from the provided PDF brochure:
   - Company name, tagline, and value proposition
   - Product/service descriptions (top 3-5 features)
   - Target audience
   - Call-to-action (CTA) priority
   - Color scheme and visual themes mentioned
   - Any specific navigation structure implied

2. From the business plan, extract:
   - Mission statement
   - Market positioning
   - Key differentiators
   - Any specific messaging priorities

3. If text extraction is garbled or incomplete, ask the user for clarification on specific sections rather than guessing.

## PHASE 2: DESIGN & ARCHITECTURE
4. Create a responsive HTML5 + CSS + JS website with these sections:
   - Header with navigation (home, about, services/products, contact)
   - Hero section with headline and primary CTA
   - Features/benefits section (3-4 key points)
   - Optional: testimonials or social proof (if mentioned in brochure)
   - Footer with contact info and links

5. Use a modern, clean design:
   - Mobile-first responsive layout (test at 375px, 768px, 1200px)
   - Accessible color contrasts (WCAG AA minimum)
   - Professional typography (no more than 2 font families)
   - Images: Use placeholder SVGs or neutral backgrounds if originals unavailable

6. File structure:
project/
├── index.html
├── css/
│ └── styles.css
├── js/
│ └── script.js
├── README.md
└── TESTING.md

## PHASE 3: IMPLEMENTATION
7. Build the website using semantic HTML, modern CSS (flexbox/grid), and vanilla JS where needed.
8. Implement a contact form with client-side validation (do NOT submit anywhere; show success message).
9. Ensure all links work internally and external links open in new tabs.

## PHASE 4: TESTING
10. Create a TESTING.md file documenting:
    - Responsive design tests (results at 3 breakpoints)
    - Form validation tests (empty fields, invalid email, success)
    - Link integrity (all internal/external links functional)
    - Browser compatibility (Chrome, Firefox, Safari)
    - Performance check (no console errors, fast load times)
    - Accessibility check (keyboard navigation, heading hierarchy)

11. Run these specific tests locally:
    - Open index.html in your browser and verify the page renders correctly
    - Resize the browser window and confirm responsive layout works
    - Fill out the contact form with invalid data, then valid data
    - Click every link and verify correct behavior
    - Open browser DevTools (F12) and check for JavaScript errors
    - Test keyboard navigation (Tab through all interactive elements)

12. If you find issues, fix them and re-test.

## PHASE 5: HANDOFF
13. Provide:
    - Full working website code (ready to open index.html locally)
    - TESTING.md with test results and pass/fail status
    - README.md with setup instructions (just "open index.html in a browser")
    - A summary of design decisions made based on the business plan

---

## CONSTRAINTS:
- No backend/server required—must run as static HTML/CSS/JS
- No npm packages or build tools—pure vanilla code
- Contact form submits client-side only (show confirmation, store nowhere)
- No external CDN dependencies; embed any critical styles/fonts
- Target audience: road construction companies

## FILES PROVIDED:
- Brochure: Machinary Hof Company profile (english).pdf
- Business Plan and structure: Machinery_Hof_Website_Structure.txt

Begin by analyzing the PDFs. If text is unclear, describe what you extracted and ask for clarification before proceeding.