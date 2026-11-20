# Book VI / Prelude — soundtrack pilot and Spotify folder management
**Date:** 2026-11-20. **Version target:** v0.17.4.
**Spoiler ceiling:** Descent of Angels is UNREAD. No private novel text or later character/plot content in this repository.

## Prelude editorial pilot
The source MOBI was privately reviewed, without committing its prose. Only the Prelude has a preliminary soundtrack; later chapters and Aftermath remain without published scores.

- Reading unit: prelude (sequence index 1, not chapter 1 of the story).
- Private source word count: ~3,238 words.
- Reader pace reference: 197 words/minute from Fulgrim valid logs.
- Estimated target: 16:26.
- Public track durations total: **16:38**; **+12 seconds** before real Spotify API validation.
- Editorial approach: six restrained instrumental cues preserving atmosphere, suspense, measured historical progression, dialogue, reflection and contemplative close. No generic boss-battle tracks used.
- Editorial status: **PILOT_UNLISTENED**, never claim listened/approved. On-device Spotify inspection verifies URI/artist/track/duration, NOT narrative suitability.

| No. | Track | Artist | Public length | Spotify track ID | Narrative role |
|---|---|---|---|---|---|
| 1 | Majula | Motoi Sakuraba | 3:18 | 0VezF1gAZbBHitiRlVnxlr | atmosphere |
| 2 | Catacombs | Yuka Kitamura | 1:53 | 3jOjqaqG7Of1gb8eoFjWk5 | suspense |
| 3 | Leyndell, Royal Capital | Yuka Kitamura | 3:17 | 4PpMIuuZUBU34wnRw2Fk0y | transition |
| 4 | Roundtable Hold | Tsukasa Saitoh | 2:21 | 2upZ542q9ScxpYFnvLRf6O | dialogue |
| 5 | Fire Keepers | Motoi Sakuraba | 2:43 | 1lNlOXH1goSj2dRBPUCzrg | aftermath |
| 6 | Firelink Shrine | Yuka Kitamura | 3:06 | 0oLK0KuDVLT3JVDpQQLHOT | closing |

Spotify public album/track pages were reviewed on the date above for title, composer and stated duration. The runtime **does not accept the published lengths as verified**. Every item must be fetched by exact ID from the reader's Spotify, with artist/title matching, and checked for the reader's market. The playlist is only marked prepared when a write (if needed) and subsequent readback reproduce all six URIs and their measured duration within -45/+60 seconds of target. Never silently substitute or delete a protected cue.

## Why playlist folders need manual work

According to official Spotify API docs, folders are not returned through the Web API and cannot be created, moved or enumerated by it. Spotify's own mobile, web and desktop apps can create and manage folders.

Suggested personal library structure:
- Heresy Score — Horus Heresy
  - IV — Flight of the Eisenstein
  - V — Fulgrim
  - VI — Descent of Angels

Two supported workflows:
1. Create an **empty playlist** inside the target folder in Spotify, copy its playlist URL, then in Heresy Score Settings use **Vincular playlist existente**. The app verifies ownership, empty playlist and uniqueness to chapter, sets it non-public, renames it to the book/unit convention, then updates its contents when audited. Folder membership cannot be verified by API.
2. Let the app create a non-public playlist under a meaningful book/unit title and move it manually to the folder afterward. It will reuse that playlist ID on subsequent audits, never create duplicates simply because the playlist was moved.

A non-public Web API playlist is not published on the profile but should not be treated as secret to someone possessing its link.

## Verification and outstanding questions
- Static source and in-memory fake-Spotify tests confirmed exact six cue IDs, 16:38 runtime with reference durations, idempotent re-audit, rejection of wrong artists and rejection of incorrect runtime before playlist creation.
- Folder-binding mock tests confirmed success for owned empty playlists and rejection of foreign, occupied or chapter-duplicated playlists.
- The user's authenticated Spotify API was NOT accessed by ChatGPT. No playlist or Spotify folder was created or moved in the user's account during this work.
- Full musical listening, transitions and precise emotional match remain unverified. This is a **pilot requiring user listening feedback**, not a promise of perfect matching to a Kindle page.
- Image replacement and subsequent Book VI scores are separate ongoing work; nothing about those is implied complete.
