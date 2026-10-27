# Fulgrim Compendium — default portraits, 2026-10-27

The Book V personae list now receives local-first image fallbacks through `data/fulgrim-portrait-fallbacks.js`.

## Implementation
- Sixteen existing Book V character cards (reader clearance chapters I–V) receive illustrated SVG portraits rendered directly by the browser from the authorship-safe, original code.
- The illustrations are explicitly marked **ARCHIVE RECONSTRUCTION // ARTISTIC, NON-CANON**. They are vector-style placeholders, NOT the painterly AI portrait assets from the private `.hsartpack` and NOT official Games Workshop or fanart.
- The public GitHub project contains no user-provided private pack binaries or unauthorized third-party image assets.
- If a named personal portrait exists in the local IndexedDB library, `scripts/private-art.js` applies it over the fallback. Reader can import the painterly private pack once on the PWA and it remains local.
- Source priority: verified period-safe official artwork > clearly credited fanart where licensed/appropriate > original generated or illustrated reconstruction.
- Not-yet-read or beyond-reader-clearance dossier cards remain sealed. No Chapter VI–VIII characters or plot information are bundled.
- Offline support: `sw.js` cache `heresy-score-v0127` preloads fallback script and inserts it before `scripts/book-switch.js` in service-worker-controlled PWA navigation.
- No destructive state mutation: existing logs, chapter scores, Spotify state and previously imported private portraits are unchanged.

## Verification
- Evaluated the `data/fulgrim-score.js` + fallback script together: 16 of 16 eligible portraits populated; 0 missing, 0 future images.
- Ran script syntax checks. Actual visual appearance on the reader's phone remains to be confirmed.
- SW activation may require closing/reopening the installed PWA once or twice; **do not** clear browser storage, reinstall PWA or delete IndexedDB.

## Known gap
- **Voidcraft & Theatre Archive** also receives 7 noncanonical, original vector illustrations (ship, planet, battlefield, species, recital, legion symbol, medical bay) via `scripts/fulgrim-archive-art.js`. All imagery remains gated by chapter clearance and yields to future confirmed artwork.
- The rich original image pack in project files is still not auto-bundled due to privacy/provenance. Its artwork may be chosen via the app's private import control without uploading it to public GitHub.
