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
      if (expectedInputs === index) {
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
    [onChange, partId, questionId, expectedInputs]
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
    }
  }, [activeInputIndex, popupKatakanaText, onChange, partId, questionId]);

  const handlePopupOpenChange = useCallback(
    (open: boolean, currentidx: number) => {
      if (!open && activeInputIndex === currentidx) setActiveInputIndex(null);
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

  let current = 0;

  return (
    <>
      <tr
        className={
          isPartSubmitted && isAnyIncorrect
            ? "bg-red-50 dark:bg-red-900/10"
            : isPartSubmitted && isOverallCorrect
            ? "bg-green-50 dark:bg-green-900/10"
            : ""
        }
      >
        <td className="p-2.5 border border-border text-center align-middle text-sm font-medium text-muted-foreground w-12">
          {rowIndex + 1}.
        </td>
        {displayCells.map((cellContent, cellIndex) => {
          if (cellContent.trim() === "（＿＿）") {
            const idx = current++;
            return (
              <td
                key={`${questionId}-cell-${cellIndex}-blank-${idx}`}
                className="p-2 border border-border text-center align-middle"
              >
                <TranscriptionPopup
                  isOpen={activeInputIndex === idx}
                  onOpenChange={(open) => handlePopupOpenChange(open, idx)}
                  HiraganaText={popupHiraganaText[idx] || ""}
                  KatakanaText={popupKatakanaText[idx] || ""}
                  onHiraganaApply={handleHiraganaApply}
                  onKatakanaApply={handleKatakanaApply}
                  trigger={
                    <Input
                      type="text"
                      placeholder="Answer"
                      value={valuesArray[idx]}
                      onChange={(e) => handleDirectInput(e.target.value, idx)}
                      onClick={() => handleInputClick(idx)}
                      aria-label={`Row ${rowIndex + 1} Answer blank ${idx + 1}`}
                      className={`h-9 px-2 mx-auto border rounded text-sm transition-colors duration-200 ease-in-out text-center focus:outline-none focus:ring-2 focus:ring-offset-1 ${getInputClasses(
                        idx
                      )}`}
                      disabled={
                        isPartSubmitted && resultsArrayFromInput[idx] === true
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
                className="p-2.5 border border-border text-center align-middle text-sm sm:text-base text-foreground/90"
              >
                <span className="whitespace-pre-wrap font-sans">
                  {cellContent}
                </span>
              </td>
            );
          }
        })}
      </tr>
    </>
  );
}
