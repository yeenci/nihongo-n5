"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Ellipsis, Languages, PawPrint, Search } from "lucide-react";
import { useState } from "react";
import Spinner from "./spinner";
import { toRomaji } from "wanakana";

export function TranslatePopup() {
  const [loading, setLoading] = useState(false);

  // input
  const [text, setText] = useState("");

  // result
  const [word, setWord] = useState("");
  const [hiraganaText, setHiraganaText] = useState("");
  const [romajiText, setRomajiText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [error, setError] = useState("");

  const translateText = async () => {
    setHiraganaText("");
    setRomajiText("");
    setTranslatedText("");
    setError("");

    if (!text.trim()) return;
    setLoading(true);

    // const keyword = extractMainWord(text);

    try {
      // Gọi API với full text để lấy reading
      const result = await fetch(`/api/post/kanji`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      }).then((res) => res.json());

      const fixedHiragana = result.reading || "";
      setWord(text);
      setHiraganaText(fixedHiragana);
      setRomajiText(toRomaji(fixedHiragana));
      setTranslatedText(result.meaning || "");

      setError("");
    } catch (error) {
      console.error("Error during translation:", error);
      setHiraganaText("");
      setRomajiText("");
      setTranslatedText("");
      setError("Error during translation!");
    }

    setLoading(false);
  };

  return (
    <div className="fixed bottom-12 right-6 z-50">
      <Popover>
        <PopoverTrigger asChild>
          <Button className="rounded-full p-3 shadow-lg " variant="secondary">
            <Languages className="w-5 h-5" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="center"
          className="w-80 mb-4 mr-6 bg-white border border-secondary rounded-md shadow-secondary p-4"
        >
          <h3 className="relative font-semibold text-primary text-xl flex justify-between">
            Meowlate
            <PawPrint width={36} height={36} className="absolute right-0" />
          </h3>

          <h6 className="text-xs mb-2 text-gray-400">
            Translate from JP to EN
          </h6>
          <div className="flex border-2 rounded-md mb-2">
            <input
              type="text"
              className="w-full resize-none text-sm p-2 border-none hover:border-none outline-none hover:outline-none"
              placeholder="Enter JP word:"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <Button variant="ghost" onClick={translateText} disabled={loading}>
              {loading ? <Ellipsis /> : <Search />}
            </Button>
          </div>

          {loading && <Spinner />}

          {/* Result */}
          {hiraganaText && romajiText && translatedText && (
            <div className="p-2">
              <h3 className="text-lg font-medium text-primary mb-1">{word}</h3>
              <p className="text-xs text-gray-500 mb-1">({hiraganaText} - {romajiText})</p>
              {/* <p className="text-xs">{romajiText}</p> */}
              <p className="font-medium text-sm text-gray-700">{translatedText}</p>
            </div>
          )}

          {error && <p className="">{error}</p>}
        </PopoverContent>
      </Popover>
    </div>
  );
}
