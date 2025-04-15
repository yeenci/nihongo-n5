"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

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
    <div>
      <div className="flex h-full justify-center w-full">
        <div className="w-full flex flex-row gap-4">
          <div className="flex flex-col justify-between">
            <h1 className="text-3xl font-bold my-4 text-primary">
              Examination
            </h1>
          </div>
        </div>
      </div>

      <div className="mb-4 text-sm text-muted-foreground">
        Question {current + 1} of {questions.length}
        <div className="w-full bg-muted rounded-full h-2 mt-1">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${((current + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

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

      <div className="flex justify-between mt-6">
        <Button variant="default" onClick={prev} disabled={current === 0}>
          Previous
        </Button>

        <Button variant="outline" className="" onClick={confirmSubmit}>
          Submit
        </Button>
        <Button
          variant="default"
          onClick={next}
          disabled={answers[current] === -1}
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
  );
}

type Question = {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
};

const questions: Question[] = [
  {
    id: 1,
    text: "What is the capital of France?",
    options: ["Berlin", "London", "Paris", "Rome"],
    correctIndex: 2,
  },
  {
    id: 2,
    text: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    correctIndex: 1,
  },
  {
    id: 3,
    text: 'Who wrote "To be, or not to be"?',
    options: [
      "Charles Dickens",
      "William Shakespeare",
      "J.K. Rowling",
      "Hemingway",
    ],
    correctIndex: 1,
  },
];
