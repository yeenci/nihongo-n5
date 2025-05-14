import { ExercisePart } from "@/app/constants/exercise";
import { renderExamples } from "../exercise-types/helper";

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
            {activePart.type !== "rearrange" && (
              <ul className="space-y-4">
                {activePart.examples.map((example, index) => {
                  // Determine which version of the question to show based on showKana
                  const exampleTextToShow =
                    showKana && example.question_kana?.[0]
                      ? example.question_kana[0]
                      : example.question[0];

                  return (
                    <li key={example.id || `ex-${index}`} className="text-sm">
                      <div className="leading-relaxed text-foreground/80 flex items-center">
                        <span className="mr-2 text-muted-foreground"></span>
                        <div>{renderExamples(exampleTextToShow)}</div>
                      </div>
                      {example.question_en?.[0] && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {example.question_en[0]}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
    </>
  );
}
