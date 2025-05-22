import { ExercisePart } from "@/app/constants/exercise";
import { renderExamples } from "../exercise-types/helper";
import { ArrowRight } from "lucide-react";

interface ExampleProps {
  activePart: ExercisePart | undefined;
  showKana: boolean;
}

export default function ExamplePart({ activePart, showKana }: ExampleProps) {
  if (!activePart) return null;
  return (
    <>
      {activePart.type !== "rearrange" &&
        activePart.examples &&
        activePart.examples.length > 0 && (
          <div className="mb-6 p-4 border border-dashed border-border rounded-md bg-background/30 dark:bg-muted/20">
            <h3 className="text-base font-semibold mb-3 text-foreground/90">
              Examples:
            </h3>
            <ul className="space-y-4">
              {activePart.examples.map((example, index) => {
                const exampleTextToShow =
                  showKana && example.question_kana?.[0]
                    ? example.question_kana[0]
                    : example.question[0];

                return (
                  <li
                    key={example.id || `ex-${index}`}
                    className="text-sm"
                  >
                    <div className="leading-relaxed text-foreground/80 flex items-center">
                    {index + 1}.
                      <div className="pl-2">{renderExamples(exampleTextToShow)}</div>
                    </div>
                    {example.question_en?.[0] && (
                      <div className="text-xs text-muted-foreground mt-1 pl-[10px]">
                        (
                        <span className="italic">{example.question_en[0]}</span>
                        )
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      {activePart.type === "rearrange" &&
        activePart.examples &&
        activePart.examples.length > 0 && (
          <div className="mb-6 p-4 border border-dashed border-border rounded-md bg-background/30 dark:bg-muted/20">
            <h3 className="text-base font-semibold mb-3 text-foreground/90">
              Examples:
            </h3>
            <ul className="space-y-4">
              {activePart.examples.map((example, index) => {
                const wordsArray =
                  (showKana && example.question_kana
                    ? example.question_kana
                    : example.question) || [];

                const wordsToDisplay = wordsArray.join("　/　");

                const correctAnswerSentence =
                  (showKana && example.answer_kana?.[0]
                    ? example.answer_kana[0]
                    : example.answer?.[0]) || "N/A";

                return (
                  <li
                    key={example.id || `ex-${index}`}
                    className="text-sm"
                  >
                    <div className="pl-2 leading-relaxed text-foreground/80">
                      <div className="flex items-start">
                    {index + 1}.
                        <div className="pl-2 font-mono">{wordsToDisplay}</div>
                      </div>

                      <div className="flex items-start ">
                        <ArrowRight className="pr-2" />
                        <div>{renderExamples(correctAnswerSentence)}</div>
                      </div>
                    </div>
                    {example.question_en?.[0] && (
                      <div className="text-xs text-muted-foreground mt-1 pl-[10px]">
                        (
                        <span className="italic">{example.question_en[0]}</span>
                        )
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
    </>
  );
}
