# Book IV → V: Epilogue and Compendium design specification
Updated: 2026-10-23

## Chapter XVII, Book IV
- Reading unit id: `flight-of-the-eisenstein:17`
- Type: `epilogue` (NOT an untracked or discarded chapter)
- Reader clearance: complete as of 2026-10-23
- Reader pace baseline: ~1.5 minutes per page, **no verified Kindle page count** for XVII.
- Curated opening: Immortal Imperium — Jesper Kyd
- Curated ending: Across The Void — Guillaume David
- Optional extension only: The Will of the Imperium — Jesper Kyd
- Approximate planned score: 8–9 min base, not the actual reading duration; Spotify resolves exact durations at chapter sync.
- Existing reader can select Mark Already Read (minutes null); new reader can launch normal chapter score.
- Track sequence reflects formal audience, clemency and threshold/new direction; must remain hidden before chapter unlock.
- Never backfill false time into logs. Never activate optional reserve just to fill time.
- Schema proposal for next refactor: `{bookSlug,number,type,title,estimatedPages,estimatedMinutes,scoreMeta,unlockPolicy}`, and logs keyed by `bookSlug:number`.
- WARNING: current local state and Supabase are still keyed around Book IV. Do not reset localStorage. Book V migration requires explicit backup and test.

## Compendium portrait source contract
Priority: 1 exact official Horus Heresy-era individual art; 2 accurately labelled official mini; 3 vetted community art with credit/permission; 4 clearly labelled original reconstruction; 5 branded placeholder.
Never use generic armour or an order's artwork labelled as the named individual. Never use later transformations in early chapter clearance.
All portraits: 3:4 crop, chest or waist-up, muted bone, iron, muted green and bronze, untextured neutral stone/shipboard backdrop, consistent chiaroscuro; no text baked into art. App overlays name, source status, chapter gate and role.
Portrait metadata: `{id,book,unlockChapter,subjectExact,sourceKind,sourceUrl,credit,license,reviewStatus,assetPath,spoilerNotes}`.
sourceKind: `official_character|official_mini|official_faction_reference|community|generated_reconstruction|pending`.
Set imagery chapter gate separate from text unlock if a later depiction spoils a transformation. Gate statuses too.
A deceased character does not automatically have safe art: preserve correct depiction era.

## Audited backlog: original roster
The base index contains named characters with no exact visual. Some additions from the runtime patch also lack art.

P0 / iconic and central:
- Nathaniel Garro — official individual miniature/art search (likely candidate); do not settle for generic legionnaire.
- Solun Decius — original Death Guard version and transformed Lord of the Flies must be separate chapter-gated visual variants; transformation gate XVI.
- Malcador the Sigillite — book IV epilogue first appearance here; search official individual reference.
- Tollen Sendek — illustration/reconstruction; death status after climax (XVI).

P1 / supporting:
- Meric Voyen, Andus Hakur, Kaleb Arin, Baryk Carya, Iacton Qruze, Euphrati Keeler, Kyril Sindermann, Mersadie Oliton, Ullis Temeter, Huron-Fal, Pyr Rahl, Ignatius Grulgor.
P2:
- Calas Typhon, Saul Tarvitz, Eidolon, Fabius, Warsinger, Efried, Halbrecht, Racel Vought, Tirin Maas, Severnaya.
Already with representative order art: Amendera Kendel; never label exact face. Mortarion and Dorn have official era references.
The current runtime uses tasteful initials placeholder for any missing image instead of automatically implying a spoiler restriction.

## Release gates before Book V
1. Back up localStorage and verify cloud rows for Book IV.
2. Consolidate runtime patches into base module and introduce book-scoped log migration.
3. Fix cloud app_version, avoid collisions in bookSlug/chapter PK.
4. Build book-select and transition preserving Book IV and unlocking Book V at chapter I.
5. Validate Spotify resolved runtime, optional reserve and final cue; confirm no spoiler in track titles.
6. Add feedback ending separately from peak, repetition guard, and provenance statuses.
7. Validate status/image chapter gating at several progress points.
8. Check PWA cache refresh, sync failure fallback, portable local state and UI on mobile.
