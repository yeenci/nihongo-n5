/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Flashcard from "@/app/components/flashcard";
import FlashcardButton from "@/app/components/flashcard-btn";
import ListView from "@/app/components/list-view";
import Spinner from "@/app/components/spinner";
import TOC from "@/app/components/toc";
import { vocabulary } from "@/app/constants/flashcard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
import { useLecturePartData } from "@/hooks/useLecturePartData";
import { Volume2 } from "lucide-react";
// import { speakJapanese } from "@/lib/speech";
// import { cn } from "@/lib/utils";
// import { List, SquareAsterisk, Volume2 } from "lucide-react";
import { useRef, useState } from "react";

export default function VocabularyPage() {
  const { data, loading } = useLecturePartData();

  // Table of Content Scroll
  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  // Flashcard
  const [flashcardMode, setFlashcardMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Search
  const [search] = useState("");
  const filtered = vocabulary.filter((w) =>
    [w.vocabulary, w.chinese_char, w.meaning].some((s) =>
      s.toLowerCase().includes(search.toLowerCase())
    )
  );

  // Group
  const groups = ["word", "phrase"];
  const grouped = groups.map((grp) => ({
    group: grp,
    vocabulary: filtered.filter((w) => w.group === grp),
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
            {/* <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:px-2 sm:gap-2 md:gap-10"></div> */}
            {!flashcardMode &&
              grouped.map(
                ({ group, vocabulary }) =>
                  vocabulary.length && (
                    <ListView
                      key={group}
                      vocabulary={vocabulary}
                      refs={refs}
                      group={group}
                    />
                  )
              )}
          </>
        )}
      </div>
      <div className="mt-4">
        <TOC groups={groups} scrollRefs={refs} />
      </div>
    </div>
  );
}
