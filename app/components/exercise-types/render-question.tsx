import { ExercisePart, Question } from "@/app/constants/exercise";
import FillInTheBlank from "./fill-in-the-blank";
import ChooseInParentheses from "./choose-in-parentheses";
import Rearrange from "./rearrange";
import WordBox from "./word-box";
import { ComponentType } from "react";

interface RenderQuestionByTypeProps {
  type: string;
  partId: string;
  onChange: (
    partId: string,
    questionId: string,
    value: string,
    blankIndex?: number
  ) => void;
  isPartSubmitted: boolean;
  showKana: boolean;
  getNumOfAnswers: (question: Question) => number;
  activePart: ExercisePart | undefined;
  userAnswers: { [key: string]: string | string[] };
  results: {
    [partId: string]: {
      [questionId: string]: (boolean | null) | (boolean | null)[];
    };
  };
}

interface CommonQuestionProps {
  question: Question;
  showKana: boolean;
  value: string | string[] | undefined;
  result: (boolean | null) | (boolean | null)[] | undefined;
  isPartSubmitted: boolean;
  partId: string;
  questionId: string;
  getNumOfAnswers: (question: Question) => number;
  onChange: (
    partId: string,
    questionId: string,
    value: string,
    blankIndex?: number
  ) => void;
  activePart: ExercisePart;
}

export default function RenderQuestionByType({
  type,
  partId,
  onChange,
  isPartSubmitted,
  showKana,
  getNumOfAnswers,
  activePart,
  userAnswers,
  results,
}: RenderQuestionByTypeProps) {
  if (!activePart) {
    return (
      <div className="text-muted-foreground">
        Loading questions or part not selected...
      </div>
    );
  }

  if (activePart.type !== type) {
    console.warn(
      `RenderQuestionByType called for type "${type}" but activePart.type is "${activePart.type}".`
    );
    return (
      <div className="p-4 border rounded bg-yellow-100 text-yellow-700">
        Mismatched exercise part type. Expected &quot;{type}&quot;, got &quot;
        {activePart.type}&quot;.
      </div>
    );
  }

  const renderQuestions = (
    QuestionComponent: ComponentType<CommonQuestionProps>
  ) => (
    <div className="space-y-8">
      {activePart.questions.map((question, index) => {
        const questionUid = `${partId}-${question.id}`;
        const questionValue = userAnswers[questionUid];
        const questionResult = results[partId]?.[question.id];

        return (
          <div
            key={question.id}
            className="border-b border-border pb-6 last:border-b-0 last:pb-0"
          >
            <p className="mb-3 text-sm font-medium text-muted-foreground">
              Question {index + 1}.
            </p>
            <QuestionComponent
              activePart={activePart}
              question={question}
              showKana={showKana}
              value={questionValue}
              result={questionResult}
              isPartSubmitted={isPartSubmitted}
              partId={partId}
              questionId={question.id}
              getNumOfAnswers={getNumOfAnswers}
              onChange={onChange}
            />
          </div>
        );
      })}
    </div>
  );

  switch (type) {
    case "fill-in-the-blank":
      return renderQuestions(
        FillInTheBlank as React.ComponentType<CommonQuestionProps>
      );
    case "choose-in-parentheses":
      return renderQuestions(
        ChooseInParentheses as React.ComponentType<CommonQuestionProps>
      );
    case "rearrange":
      return renderQuestions(
        Rearrange as React.ComponentType<CommonQuestionProps>
      );
    case "word-box":
      const wordOptions = showKana
        ? activePart.options_kana
        : activePart.options;

        return (
        <div className="space-y-8">
          {wordOptions && wordOptions.length > 0 && (<div className="mb-6 p-3 border rounded-lg bg-muted/50 sticky top-4 z-10 shadow-sm"></div>)
    default:
      return (
        <div className="p-4 border rounded bg-destructive/10 text-destructive">
          Unsupported question type: &quot;{type}&quot; for part &quot;
          {activePart.title}&quot;.
        </div>
      );
  }
}
