/* eslint-disable @typescript-eslint/no-explicit-any */
// 2. Choose in parentheses

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ChooseInParentheses({ question, onSubmit }: any) {
  const [selected, setSelected] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const isCorrect = selected === question.correctAnswer;

  const parts = question.question.split(/\((.*?)\)/);
  const options = parts[1]?.split("|") ?? [];

  return (
    <div className="p-4 border rounded bg-muted">
      <p className="mb-2">
        {parts[0]}
        <select
          className="border rounded px-2 py-1"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          <option value="">--Choose--</option>
          {options.map(({ opt, idx }: any) => (
            <option key={idx} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {parts[2]}
      </p>
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
