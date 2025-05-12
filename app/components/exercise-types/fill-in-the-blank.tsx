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
    idx?: number
  ) => void;
  isPartSubmitted: boolean;
  result: (boolean | null) | (boolean | null)[] | undefined;
  showKana: boolean;
  getNumOfAnswers: (question: Question) => number;
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
  getNumOfAnswers,
}: FillInTheBlankProps) {
  return (<div>Examples? Fill In The Blank</div>)
}
