# Heresy Score — Sound Direction Bible v1.0
Status: **normative / effective 2026-10-23**. Supersedes any older "add headroom automatically" suggestion.

## 1. Artistic mission
Heresy Score is **music editing and sonic storytelling for silent reading**, not a Warhammer-themed shuffle playlist. The governing question for every passage is:

> If this passage were a cinematic scene, what would an editor and sound designer need the reader to hear emotionally and spatially, without covering the prose?

The reader is not listening to an audiodrama; the musical selection can suggest ambience without literally layering environmental recordings. Authenticity is determined by scene function, not soundtrack franchise or composer's popularity.

## 2. Score selection — ordered evaluation
1. **Narrative function:** what changes in the character or audience (arrival, ritual, discovery, awe, doubt, loss, anxiety, violence, aftermath, transition, inconclusiveness)?
2. **Perspective and subtext:** whose experience dominates? What is felt but not stated? Is triumph actually tragic, is calm deceptive?
3. **Implied acoustics/environment:** enclosed voidship, echoing chamber, massive exterior, dense crowd, alien architecture, silence, machinery, wind, distance, pressure. Build spatial plausibility through timbre, register, reverb and texture rather than generic SFX.
4. **Energy curve and restraint:** onset, dynamics, density, rhythm, threat and release. Explicitly consider **no musical crescendo**, sparse motifs and silence.
5. **Scene hand-off:** how the final seconds of this cue land on the next passage. Avoid stylistic whiplash. Pick a cue that tolerates normal reading-speed variance.
6. **Ending function:** independently protect the final emotional punctuation (resolved, fragile, suspended, ominous, contemplative). The action peak and the ending are **not** one slot.
7. **Timing:** use the user's minute-per-page history, Kindle chapter estimate and actual Spotify `duration_ms` to *test* the edit, not to dictate extra filler.

A scene described as an opera, recital or performance **does not require an operatic track**. Choose the emotional and dramatic role (theatricality, uneasy virtuosity, admiration, social tension, intimacy, estrangement) first. The same applies to a Warsinger's sonic presence: conveying uncanniness and space may work better than literal singing.

## 3. The sonic palette replaces absent ambient effects
No embedded footsteps, guns or environmental loop is necessary by default. Prefer musical materials that *imply*:
- Ship corridors and scale: mechanical pulses, hollow reverberation, restrained low-frequency movement.
- Ceremony and status: measured harmonic rhythm, deliberate intervals, controlled brass/voices where justified.
- Unnatural/dissonant: unstable harmony, altered voices, grain, filtering, unresolved texture.
- Intimate conversation: reduced instrumentation, musical negative space, subtle timing.
- Motion or battle: percussive detail, orchestral gestures, transient contrast, without always equating combat to bombast.
- Theatrical performance: audience expectation and the subjective effect of the performance, not an automatic opera cue.

**Beware lyrical intelligibility:** singing with salient words can interfere with reading English prose; use lyrics only when an intentional dramatic benefit outweighs distraction.

## 4. Curation pool: all soundtracks welcome
Look across film, animation, games beyond Warhammer 40k, contemporary classical, chamber music, opera when appropriate, ambient/drone, experimental electronica and instrumental music. Screen candidates based on emotion, soundworld, availability, length, transitions and motif, not whether Jesper Kyd or Games Workshop produced them. A genre label is a discovery tool, not selection justification.

## 5. Non-negotiable duration and final-cue policy
- **No reserve just to add time.** Having 2–3 minutes under an estimated reading target is not automatically a scoring defect.
- **No padding after the ending cue.** Keep the last curated cue's dramatic function and ending timing. A long musical tail can blunt a scene's emotional closure.
- Reserve material exists only when the narrative map identifies a credible insertion point **before** the protected ending, and its texture/transitions were actually judged to fit. An optional reserve is not a mandatory Spotify addition.
- No automatic trimming based solely on runtime either; use intentional transitions.
- Prefer re-editing the sequence, replacing/shortening an earlier cue, or embracing a small silence over arbitrary duration filling.
- Never append tracks to make a target look correct. If the chapter concludes early, do not delay the final cue artificially.
- Track Spotify-resolved runtime separately from estimated reading duration and note uncertainties.
- For a future advanced player: scene-aligned/manual Final Cue can provide reader control, but never pretend automatic page sync exists.

### Enforced in runtime v0.11.4
`spotifySyncChapter` will only insert `durationReserve` if:
```js
meta.reserveMode === "narrative_insert" &&
typeof meta.reserveJustification === "string" &&
meta.reserveJustification.trim().length > 0
```
It likewise only applies `trimIndexes` if explicitly approved by `trimMode: "narrative_trim"` and a nonempty `trimJustification`.
Legacy `durationReserve` and `trimIndexes` metadata remain available but are **inert by default**. No currently designated Book V sequence has editorial approval for reserve insertion.

## 6. Confidential scene ledger (not exposed before reading)
```json
{
  "bookSlug": "example",
  "chapter": 1,
  "sceneId": "scene-03",
  "function": "social tension and theatrical display",
  "perspective": "observer, admiration with unease",
  "impliedAcoustics": "intimate hall, human audience, reverberant air",
  "energy": "low to medium, uneasy",
  "preferredCueCharacteristics": ["sparse", "performative", "not overpowering"],
  "avoid": ["literal operatic music by default", "heroic triumph", "disruptive lyrics"],
  "entryStrategy": "low intensity transition from preceding cue",
  "exitStrategy": "no abrupt change to the following dialogue",
  "endingRole": null,
  "confidence": "draft",
  "feedbackAfterReading": null
}
```
One may consider the track catalog **after** drafting this scene ledger. Spoiler-sensitive metadata and track cues are kept private until the reading clearance allows them.

## 7. QA before chapter activation
- [ ] Every important scene has a reasoned musical function, not only a genre.
- [ ] Soundworld evokes place when ambient sound effects are absent.
- [ ] Intensity balances speech/reflection/action/aftermath.
- [ ] Transitions make musical sense and retain emotional subtext.
- [ ] Final cue has a specific purpose, proper placement and protection from padding.
- [ ] Runtime measured from exact Spotify tracks, with no forced filling.
- [ ] No accidental repeat or prominent lyrics distract from prose.
- [ ] No spoiler-leaking scene labels, character images or track titles shown to reader.
- [ ] Feedback separately covers **opening, dramatic peak, ending, theatrical opportunity, atmosphere, duration and transitions**.

## 8. Reader-feedback case studies
- **Warsinger, The Flight of the Eisenstein:** missed sonic-storytelling opportunity. Its dramatic effect may be represented by otherworldly texture or specific timbral movement, not necessarily literal singing.
- **Bequa Kynska, Fulgrim Chapter I:** missed theatrical/performative opportunity. The dramatic impression and audience response should drive choice; opera is an option, not a reflex.
- **Fulgrim Chapter I:** 25-minute reading with roughly 3.5 tracks left. Do not add a reserve or automatically repeat the full 33-minute-target configuration on future chapters.
- **Garro's climactic faith sequence, Eisenstein:** "The Emperor of Mankind" happened to align with the emotional turning point; preserve such structural matches as exemplary, not as a rule to use that composer frequently.

## 9. Authoring rule
**Text → dramatic function → character perspective → implied acoustics → emotional/energy architecture → candidate cue → transition → protected ending → runtime validation.**

If the musical edit sounds like a background playlist rather than a deliberately directed scene, reconsider the choices.
