/* eslint-disable @typescript-eslint/no-explicit-any */
// 4. Finish sentence based on image or context

import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function FinishSentence({ question, onSubmit }: any) {
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const isCorrect = input.trim() === question.correctAnswer;

  return (
    <div className="p-4 border rounded bg-muted">
      {question.image && (
        <Image
          src={question.image}
          alt="Question Image"
          className="mb-3 rounded"
          width={300}
          height={50}
        />
      )}
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
            onSubmit(true);
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
