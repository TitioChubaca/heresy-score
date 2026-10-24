# Heresy Score — Technical and Musical Context

Last updated: 2026-10-24
Current patch protocol: **v0.11.5**
Current book: **Fulgrim (Book V)**
Correct chapter count: **17 (chapter XVII is a short epilogue)**
Current reader clearance: **Book IV complete; Fulgrim Chapter I complete**
Next score: **Fulgrim Chapter II — seven-cue first pass published; Spotify preflight pending; Kindle estimate 26 min**

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
The Flight of the Eisenstein has **17 chapters**, counting the short Chapter XVII epilogue, not 20.
The original app scaffold created 20 generic chapter cards.
Current runtime truncates the Book IV chapter array to 17 and fixes visible progress metadata. Older references to 16 predate the reader's clarification.
For the next book, total chapter count must be data-driven per book rather than hard-coded.

## Soundtrack method
Always work:
**text -> dramatic function -> character perspective -> implied acoustics -> emotional energy -> cue -> transition -> protected ending -> runtime validation**. See [SOUND_DIRECTION_BIBLE_V1.md](SOUND_DIRECTION_BIBLE_V1.md) for the normative process.

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
- NEVER auto-insert reserve tracks just to reach a duration estimate; any narrative insertion requires explicit editorial justification and a valid position before the protected Final Cue;
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


## v0.11.2 — extracted Book IV and safe archive migration (2026-10-23)
- `index.html` now loads `data/eisenstein-score.js` and `data/eisenstein-compendium.js` before its existing application script; both were extracted from the original, while existing runtime patch still applies later scores/status logic.
- `data/books.json` has Eisenstein (IV, 17 chapters, 3/5) and a sealed Fulgrim (V) placeholder, with no fabricated chapter data.
- Runtime initializes schemaVersion 2, keeps the old `heresy-score-v01` key and `state.done` read-path, and non-destructively copies Book IV logs into `state.books["flight-of-the-eisenstein"].done`. Subsequent saves mirror existing Book IV logs into the scoped copy.
- Fulgrim is **not activated**: UI, Spotify and Supabase code still largely assume Book IV. Next milestone is routing reads/writes across bookSlug and implementing real book switch; do not claim complete multi-book support.
- Local-only personal image importer `scripts/private-art.js` stores the user's own selections as browser IndexedDB blobs, without publishing to GitHub/Supabase. Credits are field-provided. Personal screenshot originals NOT committed to public repository.
- `scripts/book-backup.js` allows export of Book IV JSON reading history from Settings, excluding image blobs; backup should be taken before any full switch.
- Rendered PWA cache bumped via `sw.js`; live device/browser QA and successful Supabase synchronization not yet verified.
- Art direction correction: reduce uniform AI-like glow, halation, shiny/plastic finish; favor matte/painterly grain and meaningful focal highlights, for planets, ships, environments and characters. Original user-provided artworks are not modified by default.

## v0.11.2 — multi-book state selection (2026-10-23)
- Added `scripts/book-state.js` with schemaVersion 3, non-destructive legacy Book IV migration, `persistActive`, safe book switch and active session guard. Invariant: `state.done` reflects only the selected book, `state.books[slug].done` stores per-book records.
- `index.html` now loads the migration before the inline runtime and persists the selected book on `save()`. Cloud upload/pull uses active `book_slug`, Supabase `app_version` updated to 0.11.1, nullish-coalescing avoids altering explicit empty values on cloud pull.
- Added `scripts/book-switch.js`: Book Archives selector IV / V, per-book UI state, Book IV restored as archive, Book V selected as a sealed/uncurated placeholder; no invented Fulgrim scores, personae, plot or chapter count. The view blocks switching while a reading session is active. It deliberately does not enable starting chapter I before score QA.
- Added runtime scripts directly in `index.html` so a first-page load does not rely on service-worker injection. `sw.js` caches migration, selector and previous runtime, cache version `heresy-score-v0112`.
- Validated JavaScript syntax of live `index.html` script and modules. Unit-checked migration, reload/switch independence, credential preservation, and active-session rejection. NOT tested on user's device or live Supabase/Spotify; browser runtime integration remains to verify.
- Artwork browsing stays local-only; no artist screenshots committed to public GitHub.

## v0.11.2 — Portrait Studio enabled (2026-10-23)
- New modules: `scripts/portrait-pack.js` and `scripts/portrait-crop.js` loaded directly from `index.html` and cached via `sw.js` (cache v0113).
- Bulk `.hsartpack` importer reads the 29 user-provided images (22 character portraits, seven references), saving blobs only in existing IndexedDB `hs-private-portraits/images`; nothing is uploaded to public GitHub or Supabase.
- The private source package remains an attachment in this conversation, not a repo asset. Creator attribution is preserved as metadata, per-image publication rights still unverified.
- Adjustable X, Y and zoom crop per named character in Cogitator Settings; portrait cards use crop, open dossier shows whole image with `contain`. LocalStorage crop keys use `hs-crop:<character>`.
- Existing local portrait module can reload after bulk import. Initial presets for Garro, Mortarion, Loken and Abaddon.
- Static syntax tests passed. Live PWA, Spotify, Supabase and book IV/V switching still require device testing; do not assert complete QA.


## v0.11.3 — Fulgrim Chapter I (2026-10-23)
- New `data/fulgrim-score.js`: only Chapter I, playlist sequence and score metadata; no future character records or narrative reveals.
- Initial cue: Path of Trust / Jesper Kyd. Curated musical arc: cautious ceremony, atmospheric reflection, developing tension, action and sober ending. Target 33 minutes is a provisional planning value, not a measured chapter size; total and track availability await Spotify resolve.
- `scripts/book-switch.js` restores the Book IV archive on demand and installs the Chapter I score for Fulgrim. Chapter II+ remain sealed. `patch-v0102.js` now names the reused Spotify playlist for active book.
- Important: This is mood-first calibration because chapter-specific detailed text and Kindle page count have not been provided for the new book. Do not claim fine-grained scene sync. Calibrate after real chapter feedback.
- QA: JS syntax and module order checked; not live tested against user's Spotify/Supabase/device. Book IV remained preserved in user's manual switch test on prior version.


## Sound direction policy correction — 2026-10-23 (v0.11.4)
- Reader insists the soundtrack must function as **film music editing + implied sound design for silent reading**, not a franchise playlist, generic genre classification or mathematical timing exercise.
- Dramatic function comes first: performance does not always equal opera; Warsinger does not automatically mean singing. Use musical texture, dynamics, spatial acoustics, restraint, silence, and perspective to supply absent ambience.
- Composer pool is deliberately unrestricted: games, cinema, modern classical, experimental, ambient and other media, not only Warhammer 40k authors. Screen candidates for suitability, not genre.
- **Ending cue has narrative priority**; reserves and trims are opt-in only with scene-based justification. No automatic padding or trimming by minutes.
- In `patch-v0102.js`, `durationReserve` remains inert unless `reserveMode:"narrative_insert"` and a nonempty `reserveJustification` are explicitly present. Trims similarly require `trimMode:"narrative_trim"` and `trimJustification`. Older book metadata remains but cannot trigger mathematical auto insertions.
- Fulgrim I actual 25 minutes, ~3.5 tracks left. Fulgrim II Kindle estimate 26 min, to be assessed against chapter size and actual pace without arbitrary headroom; soundtrack still requires scene-aware curation.
- New canonical guidance: `docs/SOUND_DIRECTION_BIBLE_V1.md`. Protect spoiler-sensitive scene maps.
- Static runtime validation remains distinct from live Spotify or reading-device QA.

## Delivery pipeline — 2026-10-24
- Prioritized working board: `docs/ACTIVE_PIPELINE.md`. P0 before next chapter: safely curate Fulgrim II, validate real Spotify durations and protect ending; P1 backfill Fulgrim I Compendium; P2 reliability and logs; P3 refactor and visual extension.
- Current verified source: `data/fulgrim-score.js` still has only Chapter I and empty personae/archive data. Do **not** claim Fulgrim II is published or that Book V character records already exist.
- Project-scoped attachments `READING_CONTEXT.md`/`HERESY_SCORE_CONTEXT.md` are stale relative to repository; ensure user-controlled Project copies are refreshed before depending on them in another chat.

## v0.11.5 — Fulgrim II and Compendium I (2026-10-24)
- User clearance: through Fulgrim Chapter I. Chapter II cue is playable only after Chapter I is logged; no spoilerful future scene labels are published. Later chapters still sealed.
- Chapter II score in `data/fulgrim-score.js`: Arrakeen (Hans Zimmer), Streets of New London (Piotr Musiał), The Shepherd (Piotr Musiał), Herald of the Change (Hans Zimmer), Transmission Commences (Jesper Kyd), The City Must Survive (Piotr Musiał), Blood for Blood (Hans Zimmer). 7 tracks, **25:39 public catalog runtime** (real Spotify matching/time not yet run). The last cue is a protected climax/ending; no reserve or trim. This is a candidate editorial montage based on chapter-level secondary summaries, not verified to the user's exact Kindle scene offsets.
- Chapter I Compendium in same file: six named people (Fulgrim, Solomon Demeter, Ostian Delafour, Serena d'Angelus, Bequa Kynska, Paljor Dorji), five records (Pride of the Emperor, Laeran, Atoll 19, Laer, recital). Each unlock at I; `scripts/book-switch.js` suppresses them before a Chapter I log exists. Personal portrait imports are restored after book changes.
- Added optional `Check Spotify Runtime` button for Chapter II; prepares the active private playlist without starting the timer or playback. Reports exact resolved runtime and final-cue index, or a clear Spotify error.
- `index.html` now writes `app_version=0.11.5` to Supabase, and PWA cache updates with the new files. Static JS syntax and book-state regression checks passed, but live Spotify/device QA remains pending.
- Timing: Chapter I actual 25 min vs ~3.5 unused cues; Chapter II Kindle forecast 26 min. 15 chapters of Eisenstein II–XVI median 33 min but not directly transferable due unequal chapter lengths. Reserve and trim remain disabled by default.
- Soundtrack selection wider than Warhammer: Hans Zimmer (Dune), Piotr Musiał (Frostpunk), Jesper Kyd (Darktide). Protect narrative function, implied space and transitions; no literal opera mandate.
