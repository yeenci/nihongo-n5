/* eslint-disable @typescript-eslint/no-unused-vars */
import { Question } from "@/app/constants/exercise";
import {
  transcribeToHiragana,
  transcribeToKatakana,
} from "@/lib/transcription";
import { useCallback, useMemo, useState } from "react";
import { TranscriptionPopup } from "../transcribe-popup";
import { Input } from "@/components/ui/input";

interface FillInTheTableProps {
  question: Question;
  partId: string;
  questionId: string;
  rowIndex: number;
  value: string | string[] | undefined;
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

export default function FillInTheTable({
  question,
  partId,
  questionId,
  rowIndex,
  value,
  onChange,
  isPartSubmitted,
  result,
  showKana,
  getNumOfAnswers,
}: FillInTheTableProps) {
  const [showEnglishMeaning, setShowEnglishMeaning] = useState(false);

  const [popupHiraganaText, setPopupHiraganaText] = useState<{
    [key: number]: string;
  }>({});
  const [popupKatakanaText, setPopupKatakanaText] = useState<{
    [key: number]: string;
  }>({});
  const [activeInputIndex, setActiveInputIndex] = useState<number | null>(null);

  const displayCells = useMemo(() => {
    return showKana && question.question_kana
      ? question.question_kana
      : question.question;
  }, [showKana, question.question, question.question_kana]);

  const expectedInputs = useMemo(
    () => getNumOfAnswers(question),
    [getNumOfAnswers, question]
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
    (index: number): string => {
      let borderColor = "border-input";
      let focusRingColor = "focus:ring-primary";
      let bgColor = "bg-background";
      let textColor = "text-foreground";
      let cursor = "cursor-pointer";
      if (isPartSubmitted && index < resultsArrayFromInput.length) {
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
      if (!isPartSubmitted) cursor = "cursor-pointer";
      else if (resultsArrayFromInput[index] !== true) cursor = "cursor-pointer";
      return `${borderColor} ${focusRingColor} ${bgColor} ${textColor} ${cursor} align-middle`;
    },
    [isPartSubmitted, resultsArrayFromInput]
  );

  const handleDirectInput = useCallback(
    (newValue: string, index: number) => {
      onChange(partId, questionId, newValue, index);
      if (activeInputIndex === index) {
        setPopupHiraganaText((prev) => ({
          ...prev,
          [index]: transcribeToHiragana(newValue),
        }));
        setPopupKatakanaText((prev) => ({
          ...prev,
          [index]: transcribeToKatakana(newValue),
        }));
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
      if (activeInputIndex === index) setActiveInputIndex(null);
      else {
        setActiveInputIndex(index);
        setPopupHiraganaText((prev) => ({
          ...prev,
          [index]: transcribeToHiragana(valuesArray[index] ?? ""),
        }));
        setPopupKatakanaText((prev) => ({
          ...prev,
          [index]: transcribeToKatakana(valuesArray[index] ?? ""),
        }));
      }
    },
    [isPartSubmitted, resultsArrayFromInput, activeInputIndex, valuesArray]
  );

  const handleHiraganaApply = useCallback(() => {
    if (activeInputIndex !== null && popupHiraganaText[activeInputIndex]) {
      onChange(
        partId,
        questionId,
        popupHiraganaText[activeInputIndex],
        activeInputIndex
      );
      setActiveInputIndex(null);
      setPopupHiraganaText("");
    }
  }, [activeInputIndex, popupHiraganaText, onChange, partId, questionId]);

  const handleKatakanaApply = useCallback(() => {
    if (activeInputIndex !== null && popupKatakanaText[activeInputIndex]) {
      onChange(
        partId,
        questionId,
        popupKatakanaText[activeInputIndex],
        activeInputIndex
      );
      setActiveInputIndex(null);
      setPopupKatakanaText("");
    }
  }, [activeInputIndex, popupKatakanaText, onChange, partId, questionId]);

  const handlePopupOpenChange = useCallback(
    (open: boolean, currentIdx: number) => {
      if (!open && activeInputIndex === currentIdx) {
        setActiveInputIndex(null);
        setPopupHiraganaText("");
        setPopupKatakanaText("");
      }
    },
    [activeInputIndex]
  );

  const isOverallCorrect = useMemo(
    () =>
      isPartSubmitted &&
      expectedInputs > 0 && // Ensure there are expected answers for this row
      resultsArrayFromInput.length === expectedInputs && // Ensure we have results for all expected inputs
      resultsArrayFromInput.every((r) => r === true),
    [isPartSubmitted, resultsArrayFromInput, expectedInputs] // Correct dependencies
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

  const displayCorrectAnswers = useCallback(() => {
    const answersToDisplay = showKana ? question.answer_kana : question.answer;
    if (Array.isArray(answersToDisplay) && answersToDisplay.length > 0) {
      return (
        "　[　" + answersToDisplay.map((a) => a ?? "?").join("　|　") + "　]　"
      );
    }
    return "N/A";
  }, [showKana, question.answer, question.answer_kana]);

  const questionEnglish = useMemo(() => {
    return question.question_en?.[0] || null;
  }, [question.question_en]);

  let current = 0;

  return (
    <>
      <tr className="border-t-2 border-l-2 border-r-2 border-muted">
        <td className="p-2.5 border border-border text-center align-middle text-sm font-medium text-muted-foreground w-12">
          {rowIndex + 1}.
        </td>
        {displayCells.map((cellContent, cellIndex) => {
          if (cellContent.trim() === "（＿＿）") {
            const index = current++;
            return (
              <td
                key={`${questionId}-cell-${cellIndex}-blank-${index}`}
                className="p-2 border border-border text-center align-middle"
              >
                <TranscriptionPopup
                  isOpen={activeInputIndex === index}
                  onOpenChange={(open) => handlePopupOpenChange(open, index)}
                  HiraganaText={
                    activeInputIndex === index ? popupHiraganaText[index] : ""
                  }
                  KatakanaText={
                    activeInputIndex === index ? popupKatakanaText[index] : ""
                  }
                  onHiraganaApply={handleHiraganaApply}
                  onKatakanaApply={handleKatakanaApply}
                  trigger={
                    <Input
                      type="text"
                      placeholder="Answer"
                      value={valuesArray[index]}
                      onChange={(e) => handleDirectInput(e.target.value, index)}
                      onClick={() => handleInputClick(index)}
                      aria-label={`Row ${rowIndex + 1} Answer blank ${
                        index + 1
                      }`}
                      className={`h-9 px-2 mx-auto border rounded text-sm transition-colors duration-200 ease-in-out text-center focus:outline-none focus:ring-2 focus:ring-offset-1 ${getInputClasses(
                        index
                      )}`}
                      disabled={
                        isPartSubmitted && resultsArrayFromInput[index] === true
                      }
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck="false"
                    />
                  }
                />
              </td>
            );
          } else {
            return (
              <td
                key={`${questionId}-cell-${cellIndex}-text`}
                className="p-2.5 border border-border text-center align-middle text-sm sm:text-sm text-foreground/90"
              >
                <span className="whitespace-pre-wrap font-sans">
                  {cellContent}
                </span>
              </td>
            );
          }
        })}
      </tr>
      {isPartSubmitted && (
        <tr className="border-x border-b-2 border-l-2 border-r-2 border-muted">
          <td
            colSpan={2}
            className="p-2 text-xs text-muted-foreground border-x border-b border-border"
          >
            <span className="font-medium">Meaning: </span>
            {questionEnglish}
          </td>
          <td
            colSpan={
              displayCells.length + (isPartSubmitted || questionEnglish ? 1 : 0)
            }
            className="p-2 text-xs text-muted-foreground border-x border-b border-border"
          >
            <span className="font-semibold">Correct Answer(s): </span>
            {displayCorrectAnswers()}
          </td>
        </tr>
      )}
      {isResetOrPending && (
        <tr>
          <td
            colSpan={displayCells.length + 1}
            className="p-2 text-xs text-muted-foreground border-x border-b border-border"
          >
            <span className="text-orange-600 dark:text-orange-400 font-medium">
              Answer changed. Please reset to submit the part again.
            </span>
          </td>
        </tr>
      )}
    </>
  );
}
