/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";

const JapaneseTextToSpeech: React.FC = () => {
  const [text, setText] = useState("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
      console.log("Available voices:", availableVoices);

      // 1️⃣ Try to find a female Japanese voice (Nanami or Kyoko)
      let japaneseVoice = availableVoices.find(
        (voice) =>
          (voice.name.includes("Nanami") || voice.name.includes("Kyoko")) &&
          voice.lang === "ja-JP"
      );

      // 2️⃣ If Nanami/Kyoko is not found, fallback to any Japanese voice
      if (!japaneseVoice) {
        japaneseVoice = availableVoices.find((voice) => voice.lang === "ja-JP");
      }

      // 3️⃣ If no Japanese voice is found, leave selectedVoice as null
      setSelectedVoice(japaneseVoice || null);
      console.log("Selected Voice:", japaneseVoice?.name || "None");
    };

    // Load voices immediately
    loadVoices();

    // Ensure voices are properly loaded on iOS
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const handleTextToSpeech = () => {
    if (!text.trim()) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP";
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      console.log("Using Voice:", selectedVoice.name);
    }

    speechSynthesis.speak(utterance);
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Japanese Text-to-Speech</h2>
      <textarea
        className="w-full p-2 border rounded-md"
        rows={3}
        placeholder="Enter Japanese text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button
        variant="outline"
        className="mt-2 p-2 bg-blue-500 text-white rounded-md"
        onClick={handleTextToSpeech}
      >
        Convert to Speech
      </Button>
    </div>
  );
};

export default JapaneseTextToSpeech;
