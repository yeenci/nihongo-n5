"use client";
import React, { useState } from "react";

const JapaneseToEnglishTranslator: React.FC = () => {
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);

  const translateText = async () => {
    if (!text.trim()) return;
    setLoading(true);

    try {
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ja&tl=en&dt=t&q=${encodeURIComponent(
          text
        )}`
      );

      const result = await response.json();
      setTranslatedText(result[0][0][0]);
    } catch (error) {
      console.error("Translation error:", error);
      setTranslatedText("Error translating text");
    }
    setLoading(false);
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Japanese to English Translator</h2>
      <textarea
        className="w-full p-2 border rounded-md"
        rows={3}
        placeholder="Enter Japanese text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        className="mt-2 p-2 bg-blue-500 text-white rounded-md"
        onClick={translateText}
        disabled={loading}
      >
        {loading ? "Translating..." : "Translate"}
      </button>
      {translatedText && (
        <p className="mt-4 p-2 bg-gray-100 border rounded-md">
          Translation: {translatedText}
        </p>
      )}
    </div>
  );
};

export default JapaneseToEnglishTranslator;
