"use client";

import { FlashcardType } from "@/app/constants/flashcard";
import { useState } from "react";

export default function Flashcard({ card }: { card: FlashcardType }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      onClick={() => setFlipped(!flipped)}
      className="w-64 h-40 bg-white rounded shadow-md flex items-center justify-center cursor-pointer text-2xl font-semibold transition-transform duration-300 text-center border"
    >
        {flipped ? card.back : card.front}
    </div>
  );
}
