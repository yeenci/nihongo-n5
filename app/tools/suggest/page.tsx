/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";

const JapaneseInputSuggestion: React.FC = () => {
  const [inputText, setInputText] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!inputText.trim()) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/jisho?keyword=${encodeURIComponent(inputText)}`);
        const data = await response.json();

        if (!data || !Array.isArray(data.data)) {
          console.error("Invalid API response format:", data);
          setSuggestions([]);
          setLoading(false);
          return;
        }

        // 🔹 Only keep words that are labeled as JLPT N5
        const n5Words = data.data.filter((entry: any) => entry.jlpt?.includes("jlpt-n5"));

        const wordSuggestions = n5Words.map((entry: any) => {
          const kanji = entry.japanese?.[0]?.word || "";
          const hiragana = entry.japanese?.[0]?.reading || "";
          return kanji ? [hiragana, kanji] : [hiragana];
        });

        setSuggestions(wordSuggestions.flat());
      } catch (error) {
        console.error("Error fetching Japanese suggestions:", error);
        setSuggestions([]);
      }
      setLoading(false);
    };

    fetchSuggestions();
  }, [inputText]);

  const handleSelectSuggestion = (suggestion: string) => {
    setInputText(suggestion);
    setSuggestions([]);
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Japanese Input Suggestions (JLPT N5 Only)</h2>
      <input
        type="text"
        className="w-full p-2 border rounded-md"
        placeholder="Type in Romaji..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      {loading && <p className="text-gray-500">Loading...</p>}
      {suggestions.length > 0 && (
        <ul className="mt-2 border rounded-md bg-white shadow-md">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="p-2 cursor-pointer hover:bg-gray-200"
              onClick={() => handleSelectSuggestion(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default JapaneseInputSuggestion;
