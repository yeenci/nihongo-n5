import { Question } from "@/app/constants/questions";
import React from "react";

interface Props {
    current: number;
    questions: Question[];
}

export default function NumberPart({current, questions}: Props) {
  return (
    <div className="mb-4 text-sm text-muted-foreground">
      Question {current + 1} of {questions.length}
      <div className="w-full bg-muted rounded-full h-2 mt-1">
        <div
          className="bg-primary h-2 rounded-full transition-all"
          style={{ width: `${((current + 1) / questions.length) * 100}%` }}
        />
      </div>
    </div>
  );
}