# Changelog

All notable changes to Heresy Score are tracked here.

## v0.10.0 — Score calibration

- Added Chapters IX–XI score preparation.
- Duration is now calibrated chapter by chapter from reading pace and recent logs.
- Added formal leitmotif metadata for recurring musical identities.
- Updated current character statuses through Chapter VIII.

## v0.9.4 — Timer / Spotify state recovery

- Fixed a case where Spotify playback could start successfully while the app still treated the device command as failed.
- Resume now starts the Heresy Score reading timer immediately; Spotify device reporting can no longer block the chronometer.
- If Spotify playback begins manually while a fresh session is waiting at 00:00, the app detects it and resumes the reading timer.
- Spotify Resume now verifies the real player state after an ambiguous playback API response.

## v0.9.3 — Spotify device targeting

- Fixed Resume when Spotify reports the phone as available but not yet active.
- The app now resolves a usable Spotify device and targets playback with its device ID.
- Device preference favors the current active device, then the last device, then a smartphone/computer.
- Spotify Settings now distinguishes an available device from an active playback device.
- Resume errors now report whether Spotify returned no device at all.

## v0.9.2 — Chapter VIII / live personae roster

- Staged the Chapter VIII score using the new scene-first soundtrack approach.
- Chapter VIII targets approximately 35 minutes and is ordered around changing scene function rather than a simple low-to-high intensity curve.
- Added Tollen Sendek and Shipmaster Baryk Carya to the spoiler-safe roster.
- Added currently encountered Emperor's Children records for Saul Tarvitz, Eidolon and Fabius.
- Added progressive character status tracking.
- Pyr Rahl now changes to DECEASED at Chapter VI clearance instead of remaining generically ACTIVE.
- Personae summaries and statuses continue to unlock only at the chapter where the information becomes known.

## v0.9.1 — Spotify device flow / personae summaries

- Added Spotify playback-device detection.
- If no Spotify device is active when a chapter begins, the reading session now starts paused at 00:00 instead of silently running the timer.
- Settings now distinguishes Spotify connection state from playback-device state.
- Returning to the PWA triggers a device recheck, so opening Spotify once and coming back makes Resume reliable.
- Added progressive spoiler-safe summaries to every currently unlocked Dramatis Personae record.
- Character summaries gain additional details only after the relevant chapter clearance.
- REDACTED character dossiers can now be opened and read even without an image.
- Removed the unreliable Calas Typhon product-image endpoint; the card now intentionally shows REDACTED instead of a broken image.
- Remote official visual failures now degrade gracefully while leaving the textual dossier usable.

## v0.9.0 — Archive / track feedback

- Confirmed Chapters I–IV are successfully mirrored in Supabase.
- Added per-track `Fits` / `Doesn't Fit` marks during active Spotify playback.
- Track marks are stored with the chapter payload and included in copied debriefs.
- Added private Archive Recovery Code copy/restore controls for cross-install log recovery.
- Added a spoiler-gated Voidcraft & Theatre Archive.
- Seeded safe archive records for Eisenstein, Terminus Est, Istvaan III and a REDACTED Barbarus visual record.
- Added archive category filters for Voidcraft and Worlds / Theatres.
- Recalibrated the future music pool from Chapters III–IV feedback.
- Removed `A Speech On Earth` from the upcoming Chapter VI score and flagged it with `Side By Side` as a poor-fit candidate.
- Added a staged Chapter VII score so the app retains a three-chapter buffer.
- Chapter-specific reserve/final-cue rules remain independent per chapter.

## v0.8.4 — Cloud sync transport fix

- Fixed Supabase REST authentication for modern `sb_publishable_...` keys.
- Publishable keys now use the `apikey` header without being misparsed as a JWT.
- Local chapter logs will auto-mirror on the next app load.

## v0.8.3 — Managed cloud logs

- Created the production Supabase project in `sa-east-1`.
- Applied the reading log schema and RLS policies.
- Added a private stable helper for per-install sync-token RLS.
- Added an owner/book/chapter lookup index.
- Verified RLS with an anon-role smoke test.
- Supabase security and performance advisors now report no findings.
- Embedded the project URL and publishable browser key in the PWA.
- Existing local logs auto-mirror to Supabase on app load.
- Cloud logs are pulled back after sync for recovery across sessions/devices using the same install token.

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
