# Saint Michael Web Services Limited — Website

Static marketing website for Saint Michael Web Services Limited (London, UK).
Built with plain HTML, CSS and vanilla JavaScript — no build step, no dependencies.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home — hero ("Building the Future of Digital Business"), service summary, CTAs |
| `about.html` | Company story, values, process |
| `services.html` | Six services, pricing packages, FAQ accordion |
| `contact.html` | Validated enquiry form and contact details |

## Structure

```
.
├── index.html
├── about.html
├── services.html
├── contact.html
├── 404.html
├── css/styles.css
└── js/main.js
```

## Features

- Dark navy + white palette with an electric blue accent
- Fully responsive (mobile-first breakpoints at 980px, 760px, 420px)
- Sticky header that condenses on scroll, animated mobile menu
- Scroll-reveal animations via `IntersectionObserver`
- FAQ accordion
- Client-side contact form validation
- Back-to-top button
- `prefers-reduced-motion` support

## Running locally

Open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deployment

Deployed as a **Render Static Site**:

- Build command: *(leave empty)*
- Publish directory: `.`

## Note on the contact form

This is a static site, so the form validates input and shows a confirmation
message client-side only — it does not send email. To make it live, point the
form at a form service (Formspree, Getform, Web3Forms) or a small backend
endpoint.

## Licence

© Saint Michael Web Services Limited. All rights reserved.
