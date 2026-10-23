# Warhammer Project Conversation Router

Last updated: 2026-10-22

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
