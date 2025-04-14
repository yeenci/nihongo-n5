"use client";

import { useEffect, useState } from "react";

export function useVoiceFemale() {
  const [jpVoice, setJpVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      const voice =
        voices.find(
          (v) =>
            v.name.includes("Nanami") ||
            (v.name.includes("Kyoko") && v.lang === "ja-JP")
        ) || voices.find((v) => v.lang === "ja-JP");
      setJpVoice(voice || null);
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  return { jpVoice };
}

export function useVoiceMale() {
  const [jpVoice, setJpVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      const voice =
        voices.find((v) => v.lang === "ja-JP");
      setJpVoice(voice || null);
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  return { jpVoice };
}