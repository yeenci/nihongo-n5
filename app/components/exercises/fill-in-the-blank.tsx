/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function FillInTheBlank({ question, onSubmit }: any) {
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const isCorrect = input.trim() === question.correctAnswer;

  return (
    <div className="p-4 border rounded bg-muted">
      <p className="mb-2">{question.question}</p>
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter Your Answer"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button
          variant="default"
          onClick={() => {
            setSubmitted(true);
            onSubmit(isCorrect);
          }}
        >
          Submit
        </Button>
      </div>
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
