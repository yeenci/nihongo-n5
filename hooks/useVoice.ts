"use client";

import { useEffect, useState } from "react";

export function useVoiceFemale() {
  const [femaleVoice, setJpVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    const tryLoadVoices = () => {
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        const voice =
          voices.find(
            (v) =>
              v.name.includes("Nanami") ||
              (v.name.includes("Kyoko") && v.lang === "ja-JP")
          ) || voices.find((v) => v.lang === "ja-JP");
        setJpVoice(voice || null);
      } else {
        // Try again shortly
        setTimeout(tryLoadVoices, 100);
      }
    };

    tryLoadVoices();
  }, []);

  return { femaleVoice };
}


export function useVoiceMale() {
  const [maleVoice, setJpVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    const tryLoadVoices = () => {
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        const voice =
          voices.find(
            (v) =>
              (v.name.includes("Otoya") || v.name.includes("Ichiro")) &&
              v.lang === "ja-JP"
          ) || voices.find((v) => v.lang === "ja-JP");
        setJpVoice(voice || null);
      } else {
        setTimeout(tryLoadVoices, 100);
      }
    };

    tryLoadVoices();
  }, []);

  return { maleVoice };
}
