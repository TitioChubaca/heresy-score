"""Regression checks for a FULL local audio profile, using synthetic sounds only."""
from __future__ import annotations

import importlib.util
from pathlib import Path
import unittest

import numpy as np

SOURCE = Path(__file__).resolve().parent.parent / "tools" / "audio-qa" / "analyze_audio.py"
spec = importlib.util.spec_from_file_location("heresy_audio_qa", SOURCE)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class TestFullTrackAudioQA(unittest.TestCase):
    def test_detects_mid_song_rise_and_drop(self):
        sr = 11025
        generator = np.random.default_rng(10)

        def tone(seconds, amplitude, frequency, noise=0.0):
            time = np.arange(int(seconds * sr)) / sr
            return (amplitude * np.sin(2 * np.pi * frequency * time) +
                    noise * generator.normal(size=time.size)).astype("float32")

        # This synthetic 72s track deliberately changes in the middle.
        samples = np.concatenate([
            tone(24, 0.03, 440),
            tone(24, 0.35, 1960, noise=0.1),
            tone(24, 0.03, 440),
        ])
        report = module.analyze(samples, sr, window_seconds=8)
        self.assertEqual(report["duration_s"], 72.0)
        self.assertIn("strong_second_half_vs_opening", report["risk_flags"])
        self.assertIn("abrupt_loudness_rise", report["risk_flags"])
        self.assertTrue(any(c["direction"] == "rise" and
                            abs(c["at_s"] - 24) <= 8
                            for c in report["change_candidates"]))
        self.assertTrue(any(c["direction"] == "fall" and
                            abs(c["at_s"] - 48) <= 8
                            for c in report["change_candidates"]))
        self.assertTrue(report["requires_human_listening"])

    def test_uniform_music_not_falsely_swelled(self):
        sr = 11025
        time = np.arange(sr * 32) / sr
        samples = (0.1 * np.sin(2 * np.pi * 440 * time)).astype("float32")
        report = module.analyze(samples, sr)
        self.assertNotIn("strong_second_half_vs_opening", report["risk_flags"])
        self.assertLess(report["dynamic_range_p90_p10_db"], 3)

    def test_reject_short_invalid_audio(self):
        with self.assertRaises(ValueError):
            module.analyze(np.zeros(1000, dtype="float32"), 11025)
        with self.assertRaises(ValueError):
            module.analyze(np.full(22050, np.nan), 11025)


if __name__ == "__main__":
    unittest.main()
