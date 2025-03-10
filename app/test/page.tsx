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

      console.log("Available Voices:", availableVoices);

      const femaleVoice = availableVoices.find(
        (voice) => voice.name.includes("Nanami") && voice.lang === "ja-JP"
      );

      if (femaleVoice) {
        setSelectedVoice(femaleVoice);
        console.log("Selected Voice:", femaleVoice.name);
      } else if (availableVoices.length > 0) {
        // Fallback to any Japanese voice
        const anyJapaneseVoice = availableVoices.find(
          (voice) => voice.lang === "ja-JP"
        );
        setSelectedVoice(anyJapaneseVoice || null);
        console.log("Fallback Voice:", anyJapaneseVoice?.name);
      }
    };

    // Load voices on mount and listen for changes
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Load voices immediately in case they are already available
    loadVoices();
  }, []);

  const handleTextToSpeech = () => {
    if (!text.trim()) return;

    const utterance = new SpeechSynthesisUtterance(text);

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      console.log("Using Voice:", selectedVoice.name);
    }

    utterance.lang = "ja-JP";
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

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
