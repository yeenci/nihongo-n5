import { Question } from "@/app/constants/exercise";
import { useMemo, useState } from "react";

interface AnswerInputProps {
  questionData: Question;
  showKana: boolean;
  value: string | string[] | undefined;
  result: (boolean | null) | (boolean | null)[] | undefined;
  isPartSubmitted: boolean;

  partId: string;
  questionId: string;
  getNumOfAnswers: (question: Question) => number;

  onChange: (
    partId: string,
    questionId: string,
    value: string,
    idx?: number
  ) => void;
}

export function AnswerInput({
  questionData,
  showKana,
  value,
  result,
  isPartSubmitted,
  partId,
  questionId,
  getNumOfAnswers,
  onChange,
}: AnswerInputProps) {
  // Popup
  const [popupHiraganaText, setPopupHiraganaText] = useState("");
  const [popupKatakanaText, setPopupKatakanaText] = useState("");
  const [activeInputIndex, setActiveInputIndex] = useState<number | null>(null);

  const displayQuestion = useMemo(
    () =>
      showKana &&
      questionData.question_kana &&
      questionData.options_kana &&
      questionData.paragraph_kana &&
      questionData.answer_kana
        ? questionData.question_kana &&
          questionData.options_kana &&
          questionData.paragraph_kana &&
          questionData.answer_kana
        : questionData.question &&
          questionData.options &&
          questionData.paragraph &&
          questionData.answer,
    [showKana, questionData]
  );

  const num
}
