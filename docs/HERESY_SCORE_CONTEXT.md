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
