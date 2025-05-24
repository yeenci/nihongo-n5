/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
// app/components/exercise-types/word-box.tsx
"use client";

import { Question, ExercisePart } from "@/app/constants/exercise";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useMemo, useState } from "react";

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
  activePart,
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

  const questionText = useMemo(() => {
    const baseQ = question.question[0] ?? "";
    const kanaQ = question.question_kana?.[0] ?? "";
    return showKana && kanaQ ? kanaQ : baseQ;
  }, [showKana, question]);

  const optionsToDisplay = useMemo(() => {
    return (
      (showKana ? activePart.options_kana : activePart.options) || ["〇", "✕"]
    );
  }, [showKana, activePart.options, activePart.options_kana]);

  const correctAnswer = useMemo(() => {
    return (showKana ? question.answer_kana : question.answer) || "";
  }, [showKana, question.answer, question.answer_kana]);

  const selectedValue = useMemo(() => {
    return typeof value === "string"
      ? value
      : Array.isArray(value) && typeof value[0] === "string"
      ? value[0]
      : undefined;
  }, [value]);

  const handleOptionSelect = (optionValue: string) => {
    if (isPartSubmitted && result === true) {
      return;
    }
    onChange(partId, questionId, optionValue, 0);
  };

  const isOverallCorrect = useMemo(
    () => isPartSubmitted && result === true,
    [isPartSubmitted, result]
  );

  const isAnyIncorrect = useMemo(
    () => isPartSubmitted && result === false,
    [isPartSubmitted, result]
  );

  const isResetOrPending = useMemo(
    () =>
      isPartSubmitted &&
      result === null &&
      !isOverallCorrect &&
      !isAnyIncorrect,
    [isPartSubmitted, result, isOverallCorrect, isAnyIncorrect]
  );

  useEffect(() => {
    if (isResetOrPending) {
      setShowEnglishMeaning(true);
    } else if (!isPartSubmitted) {
      setShowEnglishMeaning(false);
    }
  }, [isResetOrPending, isPartSubmitted]);

  const displayCorrectAnswer = useCallback(() => {
    return `　[　${correctAnswer}　]　`;
  }, [correctAnswer]);

  const getOptionClasses = useCallback(
    (optionValue: string): string => {
    let baseClasses = "px-4 py-1 text-xs transition-all duration-200 ease-in-out transform min-w-[50px]";
      let borderAndBg = "border-input bg-transparent hover:bg-accent";
      let textColor = "text-foreground";
      let cursor = "cursor-pointer";

      const isSelected = selectedValue === optionValue;
      const isCorrectOption = optionValue === correctAnswer;

      if (isPartSubmitted) {
        if (result === true) {
          if (isSelected) {
            borderAndBg = "border-green-500 bg-green-100 dark:bg-green-700/30";
            textColor = "text-green-700 dark:text-green-300";
          } else {
            borderAndBg = "border-input bg-transparent opacity-60";
          }
          cursor = "cursor-not-allowed";
        } else if (result === false) {
          if (isSelected) {
            borderAndBg = "border-red-500 bg-red-100 dark:bg-red-700/30";
            textColor = "text-red-700 dark:text-red-300";
          } else if (isCorrectOption) {
            borderAndBg = "border-green-500 bg-green-100 dark:bg-green-700/30";
            textColor = "text-green-700 dark:text-green-300 font-bold";
          } else {
            borderAndBg = "border-input bg-transparent opacity-80";
          }
        } else {
          if (isSelected) {
            borderAndBg =
              "border-orange-400 bg-orange-50 dark:bg-orange-600/20";
            textColor = "text-orange-700 dark:text-orange-300";
          }
        }
      } else {
        if (isSelected) {
          borderAndBg = "border-primary bg-primary/10 dark:bg-primary/20";
          textColor = "text-primary";
        }
      }

      return `${baseClasses} ${borderAndBg} ${textColor} ${cursor}`;
    },
    [selectedValue, correctAnswer, isPartSubmitted, result]
  );

  const questionEnglish = useMemo(() => {
    return question.question_en?.[0] || null;
  }, [question]);

  const toggleShowEnglish = () => {
    setShowEnglishMeaning((prev) => !prev);
  };

  return (
    <div className="p-4 border rounded-md transition-colors duration-300 bg-card shadow">
      <div className="mb-1">
        <div
          className="leading-relaxed text-foreground/80 whitespace-pre-line prose text-sm dark:prose-invert prose-sm sm:prose-base"
          style={{ whiteSpace: "pre-line" }}
        >
          {questionText || "Question text not available."}
        </div>
      </div>

      <div className="flex flex-row gap-2 mb-2">
        {optionsToDisplay.map((option) => (
          <Button
            key={option}
            variant="outline"
            className={getOptionClasses(option)}
            onClick={() => handleOptionSelect(option)}
            disabled={isPartSubmitted && result === true}
          >
            {option}
          </Button>
        ))}
      </div>

      {isPartSubmitted && (
        <div className="mt-3 text-sm min-h-[1.25rem]">
          {isOverallCorrect && (
            <p className="text-green-600 dark:text-green-400 font-semibold">
              Correct!
            </p>
          )}
          {isAnyIncorrect && (
            <p className="text-red-600 dark:text-red-400 font-semibold">
              Incorrect. Correct answer:
              <span className="font-mono pl-1">{displayCorrectAnswer()}</span>
            </p>
          )}
          {!isOverallCorrect &&
            !isAnyIncorrect &&
            !isResetOrPending &&
            !selectedValue && (
              <p className="text-muted-foreground">Please select an answer.</p>
            )}
           {!isOverallCorrect &&
            !isAnyIncorrect &&
            !isResetOrPending &&
             selectedValue && (
              <p className="text-orange-600 dark:text-orange-400 font-semibold pl-1">
              Answer changed. Please submit the part again to check.</p>
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
