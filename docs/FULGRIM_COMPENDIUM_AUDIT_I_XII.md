# Fulgrim — Compendium audit through chapter XII
Date: 2026-11-07. Reader clearance: chapters I–XII completed; XIII unread.
This is a **repository inventory**, not a claim that every character in the novel through XII is catalogued. Do not use future plot events to fill gaps.

## Findings from source code
- `data/fulgrim-score.js` has **16** character dossier records, all with unlock 1–4. There are **zero** character entries newly unlocked in chapters V–XII. This is a content coverage gap, not a refresh bug.
- It has **7** archive/location/entity records, all with unlock 1 or 4; **zero** newly unlocked in V–XII.
- `data/fulgrim-curated-art.js` has 16 portrait source records: 2 official-illustration candidates (Fulgrim and Ferrus Manus), 2 miniature photographs (Eidolon, Saul Tarvitz), and 12 generated fallbacks. Precisely: 2 illustrated official candidates, 2 model photos, 12 generated. Miniature photo URLs were disabled as default in v0151; these characters now display generated fallback until suitable illustration is verified.
- `scripts/fulgrim-archive-curated.js` offers only **2** externally sourced fanarts (Pride of the Emperor, Laer). Remaining 5 archive records have no source illustration.
- Externally hosted URLs are not durable: hotlink failure may leave generated art or an icon. A verified source page, artist attribution and locally usable image asset are separate tasks.
- The artwork source map refreshes on saved log but cannot generate absent dossier records. Reader-specific art in IndexedDB should take priority.
- Some older source comments/notes claim curation only through V and are outdated. Future score chapters do not imply spoiler clearance.

## Character inventory in current app
| Unlock | Name | Current default | Editorial action |
|---|---|---|---|
| I | Fulgrim | Official book-cover illustration candidate (external), generated fallback | Verify era-safe source and asset |
| I | Solomon Demeter | Generated; miniature-photo reference not acceptable | Find credited 2D illustration |
| I | Ostian Delafour | Generated | Search exact-character fanart; otherwise retain labeled reconstruction |
| I | Serena d'Angelus | Generated | Search exact-character fanart; otherwise retain labeled reconstruction |
| I | Bequa Kynska | Generated | Search exact-character fanart; otherwise retain labeled reconstruction |
| I | Paljor Dorji | Generated | Search exact-character fanart; otherwise retain labeled reconstruction |
| I | Julius Kaesoron | Generated | Find era-appropriate 2D artwork |
| I | Marius Vairosean | Generated | Find era-appropriate 2D artwork |
| I | Gaius Caphen | Generated | Search exact-character fanart |
| I | Coraline Aseneca | Generated | Search exact-character fanart |
| II | Eidolon | Generated (miniature disabled) | Find credited 2D illustration |
| II | Vespasian | Generated | Search exact-character fanart |
| III | Fabius | Generated | Avoid later-era appearance/spoilers |
| IV | Saul Tarvitz | Generated (miniature disabled) | Research Dave Gallagher's illustrated card artwork |
| IV | Lucius | Generated | Avoid later-era appearance/spoilers |
| IV | Ferrus Manus | Official Black Library illustration candidate (external), generated fallback | Verify asset and availability |

## Archive inventory
| Unlock | Record | Current art | Next action |
|---|---|---|---|
| I | Pride of the Emperor | Credited fanart external URL | Check hotlink and local provenance |
| I | Laeran | No sourced illustration | Seek exact-location artwork; do not substitute generic alien world |
| I | Atoll 19 | No sourced illustration | Seek exact-location artwork; neutral symbol if none |
| I | Laer | Credited fanart external URL | Verify attribution and image availability |
| I | Recital of Bequa Kynska | No sourced illustration | Seek exact-scene fanart; do not mislabel generic concert |
| IV | Iron Hands | No sourced illustration | Official legion heraldry candidate |
| IV | Pride of the Emperor / Apothecarion | No sourced illustration | Exact-location art or labeled conceptual illustration only |

## Required work to reach chapter XII
1. **Content gap:** review the reader-provided *Fulgrim* MOBI or private chapter maps for chapters V–XII. Create an evidence-backed, spoiler-gated index of characters, places, organizations, artifacts, and new facts, each with first-appearance chapter and source notes. Never fabricate entries or unlock future developments.
2. **Art sourcing:** source original illustration first (Games Workshop/Black Library/Warhammer Community), then credited fanart; exclude painted miniature photos and later-era spoiler-heavy designs. Verify exact subject, era, source page, artist, and whether asset can be stored in this repo. Keep placeholders labeled if not found.
3. **Display QA:** compare actual app Compendium with code inventory at clearance XII. Verify that saving a log unlocks both new dossier and image, and that images persist across reload/offline. Inspect external-image failures.
4. **Maintenance:** chapter-completion refresh should be triggered by the log save, and future entries must exist in the content dataset ahead of time but remain hidden until reader clearance. No future plot descriptions in public data.

## Status
Audit inventory completed; content additions for V–XII and actual art-file replacements **not yet done**. A GitHub commit proves code change, not that images loaded on reader's device.

## Implementation 2026-11-07 — v0153
- Added reader-cleared, source-mapped facts for chapters III, IV and V to existing dossiers. Based on the attached private III–V scene-map ZIP, not inferred future plot.
- VI–XII content extraction and new entity registration still outstanding; do not mark inventory complete. No third-party 2D art binaries were imported in this release. Artwork sourcing remains pending.
- The 16 existing dossiers and 7 archive records remain the same number; this release enriches existing dossiers only.

## Source-checked expansion through XIV — 2026-11-08
- Extracted the reader-supplied MOBI locally with PalmDOC decompression and checked the text of chapters VI–XIV. The original source remains private and **was not uploaded** to GitHub.
- Added 6 new spoiler-gated character dossiers: Captain Balhaan (VI), Gabriel Santor (VII), Evander Tobias (IX), Lycaon (IX), Eldrad Ulthran (XI), Khiraen Goldhelm (XIV).
- Added 9 archive records: Diasporex, Carollis system, Ferrum (VI), Perdus Region, Craftworld Ulthwé, Eldar (XI), Maiden Worlds (XIII), Tarsus and Wraithlord (XIV).
- Added chapter-specific facts to existing Fulgrim, Solomon Demeter, Ferrus Manus, Julius Kaesoron dossiers.
- Reader explicitly reports chapter XIV read; app still uses its own completed-chapter log for clearance, so XIII–XIV entries unlock only when the log confirms that progress.
- No artwork claimed for new subjects: these records intentionally use **verified illustration pending** rather than inventing a canonical likeness. Original art / credited fanart sourcing remains outstanding. Do not use future-era Eldrad or other spoiler-bearing illustrations without screening.
- Previous inventory (16 characters/7 archive) was correct **before** this expansion; new expected counts are 22 characters and 16 archive records.
- This pass adds source-grounded high-priority entities, not an exhaustive per-scene annotation of every chapter VI–XIV. Further text pass should catch minor characters, additional sites, and more specific visual source records.
