# Heresy Score MVP v0.1

Mobile-first prototype for **The Horus Heresy — Book 04: The Flight of the Eisenstein**.

## Works now
- Original grimdark UI with no official art/logos.
- 20 chapter structure.
- Chapter 1 imported as completed: 39 min + first feedback.
- Chapter 2 ready; start cue: **Darkness Between the Stars**.
- Chapters 3–20 locked until their score is prepared.
- BEGIN CHAPTER starts a timestamp-based timer, copies the start cue and opens your Spotify playlist.
- Timer stays accurate while switching to Spotify/Kindle.
- FINISH CHAPTER stores duration and opens quick feedback.
- Progress and notes stay in browser localStorage.
- PWA manifest + service worker are included for later hosting/install.

Spotify playlist:
https://open.spotify.com/playlist/2rKr6gNZuXBCIbIIU5LJyU?si=18JNKEkWR5asIwBt3CTxFg

## Local test
Run `python -m http.server 8080` in this folder, then open `http://127.0.0.1:8080`.

The HTML can also be opened directly, but install/offline PWA features require HTTP/HTTPS.

## v0.2
Spotify OAuth with Authorization Code + PKCE, active-device detection, exact chapter offset playback, playback controls and optional reading-volume preset. EQ/crossfade/normalization remain Spotify-client settings because the public playback API does not expose them.
