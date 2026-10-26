# Fulgrim — text-first score curation protocol
Last updated: 2026-10-25
Scope: Book V / 25 chapters / five parts
Public artifact: **NO BOOK TEXT, FUTURE SCENES OR SPOILERS HERE**

## Sources of truth
1. Reader-supplied **Fulgrim** MOBI (kept in a *private* Project file or the original conversation attachment; do not upload its text to the public repository).
2. `data/fulgrim-chapter-metrics.json` (word/paragraph counts, spoiler-free).
3. Reader's chapter-level logs, Spotify verified track duration and subjective soundtrack fit.
4. `data/fulgrim-score.js` (only playlists cleared for current reading; chapters I–II have existing app scores, not necessarily source-verified to the new protocol).

**Important:** A public Markdown summary cannot replace the original chapter text. If working in a later chat, retrieve the privately attached MOBI; do not claim to know paragraph-level chronology from this metadata alone.

## Preferred workflow
1. **One-time private analysis:** extract all 25 chapter boundaries and paragraph counts. Maintain a private scene-index file with discrete events in *source order*, using paragraph or word ranges as anchors. Scene boundaries follow the actual narrative, not a fixed three-act/number-of-combats template.
2. **Publish in controlled batches:** before the next reading session, curate only the next one to three chapters from the private scene map. Future narrative maps, characters, late-book cues and artwork must remain hidden from the UI.
3. **Within each chapter:** assign emotional function per real segment; select sound palette including dialogue, contemplation, art/performance, suspense, battle, aftermath or silence **only when present**. Check the context of artistic performances for appropriate chamber, recital, opera or theatrical material; avoid cinematic martial music merely by habit.
4. **Time alignment:** count words in each actual segment. Allocate the chapter runtime proportionally as an initial estimate; then revise for dense dialogue, technical description and transitions. Reconcile the Kindle estimate and historical reader logs. Do not force a universal minutes-per-chapter or minutes-per-scene.
5. **Spotify QA before READY:** resolve exact recording IDs and live durations, avoid similarly named wrong recordings, note fade/crossfade behavior, compare planned runtime with reading estimate, verify segment cue placement and protect the ending. Reserves must be explicitly optional, never automatically extend the base score.
6. **Post-read:** log actual time, leftover/shortage, cue-specific fit, and the **actual point** at which music got ahead/behind. Use this to refine pace, *not* invent the following chapter's scene structure.
7. **Spoiler gating:** no future scene summaries, cast members, venue names, character statuses, image transformations or theme-revealing track titles in app surfaces until cleared.

## Timing evidence and uncertainty
- Fulgrim Chapter I: **4,776 words**, user logged **25 minutes** (~191 words/min for that chapter); soundtrack had ~3.5 tracks remaining and user read more slowly than usual because of many introductions.
- Fulgrim Chapter II: **5,359 words**, Kindle estimated **26 minutes** at that point. Scaling solely by Chapter I words/time would yield ~28.1 minutes, which is only a rough cross-check. The **26–29 minute** bracket is a working prior, not a measured time.
- Historical rule of thumb: ~1.5 min per Kindle page **when actual page counts are known**. Page counts aren't in the extracted text; do not synthesize them.
- Runtime success requires actual track timing; chapter minutes alone do not confirm music-to-scene synchronization.

## Scene-map schema — private only
```json
{
  "book": "fulgrim",
  "chapter": 3,
  "sourceFingerprint": "reader-supplied-file-sha256",
  "status": "not-reviewed",
  "anchors": [
    {
      "startParagraph": null,
      "endParagraph": null,
      "cumulativeWordStart": null,
      "cumulativeWordEnd": null,
      "privateSceneSummary": null,
      "dramaticFunction": null,
      "musicEnergy": null,
      "cueCandidate": null,
      "reviewedAgainstSource": false
    }
  ],
  "kindleEstimateMinutes": null,
  "userObservedMinutes": null,
  "resolvedSpotifyMinutes": null,
  "readerClearanceRequired": 3,
  "published": false
}
```
The example is only a **blank schema**; no Chapter III analysis or invented narrative sequence is implied.

## Book V publishing rule
The app should expose only the current/unlocked score; the private 25-chapter narrative map must not be imported into the public website bundle, IndexedDB for viewers, GitHub commits or Spotify playlist descriptions. Staging later chapters as a placeholder is safe; staging their plot, cast or songs is not.

## Resilience across chats
- Public documentation/score metadata persist in GitHub and can be fetched in new chats.
- **Private chapter text and scene maps require persistent private Project attachments.** A local file in one chat or temporary sandbox does not guarantee access from every future conversation.
- The source-of-truth context should reference source location and reader clearance, not copy full chapters into an MD.
- Keep Book IV backup separate and avoid altering the local-first book migration as part of music curation.

## Private-map checkpoint — 2026-10-25
- Chapters **III, IV and V** have been read from the reader-supplied private MOBI and segmented into chronological, paragraph-anchored narrative blocks. Narrative map files are kept PRIVATE in the project transfer pack, not in this public repository or PWA bundle.
- Boundaries were checked for contiguous, nonoverlapping coverage; page/section headings are excluded from narrative timing.
- Musical roles and rough segment-time allocations have been drafted from each actual passage, not from a fixed three-act template.
- **No music was released** and no Spotify recording IDs, durations, or actual playback matches have yet been verified. Chapter III is the next score candidate for private QA.
- Private handoff files: `FULGRIM_PRIVATE_CURATION_INDEX_v2.md` and `FULGRIM_PRIVATE_MAPS_III_V.zip`, supplied in the project conversation for user to attach to the private Warhammer Project.
- Current spoiler ceiling stays at the reader's confirmed Chapter II. Do not expose later scene summaries, character names or music cues in public code or chat.

## Chapter III catalog-curated score — 2026-10-25
- Source: **private chapter III paragraph-anchored map (9 segments)**, analyzed against reader-supplied MOBI; detailed event-to-music placements kept in the private Warhammer Project, never in public GitHub/PWA.
- Nine public track titles are in `data/fulgrim-score.js`, with **24:20 aggregate Spotify-catalog duration** (1460 seconds); corresponding word-weighted narrative estimate approximately 24:12, sensitivity range 21.8–25.8 min. These are estimates, not measured reader or exact Spotify account timings.
- Playlist follows the actual nine-section timing without forcing one cue per short segment; no auto-fill or auto-trim. Protected ending is track #9.
- The next unread chapter now has a dynamic **Check Spotify Runtime** preflight, rather than a chapter-II-only test. The control resolves tracks in the reader's Spotify market and can verify live duration; **we cannot claim this user-side test has occurred yet**.
- Chapter IV remains spoiler-sealed; private maps IV/V must stay out of the public repository. Static JS checks and book IV/V isolation smoke tests passed.


## Reader field calibration — Chapter III (2026-10-26)
- Supabase primary Fulgrim Chapter III: 21 min, overall score fit GOOD, sequence generally aligned; compared with 24:20 of catalog cue lengths.
- Main discrepancy is *local scene-boundary drift*: combat can start while a calmer cue continues; the combat cue can persist into later dialogue. Do not treat this as proof the cue selection is wrong or cut exactly 3:20 only from the ending.
- Runtime varies by the reading session; preserve uncertainty bands and editable transition positions. Re-analyze block-by-block if marker timestamps are collected, while retaining the text-derived event order.
- A new optional marker UI captures timer offset plus current Spotify cue for **needs more energy** or **needs to calm down**. It is not required; chapter logs with no markers remain valid.
- Visual asset coverage remains independent of score curation; the existing personal pack has only Fulgrim among Book V's currently available 6 named personae. Fill missing dossiers with verified spoiler-safe individual portrait assets later. Do not relabel art from unrelated people.
