# Heresy Score — v0.10.9

Mobile-first, spoiler-safe reading soundtrack companion for *The Horus Heresy*.

## Current reading state

- Active book: *The Flight of the Eisenstein*
- Reader clearance: Book IV completed through Chapter XVII epilogue; Fulgrim not yet started.
- Book IV has 17 chapters, including an unscored epilogue XVII.
- Chapter XVII can be marked read separately after Chapter XVI is logged.
- Book V migration/refactor is still pending.
- Local progress key is still `heresy-score-v01` so existing reading history survives upgrades.

## Main features

- PWA installable on mobile.
- Spotify PKCE connection with automatic private chapter playlist sync.
- Spotify playback-device state detection, with the reading timer held at 00:00 when Spotify has no active device.
- In-app reading session controls:
  - Play / Resume
  - Pause session
  - Previous / Next track
  - protected Final Cue jump
- Reading timer pauses together with the Spotify session.
- Scene-first soundtrack curation: emotional/scene function is prioritized before total playlist duration.
- Pace-aware chapter targeting uses the reader's ~1.5 min/page baseline plus recent actual chapter times; duration is calibrated per chapter rather than with a global buffer.
- The app now measures the real Spotify runtime after track resolution and can trim or add only chapter-curated cues to stay near the intended duration.
- Leitmotif layer tracks recurring musical identities without forcing the same cue into every appearance.
- Expanded composer palette can pull from additional official Warhammer soundtracks when a scene needs a different emotional color.
- Chapter-specific score metadata supports:
  - curated target duration
  - optional reserve tracks only where the chapter structure allows them
  - protected final cue
  - READY / STAGED / SEALED states
- Field Logs with:
  - reading time
  - duration / opening / peak feedback
  - notes
  - per-track Fits / Doesn't Fit marks
  - Copy Debrief
  - local/cloud sync state
- Compact chapter reading window plus full archive toggle.
- Book archive view.
- Spoiler-gated Dramatis Personae.
- Progressive spoiler-safe character summaries that expand only when the relevant chapter clearance is reached.
- Progressive ACTIVE / DECEASED status tracking based only on the current reading clearance.
- Broken/unreliable external character visuals fall back to an intentional REDACTED record instead of a broken image.
- Voidcraft, Theatre & Entity Compendium with clearance-gated records and explicit Official / Reconstruction / REDACTED labeling.ED provenance.
- Private Archive Recovery Code for restoring the same cloud log identity after reinstalling or moving devices.
- Safe character visuals when a period-appropriate source is available.
- Imperial-style REDACTED dossiers when a safe visual is not available.
- Dedicated adaptive-safe PWA icon generated from the repository Aquila asset.

## Spotify

Spotify uses Authorization Code with PKCE. The public Client ID is configured in the app; no Client Secret is stored in the frontend.

The app maintains one private active playlist and replaces its contents with the score for the current chapter rather than creating a new playlist for every chapter.

## Cloud logs

Cloud sync is active. A reproducible Supabase schema is included at:

`supabase/schema.sql`

The frontend already supports:
- pushing individual chapter logs,
- mirroring all local logs,
- pulling logs back to a device,
- per-install sync tokens,
- local-first fallback.

The Supabase backend is provisioned in São Paulo (`sa-east-1`), the schema is applied, RLS is enabled, and the PWA is preconfigured with the project URL and publishable key. Existing local logs are mirrored automatically on app load unless cloud sync was explicitly disabled. The archive recovery code can be copied to another installation to recover the same log identity.

## Repository layout

```text
assets/
  ui/
    symbols/
    animated/
    numerals/
    icons/
scripts/
  build_app_icons.py
supabase/
  schema.sql
.github/
  workflows/
    build-app-icons.yml
index.html
manifest.webmanifest
sw.js
```

## Versioning / maintenance

UI, soundtrack logic, reading-state behavior and integrations are tracked in `CHANGELOG.md`.

Service-worker cache versions are bumped whenever the installed PWA must receive a new shell/assets revision.

## Attribution

This is an unofficial personal reading tool. Warhammer, The Horus Heresy and related marks/characters are property of Games Workshop. Some spoiler-safe official visual references may be displayed for personal archival/reference use. The interface and application code are custom.


## Persistent project context
- `docs/READING_CONTEXT.md` — spoiler-safe reading state, themes, character status and open questions.
- `docs/HERESY_SCORE_CONTEXT.md` — soundtrack methodology, reader calibration, app architecture, known debt and next-book refactor plan.

## Book IV epilogue and portrait work
- Chapter XVII has an epilogue score and a separate option to mark prior completion without fabricating reading minutes.
- Compendium now distinguishes existing image provenance from missing original portraits, using a consistent branded placeholder.
- See `docs/BOOK_IV_V_TRANSITION_SPEC.md` for transition requirements and portrait audit. Fulgrim is not yet enabled.
