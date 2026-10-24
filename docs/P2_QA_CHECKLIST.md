# Heresy Score v0.11.6 — P2 QA checklist
**Date:** 2026-10-24. **Reader clearance:** Book IV complete; Fulgrim Chapter I complete. No spoilers for II+.

## Shipped
- Optional post-reading fields: **Ending / Final Cue**, **Atmosphere / Sonic Space**, **Scene Transitions**. Stored in the existing chapter log JSON `payload`, with neutral fallback on older logs; no SQL migration.
- Debrief and log display, text export and cloud sync now include these fields when saved.
- `cloudPushChapter` and `cloudPullLogs` snapshot the selected book; late responses after IV↔V switches are discarded safely. Push also declines to mark a log synced if the record changed while request was running.
- Spotify private playlists are now separated by **book slug + chapter** (`state.spotify.playlists`), with existing legacy Spotify playlist ID left untouched rather than forcibly adopted or overwritten.
- Prevent duplicate `Begin Chapter` while Spotify is preparing; refuse book switches while session start is pending.
- Export **all books backup**. Its `legacyBookIVLogs` always contains Book IV data even when Fulgrim is selected. No Spotify access/refresh tokens or cloud recovery token included. IndexedDB images are separate.
- Cogitator local diagnostics panel reports metadata only, never private notes or credentials.
- Offline service worker cache `heresy-score-v0119`; app cloud `app_version=0.11.6`.

## Automated checks
- [x] JavaScript parse: app inline code, patch, book state/switch, backup, feedback, diagnostics, SW
- [x] A delayed Book IV cloud **push** cannot change Book V log state
- [x] A delayed Book V cloud **pull** cannot change Book IV log state
- [x] Spotify create once for IV chapter I, create once for V chapter II, reuse IV ID on revisit
- [x] Backup's Book IV legacy alias comes from `books[HSBooks.IV].done`, not `state.done`
- [x] Optional feedback fields integrated into same `.seg` persistence flow and exported text
- [x] Asset cache and script load order include new modules

## User-device QA (open)
These steps are **not run on the user's account**. Do not claim they passed.

1. Reload app once and check **Cogitator Settings → Run local diagnostics**. Expected: both archives still present; Book IV has 17 chapter logs; Fulgrim has Chapter I. Use Copy sanitized report if an unexpected status appears.
2. Click **Export all books backup**; confirm the JSON includes separate `books.flight-of-the-eisenstein.done` and `books.fulgrim.done`. Do **not** share the whole JSON publicly because it contains reading notes; it intentionally omits login and cloud recovery secrets.
3. Open **Fulgrim → Chapter I → Open Log**; test a new Ending, Atmosphere and Transitions rating. Save. Check **Field Logs** and **Copy Debrief** for all three categories. Verify they survive a normal refresh. **Do not edit the measured 25 min**.
4. Switch **IV → V → IV** (while no timer is running). Verify logs and Compendium; return to V. Do not clear browser data or reinstall the PWA.
5. In **Fulgrim Chapter II**, click **Check Spotify Runtime**. The preflight prepares a dedicated private chapter playlist, resolves actual recordings and should not start the timer. Compare real runtime against the 26-minute Kindle estimate, and confirm Final Cue is last. An exact Spotify runtime is **not yet verified**.
6. If Supabase is connected, save one new feedback rating on Fulgrim I, sync it, refresh and pull; confirm the three ratings remain. If it fails, capture the displayed error — don't rebind the token or delete old rows.
7. When safe and not reading, optionally test offline PWA shell by loading app without internet. Offline music playback is not promised; Spotify needs connectivity.
8. The active timer, pause/resume, track marks, manual Final Cue and playback-control flows still require an actual reading-session test. Do not create a fake completed log to test.

## Risks / deferred
- Existing single `state.spotify.playlistId` remains as a **pointer** to currently active chapter, but chapter entries are preserved independently under `state.spotify.playlists`.
- Playlist creation/verification, cached Spotify tracks and API availability depend on the user's authorization and device. Any Spotify failure should not erase reading history.
- This release does not support importing a JSON backup directly into the browser, only exporting it. Recovery of cloud logs requires the user's own recovery code.
- Portable personal images remain in IndexedDB and are *not* included in the JSON log export.
- No schema modifications; Supabase still stores expanded ratings in `payload`, not first-class columns.
- Book V total chapter count and chapter II music are not re-curated by this reliability sprint.

## Exit criteria for closing P2
- User confirms settings diagnostics, backup and post-reading ratings operate in browser.
- Spotify preflight reports its exact chapter II duration without opening the timer.
- One user-driven cross-book sync round trip preserves archive separation.
- Optional normal reading session confirms final cue and pause/resume.


## User validation — 2026-10-24
- Reader verified the **installed PWA** shows the completed `Eisenstein` (17 chapters) and that **Fulgrim II → Check Spotify Runtime** ran successfully. Exact resolved minute:second was not supplied, so duration accuracy is not yet independently confirmed.
- Desktop website diagnostic screenshot (v0.11.6): `Eisenstein recorded chapters: 2`, `Fulgrim recorded chapters: 0`, selected `flight-of-the-eisenstein`, Cloud enabled, Spotify authenticated, PWA controller active, feedback fields ready. This is an **independent local archive**, not evidence that the installed PWA lost progress.
- Direct Supabase read-only check returned **two distinct owner groups**: primary archive = Eisenstein 17 + Fulgrim I 1; secondary archive = Eisenstein 2 + Fulgrim 0. This confirms separate owner hashes for current records (not proof of which precise browser produced each), without publishing either hash or recovery token.
- No migration, token rebinding, record deletion or reset required. Preserve the installed PWA as the authoritative reader surface. Secondary browser can be ignored. Beware manually pasting the primary recovery token into the stale browser while it has different local chapter data.
- The cloud auto-sync code remains push-first on load and Connect & Sync. With the **currently distinct owner hashes** it does not cross-overwrite the primary archive, but this is a future multi-device recovery risk if a stale client reuses the primary recovery token. Consider a dedicated pull-first/reconciliation improvement before asking anyone to link a second device.
- Mark as verified: archive completeness on device, separate cloud archive counts, Spotify preflight execution. Still open: exact track runtimes, Final Cue on player, feedback persistence after refresh, actual cloud roundtrip, JSON export, offline PWA behavior.
