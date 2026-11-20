#!/usr/bin/env python3
"""Analyze FULL authorized local audio for musical changes, never Spotify streams.

Requires librosa, numpy and soundfile; no audio/lyrics or personal file paths
are exported. An audio profile is descriptive DSP evidence, NOT emotional
approval or proof that Spotify uses the identical mastering.
Example:
  python tools/audio-qa/analyze_audio.py ~/Music/authorized.wav \
    --output ~/private-heresy-qa/profile.json --confirm-authorized-audio
"""
from __future__ import annotations
import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

import numpy as np

SCHEMA = "heresy-score-local-full-audio-qa-v1"
SUPPORTED = {".wav", ".flac", ".aiff", ".aif", ".ogg", ".mp3", ".m4a"}


def db(amplitude: float) -> float:
    return float(20 * np.log10(max(float(amplitude), 1e-8)))


def analyze(samples: np.ndarray, sr: int, window_seconds: float = 8.0) -> dict[str, Any]:
    """Scan the entire recording, flagging *possible* structural changes."""
    if samples.ndim != 1 or sr <= 0 or samples.size < sr:
        raise ValueError("Requires a mono full-audio waveform of at least 1 s")
    if not np.isfinite(samples).all():
        raise ValueError("Waveform has nonfinite values")
    if not 2 <= window_seconds <= 30:
        raise ValueError("Window size must be between 2 and 30 seconds")

    import librosa
    hop, frame = 512, 2048
    length_s = float(len(samples) / sr)
    rms = librosa.feature.rms(y=samples, frame_length=frame, hop_length=hop)[0]
    centroid = librosa.feature.spectral_centroid(y=samples, sr=sr,
                                                n_fft=frame, hop_length=hop)[0]
    onset = librosa.onset.onset_strength(y=samples, sr=sr, hop_length=hop)
    n = min(len(rms), len(centroid), len(onset))
    times = librosa.frames_to_time(np.arange(n), sr=sr, hop_length=hop)
    rms, centroid, onset = rms[:n], centroid[:n], onset[:n]
    onset_p95 = max(float(np.percentile(onset, 95)), 1e-5)

    windows = []
    for start in np.arange(0.0, length_s, window_seconds):
        end = min(length_s, float(start + window_seconds))
        indices = np.flatnonzero((times >= start) & (times < end))
        if not len(indices):
            continue
        windows.append({
            "start_s": round(float(start), 2),
            "end_s": round(end, 2),
            "rms_dbfs": round(db(float(np.sqrt(np.mean(rms[indices] ** 2)))), 2),
            "spectral_centroid_hz": round(float(np.median(centroid[indices]))),
            "onset_strength_relative": round(
                min(1.0, float(np.mean(onset[indices])) / onset_p95), 3),
        })
    if not windows:
        raise ValueError("Could not measure complete audio")
    levels = np.asarray([w["rms_dbfs"] for w in windows])
    centroid_hz = np.asarray([w["spectral_centroid_hz"] for w in windows])
    opening = float(np.median(levels[:max(1, len(levels) // 4)]))
    mid = float(np.median(levels))
    for w in windows:
        w["vs_opening_db"] = round(w["rms_dbfs"] - opening, 2)
        w["vs_track_median_db"] = round(w["rms_dbfs"] - mid, 2)

    changes = []
    for i in range(1, len(windows)):
        jump = float(levels[i] - levels[i - 1])
        brightness_ratio = float(centroid_hz[i] / max(40, centroid_hz[i - 1]))
        loudness_change = abs(jump) >= 5.5
        timbral_change = brightness_ratio >= 1.8 or brightness_ratio <= 0.55
        if not (loudness_change or timbral_change):
            continue
        direction = "rise" if jump >= 2 else "fall" if jump <= -2 else "timbre_shift"
        changes.append({
            "at_s": windows[i]["start_s"],
            "direction": direction,
            "loudness_jump_db": round(jump, 2),
            "brightness_ratio": round(brightness_ratio, 2),
            "trigger": "both" if loudness_change and timbral_change
                       else "loudness" if loudness_change else "timbre",
        })

    dynamic = float(np.percentile(levels, 90) - np.percentile(levels, 10))
    flags = []
    if any(w["vs_opening_db"] >= 8 and w["start_s"] >= length_s * 0.5
           for w in windows):
        flags.append("strong_second_half_vs_opening")
    if any(c["direction"] == "rise" and c["loudness_jump_db"] >= 8
           for c in changes):
        flags.append("abrupt_loudness_rise")
    if dynamic >= 12:
        flags.append("large_within_track_dynamic_range")
    if any(c["direction"] == "timbre_shift" for c in changes):
        flags.append("timbre_changes_without_major_loudness_change")
    return {
        "duration_s": round(length_s, 2),
        "sample_rate_hz": sr,
        "window_seconds": window_seconds,
        "dynamic_range_p90_p10_db": round(dynamic, 2),
        "windows": windows,
        "change_candidates": changes,
        "risk_flags": flags,
        "requires_human_listening": True,
        "limitations": (
            "Energy, onset and brightness are NOT emotion, instrument, combat, "
            "or narrative-role classifiers. A different Spotify master may have "
            "different dynamics. Human listening is still necessary."
        ),
    }


def sha256_file(file: Path) -> str:
    digest = hashlib.sha256()
    with file.open("rb") as handle:
        while block := handle.read(1024 * 1024):
            digest.update(block)
    return digest.hexdigest()


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("audio_file", type=Path)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--window-seconds", type=float, default=8.0)
    parser.add_argument("--spotify-uri", default=None)
    parser.add_argument("--confirm-authorized-audio", action="store_true", required=True)
    args = parser.parse_args()
    if not args.confirm_authorized_audio:
        parser.error("Analyze only an independently obtained, authorized audio file")
    path = args.audio_file.expanduser().resolve()
    if not path.is_file() or path.suffix.lower() not in SUPPORTED:
        parser.error("Supply an authorized WAV/FLAC/AIFF/OGG/MP3/M4A file")
    if args.spotify_uri:
        track_id = args.spotify_uri.removeprefix("spotify:track:")
        if (not args.spotify_uri.startswith("spotify:track:") or
                len(track_id) != 22 or not track_id.isalnum()):
            parser.error("Invalid reference Spotify URI")
    import librosa
    samples, sr = librosa.load(str(path), sr=11025, mono=True)
    report = analyze(samples, sr, args.window_seconds)
    report.update({
        "schema": SCHEMA,
        "reference_spotify_uri_unverified": args.spotify_uri,
        "authorized_local_file_sha256": sha256_file(path),
        "audio_source": "independent_authorized_local_file",
        "spotify_stream_analyzed": False,
        "spotify_master_match_verified": False,
        "human_listening_verdict": "PENDING",
    })
    output = args.output.expanduser().resolve()
    # A private fingerprint and derived timeline should not accidentally be
    # committed to a public GitHub repository.
    repository_root = Path(__file__).resolve().parents[2]
    if output.is_relative_to(repository_root):
        parser.error("Write private audio reports outside the repository")
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n",
                      encoding="utf-8")
    print(f"Analyzed {report['duration_s']} s of FULL authorized audio; "
          f"{len(report['change_candidates'])} structural changes, "
          f"{len(report['risk_flags'])} risk flags.")
    print(f"Private profile: {output}")
    print("Not yet approved: full-track human listening and Spotify master matching.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
