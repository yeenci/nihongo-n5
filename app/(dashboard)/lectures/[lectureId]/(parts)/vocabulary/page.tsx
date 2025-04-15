"use client";

import Flashcard from "@/app/components/flashcard/flashcard";
import FlashcardButton from "@/app/components/flashcard/flashcard-btn";
import ListView from "@/app/components/list-view";
import Spinner from "@/app/components/spinner";
import { vocabulary, Vocabulary } from "@/app/constants/flashcard";
import { useLecturePartData } from "@/hooks/useLecturePartData";
import { useRef, useState } from "react";

export default function VocabularyPage() {
  const { data, loading } = useLecturePartData();

  // Table of Content Scroll

  // Flashcard
  const [flashcardMode, setFlashcardMode] = useState(false);

  // Search
  const [search] = useState("");

  return (
    <div className="flex flex-row h-full justify-center w-full">
      <div className="w-full lg:w-4/5 xl:w-3/5 2xl:w-1/2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold my-4 text-primary">Vocabulary</h1>
          {!loading && data && (
            <FlashcardButton
              flashcardMode={flashcardMode}
              setFlashcardMode={setFlashcardMode}
            />
          )}
        </div>

        {loading && <Spinner />}
        {!loading && data && (
          <>
            {flashcardMode && (
              <Flashcard vocabulary={vocabulary} search={search} />
            )}
            {!flashcardMode && <ListView vocabulary={vocabulary} />}
          </>
        )}
      </div>
    </div>
  );
}
