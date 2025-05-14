"use client";

import { Fragment, useCallback, useMemo, useState } from "react";
import { Question } from "@/app/constants/exercise"; // Assuming this path is correct
import {
  transcribeToHiragana,
  transcribeToKatakana,
} from "@/lib/transcription"; // Assuming this path is correct
import { TranscriptionPopup } from "../transcribe-popup"; // Adjust path if necessary, was "./transcribe-popup" in original AnswerInput
import { Input } from "@/components/ui/input"; // Assuming this path is correct

interface FillInTheBlankProps {
  question: Question; // Renamed from questionData for internal consistency
  partId: string;
  questionId: string; // This is question.id
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
  getNumOfAnswers: (question: Question) => number; // Renamed from getExpectedAnswerCount
}

export default function FillInTheBlank({
  question, // Use 'question' prop directly
  partId,
  questionId,
  value,
  onChange,
  isPartSubmitted,
  result,
  showKana,
  getNumOfAnswers, // Use 'getNumOfAnswers' prop directly
}: FillInTheBlankProps) {
  // --- Logic from AnswerInput ---
  const [popupHiraganaText, setPopupHiraganaText] = useState("");
  const [popupKatakanaText, setPopupKatakanaText] = useState("");
  const [activeInputIndex, setActiveInputIndex] = useState<number | null>(null);

  const displayQuestionString = useMemo(() => {
    // Question interface has question and question_kana as string[]
    // We assume the first element is the relevant string for fill-in-the-blank
    const baseQ = question.question[0] ?? "";
    const kanaQ = question.question_kana?.[0] ?? "";
    return showKana && kanaQ ? kanaQ : baseQ;
  }, [showKana, question]);

  const expectedInputs = useMemo(
    () => getNumOfAnswers(question), // Use prop getNumOfAnswers
    [getNumOfAnswers, question]
  );

  const placeholder = "（＿＿）";
  const questionParts = useMemo(
    () => displayQuestionString.split(placeholder),
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

  const getInputClasses = useCallback(
    (index?: number): string => {
      let borderColor = "border-input";
      let focusRingColor = "focus:ring-primary";
      let bgColor = "bg-background";
      let textColor = "text-foreground";
      let cursor = "cursor-pointer";

      if (
        isPartSubmitted &&
        index !== undefined &&
        index < resultsArrayFromInput.length
      ) {
        const specificResult = resultsArrayFromInput[index];
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

      if (!isPartSubmitted) {
        cursor = "cursor-pointer";
      } else if (index !== undefined && resultsArrayFromInput[index] !== true) {
         cursor = "cursor-pointer";
      }


      return `${borderColor} ${focusRingColor} ${bgColor} ${textColor} ${cursor}`;
    },
    [isPartSubmitted, resultsArrayFromInput]
  );

  const handleDirectInput = useCallback(
    (newValue: string, index: number) => {
      onChange(partId, questionId, newValue, index);
      if (activeInputIndex === index) {
        setPopupHiraganaText(transcribeToHiragana(newValue));
        setPopupKatakanaText(transcribeToKatakana(newValue));
      }
    },
    [onChange, partId, questionId, activeInputIndex]
  );

  const handleInputClick = useCallback(
    (index: number) => {
      if (isPartSubmitted && resultsArrayFromInput[index] === true) {
        setActiveInputIndex(null);
        return;
      }
      if (activeInputIndex === index) {
        setActiveInputIndex(null);
        // Text clearing handled by handlePopupOpenChange
      } else {
        setActiveInputIndex(index);
        setPopupHiraganaText(transcribeToHiragana(valuesArray[index] ?? ""));
        setPopupKatakanaText(transcribeToKatakana(valuesArray[index] ?? ""));
      }
    },
    [isPartSubmitted, resultsArrayFromInput, activeInputIndex, valuesArray]
  );

  const handleHiraganaApply = useCallback(() => {
    if (activeInputIndex !== null && popupHiraganaText) {
      onChange(partId, questionId, popupHiraganaText, activeInputIndex);
      setActiveInputIndex(null);
      setPopupHiraganaText("");
    }
  }, [activeInputIndex, popupHiraganaText, onChange, partId, questionId]);

  const handleKatakanaApply = useCallback(() => {
    if (activeInputIndex !== null && popupKatakanaText) {
      onChange(partId, questionId, popupKatakanaText, activeInputIndex);
      setActiveInputIndex(null);
      setPopupKatakanaText("");
    }
  }, [activeInputIndex, popupKatakanaText, onChange, partId, questionId]);

  const handlePopupOpenChange = useCallback(
    (open: boolean, index: number) => {
      if (!open && activeInputIndex === index) {
        setActiveInputIndex(null);
        setPopupHiraganaText("");
        setPopupKatakanaText("");
      }
    },
    [activeInputIndex]
  );
  // --- End of Logic from AnswerInput ---

  // --- Logic originally from FillInTheBlank (for displaying overall status) ---
  // Note: `resultsArrayFromInput` is the same as `resultsArray` previously in FillInTheBlank
  const isOverallCorrect = useMemo(
    () =>
      isPartSubmitted &&
      resultsArrayFromInput.length > 0 && // Ensure there are results to check
      resultsArrayFromInput.length === expectedInputs &&
      resultsArrayFromInput.every((r) => r === true),
    [isPartSubmitted, resultsArrayFromInput, expectedInputs]
  );

  const isAnyIncorrect = useMemo(
    () => isPartSubmitted && resultsArrayFromInput.some((r) => r === false),
    [isPartSubmitted, resultsArrayFromInput]
  );

  const isResetOrPending = useMemo( // Renamed for clarity
    () => isPartSubmitted && resultsArrayFromInput.some((r) => r === null) && !isOverallCorrect && !isAnyIncorrect,
    [isPartSubmitted, resultsArrayFromInput, isOverallCorrect, isAnyIncorrect]
  );


  const displayCorrectAnswers = useCallback(() => {
    const answersToDisplay = showKana
      ? question.answer_kana
      : question.answer;
    // The Question interface does not have 'correctAnswer'. We rely on answer/answer_kana.
    // const fallback = question.correctAnswer; // This field is not in the Question interface

    if (Array.isArray(answersToDisplay) && answersToDisplay.length > 0) {
      // Filter out undefined/null before joining, or provide a placeholder
      const cleanedAnswers = answersToDisplay.map(a => a ?? "N/A").filter(a => a.trim() !== "");
      if (cleanedAnswers.length > 0) {
        return "　[　" + cleanedAnswers.join("　|　") + "　]　";
      }
    }
    return " (No answer provided)"; // Fallback if no valid answers are found
  }, [showKana, question]);
  // --- End of Logic for displaying overall status ---

  return (
    <div className="p-4 border rounded-md transition-colors duration-300 bg-card shadow"> {/* Added bg-card and shadow for consistency */}
      <div className="mb-3"> {/* Group question number and input area */}
        <span className="font-semibold mr-2 text-foreground/90">
          {/* Use question.id which is passed as questionId from parent, or map an index if needed */}
          {/* For this component, question.id is the unique ID of the question object itself */}
          {/* If a sequential number is needed, it should be passed or derived from an index in a list */}
          {/* Question {question.id} - this might be a long UUID. Consider passing an index if a simple number is preferred. */}
        </span>
        {/* JSX from AnswerInput's return, now part of FillInTheBlank */}
        <div className="leading-relaxed text-foreground/80">
          {questionParts.map((part, index) => (
            <Fragment key={index}>
              <span className="whitespace-pre-wrap font-sans">{part}</span>
              {index < expectedInputs && (
                <TranscriptionPopup
                  isOpen={activeInputIndex === index}
                  onOpenChange={(open) => handlePopupOpenChange(open, index)}
                  HiraganaText={activeInputIndex === index ? popupHiraganaText : ""}
                  KatakanaText={activeInputIndex === index ? popupKatakanaText : ""}
                  onHiraganaApply={handleHiraganaApply}
                  onKatakanaApply={handleKatakanaApply}
                  trigger={
                    <Input
                      type="text"
                      placeholder="Your answer"
                      value={valuesArray[index]}
                      onChange={(e) => handleDirectInput(e.target.value, index)}
                      onClick={() => handleInputClick(index)}
                      aria-label={`Answer blank ${index + 1} for question ${questionId}`}
                      className={`
                        inline-block w-32 sm:w-40 h-7 px-2 mx-1 align-baseline border rounded
                        text-sm transition-colors duration-200 ease-in-out
                        focus:outline-none focus:ring-2 focus:ring-offset-1
                        ${getInputClasses(index)}`}
                      disabled={isPartSubmitted && resultsArrayFromInput[index] === true}
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
      </div>

      {/* Display overall status */}
      {isPartSubmitted && (
        <div className="mt-2 text-sm min-h-[1.25rem]"> {/* min-h to prevent layout shift */}
          {isOverallCorrect && (
            <p className="text-green-600 dark:text-green-400 font-semibold">Correct!</p>
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
           {/* Case: Submitted, no incorrect, not overall correct, not pending/reset (e.g. empty required field) */}
           {!isOverallCorrect && !isAnyIncorrect && !isResetOrPending && (
             <p className="text-muted-foreground">Review your answer(s).</p>
           )}
        </div>
      )}
    </div>
  );
}