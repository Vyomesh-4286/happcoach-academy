# Happ Coach Academy — Astro app for Webflow Cloud

A complete Astro project. The course detail page uses your Webflow **Navbar** and
**Footer** components, pulled in with DevLink.

## Project structure

```
happcoach-academy/
├── package.json            ← dependencies + scripts
├── package-lock.json
├── astro.config.mjs        ← Astro + React integration + @webflow alias
├── tsconfig.json
├── webflow.json            ← Webflow Cloud + DevLink settings (add your site ID)
├── public/
│   ├── favicon.svg
│   └── images/courses/     ← placeholder images, replace with real ones
├── webflow/                ← DevLink output (placeholders until you export)
│   ├── DevLinkProvider.tsx
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── css/global.css
└── src/
    ├── layouts/Layout.astro        ← Navbar + page + Footer
    ├── pages/index.astro           ← redirects to the first course
    ├── pages/courses/[slug].astro  ← course detail page
    ├── components/course/*.astro   ← page sections
    ├── data/courses.ts             ← all course content
    ├── lib/url.ts
    └── styles/course.css
```

## 1. Run it

Requires Node.js 22.12+ and npm (Webflow Cloud supports npm only).

```bash
npm install
npm run dev
# open http://localhost:4321/courses/design-thinking-innovation
```

It runs straight away with a placeholder header and footer.

## 2. Pull your real header and footer from Webflow

1. In the Webflow Designer, make sure your header and footer are components named
   exactly `Navbar` and `Footer`, then publish the site.
2. Put your site ID in `webflow.json` (Site settings → General → Site ID).
3. Run:

```bash
npm install -g @webflow/webflow-cli
webflow auth login
npm run devlink          # = webflow devlink export
```

This overwrites the placeholder files in `webflow/` with your real components and styles.
If your components use properties, check `webflow/Navbar.tsx` for the prop names and
pass them in `src/layouts/Layout.astro`.

## 3. Deploy to Webflow Cloud

1. Push this folder to a GitHub repo.
2. Webflow → Happ Coach site settings → **Webflow Cloud** → install the GitHub app.
3. **New project → Create app**, choose the repo, branch `main`, mount path `/academy`.
4. Publish the site. The page is live at `yoursite.com/academy/courses/design-thinking-innovation`.

Don't set `base` in astro.config.mjs — Webflow Cloud sets it from the mount path at
build time. Images and links already use `withBase()` so they work under `/academy`.

## Customising

- **Fonts / colours / navbar height:** tokens at the top of `src/styles/course.css`.
- **New course:** add an object to `courses` (and a card to `courseCards`) in
  `src/data/courses.ts`; its page is generated automatically.
