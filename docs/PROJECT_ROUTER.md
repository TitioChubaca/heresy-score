# Warhammer conversation routing — current handoff (2026-11-20)

- **Book V Fulgrim**: COMPLETE (25/25 chapters), final reader score 3/5 Dreadnoughts. Its conversation may remain an archive/debate space for Book V only.
- **Book VI Descent of Angels**: NOT STARTED. Start a separate discussion; absolutely no Book VI plot/art spoilers until chapter completion is explicitly confirmed.
- **Heresy Score App Lab**: technical planning, GitHub, Spotify, cloud, dramaturgy, images and UX. Before shipping Book VI, follow the audit in [APP_AUDIT_2026-11-20.md](APP_AUDIT_2026-11-20.md).
- **Data handoff**: [READING_CONTEXT.md](READING_CONTEXT.md) is the spoiler ceiling, [HERESY_SCORE_CONTEXT.md](HERESY_SCORE_CONTEXT.md) is the technical continuity record. Source MOBI remains private; do not paste book VI future scene maps into public repository.
- **Order of next work**: snapshot/backup -> generic book support -> reliable music model and tests -> Dramatis Personae/image UX -> Book VI prelude pilot; do not mark an implementation verified before on-device testing.

Older instructions below are historical; this header supersedes stale current-book references.

---

# Warhammer Project Conversation Router

Last updated: 2026-11-07

Use separate conversations for reading and app development, sharing persistent Markdown context files.

## Canonical context files
- `READING_CONTEXT.md` — spoiler ceiling, current book/chapter, safe plot state, character statuses and open questions.
- `HERESY_SCORE_CONTEXT.md` — app architecture, soundtrack method, timing, motifs, feedback, roadmap and known debt.
- `PROJECT_ROUTER.md` — conversation layout and update responsibilities.

## Recommended conversations
- **00 — Heresy Score / App Lab**: code, GitHub, Spotify, Supabase, UI, compendium, scoring methodology, migrations and book transitions.
- **01 — Book IV: Flight of the Eisenstein**: keep only until Chapter XVI is complete, then archive.
- **02 — Book V: Fulgrim**: create after Book IV is complete; chapter reactions, lore, characters, spoiler-safe images and thematic discussion.
- Future books: one conversation per book.

## Update rules
After every chapter:
- update READING_CONTEXT.md with spoiler ceiling, newly safe events, status changes, open questions and reader interpretations;
- update HERESY_SCORE_CONTEXT.md with minutes, duration result, opening/intensity/peak/ending feedback, fit/mismatch, repetition and motif evidence.

After code changes:
- update HERESY_SCORE_CONTEXT.md with protocol version, migrations, architecture changes, bugs and next priority.

After every book:
- add final rating, strongest/weakest scenes, themes, character arcs, soundtrack retrospective and app lessons;
- initialize the next book without carrying all chapter-level detail into the active section.

## Spoiler discipline
The newest spoiler ceiling in READING_CONTEXT.md always wins.
Never infer permission from general 40k knowledge, later-game appearances, app assets, hidden future research or pre-staged scores.

## November 2026 handoff
- Authoritative current state: `docs/READING_CONTEXT.md` (Fulgrim XII complete; XIII next), `docs/HERESY_SCORE_CONTEXT.md` (v0.15.5), and `docs/FULGRIM_RUNTIME_FORECAST_2026-11-07.md`.
- Old static project-attached Markdown copies dated October 22 are historical and should not supersede the updated repo docs. The private MOBI and sealed maps must never be committed to the public repository.
