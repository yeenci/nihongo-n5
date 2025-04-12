"use client";

import KanaTable from "@/app/components/kanatable";
import {
  hiragana,
  hiraganaDakuon,
  hiraganaYoon,
  katakana,
  katakanaDakuon,
  katakanaYoon,
} from "@/app/constants/alphabets";
import { useState } from "react";

export default function Alphabets() {
  const [focused, setFocused] = useState<"Hiragana" | "Katakana" | null>(null);

  const handleClick = (table: "Hiragana" | "Katakana") => {
    setFocused((prev) => (prev === table ? null : table));
  };
  return (
    <div
      className={`p-12 grid grid-cols-1 gap-4 px-4 ${
        focused ? "" : "sm:grid-cols-2 sm:px-2 sm:gap-2 md:gap-10"
      }`}
      // className="p-12 grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:px-2 sm:gap-2 md:gap-10 lg:gap-16 lg:px-16 xl:px-32 xl:gap-20"
    >
      <KanaTable
        title="Hiragana"
        alphabet={hiragana}
        dakuon={hiraganaDakuon}
        yoon={hiraganaYoon}
        isFocused={focused === "Hiragana"}
        onClick={() => handleClick("Hiragana")}
        isHidden={focused !== null && focused !== "Hiragana"}
      />
      <KanaTable
        title="Katakana"
        alphabet={katakana}
        dakuon={katakanaDakuon}
        yoon={katakanaYoon}
        isFocused={focused === "Katakana"}
        onClick={() => handleClick("Katakana")}
        isHidden={focused !== null && focused !== "Katakana"}
      />
    </div>
  );
}
