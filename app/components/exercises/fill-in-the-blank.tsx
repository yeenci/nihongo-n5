/* eslint-disable @typescript-eslint/no-unused-vars */
// 1. Fill in the blank

"use client";

import { Question } from "@/app/constants/exercise";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";

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

export default function FillInTheTable({
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
      borderColor = "border-orange-400";
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
    const answersToDisplay = showKana ? questionData.answer_kana : questionData.answer;
    const fallback = questionData.correctAnswer;

    if (Array.isArray(answersToDisplay) && answersToDisplay.length > 0) {
      return answersToDisplay.map(a => a ?? '?').join('、 ')
    }

    if (fallback) {
      return fallback;
    }

    return "N/A";
  }

  return (
    <div className={`p-4 border rounded transition-colors duration-300`}>
      <pre className="mb-2 font-sans whitespace-pre-wrap">
        {displayQuestion}
      </pre>
    </div>
  );
}

// export default function FillInTheBlank({ question, onSubmit }: any) {
//   const [input, setInput] = useState("");
//   const [submitted, setSubmitted] = useState(false);
//   const isCorrect = input.trim() === question.correctAnswer;

//   return (
//     <div className="p-4 border rounded bg-muted">
//       <p className="mb-2">{question.question}</p>
//       <div className="flex gap-2">
//         <Input
//           type="text"
//           placeholder="Enter Your Answer"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//         />
//         <Button
//           variant="default"
//           onClick={() => {
//             setSubmitted(true);
//             onSubmit(isCorrect);
//           }}
//         >
//           Submit
//         </Button>
//       </div>
//       {submitted && !isCorrect && (
//         <p className="text-red-500 mt-2">
//           Correct answer: {question.correctAnswer}
//         </p>
//       )}
//       {submitted && isCorrect && (
//         <p className="text-green-500 mt-2">Correct!</p>
//       )}
//     </div>
//   );
// }
