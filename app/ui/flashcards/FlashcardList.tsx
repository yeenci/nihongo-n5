"use client";

import { FlashcardType } from "@/app/constants/flashcard";
import { useState } from "react";
import Flashcard from "./Flashcard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function FlashcardList({ cards }: { cards: FlashcardType[] }) {
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => (i - 1 + cards.length) % cards.length);
  const next = () => setIndex((i) => (i + 1) % cards.length);

  return (
    <div className="flex flex-col items-center gap-4">
      <Flashcard card={cards[index]} />
      <div className="flex gap-4">
        <Button variant="outline" className="px-4 py-2 border rounded" onClick={prev}>
          <ChevronLeft />
        </Button>
        <Button variant="outline" className="px-4 py-2 border rounded" onClick={next}>
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
