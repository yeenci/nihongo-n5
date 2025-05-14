// app/exercise/page.tsx (or your specific route)
"use client";

import { renderExamples } from "@/app/components/exercise-types/helper";
import RenderQuestionByType from "@/app/components/exercise-types/render-question";
import Spinner from "@/app/components/spinner";
import { Button } from "@/components/ui/button";
import { useExerciseLogic } from "@/hooks/useExerciseLogic"; // Assuming path
import { useLecturePartData } from "@/hooks/useLecturePartData"; // Assuming path, fetches ExercisePart[]

export default function ExercisePage() {
  const { data: exercisePartsData, loading } = useLecturePartData();

  const {
    partId,
    userAnswers,
    results,
    showKana,
    setPartId,
    toggleKana,
    handleChange,
    handleSubmit,
    handleReset,
    activePart,
    isPartSubmitted,
    getNumOfAnswers,
  } = useExerciseLogic(exercisePartsData);

  // Helper to check if any answers have been entered for the current part
  const hasAnswersForCurrentPart = () => {
    if (!activePart || !userAnswers) return false;
    return activePart.questions.some((q) => {
      const answer = userAnswers[`${activePart.id}-${q.id}`];
      if (Array.isArray(answer)) return answer.some((a) => a !== "");
      return answer && answer !== "";
    });
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen py-8 px-4">
      <div className="w-full max-w-3xl">
        {" "}
        {/* Constrain width for better readability */}
        <div className="flex items-center justify-between mb-6 px-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">
            Exercises
          </h1>
          {!loading && exercisePartsData && exercisePartsData.length > 0 && (
            <Button onClick={toggleKana} variant="outline" size="sm">
              {showKana ? "表示：漢字" : "Display: Kana"}
            </Button>
          )}
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-60">
            <Spinner />
          </div>
        ) : Array.isArray(exercisePartsData) && exercisePartsData.length > 0 ? (
          <>
            {/* Part Navigation */}
            <div className="flex flex-wrap justify-center gap-2 mb-8 pb-4 border-b">
              {exercisePartsData.map((part, index) => (
                <Button
                  key={part.id}
                  variant={part.id === partId ? "default" : "outline"}
                  onClick={() => setPartId(part.id)}
                  className="rounded-full px-3.5 py-1.5 h-auto text-xs sm:text-sm"
                  size="sm"
                >
                  Part {index + 1}
                </Button>
              ))}
            </div>

            {/* Current Part Content */}
            {activePart && partId ? (
              <div className="bg-card p-4 sm:p-6 rounded-lg shadow-md">
                <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-card-foreground border-b pb-3">
                  {activePart.title}
                </h2>

                {/* --- EXAMPLES SECTION --- */}
                {activePart.examples && activePart.examples.length > 0 && (
                  <div className="mb-6 p-4 border border-dashed border-border rounded-md bg-background/30 dark:bg-muted/20">
                    <h3 className="text-base font-semibold mb-3 text-foreground/90">
                      Examples (例):
                    </h3>
                    <ul className="space-y-4">
                      {activePart.examples.map((example, index) => {
                        // Determine which version of the question to show based on showKana
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
                              <span className="mr-2 text-muted-foreground">
                                {index + 1}.
                              </span>
                              <span>{renderExamples(exampleTextToShow)}</span>
                            </div>
                            {example.question_en?.[0] && (
                              <div className="text-xs text-muted-foreground mt-1 pl-5">
                                {example.question_en[0]}
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                <RenderQuestionByType
                  type={activePart.type}
                  partId={partId}
                  onChange={handleChange}
                  isPartSubmitted={isPartSubmitted}
                  showKana={showKana}
                  getNumOfAnswers={getNumOfAnswers}
                  activePart={activePart}
                  userAnswers={userAnswers}
                  results={results}
                />
                <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                  <Button
                    onClick={() => handleReset(partId)}
                    variant="outline"
                    disabled={!isPartSubmitted && !hasAnswersForCurrentPart()}
                    className="w-full sm:w-auto"
                  >
                    Reset
                  </Button>
                  <Button
                    onClick={() => handleSubmit(partId)}
                    disabled={isPartSubmitted}
                    className="w-full sm:w-auto"
                  >
                    {isPartSubmitted ? "Submitted" : "Submit Answers"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-12">
                Please select an exercise part to begin.
              </div>
            )}
          </>
        ) : (
          <div className="flex justify-center items-center h-60 text-muted-foreground">
            No exercises available or data is invalid.
          </div>
        )}
      </div>
    </div>
  );
}
