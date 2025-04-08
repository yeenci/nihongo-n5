import { flashcards } from "@/app/constants/flashcard";
import FlashcardList from "../../ui/flashcards/FlashcardList";
export default function Flashcard() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Flashcards</h1>
      <FlashcardList cards={flashcards} />
    </main>
  );
}
