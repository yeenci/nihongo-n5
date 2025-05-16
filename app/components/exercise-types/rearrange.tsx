// 3. Rearrange sentence

import { Question } from "@/app/constants/exercise";
import { useCallback, useMemo, useState } from "react";

interface RearrangeProps {
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

export default function Rearrange({
  question,
  partId,
  questionId,
  value,
  onChange,
  isPartSubmitted,
  result,
  showKana,
  getNumOfAnswers,
}: RearrangeProps) {
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

  return <div>Hi</div>;
}

// import { Button } from "@/components/ui/button";
// import { useState } from "react";

// export default function Rearrange({ question, onSubmit }: any) {
//   // const [words, setWords] = useState(() =>
//   //   [...question.words].sort(() => Math.random() - 0.5)
//   // );
//   const [words] = useState(() =>
//     [...question.words].sort(() => Math.random() - 0.5)
//   );
//   const [selected, setSelected] = useState<string[]>([]);
//   const [submitted, setSubmitted] = useState(false);
//   const joined = selected.join(" ");
//   const isCorrect = joined === question.correctAnswer;

//   return (
//     <div className="p-4 border rounded bg-muted">
//       <p className="mb-2">Rearrange to form a sentence:</p>
//       <div className="flex flex-wrap gap-2 mb-2">
//         {words.map((w: string, i: number) => (
//           <Button
//             key={i}
//             variant="default"
//             onClick={() => {
//               setSelected((prev) => [...prev, w]);
//             }}
//             disabled={selected.includes(w)}
//           >
//             {w}
//           </Button>
//         ))}
//       </div>
//       <div className="mb-2">
//         Your answer: <span className="font-medium">{joined}</span>
//       </div>

//       <Button
//         variant="default"
//         onClick={() => {
//           setSubmitted(true);
//           onSubmit(isCorrect);
//         }}
//       >
//         Submit
//       </Button>
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
