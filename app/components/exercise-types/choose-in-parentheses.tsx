"use client";

import { Question } from "@/app/constants/exercise";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useMemo, useState } from "react"; // Removed useState as 'selected' is not needed

interface ChooseInParenthesesProps {
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

export default function ChooseInParentheses({
  question,
  partId,
  questionId,
  value,
  onChange,
  isPartSubmitted,
  result,
  showKana,
  getNumOfAnswers,
}: ChooseInParenthesesProps) {
  const [showEnglishMeaning, setShowEnglishMeaning] = useState(false);

  const displayQuestionString = useMemo(() => {
    const baseQ = question.question[0] ?? "";
    const kanaQ = question.question_kana?.[0] ?? "";
    return showKana && kanaQ ? kanaQ : baseQ;
  }, [showKana, question]);

  const expectedInputs = useMemo(
    () => getNumOfAnswers(question),
    [getNumOfAnswers, question]
  );

  const questionParts = useMemo(
    () => displayQuestionString.split(/（(.*?)）/g),
    [displayQuestionString]
  );

  const valuesArray = useMemo(() => {
    const baseArray = Array.isArray(value)
      ? value
      : value !== undefined
      ? [value]
      : [];
    return Array(expectedInputs)
      .fill("")
      .map((_, i) => baseArray[i] ?? "");
  }, [value, expectedInputs]);

  const resultsArrayFromInput = useMemo(() => {
    const baseArray = Array.isArray(result)
      ? result
      : result !== undefined
      ? [result]
      : [];
    return Array(expectedInputs)
      .fill(null)
      .map((_, i) => baseArray[i] ?? null);
  }, [result, expectedInputs]);

  const getSelectedClasses = useCallback(
    (blankIndex?: number): string => {
      let borderColor = "border-input";
      let focusRingColor = "focus:ring-primary";
      let textColor = "text-foreground";
      let cursor = "cursor-pointer";

      if (
        isPartSubmitted &&
        blankIndex !== undefined &&
        blankIndex < resultsArrayFromInput.length
      ) {
        const specificResult = resultsArrayFromInput[blankIndex];
        if (specificResult === true) {
          borderColor = "border-green-500";
          focusRingColor = "focus:ring-green-500";
          textColor = "text-green-800 dark:text-green-300";
          cursor = "cursor-not-allowed";
        } else if (specificResult === false) {
          borderColor = "border-red-500";
          focusRingColor = "focus:ring-red-500";
          textColor = "text-red-800 dark:text-red-300";
        }
      } else if (!isPartSubmitted) {
        borderColor = "border-orange-200";
        focusRingColor = "focus:ring-orange-500";
      }

      if (!isPartSubmitted) {
        cursor = "cursor-pointer";
      } else if (
        blankIndex !== undefined &&
        resultsArrayFromInput[blankIndex] !== true
      ) {
        cursor = "cursor-pointer";
      }

      return `${borderColor} ${focusRingColor} ${textColor} ${cursor}`;
    },
    [isPartSubmitted, resultsArrayFromInput]
  );

  const isOverallCorrect = useMemo(
    () =>
      isPartSubmitted &&
      resultsArrayFromInput.length > 0 &&
      resultsArrayFromInput.length === expectedInputs &&
      resultsArrayFromInput.every((r) => r === true),
    [isPartSubmitted, resultsArrayFromInput, expectedInputs]
  );

  const isAnyIncorrect = useMemo(
    () => isPartSubmitted && resultsArrayFromInput.some((r) => r === false),
    [isPartSubmitted, resultsArrayFromInput]
  );

  const isResetOrPending = useMemo(
    () =>
      isPartSubmitted &&
      resultsArrayFromInput.some((r) => r === null) &&
      !isOverallCorrect &&
      !isAnyIncorrect,
    [isPartSubmitted, resultsArrayFromInput, isOverallCorrect, isAnyIncorrect]
  );

  useEffect(() => {
    if (isResetOrPending) {
      setShowEnglishMeaning(true);
    } else if (!isPartSubmitted) {
      setShowEnglishMeaning(false);
    }
  }, [isResetOrPending, isPartSubmitted]);

  const displayCorrectAnswers = useCallback(() => {
    const answersToDisplay = showKana ? question.answer_kana : question.answer;

    if (Array.isArray(answersToDisplay) && answersToDisplay.length > 0) {
      const cleanedAnswers = answersToDisplay
        .map((a) => a ?? "N/A")
        .filter((a) => a.trim() !== "");
      if (cleanedAnswers.length > 0) {
        return "　[　" + cleanedAnswers.join("　|　") + "　]　";
      }
    }
    return " (No answer provided)";
  }, [showKana, question]);

  const questionEnglish = useMemo(() => {
    return question.question_en?.[0] || null;
  }, [question]);

  const toggleShowEnglish = () => {
    setShowEnglishMeaning((prev) => !prev);
  };

  return (
    <div className="p-4 border rounded-md transition-colors duration-300 bg-card shadow">
      <div className="mb-3">
        <div className="leading-relaxed text-foreground/80 pt-2">
          {questionParts.map((part, partIndex) => {
            if (partIndex % 2 === 0) {
              return (
                <span
                  key={`text-${partIndex}`}
                  className="whitespace-pre-wrap font-sans"
                >
                  {part}
                </span>
              );
            } else {
              const blankIndex = (partIndex - 1) / 2;

              if (blankIndex >= expectedInputs) {
                console.warn(
                  "Mismatch between question structure and expected inputs count."
                );
                return null;
              }

              const currentOptionsForThisBlank = part.split("|");
              const currentValueForThisBlank = valuesArray[blankIndex] ?? "";

              return (
                <select
                  key={`select-${blankIndex}`}
                  className={`
                    inline-block w-32 sm:w-40 h-7 px-1 mx-2 align-baseline border rounded outline-none
                    text-sm transition-colors duration-200 ease-in-out
                    focus:outline-none focus:ring-2 focus:ring-offset-1
                    ${getSelectedClasses(blankIndex)}`}
                  value={currentValueForThisBlank}
                  onChange={(e) =>
                    onChange(partId, questionId, e.target.value, blankIndex)
                  }
                  disabled={
                    isPartSubmitted &&
                    resultsArrayFromInput[blankIndex] === true
                  }
                  aria-label={`Answer blank ${
                    blankIndex + 1
                  } for question ${questionId}`}
                >
                  <option value="">--Choose--</option>
                  {currentOptionsForThisBlank.map(
                    (opt: string, optIdx: number) => (
                      <option key={optIdx} value={opt}>
                        {opt}
                      </option>
                    )
                  )}
                </select>
              );
            }
          })}
        </div>
      </div>

      {isPartSubmitted && (
        <div className="mt-2 text-sm min-h-[1.25rem]">
          {isOverallCorrect && (
            <p className="text-green-600 dark:text-green-400 font-semibold">
              Correct!
            </p>
          )}
          {isAnyIncorrect && (
            <p className="text-red-600 dark:text-red-400 font-semibold">
              Incorrect. Correct answer(s):
              <span className="font-mono pl-1">{displayCorrectAnswers()}</span>
            </p>
          )}
          {isResetOrPending && (
            <p className="text-orange-600 dark:text-orange-400 font-semibold">
              Answer changed. Please submit the part again to check.
            </p>
          )}
          {!isOverallCorrect &&
            !isAnyIncorrect &&
            !isResetOrPending &&
            !resultsArrayFromInput.some((r) => r !== null) && (
              <p className="text-muted-foreground">Select your answer(s).</p>
            )}
          {!isOverallCorrect &&
            !isAnyIncorrect &&
            !isResetOrPending &&
            resultsArrayFromInput.some((r) => r !== null) && (
              <p className="text-muted-foreground">Review your answer(s).</p>
            )}
          {questionEnglish && (
            <div className="mt-2">
              <Button
                variant="link"
                size="sm"
                onClick={toggleShowEnglish}
                className="text-xs h-7 px-1 underline"
              >
                {showEnglishMeaning ? "Hide Meaning" : "Show Meaning"}
              </Button>
              {showEnglishMeaning && (
                <p
                  className="text-muted-foreground mt-1.5 px-1 rounded-md"
                  style={{ whiteSpace: "pre-line" }}
                >
                  {questionEnglish}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
