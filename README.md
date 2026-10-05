# Happ Coach Academy — course detail template (Astro)

Drop-in files for the Astro app you created with `webflow cloud init`.
Header and footer come from your Webflow components through DevLink, so they
are NOT in this folder — the page uses your existing `src/layouts/Layout.astro`.

## Install

Copy the folders into your project root (merge, don't replace):

```
src/components/course/   → all page sections
src/data/courses.ts      → course content (edit this)
src/lib/url.ts           → base-path helper for /academy
src/styles/course.css    → all styles (hc- prefixed)
src/pages/courses/[slug].astro → the page
public/images/courses/   → placeholder images (replace with real ones)
```

Then:

```bash
npm run dev
# open http://localhost:4321/academy/courses/design-thinking-innovation
```

Your Layout.astro must render `<Navbar client:load />`, `<slot />`, `<Footer client:load />`
inside `<DevLinkProvider>`.

## Make it match Webflow exactly

1. Fonts: in `src/styles/course.css` set `--hc-font-heading` / `--hc-font-body` to the
   font names your Webflow site uses (Site settings → Fonts). If DevLink's global.css
   already loads them, delete the Google Fonts `@import` on line 2.
2. Navbar height: set `--hc-nav-h` to your Webflow Navbar height so the sticky
   tabs and enroll card stop right under it.
3. Colors: the tokens at the top of course.css were sampled from the design.

## Add a course

Add an object to `courses` in `src/data/courses.ts` (and a card to `courseCards`).
A new page is generated at `/academy/courses/<slug>` automatically.
