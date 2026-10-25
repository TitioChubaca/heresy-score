# Heresy Score — v0.11.7

Mobile-first, spoiler-safe reading soundtrack companion for *The Horus Heresy*.

## Current reading state

- Active book: **Fulgrim**, Book V. Reader completed Chapter I; Chapter II score ready for Spotify preflight; Chapter III+ sealed.
- Chapter II soundtrack: seven carefully ordered cues; published catalog time **25:39**; actual Spotify runtime must be confirmed in app.
- Ending cue protected; no algorithmic reserve/trim for duration alone.
- Chapter I Compendium: six named people and five already-seen locations/cultural entries, gated behind completion of Chapter I.
- Previous book *The Flight of the Eisenstein* preserved as a 17-chapter archive (including epilogue XVII), rating 3/5.
- Local progress key remains `heresy-score-v01` with per-book `state.books[slug]` migration v3; do not wipe site data.
- Sound direction rules: [Sound Direction Bible](docs/SOUND_DIRECTION_BIBLE_V1.md).
- Active work/QA checklist: [Active Pipeline](docs/ACTIVE_PIPELINE.md).

## P2 reliability and feedback (v0.11.6)

- Post-reading form now accepts optional **Ending**, **Atmosphere** and **Transitions** evaluations; fields are mirrored as JSON log payload with no Supabase schema migration.
- PWA prevents late cloud operations from mixing books after IV ↔ V changes.
- Spotify creates a **separate private playlist per book/chapter** when first prepared, leaving prior legacy playlists intact.
- Avoids duplicate chapter starts while a Spotify score is being prepared.
- Cogitator Settings supports **Export all books backup** (no credentials) and **Run local diagnostics** (sanitized report).
- QA status: JavaScript and simulated race tests passed; user-device Spotify, Supabase round-trip and offline tests remain in [P2 QA checklist](docs/P2_QA_CHECKLIST.md).

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

## v0.11.3 book archives
- Book IV data extracted and preserved under `state.books["flight-of-the-eisenstein"]`.
- Book V selector is available through Book Archives. Fulgrim scores/content remain sealed pending curation.
- Local state migration v3 preserves legacy `heresy-score-v01` storage and independent chapter logs by book.
- Cloud requests now use active book slug; Spotify still uses one active playlist but no Book V tracks are provided before curation.
- This is not a validated multi-device release: test book switching, cloud recovery, app cache and player before relying on the new workflow.

## v0.11.3 local portrait import
- Personal Art Pack importer in Settings accepts the one `.hsartpack` file from the user's conversation, stores files in IndexedDB, and does not upload artwork to GitHub or Supabase.
- Per-character portrait crop studio controls horizontal/vertical focal position and zoom (card view); dossier modal displays full image.
- The original per-file importer remains available; bulk import shares its IndexedDB store.
- Private art package is intentionally not shipped in the public repository. If changing devices, import it again.
- Browser/device runtime test still needed; source files passed JavaScript syntax checks.

## Book V opening score — v0.11.3
- Fulgrim Chapter I prepared in `data/fulgrim-score.js`. This is an **initial mood-first** playlist, not a chapter-text-verified, scene-by-scene timed score. Reader runtime target 33 minutes, Spotify real track resolution still untested.
- Book switch loads a chapter I score while later chapters remain sealed. The Spotify active playlist name adapts to the current book and reuses the existing private playlist.
- No future character descriptions or scenes embedded in the public player. Device/browser, API and playlist-length verification remain pending.

## Fulgrim Chapter III — v0.11.7
- Chapter III: source-driven cue sequencing from a **private** 9-segment narrative map, total **24:20** across 9 catalog-verified tracks. Live Spotify account duration/availability remains pending.
- The next unread chapter has a **Check Spotify Runtime** button; it does not start playback, only resolves and populates its private chapter playlist. Chapters IV onward remain sealed.
- No private source text or scene maps have been added to the public repo. Cache v0120. The user's previous 17-chapter Eisenstein archive remains separate and was smoke-tested for preservation.
