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
