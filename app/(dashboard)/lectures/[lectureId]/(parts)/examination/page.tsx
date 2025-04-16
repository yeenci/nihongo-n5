"use client";

import NumberPart from "@/app/components/examination/number";
import { questions } from "@/app/constants/questions";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// const questions = allQuestions;

export default function ExaminationPage() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>(
    new Array(questions.length).fill(-1)
  );
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSelect = (index: number) => {
    const newAnswers = [...answers];
    newAnswers[current] = index;
    setAnswers(newAnswers);
  };

  const next = () => {
    if (current < questions.length - 1) setCurrent((prev) => prev + 1);
  };

  const prev = () => {
    if (current > 0) setCurrent((prev) => prev - 1);
  };

  const confirmSubmit = () => {
    setShowConfirm(true);
  };

  return (
    <div className="flex flex-row h-full justify-center w-full">
      <div className="w-full lg:w-4/5 xl:w-3/5 2xl:w-1/2">
        <h1 className="text-3xl font-bold my-4 text-primary">Examination</h1>
        <NumberPart current={current} questions={questions} />

        {/* Jump to Question Buttons */}
        <div className="my-6 flex flex-wrap gap-2">
          {questions.map((_, idx) => {
            const isCurrent = idx === current;
            const isAnswered = answers[idx] !== -1;

            let variant: "default" | "secondary" | "outline" = "outline";
            if (isCurrent) variant = "default";
            else if (isAnswered) variant = "secondary";

            return (
              <Button
                key={idx}
                variant={variant}
                onClick={() => setCurrent(idx)}
                className="w-10 h-10 rounded-full p-0 font-medium"
              >
                {idx + 1}
              </Button>
            );
          })}
        </div>

        {/* Question Display */}
        <div className="bg-background p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold mb-4">
            {questions[current].text}
          </h2>
          <div className="space-y-3">
            {questions[current].options.map((option, idx) => (
              <div
                key={idx}
                onClick={() => {
                  handleSelect(idx);
                }}
                className={`border rounded-xl px-4 py-2 cursor-pointer transition-all ${
                  answers[current] === idx
                    ? "border-primary bg-ring text-muted"
                    : "border-muted hover:bg-muted"
                }`}
              >
                {option}
              </div>
            ))}
          </div>
        </div>

        {/* Button */}
        <div className="flex justify-between mt-6">
          <Button
            variant="default"
            onClick={prev}
            disabled={current === 0}
            className="text-base"
          >
            Previous
          </Button>

          <Button
            variant="outline"
            onClick={confirmSubmit}
            className="text-base"
          >
            Submit
          </Button>

          <Button
            variant="default"
            onClick={next}
            disabled={answers[current] === answers[questions.length - 1]}
            className="text-base"
          >
            Next
          </Button>
        </div>

        {showConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center w-[90%] max-w-sm">
              {" "}
              <h3 className="text-lg font-semibold mb-4">
                Are you sure you want to submit?
              </h3>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
