/* eslint-disable @typescript-eslint/no-explicit-any */

// import ChooseInParentheses from "./choose-in-parentheses";
import { Question } from "@/app/constants/exercise";
import FillInTheBlank from "./fill-in-the-blank";
// import FinishSentence from "./finish-sentence";
// import Rearrange from "./rearrange";
// import ReadParagraph from "./read-and-answer";
// import WordBoxFill from "./word-box";

interface RenderQuestionProps {
  type: string;
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

export default function RenderQuestionByType({
  type,
  questionData,
  partId,
  questionId,
  value,
  onChange,
  isPartSubmitted,
  result,
  showKana,
  getExpectedAnswerCount,
}: RenderQuestionProps) {
  const commonProps = {
    questionData,
    partId,
    questionId,
    value,
    onChange,
    isPartSubmitted,
    result,
    showKana,
    getExpectedAnswerCount,
  };

  switch (type) {
    case "fill-in-the-blank":
      return <FillInTheBlank {...commonProps} />;
    default:
      return (
        <div className="p-4 border rounded bg-destructive/10 text-destructive">
          Unsupported question type: {type}
        </div>
      );
  }
}

// export default function RenderQuestionByType({
//   type,
//   question,
//   onSubmit,
// }: any) {
//   switch (type) {
//     case "fill-in-the-blank":
//       return <FillInTheBlank question={question} onSubmit={onSubmit} />;
//     // case "choose-in-parentheses":
//     //   return <ChooseInParentheses question={question} onSubmit={onSubmit} />;
//     // case "rearrange":
//     //   return <Rearrange question={question} onSubmit={onSubmit} />;
//     // case "finish-sentence":
//     //   return <FinishSentence question={question} onSubmit={onSubmit} />;
//     // case "read-and-answer":
//     //   return <ReadParagraph question={question} onSubmit={onSubmit} />;
//     // case "word-box":
//     //   return <WordBoxFill question={question} onSubmit={onSubmit} />;
//     default:
//       return <FillInTheBlank question={question} onSubmit={onSubmit} />;
//   }
// }
