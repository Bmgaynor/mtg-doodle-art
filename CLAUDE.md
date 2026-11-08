# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# MTG Doodle Art

Turns a real Magic card into a flat, thick-outlined "doodle proxy" card.

## Running
- Vite app, no framework, no tests or linter. `npm run dev` (dev server), `npm run build` (to `dist/`), `npm run preview`.
- Deploy: push to `main` and `.github/workflows/deploy.yml` builds and publishes `dist/` to GitHub Pages. `vite.config.js` uses `base: './'` so the build works under any `/<repo>/` path. Keep asset references relative.
- Live Scryfall calls only work outside Claude's sandbox. In the sandbox, use the paste-JSON fallback panel.
- Debug hook: `window.__doodle.drawArt(card, view, bump, face)` returns the art SVG string for a Scryfall card object. `src/art.js` has no DOM dependencies, so it can also be imported directly in Node.

## Hard rules
- Name, type line and rules/flavor text must be EXACT (copied from Scryfall, never paraphrased).
- Art is a fresh original doodle, fairly unrecognizable from the real art. Never show, crop, trace or filter the real card image. Scryfall is used for text only.
- Black & white filter is optional and OFF by default.
- Input is a Scryfall link only (no manual entry fields). Keep a "reprompt" text box for added info.
- No footer/serial text on the card (e.g. no "T 0014 · FIN · proxy").
- Standard loaders (splash, progress, spinner, skeleton shimmer; respect prefers-reduced-motion).

## Scryfall API
- `GET https://api.scryfall.com/cards/:set/:num[/:lang]`, send an `Accept` header, wait 50-100 ms between calls, cache 24h.
- Provide a User-Agent/app name per Scryfall docs. Credit Scryfall in the footer.
- Works from the user's browser/machine; it was blocked in Claude's sandbox, so test it here.

## How it works
`index.html` holds the markup only. `src/main.js` handles UI state and events, `src/scryfall.js` handles lookup and caching, `src/art.js` draws the art, and `src/style.css` holds the styles.
Flow: `make()` → `parseInput()` (scryfall.com/card/... URL, or "set num") → `getCard()` → `show()` → `view()` + `drawArt()`.
- `getCard()`: 24h cache in memory plus `localStorage` (key `sf:<url>`), 100 ms throttle. Non-HTTP failures (CORS/network) open the paste-JSON fallback. 404 and 429 get their own messages.
- `view()` flattens multi-face cards. If `card.image_uris` is present (split/adventure/flip), the faces' oracle texts are joined. If it's missing (transform/MDFC), the global `face` index picks a face and the Flip button is shown. P/T falls back to loyalty, then defense.
- `symbols()` turns `{X}` tokens into `.sym` discs, colored by the first letter via `PIPS`.
- `drawArt()` picks a generator by type line, checked in this order: creature, instant/sorcery, planeswalker, land, artifact, enchantment, else shield. Creature features key off subtypes after the em dash (dragon → wings, wizard → hat, ...). Colors come from `PAL` via `pickColors()`.
- Determinism: RNG = `rng(hash(card.id + ':' + face) + redraw * 7919)`. The same card always gives the same doodle; "Redraw doodle" bumps `redraw`.
- Card sizing uses container query units (`cqw`) so the 500x700 spec scales with `.frame`.

## Card spec
- Board 700x900 (bg #F3EFE6); card 500x700, bg #FFFDF6, 6px ink border (#1F2430), radius 26, padding 18.
- Boxes: title bar (name + cost), art, type line, rules box, optional P/T (right-aligned). 4px borders, radius 12-14, white fill.
- Fonts: Caveat Brush (name, P/T), Patrick Hand (everything else). Rules text 24px, italic flavor under a 2px divider, attribution on its own line.
- Mana discs: colorless {1} #E0DCD0; blue #9CCFEA with white drop; hybrid = split disc (blue #9CCFEA / red #F0A58A).
- Art: SVG viewBox 440x380, ink stroke 5, round caps, flat fills, wobble filter (feTurbulence + feDisplacementMap) with a unique filter id and seed per card.

## Known gaps between code and spec
- Filter id is hardcoded `wob` (spec wants it unique per card; this matters if several cards render on one page).
- No reprompt text box yet. Flavor text and the divider aren't rendered (only `oracle_text` is used).
- Hybrid/phyrexian pips render as one flat disc. There's no white drop on blue pips.
- No User-Agent is sent; browsers forbid setting it from `fetch`, so the app name has to come some other way.

## Files
- `index.html` + `src/`: the app (Scryfall text fetch, procedural doodle art via seeded RNG, redraw, flip face, B&W filter, paste-JSON fallback).
- `reference/boards/`: hand-drawn example cards (Quicken, Geist, Borne, Abandon Attachments) and the original design-canvas files. `.dc.html` boards need Claude's design-canvas runtime (`support.js`, not included); read them as markup/spec, not to run. `Template.dc.html` is the canonical card layout with exact pixel values.

## Ideas for next steps
- Hybrid/multi-color pip support and split frames.
- Per-card hand-tuned art overrides.
- Export card as PNG.
