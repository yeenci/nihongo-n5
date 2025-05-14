// 3. Rearrange sentence

import { Question } from "@/app/constants/exercise";

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
  return (<div>Hi</div>)
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
