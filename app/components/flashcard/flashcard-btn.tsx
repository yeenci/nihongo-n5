import { Button } from "@/components/ui/button";
import { List, SquareAsterisk } from "lucide-react";

interface flashcardProps {
  flashcardMode: boolean;
  setFlashcardMode: (value: boolean) => void;
}

export default function FlashcardButton({
  flashcardMode,
  setFlashcardMode,
}: flashcardProps) {
  return (
    <Button
      variant="outline"
      onClick={() => setFlashcardMode(!flashcardMode)}
      className=""
    >
      {flashcardMode ? (
        <>
          <List /> List Mode
        </>
      ) : (
        <>
          <SquareAsterisk /> Flashcard Mode
        </>
      )}
    </Button>
  );
}
