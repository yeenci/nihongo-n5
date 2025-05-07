"use client";

import { renderExamples } from "@/app/components/exercises/helper";
import RenderQuestionByType from "@/app/components/exercises/render-question";
import Spinner from "@/app/components/spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useExerciseLogic } from "@/hooks/useExerciseLogic";
import { useLecturePartData } from "@/hooks/useLecturePartData";
import { useMemo } from "react";

export default function ExercisePage() {
  const { data, loading } = useLecturePartData();
  // const loading = false;

  const {
    activePartId,
    userAnswers,
    results,
    showKana,
    activePart,
    isPartSubmitted,
    setActivePartId,
    toggleKana,
    handleChange,
    handleSubmit,
    handleReset,
    getExpectedAnswerCount,
  } = useExerciseLogic(data);

  const exampleAnswersTrimmed = useMemo(() => {
    const answers = new Set<string>();
    if (
      !activePart ||
      !activePart.examples ||
      activePart.examples.length === 0 ||
      activePart.type !== "word-box"
    ) {
      return answers;
    }

    activePart.examples.forEach((ex) => {
      (ex.answer || []).forEach((ans) => ans && answers.add(ans.trim()));
      (ex.answer_kana || []).forEach(
        (ansKana) => ansKana && answers.add(ansKana.trim())
      );
      if (typeof ex.correctAnswer === "string" && ex.correctAnswer) {
        answers.add(ex.correctAnswer.trim());
      }
    });
    return answers;
  }, [activePart]);

  const currentPartOptions = useMemo(() => {
    if (!activePart) return undefined;
    return showKana ? activePart.options_kana : activePart.options;
  }, [activePart, showKana]);

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
            {/* --- Part Selection Buttons --- */}
            <div className="flex flex-wrap justify-center gap-2 mb-2 pb-4">
              {data.map((part, index) => (
                <Button
                  key={part.id}
                  variant={part.id === activePartId ? "default" : "outline"}
                  onClick={() => setActivePartId(part.id)}
                  className="rounded-full px-4 py-1 h-auto text-sm sm:text-base"
                  size="sm"
                >
                  Part {index + 1}
                </Button>
              ))}
            </div>

            {/* --- Active Part Content Area --- */}
            <div className="mt-4">
              {activePart && (
                <div
                  key={activePart.id}
                  className="space-y-6 bg-card p-4 sm:p-6 rounded-lg shadow"
                >
                  <h2 className="text-xl font-semibold mb-4 text-card-foreground">
                    {activePart.title}
                  </h2>

                  {currentPartOptions && currentPartOptions.length > 0 && (
                    <div className="p-3 border rounded bg-background shadow-sm">
                      <div className="flex flex-wrap gap-2">
                        {currentPartOptions.map((option, index) => {
                          const isUsedInExample = exampleAnswersTrimmed.has(
                            option.trim()
                          );
                          return (
                            <Badge
                              key={index}
                              variant={"outline"}
                              className={`text-base ${
                                isUsedInExample
                                  ? "line-through text-foreground opacity-50"
                                  : "text-foreground"
                              }`}
                            >
                              {option}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* --- Example (if any) --- */}
                  {activePart.examples && activePart.examples.length > 0 && (
                    <div className="p-4 border mb-4 rounded text-muted-foreground">
                      <h4 className="font-semibold mb-2">Example(s)</h4>
                      {activePart.examples.map((ex, index) => (
                        <pre
                          key={`ex-${activePart.id}-${index}`}
                          className="whitespace-pre-wrap text-sm font-sans"
                        >
                          {renderExamples(
                            showKana && ex.question_kana
                              ? "れい: " + ex.question_kana
                              : "例: " + ex.question
                          )}
                        </pre>
                      ))}
                    </div>
                  )}

                  {/* --- Questions --- */}
                  {activePart.questions.map((question) => {
                    const uniqueId = `${activePart.id}-${question.id}`;
                    const questionValue = userAnswers[uniqueId];
                    const questionResult =
                      results[activePart.id]?.[question.id];

                    return (
                      <RenderQuestionByType
                        key={uniqueId}
                        type={activePart.type}
                        questionData={{ ...question, uniqueId }}
                        partId={activePart.id}
                        questionId={question.id}
                        value={questionValue}
                        result={questionResult}
                        onChange={handleChange}
                        isPartSubmitted={isPartSubmitted}
                        showKana={showKana}
                        getExpectedAnswerCount={(q) =>
                          getExpectedAnswerCount(q)
                        }
                        activePart={activePart}
                      />
                    );
                  })}
                  <div className="mt-6 flex gap-3 justify-end border-t pt-6">
                    {/* --- Reset Button --- */}
                    {isPartSubmitted && (
                      <Button
                        onClick={() => handleReset(activePart.id)}
                        variant="outline"
                        size="lg"
                      >
                        Reset Answers
                      </Button>
                    )}

                    {/* --- Button for Submit --- */}
                    <Button
                      onClick={() => handleSubmit(activePart.id)}
                      disabled={isPartSubmitted}
                      size="lg"
                    >
                      {isPartSubmitted ? "Answers Submitted" : `Submit Answers`}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-full">
            No exercise is empty/invalid
          </div>
        )}
      </div>
    </div>
  );
}
