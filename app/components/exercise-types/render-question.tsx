// app/components/exercise-types/render-question.tsx
import { ExercisePart, Question } from "@/app/constants/exercise";
import FillInTheBlank from "./fill-in-the-blank"; // Assuming this is your renamed AnswerInput

interface RenderQuestionByTypeProps {
  type: string; // Type of the exercise part (e.g., "fill-in-the-blank")
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
    return <div className="text-muted-foreground">Loading questions or part not selected...</div>;
  }

  // Ensure the component only renders for its intended type, if activePart.type mismatches, something is wrong upstream.
  if (activePart.type !== type) {
    console.warn(`RenderQuestionByType called for type "${type}" but activePart.type is "${activePart.type}".`);
    return (
      <div className="p-4 border rounded bg-yellow-100 text-yellow-700">
        Mismatched exercise part type. Expected &quot;{type}&quot;, got &quot;{activePart.type}&quot;.
      </div>
    );
  }

  switch (type) {
    case "fill-in-the-blank":
      return (
        <div className="space-y-8">
          {activePart.questions.map((question, index) => {
            const questionUid = `${partId}-${question.id}`;
            const questionValue = userAnswers[questionUid];
            const questionResult = results[partId]?.[question.id];

            return (
              <div key={question.id} className="border-b border-border pb-6 last:border-b-0 last:pb-0">
                <p className="mb-3 text-sm font-medium text-muted-foreground">
                  Question {index + 1}.
                </p>
                <FillInTheBlank
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
    default:
      return (
        <div className="p-4 border rounded bg-destructive/10 text-destructive">
          Unsupported question type: &quot;{type}&quot; for part &quot;{activePart.title}&quot;.
        </div>
      );
  }
}