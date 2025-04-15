"use client";

import Flashcard from "@/app/components/flashcard";
import FlashcardButton from "@/app/components/flashcard-btn";
import ListView from "@/app/components/list-view";
import Spinner from "@/app/components/spinner";
import TOC from "@/app/components/toc";
import { vocabulary } from "@/app/constants/flashcard";
import { useLecturePartData } from "@/hooks/useLecturePartData";
import { useRef, useState } from "react";

export default function VocabularyPage() {
  const { data, loading } = useLecturePartData();

  // Table of Content Scroll
  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  // Flashcard
  const [flashcardMode, setFlashcardMode] = useState(false);

  // Search
  const [search] = useState("");
  const filtered = vocabulary.filter((w) =>
    [w.vocabulary, w.chinese_char, w.meaning].some((s) =>
      s.toLowerCase().includes(search.toLowerCase())
    )
  );

  // type
  const types = ["Noun", "Verb", "Adjective", "Phrase"];
  const grouped = types.map((g) => ({
    type: g,
    vocabulary: filtered.filter((w) => w.type === g),
  }));

  return (
    <div className="flex flex-row h-full justify-between gap-8">
      <div className="w-6/7 md:w-4/5">
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
            {!flashcardMode &&
              grouped.map(
                ({ type, vocabulary }) =>
                  vocabulary.length > 0 && (
                    <ListView
                      key={type}
                      vocabulary={vocabulary}
                      refs={refs}
                      type={type}
                    />
                  )
              )}
          </>
        )}
      </div>
      <div className="mt-4">
        <TOC types={types} scrollRefs={refs} />
      </div>
    </div>
  );
}
