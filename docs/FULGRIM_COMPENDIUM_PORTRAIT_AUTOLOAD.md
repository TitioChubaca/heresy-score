# Fulgrim / Heresy Score — curator-approved image integration
Updated: 2026-10-27 / web app v0.12.3 / PWA cache heresy-score-v0129.

## Required source hierarchy
1. **OFFICIAL**: Black Library era-safe book covers and Forge World Horus Heresy 30K character sculpts, not images from the future 40K era.
2. **FANART**: exact named subject, verified artist credit and period compatibility. Never label a generic legionnaire as a named character or link directly to a spoiler-heavy artist article in the UI.
3. **GENERATED RECONSTRUCTION**: matte, muted painterly source-art-inspired original, explicitly marked NON-CANON. A generated portrait is illustrative, not a canonical likeness.

## What is actually shipped
- 16 standalone **original generated WebP portraits** in `assets/ui/portraits/fulgrim/` (low-bandwidth, included offline). These are *local reserve references* and must not be mistaken for 16 official portraits. Old procedural SVG heads have been DELETED from the live code and repository.
- Five curated canonical-subject image sources via remote direct image links in `data/fulgrim-curated-art.js`:
  - Fulgrim: Black Library published cover art (via an external mirror).
  - Ferrus Manus: Black Library published cover art; source credits Mikhail Savier.
  - Saul Tarvitz: Forge World 30K miniature photo (external reference).
  - Eidolon: Forge World 30K miniature photo (external reference).
  - Solomon Demeter: credited Lil Legend Studio fan-painted exact mini.
- Other 11 character dossiers use generated, label-marked *noncanonical* paintings; color palette is muted, no neon glow or generic SVG vector figure.
- Public rightsholders' binaries are not redistributed on the public GitHub Pages repository; the PWA requests their direct publicly available images, with original generated WebP fallback when remote display is blocked. The true category changes only after image load succeeds.
- User personal `.hsartpack` art in the PWA's IndexedDB always overrides the hosted source when imported. The project file attachments do not automatically populate IndexedDB.
- Two non-character archive references, *Pride of the Emperor* ship by terraluna5 and *Laer* concept art by Julien Hainault, are selected in `scripts/fulgrim-archive-curated.js`, subject to live link loading.
- The other five archive objects remain neutral glyphs until a **subject-specific and spoiler-safe** image can be sourced or reconstructed. Never give them misleading generic illustrations.
- All images, captions, dossiers and texts remain gated by current reader chapter. Reader-confirmed progress through Book V chapter V as of this checkpoint.
- The open portrait dialog now displays **OFFICIAL / FANART CREDITADA / RECONSTRUÇÃO NÃO CANÔNICA**, including artistic credit. The existing card caption also shows source classification.

## Why public rather than private-repo copies
GitHub Pages in a public PWA cannot fetch an unexposed private repo's images from the user's mobile browser without secure authenticated access. Keep third-party art remote and locally replaceable; self-host only original generated work, rather than copying third-party binaries to a public repository or exposing a private GitHub token in JavaScript.

## Validation
- GitHub tree contains 16 WebP original works (5 officially identified/fanart-curated subjects also have on-device fallback).
- JS parse and sequence checked: `data/fulgrim-score.js`, `data/fulgrim-curated-art.js`, `scripts/book-switch.js`, `scripts/fulgrim-archive-curated.js`.
- `index.html` loads curated art after Fulgrim data and before the book router; `sw.js` caches the same artwork and no longer injects vector fallbacks. Cache: `heresy-score-v0129`.
- Reader's installed PWA still requires a normal reload to activate the new Service Worker and to see remote sources; **do not clear PWA data**. Network/hotlink success for any external host is not yet confirmed in the reader's browser. Originals should always be available offline after new cache installs.

## Further quality review
- User can give visual fit feedback on the painterly versions; continue upgrading remaining 11 generated portraits if official artwork or credited artist sources are found.
- Images are independent of Spotify and reading logs. Do not touch Book IV progression.
