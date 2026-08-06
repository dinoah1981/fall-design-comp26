# Apps For The People — Fall 2026 Design Competition

Site for Comp Sci High's Fall 2026 design competition: teams of up to 4 build an
AI-powered app that addresses a real problem in the school or Bronx community,
then pitch it VC-style. Feeds into the 2026 Congressional App Challenge
(deadline: Oct 26, 2026, 12:00 PM EDT).

**Live site:** https://dinoah1981.github.io/fall-design-comp26/

## Structure

All site files live in `docs/` (GitHub Pages serves from `/docs` on `main`):

- `index.html` — main page (hero, challenge, roles, week, workshops, rules digest, submission, judging)
- `rules.html` — full rules: CSH house rules + all 2026 Congressional App Challenge rules
- `styles.css` — terminal-monochrome design system (Inter + JetBrains Mono, phosphor green accent)
- `subpage.css` — rules-page styles (extends styles.css)
- `script.js` — link application, mobile menu, scroll reveal
- `subpage.js` — mobile menu for subpages

## How links work

Links are configured in the `LINKS` object in a `<script>` tag in `index.html`.
`script.js` applies them to elements with matching `data-link` attributes.
Entries still set to `'#'` render as disabled "// soon" placeholders.

**To update a link:** edit the LINKS object in `index.html`, commit, push.
Do NOT add links to `script.js`.

## Sibling site

Winter 2026 film competition: https://github.com/dinoah1981/winter-design-comp26
