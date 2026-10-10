# Changelog

All notable changes to Heresy Score are tracked here.

## v0.8.2 — Reading session / archive expansion

- Added integrated reading-session controls for Spotify.
- Pause/Resume now pauses both playback and the effective reading timer.
- Added Previous / Next controls and a chapter-specific protected Final Cue.
- Changed timer accounting from wall-clock-only to accumulated active reading time.
- Added chapter-specific score metadata:
  - READY / STAGED / SEALED states,
  - optional reserve tracks,
  - protected final cue indexes,
  - per-chapter target duration.
- Prepared Chapter IV and staged Chapters V–VI.
- Added Field Log History with edit/copy/sync actions.
- Added compact chapter window with full archive toggle.
- Added Supabase-ready cloud log client and secure RLS schema.
- Added per-install cloud sync token model.
- Added spoiler-safe visual dossiers for Dramatis Personae.
- Added REDACTED visual state for characters without a safe image.
- Added Kaleb Arin to the Chapter III clearance roster.
- Added official period-safe reference visuals where appropriate.

## v0.7 — Chapter III score

- Added curated Chapter III score.
- Migrated known Chapter II feedback into the local archive.
- Made chapter readiness derive from score availability and prior reading progress.
- Improved dynamic reading directive.

## v0.6 — Navigation / icon fix

- Added dropdown navigation:
  - Reading Protocol
  - Book Archives
  - Dramatis Personae
  - Cogitator Settings
- Added book archive view.
- Embedded configured Spotify Client ID.
- Rebuilt PWA icons as opaque raster assets with maskable-safe padding.
- Added reproducible icon generator and GitHub Actions workflow.

## v0.5 — Spotify integration

- Added Spotify Authorization Code with PKCE.
- Added private active-playlist creation and replacement.
- Added Spotify track search/resolution and cached URI mapping.
- Added automatic playback attempt on Begin Chapter.
- Added Open Spotify fallback.

## v0.4 — Debrief / spoiler archive

- Added Latest Field Debrief.
- Expanded feedback dimensions for soundtrack calibration.
- Added first spoiler-gated Dramatis Personae implementation.

## v0.3 — Visual pass

- Added Aquila masthead.
- Added skull divider asset.
- Added animated Administratum background.
- Added Administratum seal to reading directive.
- Preserved localStorage progress key.

## v0.2 — PWA shell

- Added installable standalone PWA shell.
- Added offline cache/service worker.
- Added Imperial cogitator-inspired mobile interface.
