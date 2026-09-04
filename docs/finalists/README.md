# Finalist demos

One folder per team. Each folder holds that team's static app exactly as the
students built it (HTML + any css/js/images it references).

## Adding a team's demo

1. Make a folder here, e.g. `docs/finalists/kamm/`. Lowercase, hyphens, no spaces.
   Unnamed teams: use the advisory, e.g. `docs/finalists/g9-diverio/`.
2. Copy the team's files in. The main file should be `index.html`; any other name
   works as long as you point at it in step 3. Rename anything with spaces.
3. In `docs/index.html`, find the team in the `FINALISTS` array and set

       app: 'finalists/kamm/index.html'

   Also fill in `name` if it was `null`.
4. Commit, push. The card's preview and the in-page viewer both pick it up.
5. Friday: set `winner: true` on the winning teams for the green stamp.

## Notes

- Demos render inside the site in a sandboxed iframe (scripts, forms, and
  popups allowed; no top-level navigation). Every card also has a "new tab"
  link that opens the raw file.
- Open each demo once after the deploy. Apps that load assets over plain
  `http://` or from a blocked host will show broken pieces on GitHub Pages.
- The card previews render the app at 960x600 and scale it down, so a
  desktop-first layout looks best in the thumbnail.
