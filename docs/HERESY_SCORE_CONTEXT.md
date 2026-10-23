# Heresy Score — Technical and Musical Context

Last updated: 2026-10-23
Current patch protocol: **v0.11.0**
Current book: **The Flight of the Eisenstein**
Correct chapter count: **17 (chapter XVII is a short epilogue)**
Current reader clearance: **Book IV complete, through Chapter XVII**
Next score: **Fulgrim Chapter I, pending refactor and curation**

## Product purpose
Heresy Score is a mobile-first, spoiler-safe reading soundtrack companion for the Horus Heresy.

The primary product is **scene-to-music fit**. UI, cloud sync, archives, images and Spotify integration support that goal; they must not take priority over soundtrack quality.

## Core repository/runtime
- Repository: TitioChubaca/heresy-score
- Main PWA: index.html
- Runtime patch currently injected by service worker: patch-v0102.js
- Service worker cache should be bumped whenever the runtime patch changes.
- Persistent localStorage key: `heresy-score-v01`
  - Do not change without an explicit migration.
- Spotify uses PKCE; never store or request a client secret.
- Spotify Client ID is a public identifier and is already configured in the app.
- Supabase mirrors reading logs; local state remains authoritative.
- Supabase project ref: metjuhqaybhhauujahhu
- reading_logs stores chapter, minutes, length, intensity, opening, peak, notes and payload.
- The base index currently still contains some old hard-coded v0.10.1/version strings; runtime patching overrides visible behavior. This should be cleaned structurally for Book V.

## Critical structural correction
The Flight of the Eisenstein has **16 chapters**, not 20.
The original app scaffold created 20 generic chapter cards.
v0.10.9 truncates the runtime chapter array to 16 and fixes visible progress metadata.
For the next book, total chapter count must be data-driven per book rather than hard-coded.

## Soundtrack method
Always work:
**text -> scene -> emotional function -> cue -> total duration**

Privately map each chapter into:
- opening state
- dialogue/reflection
- tension
- action
- liminal/emotional
- ending function

Never expose the hidden scene map before the chapter is read.

## Reader timing model
- Reader baseline: roughly 1.5 min/page, but chapter-specific actuals outrank the baseline.
- Never apply a universal duration buffer solely because the previous chapter was short.
- However, three consecutive recent short endings reveal a systematic delivery problem:
  - Chapter XIII: ~26 min reading, score ended ~1–2 min early.
  - Chapter XIV: ~30 min reading, score ended roughly one track early.
  - Chapter XV: 36 min reading, score again ended significantly early.
- For the Chapter XVI finale, deliberate musical headroom is now preferred over silence at the end.
- v0.10.9 finale base score is designed around roughly 39 minutes of known source durations, before any reserve logic.

## Current duration engine
When Spotify resolves tracks:
- read real `duration_ms` from resolved tracks;
- sum the actual playlist runtime;
- use curated reserve cues only;
- preserve Final Cue position after insertions;
- avoid random filler;
- for the final chapter, do not trim merely to hit an estimated reading target if the extra minutes provide safe ending headroom.

## Repetition policy
Repeated music is allowed only when one of these is true:
1. It is an established leitmotif and the same thematic/emotional idea has returned.
2. Reader feedback previously identified the track as a strong fit for that specific function.
3. The recurrence creates intentional recognition.

Do not repeat tracks simply because they are familiar, available, or from the preferred composer pool.

Recent feedback: Chapter XV had too much recognizable repetition and some quiet dialogue needed less pressure.
Chapter XVI therefore uses a mostly fresh palette, including material from the Space Marine 2 OST alongside Darktide.

## Established / developing musical language
Strong fits:
- Noosphere — Sisters of Silence / blank presence.
- Beyond The Asteroid Belt — liminal Garro / suspended near-death or introspection.
- Across The Void — contemplative/travel/closing function; reader-confirmed fit.

Developing motifs:
- Shadow Quarters — Eisenstein / claustrophobic ship tension.
- Imperium of Man — restrained faith/clerical tone for conversations about belief; do not turn every Keeler scene into a choir.

Avoid / weak fits:
- Side By Side.
- A Speech On Earth.

## Scene-specific lessons
- Known catastrophe: melancholy / inevitability / horror is often better than heroic epic scoring.
- Warp horror: atmosphere, unreality and claustrophobia first; action still needs real impact when it arrives.
- Faith dialogue: calm, restrained clerical/choral texture rather than generic ambient music.
- Human/philosophical dialogue: leave room; do not score every reflective exchange too heavily.
- Action peaks: percussion/weight must rise enough to be perceptible.
- Ending function is independent from peak; a chapter can need a quiet, unresolved or mournful ending.

## Recent chapter feedback
- Ch V: duration good; battle/finale lacked appropriate musical support.
- Ch VI: opening too quiet for immediate combat; Beyond The Asteroid Belt excellent for Garro's liminal moment; ending a little too epic.
- Ch VII: good overall, ended 2–3 min after score.
- Ch VIII: score ran ~1.5 tracks too long.
- Ch IX: ~30 min, needed 1–2 min more; virus catastrophe was too heroic instead of melancholy.
- Ch X: planned target and actual Spotify runtime diverged badly; triggered duration_ms work.
- Ch XI: atmosphere good; final action needed more weight.
- Ch XII: 33 min; one cue remained, but Across The Void fit the ending very well.
- Ch XIII: music fit, but ended ~1–2 min early.
- Ch XIV: again about one track short.
- Ch XV: 36 min, again short; noticeable repeated tracks; some quiet moments needed less pressure.

## Chapter XVI score design
- Status: READY / FINAL.
- Private scene map is sealed until the reader finishes.
- Target philosophy: action must have weight, quieter material must breathe, ending must remain scored.
- Base soundtrack uses a mostly fresh Space Marine 2 + Darktide palette.
- Approximate planned base runtime from published track durations: ~39 minutes.
- Additional curated reserves exist if Spotify resolves the score materially shorter.
- Do not show future scene-to-track mapping before completion.

## Archive / compendium structure
- Dramatis Personae
- Voidcraft
- Worlds / Theatres
- Entity Compendium

Visual priority:
1. Official and safe for current clearance.
2. Canon reference.
3. Clearly labelled representative visual / reconstruction.
4. REDACTED.

Never use a later visual that spoils a transformation or fate.

## Known app debt to address before Book V
After Flight of the Eisenstein is finished, refactor rather than stacking more runtime patches:
- Move books/chapter counts/scores into structured per-book data.
- Remove hard-coded 20-chapter assumptions.
- Migrate v0.10.x runtime patch logic cleanly into the base app.
- Fix app_version written to Supabase so it reflects the actual runtime protocol.
- Make real Spotify runtime visible before starting a chapter.
- Add explicit Ending feedback separate from Peak.
- Improve archive image loading/fallbacks and stop relying on fragile external hotlinks where possible.
- Audit all character statuses for meta-spoiler leakage.
- Make leitmotif metadata first-class rather than scattered constants.
- Add an automatic recent-track repetition check before finalizing a score.
- Add a soundtrack QA check: planned runtime, resolved runtime, scene coverage, ending coverage, repeat count.
- Prepare Book V as a separate data package without changing the localStorage key unless a migration is intentionally designed.


## Book IV final field debrief — 2026-10-23
- Reader rating: 3/5. Strongest musical alignment: 'The Emperor of Mankind' during Garro's faith-driven return in the Decius / Lord of the Flies confrontation, reported as cinematic.
- Chapter XVI score had enough additional tracks to extend into the short epilogue XVII, but playback ended before the reader finished both chapters. Reader considered it acceptable because XVII had not been planned.
- Chapter XVII should be a separate **unscored** Field Log, without fabricating a standalone reading duration. Its minutes can remain null.
- v0.10.9 patch restores chapter XVII in UI and provides a 'Log Read Epilogue' action after chapter XVI is logged. This is an incremental correction, **not** the completed Fulgrim transition refactor.
- Must preserve Book IV local logs and Supabase owner identity at transition. Avoid overriding logs on completion.


## v0.10.9 — Book IV epilogue and portrait groundwork
- Chapter XVII now has an 2-cue epilogue score (Immortal Imperium → Across The Void), Spotify-resolved playback and an optional reserve specified outside the automatic runtime extension.
- Existing reader can mark epilogue read without inventing reading minutes. New readers can play the regular timed chapter score.
- Chapter statuses updated: Sendek and Decius through XVI; Malcador introduced at XVII.
- Compendium art metadata and branded portrait-pending cards introduced; original art not yet generated or added.
- Specification and character visual audit: docs/BOOK_IV_V_TRANSITION_SPEC.md.
- Pending major refactor: book-specific logs, Supabase migration, base-source consolidation, Fulgrim readiness. Do not claim completed.


## Compendium style work — 2026-10-23
- Created `docs/COMPENDIUM_STYLE_BIBLE_V1.md`: original portrait style, canonical/era-safe composition, 3:4 portrait system, visual source provenance, creator attribution, usage permission check, QA and independent spoiler gates.
- Created `docs/BOOK_IV_CHARACTER_IMAGE_MATRIX.md` with Book IV per-person visual triage, 4-character pilot (Garro, Sendek, Decius pre-corruption, Malcador) and global archive note for Garviel Loken.
- Reference creators named by reader: @chrisjonessuperartist (colored stylized marine studies) and @tattoo_babay (sculptural grayscale primarch/character studies). Attribution is reader-supplied and needs per-post verification before publication. User-supplied image screenshots remain private study references unless redistribution rights verified.
- Current code still has incomplete book scoping; character art metadata and actual portrait asset integration pending. Do not mistake style-board concept art for canon-verified individual portraits.


## v0.11.0 — extracted Book IV and safe archive migration (2026-10-23)
- `index.html` now loads `data/eisenstein-score.js` and `data/eisenstein-compendium.js` before its existing application script; both were extracted from the original, while existing runtime patch still applies later scores/status logic.
- `data/books.json` has Eisenstein (IV, 17 chapters, 3/5) and a sealed Fulgrim (V) placeholder, with no fabricated chapter data.
- Runtime initializes schemaVersion 2, keeps the old `heresy-score-v01` key and `state.done` read-path, and non-destructively copies Book IV logs into `state.books["flight-of-the-eisenstein"].done`. Subsequent saves mirror existing Book IV logs into the scoped copy.
- Fulgrim is **not activated**: UI, Spotify and Supabase code still largely assume Book IV. Next milestone is routing reads/writes across bookSlug and implementing real book switch; do not claim complete multi-book support.
- Local-only personal image importer `scripts/private-art.js` stores the user's own selections as browser IndexedDB blobs, without publishing to GitHub/Supabase. Credits are field-provided. Personal screenshot originals NOT committed to public repository.
- `scripts/book-backup.js` allows export of Book IV JSON reading history from Settings, excluding image blobs; backup should be taken before any full switch.
- Rendered PWA cache bumped via `sw.js`; live device/browser QA and successful Supabase synchronization not yet verified.
- Art direction correction: reduce uniform AI-like glow, halation, shiny/plastic finish; favor matte/painterly grain and meaningful focal highlights, for planets, ships, environments and characters. Original user-provided artworks are not modified by default.
