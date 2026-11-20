#!/usr/bin/env python3
"""Batch full-track QA over an independently authorized local music folder.

Spotify streaming and DRM-protected downloads are NOT valid sources. No audio
or personal file paths are included in the private JSON outputs, which are
written outside this public repository. The output is structural, not emotional.
"""
from __future__ import annotations
import argparse
import json
from pathlib import Path

import librosa

from analyze_audio import SUPPORTED, SCHEMA, analyze, sha256_file


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("audio_directory", type=Path)
    parser.add_argument("--private-output-directory", type=Path, required=True)
    parser.add_argument("--max-files", type=int, default=100)
    parser.add_argument("--confirm-authorized-audio", action="store_true", required=True)
    args = parser.parse_args()
    if not args.confirm_authorized_audio:
        parser.error("Explicit authorization for all local audio is required")
    directory = args.audio_directory.expanduser().resolve()
    output = args.private_output_directory.expanduser().resolve()
    repository_root = Path(__file__).resolve().parents[2]
    if not directory.is_dir() or output.is_relative_to(repository_root):
        parser.error("Provide an existing authorized source folder and a PRIVATE output folder")
    if not 1 <= args.max_files <= 500:
        parser.error("Maximum file count must be between 1 and 500")
    sources = sorted(p for p in directory.rglob("*")
                     if p.is_file() and p.suffix.lower() in SUPPORTED)
    if len(sources) > args.max_files:
        parser.error(f"Found {len(sources)} audio files; max is {args.max_files}. "
                     "Choose a smaller library folder or set --max-files explicitly")
    if not sources:
        parser.error("No supported full-track audio files found")
    output.mkdir(parents=True, exist_ok=True)
    analyzed = skipped = failed = 0
    for file in sources:
        digest = sha256_file(file)
        report_path = output / (digest[:24] + ".json")
        if report_path.exists():
            skipped += 1
            continue
        try:
            y, sr = librosa.load(str(file), sr=11025, mono=True)
            report = analyze(y, sr)
            report.update({
                "schema": SCHEMA,
                "authorized_local_file_sha256": digest,
                "audio_source": "independent_authorized_local_file",
                "spotify_stream_analyzed": False,
                "spotify_master_match_verified": False,
                "human_listening_verdict": "PENDING",
                "reference_spotify_uri_unverified": None,
            })
            report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) +
                                   "\n", encoding="utf-8")
            analyzed += 1
        except Exception as exc:
            failed += 1
            print("Could not analyze a local file: " + str(exc))
    print(f"Full-track profiles: {analyzed} created, {skipped} previously present, "
          f"{failed} failed. No Spotify stream accessed or music copied.")
    print(f"PRIVATE profiles directory: {output}")
    print("Critical listening and match to Spotify masters are still pending.")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
