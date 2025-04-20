/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import RenderQuestionByType from "@/app/components/exercises/render-question";
import { Button } from "@/components/ui/button";
import { useLecturePartData } from "@/hooks/useLecturePartData";
import { useState } from "react";

export default function ExercisesPage() {
  const { data, loading } = useLecturePartData();

  const [expandedParts, setExpandedParts] = useState<{
    [key: string]: boolean;
  }>({});

  const togglePart = (id: string) => {
    setExpandedParts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex flex-row h-full justify-center w-full">
      <div className="w-full lg:w-4/5 xl:w-3/5 2xl:w-1/2">
        {/* <div className="flex"> */}
        <h1 className="text-3xl font-bold my-4 text-primary">Exercises</h1>
        {/* </div> */}
        {exerciseParts.map((part) => (
          <div
            key={part.id}
            className="mb-4 border rounded-lg bg-background shadow"
          >
            <button
              // value="outline"
              className="flex text-left w-full px-4 py-3 font-semibold cursor-pointer"
              onClick={() => togglePart(part.id)}
            >
              {part.title}
            </button>

            {expandedParts[part.id] && (
              <div className="p-4 border-t space-y-6">
                {part.questions.map((question) => (
                  <RenderQuestionByType
                    key={question.id}
                    type={part.type}
                    question={question}
                    onSubmit={() => {}}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const exerciseParts = [
  {
    id: "part1",
    type: "fill-in-the-blank",
    title: "Part 1: Fill in the blank with the correct word",
    questions: [
      { id: "1", question: "わたし ___ がくせいです。", correctAnswer: "は" },
      {
        id: "2",
        question: "これは でんしゃ ___ きっぷです。",
        correctAnswer: "の",
      },
    ],
  },
  {
    id: "part2",
    type: "choose-in-parentheses",
    title: "Part 2: Choose the appropriate answer in the parentheses",
    questions: [
      {
        id: "3",
        question: "きょうは (あめ|ゆき|くもり) です。",
        correctAnswer: "あめ",
      },
    ],
  },
  {
    id: "part3",
    type: "rearrange",
    title: "Part 3: Rearrange words to make a complete sentence",
    questions: [
      {
        id: "4",
        words: ["たなかさん", "です", "わたしは"],
        correctAnswer: "わたしは たなかさん です",
      },
    ],
  },
  {
    id: "part4",
    type: "finish-sentence",
    title: "Part 4: Finish the sentence based on the answer/image",
    questions: [
      {
        id: "5",
        image: "/img/src.png",
        question: "A: おなまえは？ B: _________",
        correctAnswer: "なまえはたなかです",
      },
    ],
  },
  {
    id: "part5",
    type: "true-false",
    title: "Part 5: Read the paragraph and choose True/False",
    questions: [
      {
        id: "6",
        passage:
          "たなかさんは にほんじん です。まいにち でんしゃで しごとに いきます。",
        question: "Tanaka-san goes to work by train every day.",
        correctAnswer: "True",
      },
    ],
  },
  {
    id: "part6",
    type: "word-box",
    title: "Part 6: Choose appropriate word from the box and fill in the blank",
    questions: [
      {
        id: "7",
        sentence: "これは ___ ほんです。",
        options: ["わたしの", "あなたの", "かれの"],
        correctAnswer: "わたしの",
      },
    ],
  },
];
