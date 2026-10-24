# Heresy Score — Active Product Pipeline
**Updated:** 2026-10-24 — v0.11.6
**Protocol:** v0.11.4
**Reader clearance:** `The Flight of the Eisenstein` completed including XVII; `Fulgrim` Chapter I completed. Nothing from Book V Chapter II+ may be exposed before reading.
**Owner:** Heresy Score / App Lab (conversation 00)

## Rule of priority
**Keep the next chapter playable and spoiler-safe before introducing large architectural or illustration changes.** Artistic quality and the protected ending outweigh maximizing playlist runtime.

## Current verified state
- `patch-v0102.js` implements opt-in narrative-only additions/removals; automatic runtime padding/trimming is gated off by default.
- Book IV logs were preserved when reader manually switched IV → V → IV; no end-to-end recovery-from-cloud test yet.
- Supabase Chapter I Fulgrim: 25 minutes logged; length = long; overall intensity/opening/peak = good; ~3.5 musical tracks remained according to reader.
- Kindle estimated Chapter II Fulgrim at 26 min. Reader baseline ~1.5 min/page, but actual chapter variation should outrank blanket rules.
- `data/fulgrim-score.js` currently contains **only Chapter I**, and `people:[]`, `archive:[]`. Chapter II not yet released.
- Existing artist reference importing and cropping are available locally; source licenses for redistribution not assumed.
- GitHub context file is newer than static Project attachments, which still mention Eisenstein XV / v0.10.7; synchronize these for correct context in later conversations.

## Now — must complete before next Fulgrim chapter session
- [x] **P0.1** Privately review Chapter II's dramatic beats with reader's current spoiler limit; if chapter content cannot be verified confidently, keep the score provisional and avoid inventing scene-specific alignment.
- [x] **P0.2** Compose a function-first cue sheet: point of view, subtext, implied acoustics (no literal effects required), energy progression, transitions and **protected final cue**.
- [ ] **P0.3** Check Spotify matching tracks and exact `duration_ms`; calibrate to Kindle ~26 minutes while treating it as a forecast, not a mathematical target. No reserve/trim unless justified by a specific scene and position before final cue.
- [ ] **P0.4** Publish Chapter II **only**, verify Chapter III+ remain sealed, and run start/pause/resume/final cue tests. Reader can begin once score and player QA are confirmed.
- [x] **P1.1** Make Book V Chapter I safe personae and theatre records available, based on what reader actually encountered. Never expose scenes, variants or statuses from later chapters. Keep image source metadata truthful.
- [ ] **P1.2** Confirm media appear with correct full-image/crop option in both card and modal. Allow absent art without hiding a safe character.

## Next — reliability sprint
- [ ] **P2.1** Verify real Spotify player synchronization, playlist length, failure fallback and manual Final Cue placement; ensure active playlist reuse doesn't overwrite the only archived cue list a future user may want to revisit without warning.
- [ ] **P2.2** Test IV → V → IV after reload and cloud pull with separate `book_slug` log keys, including local-only data and stored history.
- [ ] **P2.3** Confirm completed Book IV 17 records incl. XVII epilogue and user book rating remain recoverable; check data from Supabase for duplicates rather than silently deleting rows.
- [ ] **P2.4** Confirm PWA fresh/installed/offline loads are consistent; test on mobile and desktop. Backups should be exportable and verifiable.
- [x] **P2.5** Add distinct **ending**, **ambient space** and **transition** feedback categories; optional opportunity notes remain free text.

## Later — maintainable architecture
- [ ] **P3.1** Consolidate runtime overrides from `patch-v0102.js` into coherent book-aware modules.
- [ ] **P3.2** Remove fixed 17/20 chapter assumptions; derive progress from the active book manifest.
- [ ] **P3.3** Move every future book into isolated score/personae/theatre manifest, while retaining legacy state migrations.
- [ ] **P3.4** Introduce score quality checks for dynamic runtime, repeated music, transitions, implied spatial ambience and ending protection.
- [ ] **P3.5** Maintain full provenance and per-variant spoiler gates for portraits, ships and planets. Complete P0 portraits, then wider gallery.

## Repeatable chapter lifecycle
1. **After reader completes chapter N:** read GitHub + Supabase local/cloud logs, collect Kindle prediction vs real reading time, observed leftover/shortage, opening, peak, **ending**, sonic context and favourite/mismatched cues.
2. **Lock clearance:** update `READING_CONTEXT.md`; register newly safe personae, roles, locations, craft and status facts with chapter gates. Don't unlock future changes.
3. **Curate N+1 privately:** book text → function → POV/subtext → spatial/acoustic suggestion → transitions → protected ending → tempo/duration candidates; broaden music search beyond 40k.
4. **QA:** Spotify resolves exact recordings and durations; score contains no filler reserves, duplicate by accident, vocal distraction, or spoiler label; tests pass.
5. **Publish:** commit narrowly scoped score + Compendium data + version/cache; maintain readable change log.
6. **Read and learn:** record track-level marks when available; calibrate next cue sheet without reshuffling historical logs.

## Done criteria
- Next reader chapter appears as ready; following chapter stays sealed.
- Spotify sync resolves its intended tracks and placement of Final Cue without automatic padding.
- Existing books/logs remain unchanged and cloud operations are scoped.
- Only already-seen characters/locales shown; safe blank cards are better than spoilers.
- Docs and installed PWA versions match committed source.

## Sources of truth and known drift
- `docs/SOUND_DIRECTION_BIBLE_V1.md`: normative editorial rules.
- `docs/HERESY_SCORE_CONTEXT.md`: latest technical context.
- `READING_CONTEXT.md` and `PROJECT_ROUTER.md` are in the ChatGPT Warhammer Project but their mounted copies are currently outdated (2026-10-22); align spoiler ceiling and version with this pipeline before relying on them in a new thread.
- Logs: Supabase `reading_logs` by `book_slug` (or app's exported JSON backup); do not equate the visible log with source text of a chapter.

### v0.11.5 checkpoint (2026-10-24)
- **P0 published:** seven-cue Chapter II score (25:39 published catalog runtime), protected ending, no padding. Reader has not read II; the score's narrative function ledger stays private. Secondary-source chapter skeleton checked; individual transitions still need feedback.
- **P0 release gate still open:** click **Check Spotify Runtime** inside Fulgrim II to fetch real Spotify `duration_ms`, check resolved recording identities, and ensure start/pause/resume/manual Final Cue. Not tested using user's Spotify login yet.
- **P1 published:** six already-known character dossiers and five archive records under Chapter I gate. Image crop/portrait correctness needs device QA; only Fulgrim currently has a suitable imported personal reference in the conversation pack.
- **QA regression:** JS parse and isolated book-state tests passed; book IV preserved after IV↔V simulation. Live app/PWA/cloud remain separate validation tasks.
- **Next execution:** validate preflight and finish P1 image QA; then resume P2 reliability and add explicit ending/sonic-design feedback fields.

### P2 reliability checkpoint — v0.11.6
- **Code complete / device QA open:** async Supabase cross-book guard, chapter-scoped private Spotify playlists, no duplicate starts during Spotify prepare, all-book backup (no secrets), three optional sound-direction ratings and offline-cached local diagnostics.
- Synthetic regression tests passed; no user-account Spotify, Supabase, offline-device, pause/resume or Final Cue behavior claimed as tested.
- [P2 QA checklist](P2_QA_CHECKLIST.md): lightweight user-device smoke test and remaining gates.
- P2.1 Spotify live verification, P2.2 cloud round-trip and P2.4 offline real-device check are **not closed**. The user already verified basic IV↔V switching before this release; post-change test still needed.
- Do not reset localStorage or delete the legacy Spotify playlist; historical reading scores remain separated.


### Field validation — P2 (2026-10-24)
- Installed PWA is the only authoritative reading client; user reports Book IV complete (17) and successful Fulgrim II Spotify Runtime preflight.
- Separate web browser local diagnostics showed incomplete archive (IV=2, V=0). Read-only Supabase check shows two different owner groups, **17+1** and **2+0**. The incompleteness did not overwrite the complete cloud archive. Do not wipe/reconnect any token as a workaround.
- Real-device preflight passed as an *action*, but exact Spotify runtime and final cue position weren't supplied.
- P2 follow-up: test directional feedback persistence, all-books backup on PWA, Final Cue, offline shell and Supabase roundtrip; then address push-first cloud initialization if second-device recovery becomes a supported workflow.
