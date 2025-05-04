// 1. Fill in the blank

"use client";

import { Question } from "@/app/constants/exercise";
import { Input } from "@/components/ui/input";
import { transcribeToHiragana } from "@/lib/transcription";
import { Fragment, useCallback, useMemo, useState } from "react";
import { TranscriptionPopup } from "../transcribe-popup";

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
  const displayQuestion =
    showKana && questionData.question_kana
      ? questionData.question_kana
      : questionData.question;

  const expectedInputs = getExpectedAnswerCount(questionData);

  const placeholder = "（＿＿）";
  const questionParts = displayQuestion.split(placeholder);

  const valuesArray = useMemo(() => {
    const baseArray = Array.isArray(value)
      ? value
      : value !== undefined
      ? [value]
      : [];

    const filledArray = Array(expectedInputs)
      .fill("")
      .map((_, i) => baseArray[i] ?? "");

    return filledArray;
  }, [value, expectedInputs]);

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

  const getInputClasses = (index?: number): string => {
    let borderColor = "border-input";
    let focusRingColor = "focus:ring-primary";
    let bgColor = "bg-background";
    let textColor = "text-foreground";
    let cursor = "";

    if (isPartSubmitted && index !== undefined && index < resultsArray.length) {
      const specificResult = resultsArray[index];
      if (specificResult === true) {
        borderColor = "border-green-500";
        focusRingColor = "focus:ring-green-500";
        bgColor = "bg-green-100 dark:bg-green-900/30";
        textColor = "text-green-800 dark:text-green-300";
        cursor = "cursor-not-allowed";
      } else if (specificResult === false) {
        borderColor = "border-red-500";
        focusRingColor = "focus:ring-red-500";
        bgColor = "bg-red-100 dark:bg-red-900/30";
        textColor = "text-red-800 dark:text-red-300";
      }
    } else {
      borderColor = "border-orange-200";
      focusRingColor = "focus:ring-orange-500";
    }

    return `${borderColor} ${focusRingColor} ${bgColor} ${textColor} ${cursor}`;
  };

  const isOverallCorrect =
    isPartSubmitted &&
    resultsArray.length === expectedInputs &&
    resultsArray.every((r) => r === true);

  const isAnyIncorrect =
    isPartSubmitted && resultsArray.some((r) => r === false);

  const isReset = isPartSubmitted && resultsArray.some((r) => r === null);

  // get correct answer
  const displayCorrectAnswers = () => {
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
  };

  // Popup
  const [popupTranscribedText, setPopupTranscribedText] = useState("");
  const [activeInputIndex, setActiveInputIndex] = useState<number | null>(null);

  const handleDirectInput = useCallback(
    (newValue: string, index: number) => {
      onChange(partId, questionId, newValue, index);
      if (activeInputIndex === index) {
        setPopupTranscribedText(transcribeToHiragana(newValue));
      }
    },
    [onChange, partId, questionId, activeInputIndex]
  );

  // Handle clicking the input
  const handleInputClick = useCallback(
    (index: number) => {
      if (isPartSubmitted && resultsArray[index] === true) {
        setActiveInputIndex(null);
        return;
      }
      if (activeInputIndex === index) {
        setActiveInputIndex(null);
        setPopupTranscribedText("");
      } else {
        setActiveInputIndex(index);
        setPopupTranscribedText(transcribeToHiragana(valuesArray[index] ?? ""));
      }
    },
    [isPartSubmitted, resultsArray, activeInputIndex, valuesArray]
  );

  const handlePopupApply = useCallback(() => {
    if (activeInputIndex !== null && popupTranscribedText) {
      onChange(partId, questionId, popupTranscribedText, activeInputIndex);
      setActiveInputIndex(null);
      setPopupTranscribedText("");
    }
  }, [activeInputIndex, popupTranscribedText, onChange, partId, questionId]);

  const handlePopupOpenChange = useCallback(
    (open: boolean, index: number) => {
      if (!open && activeInputIndex === index) {
        setActiveInputIndex(null);
        setPopupTranscribedText("");
      }
    },
    [activeInputIndex]
  );

  return (
    <div className="p-4 border rounded transition-colors duration-300">
      {/* （＿＿） as input bar */}

      <span className="font-semibold mr-2 text-foreground/80">
        Question {questionData.id}.
      </span>
      <div className="mb-3 leading-relaxed text-foreground/80">
        {questionParts.map((part, index) => (
          <Fragment key={index}>
            <span className="whitespace-pre-wrap font-sans">{part}</span>
            {index < expectedInputs && (
              <TranscriptionPopup
                isOpen={activeInputIndex === index}
                onOpenChange={(open) => handlePopupOpenChange(open, index)}
                transcribedText={
                  activeInputIndex === index ? popupTranscribedText : ""
                }
                onApply={handlePopupApply}
                trigger={
                  <Input
                    type="text"
                    placeholder="Your answer"
                    value={valuesArray[index]}
                    onChange={(e) => handleDirectInput(e.target.value, index)}
                    onClick={() => handleInputClick(index)}
                    aria-label={`Answer blank ${
                      index + 1
                    } for question ${questionId}`}
                    className={`
                  inline-block w-32 sm:w-40 h-7 px-2 mx-1 align-baseline border rounded
                  text-sm transition-colors duration-200 ease-in-out
                  focus:outline-none focus:ring-2 focus:ring-offset-1
                  ${getInputClasses(index)}`}
                    disabled={isPartSubmitted && resultsArray[index] === true}
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                  />
                }
              />
            )}
          </Fragment>
        ))}
      </div>

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
