"use client";

import { FlashcardType } from "@/app/constants/flashcard";
import { useState } from "react";
import Flashcard from "./Flashcard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function FlashcardList({ cards }: { cards: FlashcardType[] }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [flipMode, setFlipMode] = useState(false);

  const goTo = (i: number) => {
    setIndex(i);
    setFlipped(false);
  };

  const prev = () => goTo((index - 1 + cards.length) % cards.length);
  const next = () => goTo((index + 1) % cards.length);

  return (
    <div className="flex flex-col items-center gap-4">
      <Flashcard
        card={cards[index]}
        flipped={flipped}
        flipMode={flipMode}
        onFlip={() => setFlipped((f) => !f)}
      />
      <div className="flex gap-4">
        <Button
          variant="outline"
          className="px-4 py-2 border rounded"
          onClick={prev}
        >
          <ChevronLeft />
        </Button>
        <Button
          variant="outline"
          className="px-4 py-2 border rounded"
          onClick={next}
        >
          <ChevronRight />
        </Button>
        <Button
          variant="default"
          className="px-4 py-2 border rounded"
          onClick={() => setFlipMode((m) => !m)}
        >
          {flipMode ? "English → Japanese" : "Japanese → English"}
        </Button>
      </div>
    </div>
  );
}
