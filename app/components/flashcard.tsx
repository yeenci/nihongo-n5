import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Star, Volume2 } from "lucide-react";
import { useState } from "react";
import { Vocab } from "../constants/flashcard";
import { speakJapanese } from "@/lib/speech";
import { useVoiceFemale } from "@/hooks/useVoice";

interface FlashcardProps {
  vocab: Vocab[];
}

export default function Flashcard({ vocab }: FlashcardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Search
  const [search] = useState("");
  const filtered = vocab.filter((w) =>
    [w.vocabulary, w.chinese_char, w.meaning].some((s) =>
      s.toLowerCase().includes(search.toLowerCase())
    )
  );

  const currentItem = filtered[currentIndex] || null;

  const { jpVoice } = useVoiceFemale();

  return (
    <div className="flex flex-col items-center justify-center space-y-4 mt-8">
      <div className="relative w-full sm:w-[500px] h-[300px] [perspective:1000px]">
        <div
          className={cn(
            "relative w-full h-full duration-500 transform-style-preserve-3d cursor-pointer",
            isFlipped ? "rotate-y-180" : ""
          )}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* Front = Vocabulary */}
          <div className="absolute w-full h-full bg-card rounded-2xl shadow-lg p-6 flex flex-col justify-center items-center backface-hidden">
            <p className="text-2xl font-bold mb-2">
              【{currentItem.chinese_char}】{currentItem.vocabulary}
            </p>
            <p className="text-sm text-muted-foreground">{currentItem.group}</p>
            <div className="fixed right-2 top-2">
              <Button
                variant={"ghost"}
                className=""
                onClick={(e) => {
                  e.stopPropagation();
                  speakJapanese(currentItem.vocabulary, jpVoice ?? undefined);
                }}
              >
                <Volume2 />
              </Button>
              <Button variant={"ghost"} className="">
                <Star />
              </Button>
            </div>
          </div>

          {/* Back = Meaning */}
          <div className="absolute w-full h-full bg-card rounded-2xl shadow-lg p-6 flex flex-col justify-center items-center transform rotate-y-180 backface-hidden">
            <p className="text-2xl font-semi mb-2">
              【{currentItem.yin_han}】{currentItem.meaning}
            </p>
          </div>
        </div>

        <div className="flex gap-4 justify-center items-center pt-4">
          <Button
            variant="outline"
            onClick={() => {
              setCurrentIndex((prev) => Math.max(0, prev - 1));
              setIsFlipped(false);
            }}
            disabled={currentIndex === 0}
            className="w-18 h-12"
          >
            <ArrowLeft />
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              setCurrentIndex((prev) =>
                Math.min(filtered.length - 1, prev + 1)
              );
              setIsFlipped(false);
            }}
            disabled={currentIndex === filtered.length - 1}
            className="w-18 h-12"
          >
            <ArrowRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
