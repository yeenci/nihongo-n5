"use client";

import FillInTheBlank from "@/app/components/exercise-types/fill-in-the-blank";
import RenderQuestionByType from "@/app/components/exercise-types/render-question";
import Spinner from "@/app/components/spinner";
import { Button } from "@/components/ui/button";
import { useExerciseLogic } from "@/hooks/useExerciseLogic";
import { useLecturePartData } from "@/hooks/useLecturePartData";

export default function ExercisePage() {
  const { data, loading } = useLecturePartData();

  const {
    partId,
    userAnswers,
    results,
    partStatus,
    showKana,
    setPartId,
    toggleKana,
    handleChange,
    handleSubmit,
    handleReset,
    activePart,
    isPartSubmitted,
    getNumOfAnswers,
  } = useExerciseLogic(data);

  return (
    <div className="flex flex-row h-full justify-center w-full">
      <div className="w-full lg:w-4/5 xl:w-3/5 2xl:w-1/2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold my-4 text-primary">Exercises</h1>
          {!loading && data && (
            <Button onClick={toggleKana} variant="outline">
              Toggle {showKana ? "Kanji" : "Kana"}
            </Button>
          )}
        </div>
        {loading ? (
          <Spinner />
        ) : Array.isArray(data) && data.length > 0 ? (
          <div>
            {/* --- Toggle between parts of each lecture --- */}
            <div className="flex flex-wrap justify-center gap-2 mb-2 pb-4">
              {data.map((part, index) => (
                <Button
                  key={part.id}
                  variant={part.id === partId ? "default" : "outline"}
                  onClick={() => setPartId(part.id)}
                  className="rounded-full px-4 py-1 h-auto text-sm sm:text-base"
                  size="sm"
                >
                  Part {index + 1}
                </Button>
              ))}
            </div>

            {/* --- Current Part Content --- */}
            <div className="mt-4">
              {activePart && (
                <div
                  key={activePart.id}
                  className="space-y-6 bg-card p-4 sm:p-6 rounded-lg shadow"
                >
                  <h2 className="text-xl font-semibold mb-4 text-card-foreground">
                    {activePart.title}
                  </h2>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-full">
            No exercise is empty/invalid
          </div>
        )}
        <div className="w-full flex flex-row gap-4"></div>
      </div>
    </div>
  );
}
