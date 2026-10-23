# HERESY SCORE — COMPENDIUM STYLE BIBLE v1.0
**Date:** 2026-10-23
**Status:** approved direction; individual assets require visual QA, provenance and chapter-clearance review.
**Spoiler ceiling:** `Flight of the Eisenstein` completed (XVII); `Fulgrim` not yet started.

## 1. Product intent
An in-universe, visually coherent, mobile-first archive whose art supports identification and reading, not future-story disclosure. **Lore fidelity > subject readability > image aesthetics > novelty.** Never force a reference likeness when the character's canonical appearance is vague.

## 2. Reference library — independent inspirations, not a copy target
**Colored concept-art family:** user-supplied first seven images, attributed by the user to [@chrisjonessuperartist](https://www.instagram.com/chrisjonessuperartist/). Distill broad traits: confident silhouettes, economical but convincing 30k armor, expressive faces, selected warm/cool rim lights, soft painterly texture, limited fog and atmospheric background. Distinctive artist compositions and exact visual signatures must not be replicated.
**Monochrome mythic study family:** the user-supplied series attributed to [@tattoo_babay](https://www.instagram.com/tattoo_babay/). Distill broad traits: sculptural chiaroscuro, anatomical volume, compositional stillness, recognisable archetypes and economical costume symbols. Work from original character/lore descriptions; do not reproduce existing linework or poses.
**User-supplied Garviel Loken portrait:** close-up of a short-haired armored Astartes with two studs visible on his forehead, strong split lighting; author of this individual image **not verified** from the screenshot alone. Source credit and original post must be verified before display/distribution.
**Attribution confidence:** profile attribution provided by the user, not yet per-post provenance. A linked creator profile does not establish that a particular screenshot was published by that creator.

## 3. Visual system
- **Archive Portrait / default:** vertical 3:4 source canvas (suggest 1200×1600 or equivalent). Crops legibly to 4:5 and square thumbnails. Head + upper torso or waist, face unobscured unless canon requires helmet; upper half contains identity-signalling details. Subject neither cut by UX labels nor lost against scenery.
- **Hero Study / optional:** vertical 2:3 or 3:4, full-body or 3/4 figure, primarily primarchs, major leaders and scene archives. A special illustration, never a prerequisite for a functional dossier.
- **Palette:** bone #D2CBB7, machine iron #48534B, deep void #080E0B, restrained archive green #A8DB72 and warm bronze #A88253. Chapter-accurate legion heraldry is exempt from palette restriction. Colors of armor must obey current era/Legion.
- **Rendering:** readable stylized realism, moderately simplified forms, measured anatomy, soft-edged digital painting, restrained linework and directional cinematic light, low-detail background. Not hyper-glossy, anime, photobashed, airbrushed plastic, or near-monochrome by default.
- **Composition:** neutral or 3/4 pose; medium-contrast face; avoid busy weapons across faces; 10% safe area around crop; no huge shoulder insignia unless correctly researched.
- **UI treatment:** name, chapter gate, faction, status, source label and credits are HTML overlays (never baked into pixels), consistent green-terminal archive shell; assets free from watermarks added by us.
- **Variants:** same named character can have separate `variantId` and `firstSafeChapter` values. Never silently overwrite a prior-era appearance with a later event/transform.
- **Narrative style:** restrained, austere, documentary, evocative. Avoid dramatic depictions that silently reveal deaths, allegiance changes or supernatural manifestations.
- **Humans:** convey profession and social standing by posture, apparel and materials; no Astartes-scale physiology.
- **Astartes:** era-correct armor pattern, aquila/legion badge placement, scale, hair/age details only with lore evidence.
- **Sisters of Silence:** correct armor and null-maiden iconography, no generic ecclesiastical robes.
- **Primarchs:** more statue-like bearing but individual and canon-specific morphology; no blanket excessive muscles, costumes or future transformations.
- **Corrupted:** entirely separate spoiler-gated variants; no corrupted variant leaked in filename, image preview, alt text or fallback.

## 4. Image sourcing and distribution
1. Verified official illustration **of the actual subject and era**, linked or used only where redistribution is authorized.
2. Official miniature matching same individual/era, correctly labelled `official_mini`.
3. Community illustration with creator/post URL, date, explicit use permission or license, and exact-subject identity verified.
4. Original generated reconstruction based on **canonical text** and broad style characteristics, not a copy of an artist's identifiable artwork. UI label `ARCHIVE RECONSTRUCTION`.
5. Archive-pending graphic; no misleading 'REDACTED' for an already revealed character. Preserve factual dossier and visible status.

**Important rights rule:** possessing screenshots, citing an artist and crediting them does not itself grant permission to redistribute their art on a public GitHub repo/PWA. The uploaded images are private curation references by default. Do not commit or hotlink user-supplied screenshots into a publicly reachable app without confirmation of artist permission or an appropriate license. This also applies separately to official GW images. Reference creator profiles can be linked without rehosting the images.

**Suggested credit footer:** `ART // Community illustration — @handle (source link) | used by permission` or `ART // Heresy Score reconstruction — not official artwork`.

## 5. Metadata contract
```json
{
  "id": "tollen-sendek",
  "name": "Tollen Sendek",
  "firstSeen": {"bookSlug": "flight-of-the-eisenstein", "chapter": 1},
  "visuals": [{
    "variantId": "legionary",
    "assetPath": null,
    "kind": "pending",
    "subjectExact": false,
    "firstSafe": {"bookSlug": "flight-of-the-eisenstein", "chapter": 1},
    "sourceProfile": null,
    "sourcePost": null,
    "creator": null,
    "licenseOrPermission": "not_applicable",
    "qa": "needs_source_or_reconstruction",
    "spoilerFlags": []
  }]
}
```
Valid `kind`: `official_character`, `official_mini`, `official_faction_reference`, `community`, `archive_reconstruction`, `pending`. The `kind` is **source provenance**, not a claim of canonical likeness. `subjectExact` must be false for faceless faction examples. Archive statuses require **their own** chapter gates.

## 6. QA checklist per portrait
- [ ] Correct identity / age / faction / heraldry for source chapter.
- [ ] No post-clearance spoiler in art, alt text, thumbnail, URL slug or supporting captions.
- [ ] Artwork has clear source kind and character/era identity.
- [ ] Display rights verified if third-party image is reproduced publicly.
- [ ] 3:4 image at mobile readable size; crops to 4:5 and square without losing face.
- [ ] Color temperature and rendered level match the core gallery.
- [ ] No incidental lore inventions disguised as canonical attributes.
- [ ] All supported variants gated independently.
- [ ] Fallback renders offline, does not display broken link and never hides the character.
- [ ] Approval recorded before activating any image.

## 7. First pilot
1. Nathaniel Garro — white/ivory Death Guard veteran with appropriate armor markings; prefer verified official exact-person art where possible. Pilot reconstruction only if needed.
2. Tollen Sendek — understated Death Guard legionary and analytical expression; **inventing a unique face must be labelled speculative**.
3. Solun Decius, pre-corruption — loyalist-era Death Guard armor; do not encode later visual reveal. Build distinct later variant only after gated approval.
4. Malcador the Sigillite — aged human counselor and Regent, robes rather than giant Astartes armor; prefer verified official portrait where possible.

Pilot accept/reject criteria: four clearly different individuals, recognizably same art direction, period-safe, 3:4 crops, no source-rights issue, no mistaken canonical claims.

## 8. Release phases
**v1.0:** reference catalog + source auditing + templates + P0 assignments. **v1.1:** approved pilot portrait assets and in-app gallery QA. **v1.2:** long-tail Book IV + global/person-per-book index. **v2:** multiple provenanced views and full artist credits on expanded dossiers.

## 9. App architecture caution
Current UI stores `people` and image URLs in `index.html`, with runtime mutations in `patch-v0102.js`. Do not migrate artwork into the main bundle by sprinkling filename conditions. Move metadata to separate book and character manifests after the safer book-state migration. Chapter XVII completion alone must not unlock `Fulgrim`-era appearance variants.
