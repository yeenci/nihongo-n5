"use client";
import React, { useState } from "react";
// import {toRomaji} from "wanakana"

const JapaneseToEnglishTranslator: React.FC = () => {
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [hiraganaText, setHiraganaText] = useState("");
  const [meaningText, setMeaningText] = useState("");
  const [loading, setLoading] = useState(false);

  const translateText = async () => {
    if (!text.trim()) return;
    setLoading(true);
  
    try {
      const [translateRes, hiraRes] = await Promise.all([
        fetch(
          `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ja&tl=en&dt=t&q=${encodeURIComponent(
            text
          )}`
        ).then((res) => res.json()),
        fetch("/api/post/kanji", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        }).then((res) => res.json()),
      ]);
  
      setTranslatedText(translateRes[0][0][0]);
      setHiraganaText(hiraRes.reading || "");
      setMeaningText(hiraRes.meaning || "");
  
      // if (hiraRes.reading) {
      //   setRomajiText(toRomaji(hiraRes.reading));
      // }
    } catch (err) {
      console.error("Error during translation:", err);
      setTranslatedText("Error");
      setHiraganaText("");
      setMeaningText("");
      // setRomajiText("");
    }
  
    setLoading(false);
  };

  const Spinner = () => (
    <div className="flex justify-center mt-4">
      <div className="h-6 w-6 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );
  
  

  return (
    <div className="p-4 max-w-xl mx-auto">
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
  
      {loading && <Spinner />}
  
      {translatedText && (
        <p className="mt-4 p-2 bg-gray-100 border rounded-md">
          <strong>Google Translate:</strong> {translatedText}
        </p>
      )}
  
      {hiraganaText && (
        <p className="mt-2 p-2 bg-green-100 border rounded-md">
          <strong>Hiragana:</strong> {hiraganaText}
        </p>
      )}
  
      {/* {romajiText && (
        <p className="mt-2 p-2 bg-purple-100 border rounded-md">
          <strong>Romaji:</strong> {romajiText}
        </p>
      )} */}
  
      {meaningText && (
        <p className="mt-2 p-2 bg-yellow-100 border rounded-md">
          <strong>Meaning:</strong> {meaningText}
        </p>
      )}
    </div>
  );
  
};

export default JapaneseToEnglishTranslator;
