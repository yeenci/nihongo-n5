/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useState } from "react";

const RomajiToHiragana: React.FC = () => {
  const [text, setText] = useState("");
  const [transcribedText, setTranscribedText] = useState("");

  const transcribe = (input: string): string => {
    let car = input.toLowerCase();

    // Long vowel replacements
    // car = car.replace(/_/g, "ー");
    // car = car.replace(/[ôō]/g, "oう");
    // car = car.replace(/[ūû]/g, "uう");
    // car = car.replace(/[âā]/g, "aあ");
    // car = car.replace(/[îī]/g, "iい");
    // car = car.replace(/[êē]/g, "eい");

    // Specific romaji-to-hiragana conversions
    const replaceJapan: [RegExp, string][] = [
      [/_/g, "ー"],
      [/[âā]/g, "aあ"], [/[îī]/g, "iい"], [/[ūû]/g, "uう"], [/[êē]/g, "eい"], [/[ôō]/g, "oう"],
      [/n/g, "ん"],
      [/wa/g, "わ"], [/wo/g, "を"],
      [/ra/g, "ら"], [/ri/g, "り"], [/ru/g, "る"], [/re/g, "れ"], [/ro/g, "ろ"],
      [/pya/g, "ぴゃ"], [/pyu/g, "ぴゅ"], [/pyo/g, "ぴょ"],
      [/bya/g, "びゃ"], [/byu/g, "びゅ"], [/byo/g, "びょ"],
      [/ja/g, "ぢゃ"], [/ju/g, "ぢゅ"], [/jo/g, "ぢょ"],
      [/ja/g, "じゃ"], [/ju/g, "じゅ"], [/jo/g, "じょ"],
      [/gya/g, "ぎゃ"], [/gyu/g, "ぎゅ"], [/gyo/g, "ぎょ"],
      [/rya/g, "りゃ"], [/ryu/g, "りゅ"], [/ryo/g, "りょ"],
      [/mya/g, "みゃ"], [/myu/g, "みゅ"], [/myo/g, "みょ"],
      [/hya/g, "ひゃ"], [/hyu/g, "ひゅ"], [/hyo/g, "ひょ"],
      [/nya/g, "にゃ"], [/nyu/g, "にゅ"], [/nyo/g, "にょ"], [/んya/g, "にゃ"], [/んyu/g, "にゅ"], [/んyo/g, "にょ"],
      [/cha/g, "ちゃ"], [/chu/g, "ちゅ"], [/cho/g, "ちょ"],
      [/sha/g, "しゃ"], [/shu/g, "しゅ"], [/sho/g, "しょ"],
      [/kya/g, "きゃ"], [/kyu/g, "きゅ"], [/kyo/g, "きょ"],
      [/ya/g, "や"], [/yu/g, "ゆ"], [/yo/g, "よ"],
      [/ma/g, "ま"], [/mi/g, "み"], [/mu/g, "む"], [/me/g, "め"], [/mo/g, "も"],
      [/pa/g, "ぱ"], [/pi/g, "ぴ"], [/pu/g, "ぷ"], [/pe/g, "ぺ"], [/po/g, "ぽ"],
      [/ba/g, "ば"], [/bi/g, "び"], [/bu/g, "ぶ"], [/be/g, "べ"], [/bo/g, "ぼ"],
      [/ha/g, "は"], [/hi/g, "ひ"], [/fu/g, "ふ"], [/he/g, "へ"], [/ho/g, "ほ"], [/hu/g, "ふ"],
      [/んa/g, "な"], [/んi/g, "に"], [/んu/g, "ぬ"], [/んe/g, "ね"], [/んo/g, "の"],
      [/da/g, "だ"], [/ji/g, "ぢ"], [/zu/g, "づ"], [/de/g, "て"], [/do/g, "ど"], [/di/g, "ぢ"], [/du/g, "づ"],
      [/ta/g, "た"], [/ti/g, "ち"], [/tu/g, "つ"], [/te/g, "て"], [/to/g, "と"], [/chi/g, "ち"], [/cひ/g, "ち"], [/tsu/g, "つ"],
      [/za/g, "ざ"], [/ji/g, "じ"], [/zu/g, "ず"], [/ze/g, "ぜ"], [/zo/g, "ぞ"], [/zi/g, "じ"],
      [/sa/g, "さ"], [/si/g, "し"], [/su/g, "す"], [/se/g, "せ"], [/so/g, "そ"], [/shi/g, "し"], [/sひ/g, "し"],
      [/ga/g, "が"], [/gi/g, "ぎ"], [/gu/g, "ぐ"], [/ge/g, "げ"], [/go/g, "ご"],
      [/ka/g, "か"], [/ki/g, "き"], [/ku/g, "く"], [/ke/g, "け"], [/ko/g, "こ"],
      [/a/g, "あ"], [/i/g, "い"], [/u/g, "う"], [/e/g, "え"], [/o/g, "お"],
    ];

    replaceJapan.forEach(([pattern, replacement]) => {
      car = car.replace(pattern, replacement);
    });

    return car;
  };

  const textRoman = (input: string): string => {
    let car = input.toLowerCase();
    const replaceText: [string, string][] = [
        ["hu", "fu"],
        ["ti", "chi"], ["tu", "tsu"],
        ["si", "shi"],
        ["zi", "ji"],
        ["di", "ji"], ["du", "zu"],

    ];

    replaceText.forEach(([pattern, replacement]) => {
      car = car.replace(pattern, replacement);
    });

    return car;
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Romaji to Hiragana Converter</h2>
      <textarea
        className="w-full p-2 border rounded-md"
        rows={3}
        placeholder="Enter Romaji"
        value={text}
        onChange={(e) => {
        //   setText(e.target.value);
          setText(textRoman(e.target.value));
          setTranscribedText(transcribe(e.target.value)); // Convert in real-time
        }}
      />
      <div className="mt-2 p-2 border rounded-md bg-gray-100" >{transcribedText}</div>
    </div>
  );
};

export default RomajiToHiragana;
