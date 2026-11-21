# Heresy Score — Technical and Musical Context

Last updated: 2026-11-07
Current patch protocol: **v0.15.5**
Current book: **Fulgrim (Book V)**
Correct chapter count: **17 (chapter XVII is a short epilogue)**
Current reader clearance: **Book IV complete; Fulgrim Chapter XII complete (confirmed log); Chapter XIII next. Never expose XIII+ narrative details.**
Next score: **Fulgrim Chapter XIII — editorial cue sheet staged; authoritative Spotify runtime and phone-device QA still pending. XIV–XXV only precurated, not ready-certified.**

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

## v0.11.6 — P2 Reliability and Sound Direction Feedback (2026-10-24)
- Active score remains Fulgrim Chapter II seven-cue candidate. No music reorder or spoiler gate changes here.
- Additional optional post-chapter ratings: `ending`, `ambience`, `transitions`, each shown in feedback form, debrief and field log; saved alongside existing fields in JSON `payload` and mirrored to Supabase with no schema change. Older logs remain readable, missing ratings are `—` / not evaluated.
- Fixed **async cross-book cloud race**: requests capture slug+token; stale IV/V push or pull responses are ignored, and a changed record is not falsely marked synced.
- Spotify score playlists now have stable book/chapter-scoped `state.spotify.playlists[slug+':'+chapter]` identifiers. The previous shared playlist is left intact rather than silently reassigned. `state.spotify.playlistId` is only the pointer to current synced chapter. Switch books clears the pointer and blocks switching during a pending Spotify session start.
- Backup now exports **all books**, accurately assigns `legacyBookIVLogs` from Book IV, excludes sync credentials and Spotify tokens, and warns that private images are not included. No automatic import or destructive restore was added.
- Added non-destructive Settings diagnostics, with Copy sanitized report, counts per book, connection booleans and PWA controller status, no reading notes or tokens.
- `app_version=0.11.6`, offline SW cache `heresy-score-v0119`, new `scripts/feedback-direction.js` and `scripts/p2-diagnostics.js`.
- Ran JS syntax and mock asynchronous cloud/Spotify regression tests. **Real account/device Spotify playback, Supabase round-trip, final cue/timer and PWA offline behavior are not yet verified.**
- The authoritative user-device steps are in [P2 QA checklist](P2_QA_CHECKLIST.md). P2 must not be declared fully finished until user testing.


## P2 field observation — 2026-10-24
- User reports installed PWA still shows **17 Eisenstein chapters** and Fulgrim II Check Spotify Runtime worked. Site in ordinary browser shows only 2 Eisenstein and 0 Fulgrim in local diagnostic v0.11.6; do not mistake that for data loss in PWA.
- Read-only cloud aggregate across owner_hash groups: main archive 17 Eisenstein + 1 Fulgrim; secondary 2 Eisenstein + 0 Fulgrim. Owners are currently separate. No identifying hashes or recovery credentials stored in docs.
- Keep PWA as canonical client. Do not suggest clearing data, reinstalling, migrating stale browser logs or cross-linking archive tokens unnecessarily.
- Caveat: auto `cloudSyncAll` on boot/connect is push-first; if a stale second client is manually joined to the main token in the future, it can overwrite shared chapters. Track a non-destructive pull-first merge and sync reconciliation as a reliability item before enabling cross-device sharing.
- Spotify run was confirmed by reader but real resolved track duration and final-cue correctness not provided. Remains partly unverified.


## 2026-10-25 — Book V text-first source preservation
- The reader supplied an accessible MOBI of Graham McNeill's **Fulgrim** in a private conversation. Its text and 25 chapter boundaries (five parts) were verified. **The copyrighted original and private scene maps are NOT checked into the public GitHub repository.**
- Public metadata now lives at `data/fulgrim-chapter-metrics.json` (25 chapters with word counts/paragraph counts only).
- Permanent public curation and spoiler-control methodology: `docs/FULGRIM_TEXT_FIRST_WORKFLOW.md`.
- A private downloadable `FULGRIM_PRIVATE_CURATION_INDEX.md` and a private JSON scene-map scaffold were created in the conversation; these have empty future scene lists, **not 25 completed music scores**. Reader should add source MOBI and private index to Project files if they need guaranteed cross-chat access.
- Editorial decision: analyze the real text of all chapters in privately stored scene maps, but publish/Spotify-QA soundtracks in batches of ~1–3 upcoming chapters; never use pre-set scene/act counts.
- Observed Chapter I was 4,776 words and 25 minutes (reader reports ~3.5 unused tracks); Chapter II is 5,359 words, with a 26-minute Kindle estimate at the time. One-chapter reading pace is not a universal rate.
- The existing Book V chapter I–II scores remain as-is. This documentation/metadata change is not a claim that future chapters have text-mapped, Spotify-verified scores.


## v0.11.7 — Fulgrim chapter III text-first score (2026-10-25)
- The 9 passage map for Book V/Chapter III was reviewed privately from the supplied MOBI. The public app only contains 9 generic soundtrack title/artist cues; not plot summaries or future personae.
- Catalog-based soundtrack 24m20s (1460s). Planning estimate from source text roughly 24m12s; actual Kindle/chapter reading runtime and Spotify logged-in recording durations remain pending.
- Installed Chapter III; Chapter IV is a sealed placeholder. Preflight **Check Spotify Runtime** now targets the next eligible chapter rather than only Chapter II.
- Book metadata set to 25 chapters (reader-provided MOBI); historical Book IV records and playlist IDs remain untouched. Service-worker cache v0120, new logging app_version v0.11.7.
- Static module syntax, progression gating and book-state migration smoke tests PASS. Browser/device live Spotify synchronization still requires user verification before marking score fully validated.
- Private editorial handoff: `FULGRIM_CH03_PRIVATE_CUE_PACKAGE.zip` should be stored among the private Project files, never on public GitHub.


## v0.11.8 — Fulgrim III feedback, portrait recovery and optional transition markers (2026-10-26)
- Confirmed Supabase log: Fulgrim I 25 min, II 28 min, III 21 min; III general musical fit GOOD, cue order noticeably better, but battle music may start after action begins or continue during dialogue after action ends.
- Explicitly **do not** infer next chapters' scene sequence from past feedback or indiscriminately shorten all tracks. Use text-derived private scene maps, segment-level word counts and actual reading pace variability. The 24:20 catalog score vs 21-minute reading is a total-length diagnostic, not enough to infer individual boundaries.
- `scripts/scene-transition-markers.js`: optional one-tap in-session *action started/music calm* and *action ended/music intense* marks with elapsed timer and currently detected Spotify track. They are copied to the finished local chapter log as `sceneMarkers`, inherited by existing Supabase payload sync; absent markers remain valid. This does not automatically change playlists.
- `scripts/private-art.js` now refreshes active roster dynamically, cancels stale concurrent restoration, adds per-book coverage and missing-art diagnostics, and maintains individual import choices after Book IV/V switching.
- `scripts/book-switch.js` announces `hs-book-changed` at startup as well as on each switch. `scripts/portrait-crop.js` refreshes selectable characters and imported keys and describes missing files. `scripts/portrait-pack.js` reports how many imports match the active book rather than claiming every stored portrait is displayed.
- Critically, the private 29-image package contains *one* portrait matching current Fulgrim chapter-I character dossiers, **Fulgrim**; five other currently listed dossiers (Solomon Demeter, Ostian Delafour, Serena d'Angelus, Bequa Kynska, Paljor Dorji) require their own approved art. World/ship archive cards remain glyphs (not image-backed). Do not substitute another character's artwork or imply these are already illustrated.
- A user must import `.hsartpack` through settings *in the PWA browser where reading happens*. Chat/project file attachments do not automatically populate browser IndexedDB, nor does Supabase sync portrait blobs.
- Tested: JavaScript syntax in affected files, static script loading/cache paths, and mocked IndexedDB book switching (Garro restored in IV, Fulgrim restored in V, missing names correctly reported). Not yet validated on user's PWA device or Spotify live.
- Future log `app_version` is 0.11.8; offline cache `heresy-score-v0121`. Do not reset browser data or switch primary Supabase owner.


## Release 0.12.0 — continuous Fulgrim scoring and visual source audit (2026-10-26)
- Reader reports **Fulgrim Chapter V completed**. The cloud query returned only I–IV; do not pretend V cloud log exists or invent a timestamp/minutes. The Book V UI now presents an explicit `Mark Chapter V Already Read` button when IV is present and V is missing, storing `minutes:null`, `length:"not_measured"`, a manual origin note, and no fabricated finishedAt.
- Chapters VI, VII and VIII have actual reader-provided MOBI-based chronological scene maps, preserved privately as `FULGRIM_PRIVATE_MAPS_VI_VIII.zip`, never shipped publicly. Respect existing last-reader clearance through V; publication of music scores is sequential and unlocked by local logs.
- Catalog soundtrack plans: **VI 10 cues / 25:37**, **VII 11 cues / 26:43**, **VIII 12 cues / 28:43**; catalog durations taken from official Steam music tracklists and Spotify soundtrack catalog references. Exact account track IDs, runtime and playback order require PWA's Check Spotify Runtime before each chapter. Chapter IX remains sealed. Do not describe these scores as Spotify-device-verified.
- Fulgrim IV logged in Supabase: 28 min, duration good, intensity high, middle-scene tone can be improved. The conversation references Fulgrim talking to the apothecary as a moment whose background music could improve. User's claim that V is finished is distinct from IV feedback/log; never rewrite the wrong chapter.
- Visual audit `data/fulgrim-visual-audit.json` catalogs sources with provenance and story-era QA: official pre-Heresy imagery first; credited fanart second; **original generated reconstruction** as last resort. Do not use later corrupt forms or spoiler-bearing imagery. Five additional known characters and places are still awaiting sourced art.
- Expanded `data/fulgrim-score.js` Book V roster by 10 characters only as introduced through V. No future chapter VI–VIII character narrative spoilers are bundled, even if private soundtrack maps contain those.
- New private `heresy_score_private_art_pack_v2.hsartpack`: **35 entries (28 named portraits plus 7 style references)** by merging user's original personal art pack (29 entries) with **six labeled AI reconstructions** of early-book characters (Ostian, Serena, Bequa, Paljor, Coraline, Gaius). Keep outside public GitHub. `scripts/portrait-pack.js` preserves sourceKind and original MIME, and `scripts/private-art.js` labels `ARCHIVE RECONSTRUCTION` instead of masquerading as official art.
- Main app reported version 0.12.0, `sw.js` cache `heresy-score-v0123`. JavaScript syntax, score count/duration, sequential gating, distinct roster names, Book IV/V migration and cache link checks passed. Real Spotify authentication, live playback, PWA appearance and Supabase cross-device round trip still pending.
- IMPORTANT: the private MOBI, original fanart files and detailed future scene maps are NOT in GitHub. Reader should add `FULGRIM_PRIVATE_MAPS_VI_VIII.zip` and `FULGRIM_PRIVATE_CURATION_INDEX_v3.md` to private Warhammer Project. Keep PWA as principal client and do not clear browser IndexedDB/localStorage.


### Fulgrim VI–VIII batch preflight / v0.12.0 follow-up
- `scripts/book-switch.js` now adds **Prepare Spotify Playlists VI–VIII** to the Book Archives panel. It is an explicit user-triggered loop over scores VI, VII, VIII, performing normal `spotifySyncChapter(n)` and persisting distinct private chapter playlists without invoking playback or timer. It restores the previous active-playlist pointer at the end. This removes the need to interrupt subsequent reading sessions for manual score selection; the app still supports per-chapter Check Spotify Runtime.
- The script remains source-verified, but LIVE Spotify API resolution for all 33 song instances awaits the user pressing this button with Spotify connected. When any track fails, its corresponding error is presented in the Books panel; no fake success should be reported.
- Offline SW cache latest: **`heresy-score-v0124`** after batch preflight change (supersedes earlier v0123 text).
- The personalized art pack v2 is a private downloadable artifact produced in this conversation; adding it to Project ChatGPT files does NOT install it in PWA IndexedDB. Reader said existing art will be imported later; maintain local-only art, no private artist binaries to GitHub.

### Final v0.12.0 patch checkpoint
- All **25** chapter numbers are now rendered in Fulgrim's archive: VI–VIII are score candidates, IX–XXV remain sealed and carry no narrative data. Chapter V remains manual-log-only if not recorded.
- Final offline service worker asset cache is `heresy-score-v0125` (supersedes intermediate v0123/v0124 notes). Spotify preflight batch in Books prepares VI–VIII playlists but does not play music or create a timer.


## 2026-10-27 — Book V visual curation correction (v0.12.3)
- Reader rejected procedural vector default portraits as inaccurate for spoiler-safe reading; NEVER substitute generic vector heads as character likenesses again. Enforce OFFICIAL era-safe exact subject > verified credited FANART > grounded original generated painting; remove future-form imagery from consideration. Visual fidelity and character identification are more important than having every slot filled.
- New `data/fulgrim-curated-art.js` maps **16 Book V characters** (reader through chapter V) to 16 locally hosted original painterly WebP backups. External five source-specific references are **4 Black Library/Forge World-era official publications/sculpts** (Fulgrim, Ferrus Manus, Saul Tarvitz, Eidolon) plus **Solomon Demeter** credited fan-painted miniature by Lil Legend Studio. They are requested from source URLs; only mark official/fanart after the image actually loads. If hotlink fails, use clearly tagged painterly original reconstruction, never misleading vector art.
- Remaining 11 visible character entries currently use explicitly noncanonical, matte-toned generated portraits. Reader's individually imported `.hsartpack` art in IndexedDB ALWAYS overrides both. Book IV records unchanged.
- Two art references added to Voidcraft & Theatre Archive: the exact `Pride of the Emperor` ship by terraluna5, and a Laer warrior concept illustration by Julien Hainault. These also require live external image resolve. Other five non-character archive records have neutral glyphs, NOT generic invented depictions.
- `sw.js` updated to `heresy-score-v0129`, `index.html` log version 0.12.3, source scripts load between Book V scores and router. All 16 original WebP backups cached offline. Old SVG placeholder loader/files deleted from default public repo and no longer injected.
- Full image source review lives in `data/fulgrim-visual-audit.json` (v2) and `docs/FULGRIM_COMPENDIUM_PORTRAIT_AUTOLOAD.md`; public Github only hosts original generated imagery and code linking to credited third party images. Do not copy third-party binary art into a public repo without permission, and do not disclose a private repo token to the PWA.
- QA: repo git tree verified 16 WebP files exist, correct JS syntax/loading/cache, simulation 4 official + 1 fanart when remote images resolve, 11 generated in the remaining slots; personal blob overrides still win. Live remote hotlink appearance in user's installed phone and service-worker activation remain UNVERIFIED. If blocked, still show painterly fallback and accurate reconstruction label.
- Do not expose pages about post-V plots; links stay in internal provenance metadata rather than prominent spoiler-bearing links in app UI.


## 2026-10-27 — CRITICAL correction: Fulgrim reading ceiling IV; all 25 scores pre-curated
- **User has NOT read Fulgrim Chapter V.** Earlier mistaken click on `Mark Chapter V Already Read` recorded a false `readingType:"read_outside_app",minutes:null` entry. Book V local repair in `scripts/book-switch.js` deletes ONLY that artificial marker and prevents returning from cloud pull; genuine measured logs remain untouched. The false manual-completion button was removed. Never again use `readerDeclaredThrough:5` unless the user actually finishes V.
- Book V chapters **I–XXV** now have explicit cue sheets in `data/fulgrim-score.js` (I–VIII) and `data/fulgrim-future-scores.js` (IX–XXV). Future chapter event descriptions and private scene paragraphs are NEVER sent to the public PWA. UI remains sequentially gated: V is next-ready when I–IV finished; VI–XXV are staged, NOT marked read.
- Chapters IX–XXV: 17 new score sheets, 170 ordered cues derived from the reader-supplied **Fulgrim MOBI** by paragraph-anchored text segmentation and mood analysis. They are first-edition source-informed curated candidates: **DO NOT** claim real-time Spotify availability, verified timing, perfect phrase-level synchronization, or per-scene editorial signoff. Estimated reading time uses ~195 English words/min from I–IV logs; target ~21–33 min depending on chapter length. The private 17-chapter mapping is `FULGRIM_PRIVATE_MAPS_IX_XXV.zip` (project attachment, DO NOT push to GitHub or show pre-read).
- `scripts/score-readiness.js` ensures published tracks are independent of local `state.done` and caches individual private Spotify chapter playlists by exact music-list signature, preventing full re-resolution every reading session. On soundtrack edits, fingerprint changes and playlist is refreshed.
- `scripts/spotify-resilient.js`: if the strict Spotify matcher fails on a single recording, the app retries by skipping only unavailable tracks, prepares a usable partial playlist, and flags `chapterRuntime.missingTracks`. This is a last-resort playback safety net, not a replacement for artist/title QA.
- Book Archive offers optional **Preparar playlists V–XXV** bulk first-time preflight with a STOP button. This is a user-triggered action requiring the user's Spotify connection; the assistant did NOT create/verify those private playlists remotely. Individual Begin Chapter still prepares the required next chapter if none has been cached.
- PWA cache **heresy-score-v0133**; current app log version **0.13.2**. All future scripts are precached; avoid query-string cache mismatch when offline. Neither Book IV nor Book V actual log history should be reset.
- Correct priority: NEVER delay user reading to redo a soundtrack because chapter was falsely marked done; cue sheet remains accessible in published source. If Spotify preflight fails, fix specific track later; never tell user to search 14 songs manually as primary solution.

## 2026-11-01 — Spotify cue restoration and review of reader logs
- Latest confirmed Fulgrim cloud logs: Chapter V 36m, VI 30m (short score; space-combat mismatch and lengthy transitions), VII 31m (strong fit; slower reading), VIII 30m (explicit mismatch: `Discordant Feast`). `trackFeedback` and `sceneMarkers` arrays are empty on these cloud logs; do not fabricate exact mismatch timestamps or infer missing titles from notes.
- A reader can pause a chapter, listen to other Spotify audio, then resume from the correct place. `scripts/spotify-chapter-resume.js` provides an explicit button and overrides **Resume** and active-session **Open Spotify**, selecting the chapter playlist, track index and `position_ms` from the persisted reading timer; ±30s manual corrections are possible. Nothing auto-overwrites unrelated audio on app open. Test via real Spotify Premium device remains pending. Offline SW version `heresy-score-v0135`.
- `refreshPlayer` refuses to overwrite the chapter's current-track status with other Spotify playlist contexts.
- Sound Direction Bible already required non-Warhammer music and justified leitmotifs. Preliminary 255-entry audit: 47 entries from listed external-media composer pool (~18.4%); high repetitions (up to 7 uses for certain tracks) lacked scene-function documentation. Many repeats were familiarity/limited pool, not validated leitmotifs. Do not claim deliberate leitmotif without supporting private narrative reasoning.
- Historical feedback adjustments: VI inferred fleet-combat cue `Onslaught` replaced with `The End Run` (Jack Wall; provisional); VIII explicitly rejected `Discordant Feast` replaced with restrained `The Royal Conservatory` (Daniel Licht; awaiting reader QA). Active or unread Chapter IX soundtrack kept unchanged.
- Detailed spoiler-free decisions, log evidence and Spotify transition settings caveats: `docs/FULGRIM_MUSIC_QA_2026-11-01.md` and `docs/SOUND_DIRECTION_BIBLE_V1.md`.

## 2026-11-02 — Chapter IX Spotify runtime autofit
User-observed IX 22:38 vs 25:12 text estimate. Added The Still, Cold World (Bonus Track), Piotr Musial, published 2:29, at the private source transition after block 6; projected playlist 25:07 if the same recording is resolved. The original final cue is protected. New `scripts/spotify-runtime-fit.js` selects from limited source-approved bridges for later chapters when the Spotify duration shortfall is 90–330 sec and insertion brings it within 45 sec of target. No blind end-padding or automatic trimming, no edits to active sessions, no duplicate insertion on repeat checks. `Check Spotify Runtime` is now `Verificar e ajustar duracao`; device Spotify confirmation still pending. App 0.13.4, PWA cache v0137.

## 2026-11-03 — App Lab handoff: Fulgrim IX–X, runtime and musical quality
- New conversation supersedes the previous App Lab chat. Latest *confirmed repository checkpoint* is app **0.13.4**, service-worker cache **v0137**; do not infer newer deployed versions without inspection.
- Reader reports **Fulgrim IX completed**. Its overall playlist length matched reading well, but some cues began with an appropriate restrained tone and later became too energetic for the actual passage. Therefore **whole-track emotional trajectory** (intro, middle, ending, dynamic spikes) must be reviewed; opening mood alone is insufficient.
- Chapter X: reader tried **Verificar e ajustar duração** and reports it **did not work**. Do not claim runtime autofit is fixed merely because v0.13.4 code exists. Diagnose on the actual app/runtime: Spotify auth/device, resolved track IDs and duration_ms, target versus actual, eligible shortfall range (90–330s), candidate/bridge availability, insertion point, chapter readiness, caching/fingerprint, UI error/status, and whether the change survives playlist refresh. Do not automatically pad if no editorially appropriate cue exists.
- Chapter IX prior preflight observation: **22:38** Spotify runtime versus **25:12** estimate; the v0.13.4 patch proposed adding **The Still, Cold World (Bonus Track)** (Piotr Musiał, nominal 2:29), projecting **25:07**. Reader's later report that duration fit does **not** establish whether this insertion actually played; inspect live resolution/logs before attributing the outcome.
- Score quality priority: **text-anchored scene alignment > internal dynamic contour > transition > intentional leitmotif > runtime matching**. Do not sacrifice narrative fit merely to reach the Kindle time estimate.
- Expand the search pool **beyond Warhammer OSTs** when a track is genuinely better suited. Consider game/film/ambient catalog with precise artist, recording, availability, dynamics and provenance. Avoid a token diversity quota or generic cinematic bombast.
- **Leitmotif discipline:** maintain concept/character, emotional function, motif identity, last uses, strength/confidence, and explicit reason for each recurrence. Repeated track != leitmotif. Review reuse across the last three chapters and replace convenience repetitions.
- Add musical **arc QA**: evaluate the full track (quiet intro, build, percussion entry, climax, outro), not just its first 20–30 seconds; reject a cue whose later intensity collides with a sustained quiet scene. If possible store energy-curve notes and acceptable excerpt boundaries; never assume Spotify API provides reliable segment-level audio analysis.
- Before marking a chapter READY, verify exact Spotify recording, resolved runtime, ordered text segments, transition fit, final-cue protection, duplicate/recent-use warnings, and spoiler-safe metadata. Distinguish catalog estimates, app-resolved values and reader-confirmed playback.
- Preserve all reading logs, local state, private MOBI and sealed future scene maps. Never publish the MOBI or private narrative maps to the public repository. Chapter X remains unconfirmed as completed; do not reveal future plot.
- Next engineering task: reproduce and fix the **Chapter X Spotify runtime check failure**, then reassess its cue selection and dynamic contours. Follow with IX post-read audit and a general repeat/leitmotif guard.

## 2026-11-03 — Compact reading player UI (first implementation)
- Reader requested fewer chapter-start buttons and ability to browse spoiler-safe compendium images while chapter timer/music continues.
- Added `scripts/compact-reader.js` and loaded it after other scripts in `index.html`; offline SW cache bumped to **heresy-score-v0138**.
- Active player gains **Minimizar / Expandir**; compact mode docks at bottom with chapter/time and previous/pause/next controls. Existing session, timer and Spotify handlers remain authoritative, and no chapter abort/finish occurs when minimizing.
- Secondary track feedback, final cue and chapter finish/open Spotify/abort actions are grouped in a native expandable **Mais ações** section in full mode. These remain available by expanding the player.
- This is a first UI pass, **not device-tested**. Verify on Android PWA: viewport overlays, safe-area, archive navigation, image dialogs, pause/resume, track skip, finish, and page reload while active. Review other chapter-preflight action buttons in a second UI pass.
- Spotify runtime Chapter X bug remains open; compact player work does not imply runtime fix.

## 2026-11-04 — Spotify playback / timer regression repair
- Reader reported Chapter X active paused at 00:00; **Resume** failed even after opening Spotify manually, and **Open Spotify** was mislabeled/repurposed as a failed restore operation.
- Root code issue verified in `scripts/spotify-chapter-resume.js`: override of `toggleSessionPause` sent paused sessions to `restore(0)`, coupling timer progression to successful Spotify device/playback API calls. `openSpotifyBtn` was also overridden to run restore rather than navigate.
- Fixed timer resume to immediately update `state.active` and `renderNow()`, then attempt Spotify playback independently. Spotify failure must not freeze reading time.
- Restored `openSpotifyBtn` to open the chapter playlist URL. Explicit `Retomar trilha no ponto da leitura` remains the API seek feature and now reports errors more clearly.
- Offline cache bumped to **heresy-score-v0140**. Real Android/Spotify validation pending. Spotify API/device issues not yet proven fixed; do not claim end-to-end playback success.
- Next QA: reload PWA; verify timer Resume/Pause independently, playlist link opening, device status, explicit restore error details, and playlist track API behavior. Never reset Chapter X reading logs to test.

## 2026-11-05 — Spotify runtime overrun correction (v0.14.1 cache)
- Reader reports **Verificar e ajustar duração** left Chapter X about **three minutes too long**; wants bidirectional adjustment without disrupting authored narrative order.
- Inspected `scripts/spotify-runtime-fit.js`: previous implementation only added approved bridge tracks for shortfalls and incorrectly treated overlong playlists as sufficient.
- Updated live Spotify playlist duration audit on each check, and conservative rollback of an auto-inserted bridge ONLY when playlist has exactly one extra track, that track is at the approved insertion position, it matches an approved bridge, and all remaining original cue titles match the authored sequence. Verify after DELETE; never remove arbitrary source cues.
- After a bridge rollback, do not immediately reinsert the same bridge. If original sequence remains >45 seconds long, report the overrun as **unresolved editorial shortening** rather than trimming blindly. Future work: approved same-function replacement and/or excerpt/cue-boundary design.
- Cache **heresy-score-v0141**. Real device Spotify playlist test pending; active reading sessions remain protected from edits. Never describe full bidirectional shortening as solved until editorial overrun handling is implemented and tested.

## 2026-11-05 — Reader correction: overrun belongs to Fulgrim XI
- IMPORTANT: The reader clarified that the approximately **+3 minute** overrun after using **Verificar e ajustar duração** concerns **Chapter XI**, NOT Chapter X. Previous v0.14.1 note incorrectly attributed the overrun to X; retain X's earlier distinct runtime/button problems, but do not treat this +3m observation as X evidence.
- Focus next audit and Spotify live-duration verification on **Chapter XI** (estimated source target 21.7 min), preserving authored cue sequence and final cue. The generic bridge rollback implementation applies to XI but remains unverified on the user's playlist.
- Do not infer Chapter XI has been read or completed solely from Spotify preflight.

## 2026-11-05 — Fulgrim XI runtime diagnostic (v0142)
- Added chapter XI live per-track Spotify audit (`auditTracks`, `auditTargetMs`, `auditOrderMatches`) and an expandable audit under chapter XI's Spotify verification result, showing exact track durations, total deviation and whether authored cue order matches.
- The app still safely removes only provably auto-inserted bridges; it does **not** automatically remove/replace any of XI's eight authored cues without editorially justified alternatives. Spotify API is executed in reader's PWA, not through GitHub; actual playlist durations cannot be verified from repo alone.
- User should run verification on XI and share the audit if original eight tracks are overlong; then curate an appropriate shorter replacement in the same scene position, rather than guessing a song. Offline cache v0142. Do not claim the +3-minute issue has been eliminated.

## 2026-11-05 — XI runtime failed again; reader proceeds with reading
- Reader confirms v0143 quick-fit did not work; reading XI with existing playlist. Do not edit playlists during an active session.
- Reviewed source and **reverted unsafe quick-fit** that would delete an arbitrary middle cue solely by duration. The earlier promise of an automatic 21:42 fit was not validated. v0144 now labels the control **Auditar duração Spotify** rather than falsely implying guaranteed shortening. Spotify track-level audit remains, with safe removal only for proven added bridges; actual XI authored-score excess remains an editorial issue.
- Real solution still requires track-level live Spotify durations and a source-reviewed shorter replacement or properly authored shortened cue plan, then transactional playlist update with readback and UI status. Do not claim the 25:05 playlist is shortened until verified. Preserve opening/final cue and scene order, no plot spoilers.

## 2026-11-06 — Fulgrim XII overrun / replacement implementation v0145
- Reader reports Chapter XII remains over target after runtime check. Root cause in runtime-fit: overlong authored scores returned with a warning, without attempting shorter alternatives.
- Implemented XII-only shortening attempt at the preapproved transition slot using Spotify-resolved approved alternatives. Candidate must shorten duration and improve total deviation to <=60 seconds; preserve entry/final cue and remaining sequence. Updates playlist with ordered full-list PUT and verifies exact URIs via readback. No change if no valid candidate, or if active reading session. Track-level audit UI expanded to XII.
- Important: This is **not verified on reader's Spotify**; app cache v0145, user must refresh and run Auditar duração Spotify to execute. If no approved replacement fits, report unresolved excess; never claim success. Next step: inspect live XII audit, curate additional alternatives if necessary. No arbitrary cue deletion.

## 2026-11-06 — Chapter XII targeted quick fix v0146
- Reader reports XII remains too long after v0145. Added a conditional one-cue editorial reduction for XII: omit the middle atmospheric bridge `Beyond The Asteroid Belt` (index 5) ONLY if Spotify live duration would become closer to 29m36s with <=75s residual. Full ordered playlist PUT followed by exact URI readback; opening and final cues remain. This is a provisional editorial decision and has not been tested against the user's actual Spotify playlist or reading.
- If the bridge duration does not fit, the operation remains a no-op and the unresolved overrun must be reported. Do not claim v0146 fixed runtime until Spotify readback confirms. No playlist writes during an active session. Cache v0146.

## 2026-11-06 — Root cause of repeatedly ineffective runtime fixes: SW caching v0147
- User confirms repeated chapter XII fixes have no observable effect. Inspected sw.js: cache-first fetch used global `caches.match(e.request)`, potentially serving old version cache content; SW install used `cache.addAll(ASSETS)`, making entire update fail if one optional asset returns error. Fixed to match only current cache, clear obsolete caches on activate, install assets with Promise.allSettled and only cache successful fetches, and scope offline HTML fallback to current cache. Version v0147.
- This resolves a real update delivery bug but DOES NOT prove Spotify XII runtime has changed. Must test fresh PWA update and inspect Spotify readback; no direct access to user's authenticated Spotify from GitHub. Earlier playlist mutations remain unverified. No spoilers.

## 2026-11-07 — Timing incident review / v0149
- Reader completed Fulgrim XII using original playlist after repeated failures. Screenshot: Spotify XII 34:34 vs 29:36 target (+298s), 11 tracks, order confirmed; error "Spotify não confirmou a playlist reduzida". Reader completed XI in 27 min vs target 21:42; do not infer XII reading duration.
- Major root cause in service worker: fetch handler cached all GET requests including cross-origin Spotify API, potentially returning stale playlist readbacks after successful writes. Fixed to handle only same-origin GET requests; Spotify API bypasses SW cache. Version v0149.
- XII: target-specific editorial trim of optional atmospheric bridge Beyond The Asteroid Belt (index 5) only if resulting deviation <=75s. Uses full ordered PUT with readback retries. If original playlist update/readback fails, creates a new private playlist, verifies it, updates active playlist pointer, preserves original as backup. No write during reading.
- All Fulgrim chapters >=XI now record per-track Spotify audits. Batch preparation shows runtime, target, signed deviation and LONGA warning. No arbitrary automatic cue deletions for future chapters; these need scene-aware editorial work.
- GitHub code changes are committed; Spotify-side success remains unverified until user tests authenticated PWA. Project Markdown uploads dated Oct 22 are stale compared with this repo technical record. Spoiler ceiling: XII complete, XIII unread.

- v0150 additionally forces cache:no-store on every Spotify API request (including refreshed-token retry); verified JavaScript syntax for runtime-fit, book-switch and service worker. Spotify integration test still requires reader authentication.

## 2026-11-07 — v0151 visual compendium + future fitting
- Reader has completed Fulgrim XII, next XIII. Requests compendium update after EVERY logged chapter, and prefers canonical/credited 2D illustration and genuine fanart over AI reconstructions or miniature photos. Never expose later-era transformations/spoilers.
- Changed curated-art attach to remove hard-coded chapter V ceiling; refreshes on book switch and after chapter log is saved, and calls private portrait refresh. Locally imported personal portraits retain priority. Forge World miniature photo entries are no longer used as default portraits; current generated placeholder stays until safe verified illustration is sourced. This is a **policy change, not a completed replacement of all existing AI portraits**.
- Official source leads for future editorial sourcing: Warhammer Art (Fulgrim — Visions of Treachery by Neil Roberts, and The Palatine Phoenix); Warhammer Community archive of Dave Gallagher's 2003 Saul Tarvitz card illustration; Karl Richardson's Phoenix Guard book illustration (40k.gallery attribution). Verify scene-era spoiler safety and direct image rights/source before embedding. Do not use current 40k/Fulgrim Transfigured designs for current reading ceiling.
- For n>=13, runtime-fit now attempts approved shorter transition candidates in the designated cue slot when over target; verifies exact Spotify playlist readback. If none fits, reports overrun without random deletion. This is **not** a guarantee of <=45s for all future chapters; deeper per-chapter music curation and device QA are pending.
- v0151 deployed. Avoid publishing third-party art binaries to a public repository without license/permission; private repository status alone does not grant redistribution rights. User prefers personal/internal use, but provenance and artist credit must remain attached.


## 2026-11-07 — v0.15.5 Spotify correctness and soundtrack-duration protocol

**Problem and evidence:** GitHub commits did not imply updates to an installed PWA or to the user's private Spotify playlist. XII Spotify audit reported 34:34 / 11 items against a 29:36 estimate, while Supabase confirms XII was read in 29 minutes. Chapter XI was 27 minutes reading (not the 21:42 forecast). Do not silently change a reader's recorded time to match music.

**Implemented:**
- `data/fulgrim-future-scores.js`: XII source reduced from 11 to 10 approved cues by omitting its previously designated *optional intermediate atmospheric bridge*. Keep the opening and final cue. This is an editorial source change, not an unverified claim about the live Spotify playlist.
- `scripts/spotify-runtime-fit.js`: now an authoritative reconciliation layer. For any chapter audit without an active session, resolve canonical cues; validate exact track + artist; compare playlist ordered URIs; replace mismatched live contents using Spotify `PUT /playlists/{id}/items`; reread and verify every URI plus `duration_ms`. Existing legacy `preflightComplete` signatures are **not sufficient evidence**. Statuses `WITHIN_RANGE`, `OVER_TARGET`, `UNDER_TARGET`, `FAILED`; never claim fitting if the overrun survives.
- Disabled previous silent numerical bridge addition/deletion/replacement logic for Fulgrim. It failed to produce dependable, scene-faithful verified results. New changes require explicit editorial cue-sheet revisions first. Spotify errors must not be disguised as success.
- Spotify 2026 API migration: use individual `GET /tracks/{id}` (bulk `GET /tracks?ids` is unavailable in applicable development mode), plus `playlist-read-private` OAuth scope for readback of the private chapter playlists. `spotify-resilient.js` fallback migrated as well. Existing authorized users **may need to click Connect Spotify and reauthorize** to grant the newly requested scope; never wipe the reading log or existing playlists.
- PWA `sw.js` switched executable source files (.js, .json, .html) to network-first with `cache:"no-store"`, while keeping offline cached fallback, and version-bumped to `heresy-score-v0155`. `index.html` registers SW with `updateViaCache:"none"`.
- New `scripts/spotify-audit-panel.js` in Settings allows auditing already-read chapters and the next unread one without starting music; shows actual runtime, reader target, signed deviation, verification state and previously read track list. Future preflight batch now limits to three upcoming chapters to reduce rate limiting.
- Isolated mocked integration checks: stale 3-track playlist reconciled to two intended tracks with one PUT + readback; second check did not rewrite; active reading did not mutate; Spotify 403 returned a visible failure rather than a false success. JS syntax checks passed. **Authenticated Android PWA/Spotify confirmation remains open.**
- The corrected Spotify playlist is **not** confirmed on the reader's account until the new code loads, OAuth includes reading scope, and a readback from Settings returns `verified=true`. Do not tell user it is already fixed on the phone.

**Spoiler ceiling and next work:** Supabase currently has Fulgrim V–XII logs (V 36, VI 30, VII 31, VIII 30, IX 24, X 35, XI 27, XII 29 minutes) but not XIII. Next safe chapter XIII. Chapters XIV–XXV have precurated soundtrack data, *not* certified matching runtime; audit them in small batches, and edit source cue selection where persistent overrun is measured. Do not publish scene maps, original MOBI, future-character statuses or narrative details to the public repository. Base forecast on historical real reading times, not simply Kindle estimate.

**QA still pending:** (1) installed PWA loads new JS (cache version evidence), (2) Spotify reauthorization with read-private scope, (3) live XII original 11 → canonical 10 readback / runtime, (4) XIII next-chapter preflight, (5) next 3 chapters' duration and scene-by-scene score editorial review, (6) Android pause/resume/final cue consistency and app_version telemetry.

- v0155 includes an idle-client auto-refresh on service-worker controller change, release diagnostics, documented README and reproducible mocked regression \`tests/spotify-runtime-reconciliation.js\`. Do not claim live-user confirmation from mocked tests.

- Separate technical forecast and future-chapter QA checklist: `docs/FULGRIM_RUNTIME_FORECAST_2026-11-07.md`. The audit UI computes a pace forecast from the reader's own logged minutes and source word counts; this does not modify musical target or guarantee Spotify length.

## 2026-11-07 — Compendium audit through XII (v0152)
- Detailed spoiler-safe repository inventory at docs/FULGRIM_COMPENDIUM_AUDIT_I_XII.md. Current data has 16 character entries, all unlocked by IV, and 7 archive entries all unlocked by IV; zero new entries V–XII. This is the main coverage gap, separate from artwork. 2 external official illustration candidates, 2 miniature photos disabled as default, 12 generated fallbacks. 2 external archive fanarts, 5 without sourced illustration.
- Fixed curated art refresh to retain already-loaded official/fanart instead of resetting to generated fallback; removed hardcoded chapter V limit in archive art source. v0152.
- Next: read private source maps/MOBI for V–XII and add accurate spoiler-gated content; source and credit real 2D artwork, verify external asset access and rights. No claim of complete art replacement yet.

## 2026-11-08 — Fulgrim Compendium expanded through XIV (v0156)
- Reader reports XIV completed, with expanded Eldar material. Used supplied MOBI privately and extracted chapters VI–XIV to verify names and first appearances; no book text committed.
- Added 6 dossiers (Balhaan VI, Gabriel Santor VII, Evander Tobias IX, Lycaon IX, Eldrad Ulthran XI, Khiraen Goldhelm XIV) and 9 archive records (Diasporex, Carollis, Ferrum, Perdus, Craftworld Ulthwé, Eldar, Maiden Worlds, Tarsus, Wraithlord), with spoiler-gated chapter unlocks. Total 22 people, 16 archive entries. Added facts to 4 existing dossiers.
- Artwork for newly added entities is explicitly pending verified 2D official art or credited fanart; do not substitute later-era images or miniatures. Detailed audit: docs/FULGRIM_COMPENDIUM_AUDIT_I_XII.md (expanded through XIV). Cache v0156. Device visual QA pending.

## 2026-11-09 — v0157: Chapter XV 44min vs 32:30 target
- User reported ~44 minutes Spotify runtime against 32:30 editorial reading estimate for chapter XV. Prior claims that runtime was fixed were incorrect: strict reconciler only enforced original URI sequence and could restore removed tracks, with no fitting of target duration.
- Introduced chapter XV approved optional-bridge positions [1,4,6,8,9] (0-based original score). At Spotify preflight, use actual Spotify durations to search subsets, protecting opening/final and all nonoptional cues. Accept only total from target-90s to target+60s and >=6 cues, choosing nearest target. PUT selected URIs and verify actual readback. Store edited sequence per source signature so next audit will not restore all 12 tracks.
- Crucial: a Spotify-verified sequence does NOT imply target runtime: preflightComplete now true only for WITHIN_RANGE; OVER_TARGET explicitly flagged. No live Spotify OAuth access here, so actual corrected duration not yet confirmed. If no acceptable optional subset exists, chapter remains over target and requires further editorial change.
- Other future chapters still require actual duration-fitting; this patch is specifically for XV, not a claim that XIII–XXV are fixed.

## 2026-11-09 — v0159 illustration rendering follow-up
- User confirmed new compendium records display only names. Cause: 6 new character records have image:null, and 9 new archive records were added without image URLs. Previous art updates were partial and did not populate those records.
- Replaced Eldrad Lexicanum Special:Redirect URL with exact direct JPEG https://wh40k.lexicanum.com/mediawiki/images/d/db/Eldrad_Ulthran_Art.jpg (Codex: Eldar 4th ed p50). Web source displayed image successfully; actual mobile PWA display not verified.
- Added original official illustrations to two archive records: generic Craftworld illustration (Codex: Craftworlds 7th ed) for Craftworld Ulthwé, explicitly labeled REPRESENTATIVE not exact Ulthwé; Paul Dainton illustration of Arquellia of Ulthwé for Eldar species entry, clearly not Eldrad portrait. Direct image URLs used. No image assets copied into public repo; hotlink and offline reliability still unresolved.
- Remaining new character records (Balhaan, Santor, Tobias, Lycaon, Khiraen) lack verified exact-character 2D artwork; do not pretend otherwise. Remaining archive entries also pending. Source artwork rights must be reviewed before storing copies in public repo.

## 2026-11-10 — v0161 general runtime fit
- Spotify runtime fitter now attempts all Fulgrim chapters, not just XV. Reads actual recording durations, searches ordered subsets preserving first and final cues and at least 60% of original list, target tolerance -90/+60 sec. Verifies playlist URI readback after Spotify PUT; remains blocked if outside tolerance. This is a technical duration fit and must still be listened to for editorial scene alignment.
- No live Spotify authenticated session available in this maintenance context. Do not claim any specific chapter is now within tolerance until user's device completes audit. Other possible blockers: invalid track resolution, Spotify permissions, no viable subset, playlist write failure.
- Remote art failures are now visibly marked and no longer retried repeatedly within the same session. This does not supply missing licensed illustrations: new individual character portraits remain pending, as do local offline artwork files. Do not claim image issue solved.

## 2026-11-11 — v0.16.4 responsive reader and real-art replacement tranche
- User verified Spotify runtime fitting succeeded on the device and completed/logged the chapter. Do not modify their local/cloud logs or infer an exact completed chapter number from that confirmation.
- Replaced the multi-chapter reading window with a single-card chapter deck (scripts/chapter-deck.js), left/right arrows and horizontal swipe, jump back to current, separate log history link. Book switching, Spotify preflight, begin/log actions are maintained via wrapping original render, not rewriting Spotify flows.
- All cards are built internally so existing event handlers and audit button stay attached, but only one is visible; future chapters display only sealed label and explanation. Only one chapter is visible by default, the first unread or currently active. Current card auto-advances after a completed log; browsing older logs stays available.
- Layout: responsive grid alignment, narrower heading typography, chapter heading count now derived from book metadata (25 for Fulgrim), compact dashboard, consistent person/archive tiles. Mobile/deployed UI has not been visually verified by a device browser; JavaScript syntax/static integration checked only.
- Removed AI generated pictures as *default public UI depictions*: the original generated portrait assets may still exist in repo but the curated-art layer now uses clearly labeled local SVG symbolic plates until real sourced art is loaded; user-imported personal art retains priority.
- New period-safe original illustrations: Fulgrim (Mikhail Savier / Warhammer Art), Lucius pre-Heresy (Horus Heresy art books), Saul Tarvitz (Horus Heresy: Legions card), plus credited fanart of Great Crusade Eidolon (Diego Gisbert Llorens) and Gabriel Santar (Ilya Gurenko). Corrected mistaken name 'Gabriel Santor' to 'Gabriel Santar' in source data.
- External image URLs are only attempted in-browser. A failed image is replaced with symbolic plate, and the full dossier offers a source link when appropriate. DO NOT claim these are verified on the user's device or available offline. No copyrighted art copied into the public repository without permission.
- Remaining individuals (remembrancers, rare commanders, other non-primary cast) still need approved non-AI character-specific artwork; source-safe fallback remains visibly noncanonical. No future plot spoilers should be introduced by art curation.

## 2026-11-11 — reader feedback for just-finished chapter (likely XVII)
- Reader reports chapter completed and logged; **two tracks remained unused at the end**. Do not infer exact measured reading time or Spotify playlist total; user did not provide it. Prior message had confirmed XVI read/logged; 'Discordant Feast' appears in curated XVII source, making XVII likely, but do not alter actual cloud/local logs.
- Reader reports **Discordant Feast (Pavel Lipski)** still fails to fit the scene, and says this was raised before. Prior recorded feedback for VIII identified the same track mismatch (though original VIII source no longer contains this title). This is a negative recurring music preference; avoid this track in future scoring unless user specifically changes mind.
- Edited chapter XVII score: remove Discordant Feast, retain Shadow Quarters as final cue, finalCueIndex 9, sourceOrderSegments 10. This editorial change does not rewrite user-completed playlist/log. Runtime duration should be recalibrated only if user opts to re-audit that chapter.
- Two leftover tracks indicate pace issue beyond overall measured Spotify duration; future editorial review should distinguish playback length vs reading duration; do not claim solved by simply removing one track. No spoilers about story content beyond user's current point.

## 2026-11-12 — Qualidade musical e visual: correção de causas (v0.16.6)

### Evidência dos logs
- Progresso confirmado no Supabase até Fulgrim XVIII (24 minutos, trilha 1 minuto curta e alguns encaixes incorretos). XVII: 26 minutos, trilha longa, Discordant Feast não encaixou. XV: 35 minutos, bom encaixe geral. XVI: registro de 1 minuto INVÁLIDO para calibragem: usuário não cronometrou a leitura, notou The Chant incompatível com diálogo calmo. IX e XII registraram intensidade excessiva em segmentos sem ação.
- Fonte privada permite contar palavras e mapear posições de cenas sem publicar o texto. Por exemplo: XV 6399 palavras; XVI 4848; XVII 5590; XVIII 4405; XIX 5277. A estimativa seguinte usa mediana robusta de minutos/palavras (exclui log de 1 min), combinada à meta editorial anterior. Ritmo é variável; NÃO existe acompanhamento da página do Kindle em tempo real.
- Erro de arquitetura anterior: o auto-fitter removia qualquer música intermediária até bater minutos, sem respeitar se era o elo entre atmosfera e combate. Novo fitter usa índices opcionais, índices protegidos e posições relativas de transição editorial. Se não encontrar subset válido, não declara sucesso.
- Cues futuros XIX–XXV receberam proteções de estrutura musical (somente índices e timing genérico no repositório público); XIX reordenado para transições suaves. Discordant Feast removido das playlists futuras XXI e XXV, além de XVII. Nunca reintroduzir sem aprovação explícita.
- Novos logs gravam musicTelemetry AUTOMÁTICO ao finalizar capítulo: duração da sessão, duração auditada, faixas/minutos restantes estimados e último título observado no Spotify. Estimativas não são posição real garantida, porque playback pode ser pausado/pulado independentemente. Não exigir botões durante leitura. Marcadores manuais recolhidos num bloco de diagnóstico fechado.

### Regra visual e pendências
- Ordem: arte oficial 2D da época > fanart creditada sem spoiler > **manter IA anterior como fallback local claramente não canônico** > identificação simbólica somente quando nunca houve retrato. O usuário rejeitou a troca de IA por placa/ausência de imagem.
- Confirmada no GitHub a existência dos binários WEBP dos retratos antigos (amostra Fulgrim, Fabius, Julius, Ferrus, Serena); restaurado fallback. Imagem externa deve carregar realmente antes da substituição. Arte pessoal do IndexedDB continua prioritária.
- Novas fontes representativas no arquivo de lugares: Karl Richardson, arte Black Library de campanha em Laeran (Atoll 19 apenas como referência de campanha, NÃO cena exata), Iron Hands oficial de GW (arte representativa), Eldar e craftworld. Pride of the Emperor e Laer têm referências externas prévias. Muitos planetas, lugares e personagens CONTINUAM sem ilustração exata; glyph/símbolo não é conclusão. Fontes externas têm risco de hotlink; não copiar arte protegida para repositório público sem permissão.
- Retratos posteriores que revelem transformações futuras são proibidos mesmo se oficiais. Usuário já leu até XVIII, não revelar XIX+ nos textos ou assets.

### QA antes de dizer corrigido
1. Ler o mapa privado texto/capítulo e os logs, sem expor spoilers futuros.
2. Classificar passagens por atmosfera, diálogo, tensão, ação e desfecho.
3. Atribuir e proteger faixas de transição, depois ajustar duração Spotify com leitor real; NÃO arbitrar cortes por total.
4. Verificar ordem/URI/duração na sessão OAuth do dispositivo. Código alterado não é validação de playback.
5. Verificar ilustração renderizada no PWA; diferenciar arte oficial/fanart, IA temporária e símbolo.
6. Preservar logs Supabase, leitura ativa, progresso, navegação e separação de livros.
7. Registrar pendências abertamente e não criar versão atrás de versão sem inspeção final.

## 2026-11-16 — v0.16.7 Spotify bidirectional runtime + visible audit (verified in offline mocks, NOT live account)

- Reader confirmed latest completion via private Supabase logs: Fulgrim XXI complete, next XXII. DO NOT reveal XXII+ scenes; prior contexts through XVIII are historical.
- Primary complaint: tapping 'Auditar duração Spotify' appeared to do nothing, and short scores were not extended. Code root causes: (1) timeout/errors were shown only in a one-second toast; (2) fitter returned null for under-target scores; (3) saved verifiedSequence could equal length of canonical source but contain previously inserted + removed cues, wrongly treated as canonical on next run; (4) ambiguous 403 descriptions, stale app version and ready-status labels.
- New UI: chapter button has persistent progress/error box; Settings Spotify audit also keeps stage and exact result. Progress events: connecting/loading/measuring/reserves/planned/writing/verifying/success or error. Failure always says NOT CORRECTED and a concrete reason.
- New bidirectional fit: +/- tolerance is -45/+60 seconds. Remove only plan.optionalIndexes; preserve plan.protectedIndexes and opening/closing cues; add only preapproved chapter-appropriate tracks at editorially selected positions. Plans for XIX–XXV include two reserve candidates each (ambient/tension/action as relevant). No random repetition, skip-or-trim tricks or fake guarantees. If no safe combination within tolerance or missing rights/Spotify access, leave playlist unreconciled and report failure.
- Verify each selected exact Spotify recording with GET /tracks/{id}; playlist GET /playlists/{id}/items and PUT /playlists/{id}/items are current Spotify API endpoints. After write, exact URI order and durations must be read back. Only then update editorialFit cache. Canonical source is always resolved anew and not inferred from previous verifiedSequence.
- Improved Spotify API errors HTTP 401/403/404/429 and network timeout, distinguishing read from write stage. When fetching reserves, one unavailable candidate does not prevent evaluating other authorized candidates; final inability to fit is explained.
- Keep calibrated estimatedMinutes reflected in both SCORE_META and chapter card metadata; spoofed XVI reading time is excluded.
- Offline mocked tests passed during development: under-target addition, over-target removal, same-length replace then repeat audit without duplicate changes, no-safe-fit refusal without PUT, 403 PUT denial without declaring success. Source-level regression test added at tests/spotify-bidirectional-fit.js; original tests/spotify-runtime-reconciliation.js adapted for new progress events.
- Real Spotify authenticated session unavailable to ChatGPT via this environment. GitHub commits plus synthetic tests do NOT prove the reader's playlist has been updated. The app must be opened with the current version and audited once by reader; persistent result is then evidence. Don't use 'definitively fixed on device' without that result.
- Future accepted issue: Spotify whole tracks can make exact time impossible; the UI must report when protected cues and approved reserves cannot fit target. Also, no real-time Kindle page location means transitions can only be optimized predictively.

## 2026-11-16 — v0.16.9: user screenshot proved Spotify runtime succeeded but the UI was stale

User sent live Android PWA screenshot of Fulgrim chapter XXII:
- Reading card still showed editorial target **27.1 minutes** and badge **READY**.
- Audit report read **"CONFIRMADO NO SPOTIFY · 25:40 / meta 26:12 · 9 faixas · 1 cortes editoriais · 0 reservas adicionadas"**.
- Lower directive still said **"AUDITORIA SPOTIFY NECESSÁRIA"**.
- This is NOT a case of the button doing literally nothing: readback and one optional cut did execute. The interface was inconsistent because the audit event updated state and an inline report but DID NOT rerender the whole card/directive.
- 26:12 is the dynamically calibrated target; 27:06 (27.1 minutes) is the editorial source estimate. The gap between actual Spotify 25:40 and calibrated target 26:12 is -32 seconds, within the app's stated -45/+60 seconds tolerance. It does NOT prove scene-to-music emotional fit.

Fixes:
1. Chapter card target is derived from SCORE_META's live calibrated value, not the stale chapter copy.
2. After an authenticated audit succeeds/fails, re-render the complete reading card and directive; don't leave stale READY or audit-required text.
3. Core render distinguishes **SPOTIFY OK** (API readback verified) from **SCORE PRONTO** (editorial music list exists).
4. Audit report is persisted in state.spotify.auditResults, with VERIFIED or FAILED; after app reopen show last confirmed runtime or exact failed reason. Both chapter and Settings auditors refresh the reading UI.
5. Crucial restart fix: SCORE_META is recreated from source on app reload, returning to 27.1; restore the last VERIFIED targetMs from persisted Spotify runtime (26:12) when source signature still matches. The view now shows "alvo calibrado ≈ 26:12" and a Spotify-confirmed 25:40 report across restarts.
6. Score readiness accepts previously confirmed Spotify 0.16.7 entries as well as 0.16.8; no need to force a new Spotify rewrite to correct labels.
7. Regression tests: tests/spotify-audit-ui-consistency.js created and expanded for screenshot scenario, including restart; targeted in-memory JS evaluations verified "SPOTIFY OK", targetClock "26:12", and lower directive "PLAYLIST CONFIRMADA NO SPOTIFY" for verified state, then audit-required for failed state.

QA caveat: validated code syntax and mocked UI/state behavior; real Android screen *after* deployment is still unverified. Prior screenshot is authentic evidence of Spotify readback, not live testing of the newest UI. Do not claim more.

## 2026-11-20 — GENERAL APP AUDIT / BOOK VI PREPARATION (NOT A RUNTIME RELEASE)
- User completed Fulgrim (25 chapters) and gave book a final score of 3/5 Dreadnoughts; Descent of Angels is NOT started. Strict spoiler ceiling: end of Fulgrim, nothing from book VI plot or visual transformations.
- A full written audit was created at docs/APP_AUDIT_2026-11-20.md and a private local Markdown unit-metrics file is available in the project conversation, from the reader-supplied MOBI.
- MOBI structural extraction verified four parts, a Prelude, 23 numbered chapters and an Aftermath (25 reading units). Original Dramatis Personae present. No source plot text or scene map published.
- Confirmed blockers: HSBooks and book router hardcode IV/V; old progress totals hardcode 20/25; per-book switch clears music runtime; no backup import; source has many wrappers around render/sync and legacy SW patch; pre-cache uses Promise.allSettled so incomplete installation can activate; stale diagnostics version; limited regression suite and no validated Android UI test.
- Spotify API current GET Playlist Items maximum is 50 per page, while runtime fitter/resume request 100. Must repair before expanding. Spotify content cannot be ingested into ML systems or downloaded for audio analysis. Develop curation using private novel scene models and responsibly obtained audio references, NOT Spotify stream ingestion.
- Real Fulgrim reading observations: 25 logs, 23 valid time sessions (XVI and XXII both 1-minute invalid). Estimated robust median pace ~197wpm, median valid session ~27min; just one track-feedback mark despite extensive human narrative feedback. Prefer improving passive structured evaluation after reading rather than asking for in-reading button taps.
- Fulgrim image inventory: 22 people and 16 archive entries; 16 local portrait fallback WebPs. Official 2D/fanart with attribution before AI, but never blank an existing AI image as a premature 'fix'. Avoid spoiler-bearing later-era imagery.
- Next implementation must freeze and back up 25/25 logs, refactor to generic book/reading-unit state and testing, then redesign soundtrack, Dramatis Personae and art pipeline; pilot Prelude and initial chapters of Descent only once acceptance criteria pass. No production source files were changed during this audit.

## 2026-11-20 — IMPLEMENTATION v0.17.1 / BOOK VI FOUNDATION
- Book V Fulgrim finished: 25 cloud logs confirmed, 3/5 Dreadnoughts. New Book VI Descent of Angels remains UNREAD and selectable in the library with Prelude + Chapters 1–23 + Aftermath (25 sequence indices). No soundtrack or future character content published.
- State schema v4 adds HSBooks.VI, unit labels and book-specific runtime/audit snapshot. Switch keeps IV/V chapter logs, Spotify URIs and authentication. Unit index 1 maps to Prelude for VI only; stable IDs are in data/descent-of-angels.js.
- Export/restore settings now previews and merges only absent logs, never replacing notes. Actual Supabase checks before/after code changes showed unchanged Book V digest 4b779406ef97e8864a0515cfdc9fa1e1 (25 entries). No Supabase writes. Backups exclude tokens and private art.
- Dramatis Personae has search, filters, status counts and known-relationship lines, with hidden unencountered cards. Book VI roster/archive deliberately empty before first appearance. Bigger mobile typography and touch targets.
- Editorial score engine models role-specific candidates, required musical slots, optional transitions and explicit failure; isolated mock passed. Not yet wired into VI Spotify or any curated VI music. The Prelude has a preliminary private no-plot editorial map outside GitHub.
- Spotify playlist pagination limit=50 in runtime audit and resume. PWA essential install atomic and only one activate listener. Central build v0.17.1 with CI tests for app integration, editorial roles, backup and IV/V/VI migration.
- Remaining scope: CI execution status not confirmed, no Android on-device UI validation, no VI curated Spotify score, incomplete real-art/hotlink replacement, legacy wrapper modularization and cloud merge conflicts. Do not claim complete.
- Implementation ledger: docs/BOOK_VI_IMPLEMENTATION_2026-11-20.md. Strict Book VI spoiler ceiling at zero chapters.

## 2026-11-20 — v0.17.2 / GitHub CI failure triage and archives
- Reader received multiple GitHub failure emails. Connected Gmail search found one explicit failing action notification for run 44785160572 (main 0e75ab3). GitHub job log showed syntax and Book VI/narrative tests passed, but tests/spotify-runtime-reconciliation.js expected the substring 'permissão' after simulated HTTP 403. Runtime now correctly says 'Spotify recusou LER a playlist' and names playlist-read-private; regression expectation was too restrictive. Test updated to recognize specific reason and 403. No evidence of failed real Spotify OAuth call in that job.
- Workflow concurrency now cancels redundant runs on repeated main commits; automated validations REMAIN ENABLED.
- Scripts and mandatory PWA assets checked via GitHub connector for existence: 33 text/application + 23 image items, all present; separate './' shell served by index.html. This checks repository objects, not real CDN/device responses.
- New archive-search-v2 filters only unlocked locations, factions and ships. Sealed future cards and metadata are omitted from searches; mock filter test passed, and a Node regression test was added to CI.
- PWA and app build advanced to v0.17.2 with cache name heresy-score-v0172. No Book VI plot, score, character or place was made public; Book VI remains 0/25.
- Full current GitHub Actions green status has NOT been independently confirmed via accessible connector; do not report workflow green until job result available. User's Android deployment was not visually tested in this turn.

## 2026-11-20 — v0.17.3 PRELUDE PILOT AND SPOTIFY FOLDERS

- User requested one Spotify playlist folder instead of scattered chapter playlists. Spotify's official Web API docs say folders cannot be created, read, or moved through API; native folders are manageable in Spotify mobile/web/desktop.
- Recommended main folder 'Heresy Score — Horus Heresy' with one subfolder per book. Moving a playlist keeps its Spotify ID and existing app link.
- Settings now offer a folder guide and optional link of an owned, EMPTY playlist already created inside the Spotify folder. Validation checks ownership, absence of prior tracks, unique chapter association and switches playlist to non-public. Actual folder membership is NOT accessible to API. Auto-created playlists are also public:false, named by book + editorial unit, and can be moved manually.
- Only Book VI Prelude has a score pilot. Six publicly documented instrumental game OST tracks, none containing source novel plot or character hints: Majula, Catacombs, Leyndell Royal Capital, Roundtable Hold, Fire Keepers, Firelink Shrine. Exact Spotify track URIs and expected artist metadata are in data/descent-of-angels.js. Total public durations 998 seconds (16:38). Reader reference 3238 words / 197wpm = 986 seconds (16:26), gap +12s. The six musical roles are protected and do not feature unrelated boss battle transitions.
- This sequence was mapped from the private user-supplied Prelude, but FULL MUSIC LISTENING AND TRANSITION QA HAS NOT BEEN PERFORMED. Label PILOT_UNLISTENED; do not call editorially approved from duration match.
- scripts/spotify-bookvi-pilot.js overrides only Book VI. It validates exact URI GET metadata, composer and duration, enforces HSEditorialScore roles, then updates a linked/created private playlist and re-reads exact order/duration through the user's Spotify API. Only after readback sets SPOTIFY OK. Explicit failure for unsupported, out-of-range or unavailable recordings, without silent substitution. Base legacy Eisenstein playlist renaming flow is bypassed for VI.
- Persistent Book VI Prelude QA button in reading card plus collapsible six-track references. During reading no manual atmosphere/battle buttons are required. Future units remain unscored and spoiler locked.
- Mock tests passed for six tracks, expected runtime, re-audit without duplicate write, wrong artist failure, too-long failure before playlist creation; folder tests passed owner/empty/unique checks and negative cases. CI includes tests/bookvi-prelude-spotify.js and tests/spotify-folder-guide.js.
- A duplicate VI runtime script tag was detected in integration review and removed. Scripts were compiled and HTML/ServiceWorker pre-cache lists cross-checked.
- Full spoiler-free public editorial status documented in docs/BOOKVI_PRELUDE_PILOT_2026-11-20.md; private editorial notes appended to the project-local HERESY_SCORE_BOOKVI_PRIVATE_PRELUDE_PLAN.md. No source novel text was committed, Book VI remains 0/25.
- The user's authenticated Spotify session was not directly accessible to this ChatGPT runtime. No folder or playlist has yet been created in the user's Spotify account through these changes. Real device API audit and narrative listening remain outstanding.

## 2026-11-20 — v0.17.5 FULL AUDIO ANALYSIS / AUTOMATIC PLAYLIST PREFERENCE

User prefers the application to CREATE playlists automatically; no manual Spotify playlist creation or pasting URLs. The default SpotifyEnsurePlaylist already creates a non-public playlist per book+unit on audit and reuses it afterward. Settings now explicitly say automatic is default; optional manual playlist linking is folded into Advanced. Native Spotify folders still cannot be created/listed/moved via Spotify Web API; only user-side Spotify UI can organize them, so no false claim of automatic folder placement.

Core unresolved problem from Fulgrim: a track may begin quiet and change instrumentation/loudness in its middle while a purely numeric playlist-duration fit still says success. The assistant cannot directly listen to complete DRM Spotify audio through API/tools; Spotify Platform policies prohibit ingestion of Spotify Content into AI/ML, and 2024 API changes restricted the old audio features/analysis endpoints.

New local pipeline in tools/audio-qa/: analyze_audio.py (one independently authorized full recording) and analyze_library.py (batch folder analysis, avoiding per-track uploads). It measures RMS dBFS, spectral centroid, onset strength, candidate structural transitions and late swells for an entire file. Does NOT rip/download/capture Spotify, nor copy audio to public repo. Default output is private JSON outside repository, with SHA256 and warning about different Spotify masters. .gitignore disallows private novels/audio. Verified locally with synthesized quiet->loud->quiet waveform: the comparable prototype detected rise and fall and passed its 3 unit tests. GitHub source is syntax-checked in CI; real six-track input analysis is STILL PENDING because no independent authorized recordings were supplied. Human/musical listening is still necessary: DSP does not understand emotion/scene suitability.

Data/descent-of-angels.js now explicitly labels all six Prelude cues NOT_ANALYZED, fullListeningReviewed=false, roleFitApproved=false; editorialStatus is PILOT_FULL_AUDIO_UNVERIFIED (not editorially approved). New scripts/music-quality-gate.js reports separate counts of structurally scanned/listened/approved, currently 0/6. Prelude UI displays this even if Spotify exact URIs/order/time were authenticated. scripts/editorial-score-engine.js version 2 adds a requirement-aware filter: if independent full-audio profile evidence exists and policy enables it, reject recordings flagged 'strong_second_half_vs_opening' or 'abrupt_loudness_rise' in dialogue/quiet/closing slots, regardless of total runtime. Mock JS test verified replacement with a safer candidate and refusal when no safe alternative.

No source novel plot, copyrighted song audio or private scene mappings were committed. Other Book VI units remain sealed. Current live Spotify recording analysis and Android rendering not validated. docs/MUSIC_FULL_AUDIO_QA.md is the editorial QA manual and source constraints.

## 2026-11-20 evening — Book VI three-unit lookahead v0.17.6

- User reported multiple CI failure emails and requested a rolling three-unit soundtrack buffer to avoid nightly manual audits. Book VI is STILL unread, 0/25. Strict spoiler ceiling remains before the Prelude.
- Examined the actual private MOBI for Prelude and Chapters 1–2; all plot/character/scene text stays PRIVATE. Public music metadata only contains song names, composer, generic musical roles, no-book-detail percentage anchors and publicly sourced album duration references.
- Pilot 1: Prelude (internal n=1), 3238 words, reading target ~16:26, six reference recordings ~16:38.
- Pilot 2: Chapter 1 (n=2), 4365 words, reading target ~22:09, eight reference recordings ~21:58.
- Pilot 3: Chapter 2 (n=3), 4498 words, reading target ~22:50, eight reference recordings ~22:52.
- All are provisional PILOT_FULL_AUDIO_UNVERIFIED, no full-song listening or structural audio measurement completed. Only Spotify session API can verify actual master, duration and URI. Technical time validation does NOT mean narrative approval.
- scripts/spotify-bookvi-pilot.js supports n 1,2,3 with exact Prelude URI or strict title+composer resolution for Chapters 1–2. GET /tracks/{id}, check metadata and approximate recorded length, use scene-role required slots, reject timing outside -45/+60 seconds, create or reuse private playlists with SpotifyEnsurePlaylist, re-read exact URI order and whole-track durations, then mark technical success only after confirmation. Single-flight protects concurrent calls. sourceVerifiedBy = 0.17.6.
- scripts/bookvi-read-ahead.js runs automatic foreground-only preflight of the next three unread units when Book VI is selected and Spotify is connected. It never starts playback/timers, preserves the active playlist pointer, skips existing verified playlists and gives a visible status/errors. A gap after completing a unit appears as editorial pending instead of inventing music.
- A recurring conditional monitor was explicitly created, id Automation_4a542d3898c88191954682d4a521f9f1, first run 2026-11-21 18:00 America/Sao_Paulo, to inspect progress and fill future curation only when source and safe verification permit. It cannot control the user's authenticated Spotify in background.
- CI root cause in actual run 44848018124 (commit b3b3420, job 136672413424): obsolete test still required only one Book VI score when three exist. Earlier obsolete expectation required PILOT_UNLISTENED rather than current PILOT_FULL_AUDIO_UNVERIFIED. Updated tests/book-state-v4.js and tests/bookvi-prelude-spotify.js to require 3 pilots while 4..25 remain sealed, plus tests/bookvi-read-ahead.js. In-memory mock Spotify scenarios verified three time targets ~998/986, 1318/1329, 1372/1370 seconds and no duplicate playlist writes. Full current GitHub Actions green remains unconfirmed until checked; do not claim complete.
