# Book IV Compendium — Character image decisions (v1)
Updated 2026-10-23. Based on source audit of `index.html` and `patch-v0102.js`.
Rule: archive completed through XVII; `Fulgrim` reading not begun.
Screenshot set by user includes a portrait presented as Loken, and images *attributed by the user* to @chrisjonessuperartist (seven color examples) and @tattoo_babay (monochrome primarchs/warriors). Source-post authorship and display permissions still need verification.
`USE_REF` means private reference only until rights checked. `LOOKUP` means seek exact official/community art. `RECON` means create a period-safe original illustration. No posted screenshot automatically means publishable.

| Character | Decision | Art role / restriction | Priority |
|---|---|---|---|
| Nathaniel Garro | LOOKUP, RECON if needed | Recognizable 30k Death Guard, not late-era costume; user Garro portrait can inform research | P0 |
| Solun Decius | RECON | Original Death Guard first; transformed version separate, gate XVI | P0 |
| Tollen Sendek | RECON | Individual speculative likeness, role analytic Death Guard; status gated at XVI | P0 |
| Malcador | LOOKUP | Regental robes, age, human scale, first visible XVII | P0 |
| Meric Voyen | RECON | Apothecary signifiers, early legion status | P1 |
| Andus Hakur | RECON | Veteran sergeant, restrained service wear | P1 |
| Kaleb Arin | RECON | Human housecarl; never depict as Astartes | P1 |
| Baryk Carya | RECON | Human shipmaster/naval bridge uniform | P1 |
| Iacton Qruze | LOOKUP / RECON | Sons of Horus veteran, known at IX | P1 |
| Euphrati Keeler | LOOKUP / RECON | Human remembrancer, no later-era symbolism | P1 |
| Kyril Sindermann | LOOKUP / RECON | Human iterator, book-era | P1 |
| Mersadie Oliton | LOOKUP / RECON | Human documentarist, book-era | P1 |
| Pyr Rahl | RECON | Chapter-safe service appearance | P1 |
| Ullis Temeter | RECON | Death Guard captain, subject exact unverified | P1 |
| Huron-Fal | RECON | Heresy-era Dreadnought, correct chassis after research | P1 |
| Ignatius Grulgor | RECON | Separate original and chapter XI changed form | P1 |
| Mortarion | KEEP source REVIEW | Official era visual already linked; no later transformation | P1 |
| Rogal Dorn | KEEP source REVIEW | Official era visual already linked | P1 |
| Amendera Kendel | KEEP order ref, RECON person | Order illustration is not her exact individual portrait | P1 |
| Calas Typhon | LOOKUP / RECON | Era-specific only; never later form | P2 |
| Saul Tarvitz | LOOKUP / RECON | 30k Emperor's Children, chapter-appropriate | P2 |
| Eidolon | LOOKUP / RECON | 30k Emperor's Children | P2 |
| Fabius | LOOKUP / RECON | Only period-safe pre-Fulgrim depiction | P2 |
| Warsinger | RECON | Based on book descriptions, without later inventions | P2 |
| Efried | RECON | Imperial Fists, name/facts exact | P2 |
| Halbrecht | RECON | Imperial Fists; avoid arbitrary unique heraldry | P2 |
| Racel Vought | RECON | Human officer, Eisenstein | P2 |
| Tirin Maas | RECON | Human vox officer | P2 |
| Severnaya | RECON | Navigator, exact lore constraints | P2 |
| Garviel Loken | USE_REF / LOOKUP | User-provided monochrome portrait; add to prior-book global archive, **not** as a new Book IV introduction | P1 GLOBAL |
| Abaddon | USE_REF / LOOKUP | Monochrome user reference; gate against current narrative; avoid future 40k visual | GLOBAL |
| Primarch reference set | USE_REF | May index user-identified Fulgrim, Sevatar, Horus, Guilliman, Mortarion, Angron, Sanguinius, Russ, Dorn, Corax, Lion, Khan, Ferrus Manus, Vulkan, Perturabo, Konrad Curze, Lorgar, Alpharius, Magnus, and related sketches as unverified per-post provenance | GLOBAL |

## Audit notes
Base roster contains 22 people; 6 more added with `ensurePerson` in the runtime patch, plus Malcador. Most are `image:null`. Missing art was conflated with hidden/restricted art; style bible distinguishes `pending` from `redacted`. No fanart is committed unless authorized. Loken belongs to global character history across books; add to canonical character manifest in the data-model refactor, not a fabricated Book IV encounter.

## Asset workflow
Research source links → verify subject + era → check rights → approve exact existing asset or generate an original reconstruction → crop and QA → save as `assets/compendium/<book-slug>/<character-id>/<variant-id>.webp` → attach metadata `firstSafe` + credit → verify offline and all clearance boundaries.

## Pilot order
Garro, Decius pre-corruption, Sendek, Malcador. Match them as a family without copying either contributor's individual paintings.
