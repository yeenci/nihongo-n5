// 4. Word Box sentence

import { Question } from "@/app/constants/exercise";
import { useState } from "react";

interface WordBoxProps {
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

interface WordToken {
  text: string;
  id: number;
}

export default function WordBox({
  question,
  partId,
  questionId,
  value,
  onChange,
  isPartSubmitted,
  result,
  showKana,
  getNumOfAnswers,
}: WordBoxProps) {
  const [showEnglishMeaning, setShowEnglishMeaning] = useState(false);}