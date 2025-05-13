// 1. Fill in the blank
"use client";

import { ExercisePart, Question } from "@/app/constants/exercise";
import { useState } from "react";
import { AnswerInput } from "../exercises/answer-input";

interface FillInTheBlankProps {
  questionData: Question[];
  partId: string;
  // questionId: string[];
  // value: string[] | string | undefined;
  onChange: (
    partId: string,
    questionId: string,
    value: string,
    idx?: number
  ) => void;
  isPartSubmitted: boolean;
  // result: (boolean | null) | (boolean | null)[] | undefined;
  showKana: boolean;
  getNumOfAnswers: (question: Question) => number;
  activePart: ExercisePart | undefined;
}

export default function FillInTheBlank({
  questionData,
  partId,
  // questionId,
  // value,
  onChange,
  isPartSubmitted,
  // result,
  showKana,
  getNumOfAnswers,
  activePart,
}: FillInTheBlankProps) {

  // const displayQuestion = useMemo(
  //   (question) =>
  //     showKana && question.question_kana
  //       ? question.question_kana
  //       : question.question,
  //   [showKana, questionData]
  // );
  return (
    <div>
      {/* {questionData.questions && (<div></div>)} */}
      {activePart && (
        <div key={activePart.id}>
          <h2 className="text-xl font-semibold mb-4 text-card-foreground">
            {activePart.title}
          </h2>
          {activePart.questions.map((question) => {
            const uniqueId = `${activePart.id}-${question.id}`;
            return (
              <div
                key={uniqueId}
                className="p-4 border rounded transition-colors duration-300"
              >
                {" "}
                <span className="font-semibold mr-2 text-foreground/80">
                  Question {question.id}.
                </span>
                
      <AnswerInput
        question={question}
        showKana={showKana}
        isPartSubmitted={isPartSubmitted}
        partId={partId}
        questionId={question.id}
        getNumOfAnswers={getNumOfAnswers}
        onChange={onChange}
      />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
