// 1. Fill in the blank

"use client";

import { Question } from "@/app/constants/exercise";
import { useCallback, useMemo } from "react";
import { AnswerInput } from "../answer-input";

interface FillInTheBlankProps {
  questionData: Question;
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
  getExpectedAnswerCount: (question: Question) => number;
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
  getExpectedAnswerCount,
}: FillInTheBlankProps) {
  const expectedInputs = useMemo(
    () => getExpectedAnswerCount(questionData),
    [getExpectedAnswerCount, questionData]
  );

  const resultsArray = useMemo(() => {
    const baseArray = Array.isArray(result)
      ? result
      : result !== undefined
      ? [result]
      : [];

    const filledArray = Array(expectedInputs)
      .fill(null)
      .map((_, i) => baseArray[i] ?? null);

    return filledArray;
  }, [result, expectedInputs]);

  const isOverallCorrect = useMemo(
    () =>
      isPartSubmitted &&
      resultsArray.length === expectedInputs &&
      resultsArray.every((r) => r === true),
    [isPartSubmitted, resultsArray, expectedInputs]
  );

  const isAnyIncorrect = useMemo(
    () => isPartSubmitted && resultsArray.some((r) => r === false),
    [isPartSubmitted, resultsArray]
  );

  const isReset = useMemo(
    () => isPartSubmitted && resultsArray.some((r) => r === null),
    [isPartSubmitted, resultsArray]
  );

  // get correct answer
  const displayCorrectAnswers = useCallback(() => {
    const answersToDisplay = showKana
      ? questionData.answer_kana
      : questionData.answer;
    const fallback = questionData.correctAnswer;

    if (Array.isArray(answersToDisplay) && answersToDisplay.length > 0) {
      return answersToDisplay.map((a) => a ?? "?").join(",  ");
    }

    if (fallback) {
      return fallback;
    }

    return "N/A";
  }, [showKana, questionData]);

  return (
    <div className="p-4 border rounded transition-colors duration-300">
      <span className="font-semibold mr-2 text-foreground/80">
        Question {questionData.id}.
      </span>
      <AnswerInput
        questionData={questionData}
        showKana={showKana}
        value={value}
        result={result}
        isPartSubmitted={isPartSubmitted}
        partId={partId}
        questionId={questionId}
        getExpectedAnswerCount={getExpectedAnswerCount}
        onChange={onChange}
      />

      {/* display if the answers are correct or not */}
      {isPartSubmitted && (
        <div className="mt-2 text-sm min-h-[1.25rem]">
          {isOverallCorrect && (
            <p className="text-green-600 font-semibold">Correct!</p>
          )}
          {isAnyIncorrect && (
            <p className="text-red-600 font-semibold">
              Incorrect. Correct answer(s): {displayCorrectAnswers()}
            </p>
          )}
          {isReset && !isOverallCorrect && !isAnyIncorrect && (
            <p className="text-orange-600 font-semibold">
              Answer changed. Submit part again to re-check.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
