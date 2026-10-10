# Heresy Score — v0.8.2

Mobile-first, spoiler-safe reading soundtrack companion for *The Horus Heresy*.

## Current reading state

- Active book: *The Flight of the Eisenstein*
- Spoiler clearance: through Chapter III
- Chapter IV: READY
- Chapters V–VI: STAGED
- Local progress key is still `heresy-score-v01` so existing reading history survives upgrades.

## Main features

- PWA installable on mobile.
- Spotify PKCE connection with automatic private chapter playlist sync.
- In-app reading session controls:
  - Play / Resume
  - Pause session
  - Previous / Next track
  - protected Final Cue jump
- Reading timer pauses together with the Spotify session.
- Chapter-specific score metadata supports:
  - curated target duration
  - optional reserve tracks only where the chapter structure allows them
  - protected final cue
  - READY / STAGED / SEALED states
- Field Logs with:
  - reading time
  - duration / opening / peak feedback
  - notes
  - Copy Debrief
  - local/cloud sync state
- Compact chapter reading window plus full archive toggle.
- Book archive view.
- Spoiler-gated Dramatis Personae.
- Safe character visuals when a period-appropriate source is available.
- Imperial-style REDACTED dossiers when a safe visual is not available.
- Dedicated adaptive-safe PWA icon generated from the repository Aquila asset.

## Spotify

Spotify uses Authorization Code with PKCE. The public Client ID is configured in the app; no Client Secret is stored in the frontend.

The app maintains one private active playlist and replaces its contents with the score for the current chapter rather than creating a new playlist for every chapter.

## Cloud logs

A Supabase schema is included at:

`supabase/schema.sql`

The frontend already supports:
- pushing individual chapter logs,
- mirroring all local logs,
- pulling logs back to a device,
- per-install sync tokens,
- local-first fallback.

The Supabase backend still needs to be provisioned and the schema applied before cloud sync is active.

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
