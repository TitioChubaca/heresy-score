# Heresy Score — Book VI foundation implementation (2026-11-20)

## Scope shipped to code, not verified in the reader's Android yet
- Core Book IV/V/VI state migration in scripts/book-state.js (schema v4). Preserve prior IV/V logs and OAuth; Book VI initializes empty. Snapshot chapterRuntime, scoreDurations and auditResults per book; retain book+chapter Spotify playlist keys.
- Explicit editorial sequence for Book VI in data/descent-of-angels.js: 25 units (Prelude, 23 numbered chapters, Aftermath), 4 parts; approximate reading minutes only. No future scene details, cast names or source prose. SCORES EMPTY: nothing pretends to be Spotify-ready.
- Book library/router, chapter carousel and player/log labels support VI; Fulgrim 25/25 completed, 3/5 Dreadnoughts.
- Restore preview in scripts/book-backup.js: JSON export and import with schema checking, per-book unit bound checks, add-missing-only policy. Personal art and credentials excluded. Do NOT overwrite user notes.
- scripts/dramatis-personae-v2.js: type-to-search, filter only groups currently unlocked, hide sealed character cards rather than showing a sea of redacted blocks; no future cast imported. Book VI personae currently empty until first appearances are curated.
- scripts/reader-design-v2.js: mobile text sizes, button tap targets, responsive reading card and compact headings.
- scripts/editorial-score-engine.js: a scene-role fit contract, protected required slots, strictly optional transitions, candidate recording role validation and explicit no-safe-fit outcome. Integration into future chapter scores is pending; no Spotify soundtrack has been authored for Book VI.
- Spotify playlist pagination max 50 in runtime fitting and resume paths; do not claim live authorized Spotify verification.
- PWA install now requires all executable sources to be cached successfully before activation; a failed optional portrait does not block. One activate handler.
- CI workflow .github/workflows/ci.yml added to syntax-check, run historical Spotify mocks, unit migration, editorial-fitting and backup tests; **GitHub Actions completion status not confirmed**.

## Private source precautions
- The user-supplied MOBI belongs outside the public repository.
- A private no-plot Prelude sketch was created in the project container as HERESY_SCORE_BOOKVI_PRIVATE_PRELUDE_PLAN.md. It is preliminary and contains no approved soundtrack candidate; do not expose future narrative details or treat it as final curation.
- Only reference counts by reading unit and neutral units are shipped.
- Artwork rule remains official era-safe 2D > credited fanart > honest previous AI fallback. Place archive now restores symbols when external hosted art fails; this does not complete real original art acquisition.

## QA before declaring ready
1. Run all CI tests on the real GitHub checkout; confirm green.
2. Verify Android PWA update is on version 0.17.x. Test old V 25/25 and older IV logs first.
3. Switch to VI; assert 0/25, first unit Prelude, no playable Spotify score, no unwarranted characters or places, future cards sealed.
4. Switch back V/IV and verify historic logs, prior Spotify runtime and book rating remain unchanged.
5. Export JSON backup, test import preview and safe merge on disposable copy; never import test data into the user's actual app.
6. Confirm PWA remains usable offline after a full update (atomic install).
7. Curate Prelude by close reading/private scene map, source verified music candidates and listen to each transition; only then publish a score and run an authenticated Spotify read-back.
8. Apply character/art metadata only at first real in-book appearance and with chapter/unit-specific fact clearance.

## Known limitations / not yet shipped
- No Book VI Spotify playlist; the player is intentionally disabled for uncurated reading units.
- The private narrative map and editorial-song approvals still need human listening and original recording verification; no perfect Kindle page tracking.
- Book VI Dramatis has search/filter UI but NO characters imported; those must be spoiler-gated one by one.
- Art links for older books still rely partly on hotlinks. Real licensed/on-device tested replacement coverage is incomplete.
- Cloud conflict merge strategy, mobile e2e screenshot tests and full de-duplication of legacy script wrappers are still technical debt.
- This release is a tested foundation, not completion of the entire multi-stage audit. Do not tell user otherwise.
