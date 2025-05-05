// import ChooseInParentheses from "./choose-in-parentheses";
import { ExercisePart, Question } from "@/app/constants/exercise";
import FillInTheBlank from "./fill-in-the-blank";
import WordBox from "./word-box";
// import FinishSentence from "./finish-sentence";
// import Rearrange from "./rearrange";
// import ReadParagraph from "./read-and-answer";

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
  activePart: ExercisePart | undefined;
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
    case "word-box":
      return (
        <WordBox
          {...commonProps}
        />
      );
    default:
      return (
        <div className="p-4 border rounded bg-destructive/10 text-destructive">
          Unsupported question type: {type}
        </div>
      );
  }
}
