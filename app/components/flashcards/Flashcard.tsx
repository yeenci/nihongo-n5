"use client";

import { FlashcardType } from "@/app/constants/vocabulary";

type Props = {
  card: FlashcardType;
  flipped: boolean;
  flipMode: boolean;
  onFlip: () => void;
};

export default function Flashcard({ card, flipped, flipMode, onFlip }: Props) {
  const showFront = flipMode ? card.back : card.front;
  const showBack = flipMode ? card.front : card.back;

  return (
    <div
      onClick={onFlip}
      className="w-64 h-40 bg-white rounded shadow-md flex items-center justify-center cursor-pointer text-2xl font-semibold transition-transform duration-300 text-center border"
    >
      {flipped ? showBack : showFront}
    </div>
  );
}
