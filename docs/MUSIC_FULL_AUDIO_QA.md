# Heresy Score — Full-track music QA without Spotify audio ingestion

Last updated: 2026-11-20. Status: **tool implemented; no six Prelude recordings analyzed**.

## The problem

A Spotify playlist can match the reader's time to within seconds yet mismatch the
narrative if a recording changes energy, instrumentation or atmosphere halfway.
Title, composer, duration, and even an intro preview CANNOT establish full-track
appropriateness. Earlier Fulgrim sessions demonstrated this problem.

## Platform limitations (not a temporary bug)

Spotify Web API exposes recording identifiers, metadata, playlist contents,
durations and controlled playback; it does not provide raw full-track PCM files.
Spotify's developer policy prohibits ingesting Spotify Content into AI/ML
models. Audio Features and Audio Analysis endpoints were restricted in 2024.
Do NOT record/rip Spotify, bypass DRM, or train/analyze AI using Spotify
streaming content as a workaround.

Official sources:
- https://developer.spotify.com/policy
- https://developer.spotify.com/blog/2024-11-27-changes-to-the-web-api
- https://developer.spotify.com/documentation/web-api/concepts/playlists

## Viable separate audio pipeline

The editor can process **independently obtained and authorized full audio
files** locally, such as properly licensed DRM-free soundtrack files or
artist-permitted material. Nothing is streamed, downloaded from Spotify or
uploaded to Heresy Score. The sound files remain outside this public repo.

Run from a trusted computer containing the authorized soundtrack files:

```bash
python -m pip install -r tools/audio-qa/requirements.txt
python tools/audio-qa/analyze_audio.py /private/music/authorized-track.flac \
  --spotify-uri spotify:track:EXACT22CHARTRACKID \
  --output /private/heresy-audio-qa/track-profile.json \
  --confirm-authorized-audio
```

Batch processing is also supported, so the reader does **not** need to
upload or open every song individually. If an independent, authorized
soundtrack directory is available:

```bash
python tools/audio-qa/analyze_library.py /private/authorized-soundtracks \
  --private-output-directory /private/heresy-audio-qa \
  --max-files 150 --confirm-authorized-audio
```

The batch tool scans each full track and writes private JSON metadata keyed
by SHA-256, without copying the sound file. It skips previously scanned
files. It does NOT fetch tracks from Spotify, match different masters or
automatically approve soundtrack candidates. Source availability remains
the blocker for the six selected Prelude OST tracks.

The Spotify URI is merely a reference label; it does not prove the independent
recording and the Spotify master are identical. Never assume a shared title
means a shared version, mix, duration or dynamic range.

### What the analyzer measures

The whole waveform is decoded, not just 30-second previews. Fixed windows
(default 8 seconds) record:
- RMS sound level in decibels (changes in loudness / swells);
- spectral centroid (relative brightness / timbral changes);
- normalized onset strength (rough rhythm/transient activity);
- large changes between windows, late swells and broad dynamic range.

These can identify a calm intro that suddenly becomes loud at minute two and
can flag time positions for deeper musical review. Synthetic quiet → intense →
quiet unit tests have passed using a separate local prototype of this method.

**These measurements DO NOT establish:** epic/violent/sad/happy mood,
instrumentation identity, story fit, which event the music implies, or whether
a Spotify account plays precisely the analyzed master. Stable loudness does
not mean stable emotion; scene matching needs critical full-track listening.

### Approval gates

1. **Spotify technical verification:** exact URI, artist, recording duration,
   order, and API readback. No music quality statement.
2. **Local full-track structural profile:** authorized audio measured end-to-end,
   changes and review timestamps identified. No emotional approval.
3. **Full critical audition:** transitions and middle/end of every recording
   evaluated for narrative role and emotional intensity. Reject unexpected
   crescendos or dialogue-obscuring sections. Use the private textual scene
   map, without publishing book spoilers.
4. **Editorial approval:** explicitly approved track plus alternative of
   *similar narrative function*, with expected time positions and a revision
   note. Only then promote from PILOT to approved.

### Current Prelude / Book VI

The app explicitly shows three separate counters: full-track structural scan, full critical audition, and editorial approval. All are 0/6 until evidence exists. The scene-selection engine can reject a quiet-scene candidate if its full-audio profile flags an abrupt or late swell; the track's introduction and total runtime cannot override that warning.

Six exact URI references exist with a technical target of 16:26 and public
song durations totaling 16:38. **Zero of six have full-audio structural QA or
full critical audition in this repository.** The app shows separate counters.
They remain PILOT_FULL_AUDIO_UNVERIFIED; successful Spotify timing cannot
promote them to approved music.

No future Descent of Angels plot, person, scene, or soundtrack information
may be committed before the reader unlocks it. The private music/scene map
continues outside GitHub.

### Playlist creation preference

The **default is automatic**: the app creates a non-public playlist the first
time a score is audited and reuses its ID. Users do not need to create an empty
playlist or copy any links. Optional manual linking remains collapsed under
Advanced Settings for users who expressly want it.

The Spotify Web API cannot create or move playlists into folders. Native
Spotify folders, if desired, require organization in Spotify's UI. Do not
silently replace the per-chapter playlist model with a mutable single
playlist per book because that would break historical playback links.

### Next practical dependency

To analyze the currently selected six copyrighted OST recordings rather than
only a synthetic sound sample, the project needs access to authorized full
audio files independently of Spotify. A one-time local soundtrack directory
can be analyzed in batch later; the app must never ask the reader to press
musical-transition buttons during reading. No source audio should be uploaded
to the public repository.
