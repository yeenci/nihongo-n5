// 1. Fill in the blank
"use client";

import { Question } from "@/app/constants/exercise";

interface FillInTheBlankProps {
  questionData: Question;
  partId: string;
  questionId: string;
  value: string[] | string | undefined;
  onChange: (
    partId: string,
    questionId: string,
    value: string,
    blankIndex?: number
  ) => void;
  isPartSubmitted: boolean;
  result: (boolean | null) | (boolean | null)[] | undefined;
  showKana: boolean;
  getRequiredAnswers: (question: Question) => number;
}

export default function FillInTheBlank({
  questionData,
  partId,
  questionId,
  value,
  onChange,
  isPartSubmitted,
  result,
  showKana,
  getRequiredAnswers,
}: FillInTheBlankProps) {}
