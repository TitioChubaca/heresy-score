# Sprint validation — 2026-10-23

## Completed
- `data/portrait-manifest.json`: metadata and four preview crop presets without redistributing third-party artwork.
- `data/fulgrim-shell.json`: Book V chapter 1 sealed with empty personae and no plot or music data.
- Read existing Book IV / Book V switch and migration code. `HSBooks` v3 separates `done` by book and prevents switching during an active timer. Book IV cloud calls are parameterized by the selected slug in the current main app.

## Not yet merged to the hosted PWA
- The personal `.hsartpack` and `portrait-import-v1.js` remain an external private sprint ZIP attachment. The full importer has not been successfully committed or hooked into the service worker in this release. `scripts/portrait-import-v1.js` currently contains only a preparatory copy of the old local importer, **not** the complete package loader. Do not claim integrated controls are available online.
- Full browser/Spotify/Supabase runtime validation pending. No actual Book V cue sheet/playlist activated.

## Known precautions
- Current repo is public: private artist images must not be committed or cached as PWA assets.
- Existing on-device images are in IndexedDB `hs-private-portraits` and are not part of the JSON backup.
- There is no evidence that Book V switching and cloud sync was tested end-to-end on the user's installed PWA; only logical/static checks performed.
- Keep the last exported backup safe before installing changes.
