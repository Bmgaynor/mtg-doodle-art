# MTG Doodle Art

Paste a Scryfall card link, get a doodle proxy card with exact rules text.

```sh
npm install
npm run dev      # local dev server
npm run build    # production build to dist/
npm run preview  # serve the build
```

Pushing to `main` deploys to GitHub Pages via `.github/workflows/deploy.yml`
(one-time setup: repo Settings → Pages → Source: "GitHub Actions").

See CLAUDE.md for the rules and card spec. Example cards are in reference/boards/.
