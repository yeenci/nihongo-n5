/* eslint-disable @typescript-eslint/no-explicit-any */
// 5. Read and choose True/False

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function ReadParagraph({ question, onSubmit }: any) {
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const isCorrect = answer === question.correctAnswer;

  return (
    <div className="p-4 border rounded bg-muted">
      <p className="mb-2 whitespace-pre-wrap">{question.passage}</p>
      <p className="mb-2 font-medium">{question.question}</p>
      <div className="flex gap-4">
        {["True", "False"].map((opt) => (
          <label key={opt} className="flex gap-1 items-center">
            <Input
              type="radio"
              name={`tf-${question.id}`}
              value={opt}
              onChange={(e) => setAnswer(e.target.value)}
            />
            {opt}
          </label>
        ))}
      </div>
      <Button
        variant="default"
        onClick={() => {
          setSubmitted(true);
          onSubmit(isCorrect);
        }}
      >
        Submit
      </Button>
      {submitted && !isCorrect && (
        <p className="text-red-500 mt-2">
          Correct answer: {question.correctAnswer}
        </p>
      )}
      {submitted && isCorrect && (
        <p className="text-green-500 mt-2">Correct!</p>
      )}
    </div>
  );
}
