import { cn } from "@/lib/utils";

type Vocab = {
  // id: string;
  vocabulary: string;
  chinese_char: string;
  yin_han: string;
  meaning: string;
  group: "word" | "phrase";
};

interface FlashcardProps {
  isFlipped: boolean;
  setIsFlipped: (value: boolean) => void;
  currentItem: Vocab | null;
}

export default function Flashcard({ isFlipped, setIsFlipped, currentItem }: FlashcardProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 mt-8">
      <div
        className="relative w-full sm:w-[300px] h-[180px] [perspective:1000px]"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className={cn(
            "relative w-full h-full duration-500 transform-style-preserve-3d",
            isFlipped ? "rotate-y-180" : ""
          )}
        >
          {/* Front = Vocabulary */}
          <div className="absolute w-full h-full bg-card rounded-2xl shadow p-6 flex flex-col justify-center items-center backface-hidden">
            <p className="text-2xl font-bold mb-2">
              【{currentItem.chinese_char}】{currentItem.vocabulary}
            </p>
            <p className="text-sm text-muted-foreground">{currentItem.group}</p>
          </div>

          {/* Back = Meaning */}
          <div className="absolute w-full h-full bg-card rounded-2xl shadow p-6 flex flex-col justify-center items-center transform rotate-y-180 backface-hidden">
            <p className="text-2xl font-bold mb-2">
              【{currentItem.yin_han}】{currentItem.meaning}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
