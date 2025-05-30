"use client";

import NumberPart from "@/app/components/examination/number";
import ConfirmationModal from "@/app/components/modal";
import { questions } from "@/app/constants/questions";
import { Button } from "@/components/ui/button";
import { Book, Check, FileText, PartyPopper, RotateCcw, X } from "lucide-react";
import { useState } from "react";

// const questions = allQuestions;

export default function ExaminationPage() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>(
    new Array(questions.length).fill(-1)
  );
  const [score, setScore] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);

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

  const handleFinalSubmit = () => {
    let total = 0;
    answers.forEach((answer, idx) => {
      if (answer == questions[idx].correctIndex) total += 1;
    });
    setScore(total);
    setIsSubmitted(true);
    setShowConfirm(false);
  };

  const handleRestart = () => {
    setAnswers(new Array(questions.length).fill(-1));
    setCurrent(0);
    setIsSubmitted(false);
    setScore(null);
    setShowAnswers(false);
  };

  if (isSubmitted && score !== null) {
    return (
      <div className="flex flex-col">
        <div className="">
          <h1 className="text-3xl font-bold my-4 text-primary">Examination</h1>
          <div className="flex flex-col items-center">
            <h2 className="flex gap-2 text-primary font-bold text-xl">
              <PartyPopper /> Exam Completed
            </h2>
            <p className="text-lg mt-2">Your Score:</p>
            <p className="text-4xl font-bold text-primary mt-1">
              {score} / {questions.length}
            </p>

            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
              <Button variant="outline" onClick={handleRestart}>
                <RotateCcw />
                Redo Test
              </Button>
              <Button onClick={() => setShowAnswers(true)}>
                <FileText />
                View Answers
              </Button>
            </div>
          </div>
        </div>
        {showAnswers && (
          <div className="flex flex-row h-full justify-center w-full">
            <div className="w-full lg:w-4/5 xl:w-3/5 2xl:w-1/2">
              <h3 className="flex gap-2 text-primary font-bold text-lg">
                <Book /> Your Answers
              </h3>
              {questions.map((q, idx) => (
                <div key={q.id} className="mb-6 p-4 bg-white rounded-lg shadow">
                  <p className="font-semibold text-muted-foreground mb-2">
                    Q{idx + 1}. {q.text}
                  </p>
                  <ul className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = answers[idx] === optIdx;
                      const isCorrect = q.correctIndex === optIdx;
                      const isWrongChoice = isSelected && !isCorrect;

                      return (
                        <li
                          key={optIdx}
                          className={`flex px-3 py-2 rounded-md border ${
                            isCorrect
                              ? "bg-green-100 border-green-500"
                              : isWrongChoice
                              ? "bg-red-100 border-red-500"
                              : isSelected
                              ? "bg-blue-100 border-blue-500"
                              : "border-muted"
                          }`}
                        >
                          {opt}
                          {isCorrect && (
                            <span className="flex ml-2 text-green-700">
                              <Check /> Correct
                            </span>
                          )}
                          {isWrongChoice && (
                            <span className="flex ml-2 text-red-600">
                              <X /> Your Choice
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

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
          <div className="flex gap-4">
            <Button
              variant="default"
              onClick={prev}
              disabled={current === 0}
              className="text-base"
            >
              Previous
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

          <Button
            variant="outline"
            onClick={confirmSubmit}
            className="text-base"
          >
            Submit
          </Button>
        </div>

        <ConfirmationModal
          open={showConfirm}
          title="Are you sure you want to submit?"
          onCancel={() => setShowConfirm(false)}
          onConfirm={handleFinalSubmit}
          confirmText="Submit"
        />
      </div>
    </div>
  );
}
