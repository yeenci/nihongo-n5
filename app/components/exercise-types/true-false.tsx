// app/components/exercise-types/word-box.tsx
"use client";

import { Question, ExercisePart } from "@/app/constants/exercise";
import { useState } from "react";

interface TrueFalseProps {
  activePart: ExercisePart;
  question: Question;
  partId: string;
  questionId: string;
  value: string | string[] | undefined;
  onChange: (
    partId: string,
    questionId: string,
    value: string,
    blankIndex?: number
  ) => void;
  isPartSubmitted: boolean;
  result: (boolean | null) | (boolean | null)[] | undefined;
  showKana: boolean;
  getNumOfAnswers: (question: Question) => number;
}

export default function TrueFalse({
  question,
  partId,
  questionId,
  value,
  onChange,
  isPartSubmitted,
  result,
  showKana,
  getNumOfAnswers,
}: TrueFalseProps) {
  const [showEnglishMeaning, setShowEnglishMeaning] = useState(false);

  const [popupHiraganaText, setPopupHiraganaText] = useState("");
  const [popupKatakanaText, setPopupKatakanaText] = useState("");
  const [activeInputIndex, setActiveInputIndex] = useState<number | null>(null);

  return (<div></div>);
}