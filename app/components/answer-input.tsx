import { Fragment, useCallback, useMemo, useState } from "react";
import { Question } from "../constants/exercise";
import {
  transcribeToHiragana,
  transcribeToKatakana,
} from "@/lib/transcription";
import { TranscriptionPopup } from "./transcribe-popup";
import { Input } from "@/components/ui/input";

interface AnswerInputProps {
  questionData: Question;
  showKana: boolean;
  value: string | string[] | undefined;
  result: (boolean | null) | (boolean | null)[] | undefined;
  isPartSubmitted: boolean;

  partId: string;
  questionId: string;
  getExpectedAnswerCount: (question: Question) => number;

  onChange: (
    partId: string,
    questionId: string,
    value: string,
    blankIndex?: number
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
  getExpectedAnswerCount,
  onChange,
}: AnswerInputProps) {
  // Popup
  const [popupHiraganaText, setPopupHiraganaText] = useState("");
  const [popupKatakanaText, setPopupKatakanaText] = useState("");
  const [activeInputIndex, setActiveInputIndex] = useState<number | null>(null);

  const displayQuestion = useMemo(
    () =>
      showKana && questionData.question_kana
        ? questionData.question_kana
        : questionData.question,
    [showKana, questionData]
  );

  const expectedInputs = useMemo(
    () => getExpectedAnswerCount(questionData),
    [getExpectedAnswerCount, questionData]
  );

  const placeholder = "（＿＿）";
  const questionParts = useMemo(
    () => displayQuestion.split(placeholder),
    [displayQuestion]
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

  const resultsArray = useMemo(() => {
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
        index < resultsArray.length
      ) {
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

      if (!isPartSubmitted) {
        cursor = "cursor-pointer";
      }

      return `${borderColor} ${focusRingColor} ${bgColor} ${textColor} ${cursor}`;
    },
    [isPartSubmitted, resultsArray]
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

  // Handle clicking the input
  const handleInputClick = useCallback(
    (index: number) => {
      if (isPartSubmitted && resultsArray[index] === true) {
        setActiveInputIndex(null);
        return;
      }
      if (activeInputIndex === index) {
        setActiveInputIndex(null);
        setPopupHiraganaText("");
        setPopupKatakanaText("");
      } else {
        setActiveInputIndex(index);
        setPopupHiraganaText(transcribeToHiragana(valuesArray[index] ?? ""));
        setPopupKatakanaText(transcribeToKatakana(valuesArray[index] ?? ""));
      }
    },
    [isPartSubmitted, resultsArray, activeInputIndex, valuesArray]
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

  return (
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
            ></TranscriptionPopup>
          )}
        </Fragment>
      ))}
    </div>
  );
}
