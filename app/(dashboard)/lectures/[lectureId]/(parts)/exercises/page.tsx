/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Question } from "@/app/constants/exercise";
import { useCallback, useEffect, useState } from "react";

interface ExercisePart {
  id: string;
  type: string;
  title: string;
  questions: Question[];
  examples?: Question[];
  images?: string[];
}

export default function ExercisePage() {
  // const { data, loading } = useLecturePartData();
  const data = exerciseParts;
  const loading = false;

  // State to track the currently visible part
  const [activePartId, setActivePartId] = useState<string | null>(null);

  // State to hold user answers
  const [userAnswers, setUsersAnswers] = useState<{
    [key: string]: string | string[];
  }>({});

  // State to hold results per part
  const [results, setResults] = useState<{
    [pardId: string]: {
      [questionId: string]: (boolean | null) | (boolean | null)[];
    };
  }>({});

  // State to track submission status per part
  const [partSubmittedStatus, setPartSubmittedStatus] = useState<{
    [pardId: string]: boolean;
  }>({});

  // State for Kana/Kanji toggle (true = show Kana)
  const [showKana, setShowKana] = useState<boolean>(false);

  // Set the first part as active initially when data is loaded
  useEffect(() => {
    if (data && data.length > 0 && activePartId === null) {
      setActivePartId(data[0].id);
    }
  }, [data, activePartId]);

  // Get the expected number of answers for a question
  // Prioritizes `answer` length, falls back to `answer_kana`, then 1.
  const getExpectedAnswerCount = useCallback((question: Question): number => {
    if (
      question.answer &&
      Array.isArray(question.answer) &&
      question.answer.length > 0
    ) {
      return question.answer.length;
    }

    if (
      question.answer_kana &&
      Array.isArray(question.answer_kana) &&
      question.answer_kana.length > 0
    ) {
      return question.answer_kana.length;
    }

    return question.correctAnswer ? 1 : 1;
  }, []);

  // Checks answer against both kanji and katakana/hiragana
  const checkAnswer = useCallback(
    (
      userInput: string | string[] | undefined,
      question: Question,
      isKanaMode: boolean
    ): (boolean | null) | (boolean | null)[] => {
      const expectedCount = getExpectedAnswerCount(question);

      if (expectedCount > 1) {
        const userInputsArray = Array.isArray(userInput) ? userInput : [];
        const resultsArray: (boolean | null)[] = [];

        for (let i = 0; i < expectedCount; i++) {
          const userInputTrimmed = (userInputsArray[i] ?? "").trim();
          const correctKanji = (question.answer?.[i] ?? null)?.trim();
          const correctKana = (question.answer_kana?.[i] ?? null)?.trim();

          let areCorrectAnswers = false;

          // Check non-empty input
          if (userInputTrimmed !== "") {
            areCorrectAnswers =
              (correctKana !== null && userInputTrimmed === correctKana) ||
              (correctKanji !== null && userInputTrimmed === correctKanji);
          }

          // Check empty input
          if (correctKanji === null && correctKana === null) {
            resultsArray.push(null);
          } else {
            resultsArray.push(areCorrectAnswers);
          }
        }
        return resultsArray;
      } else {
        const userInputTrimmed = (
          typeof userInput === "string"
            ? userInput
            : (Array.isArray(userInput) ? userInput[0] : "") ?? ""
        ).trim();
        const correctKanji = (
          question.answer?.[0] ??
          question.correctAnswer ??
          null
        )?.trim();
        const correctKana = (question.answer_kana?.[0] ?? null)?.trim();

        let isCorrectAnswer = false;

        if (userInputTrimmed !== "") {
          isCorrectAnswer =
            (correctKanji !== null && userInputTrimmed === correctKanji) ||
            (correctKana !== null && userInputTrimmed === correctKana);
        }

        if (correctKanji === null && correctKana === null) {
          return null;
        } else return isCorrectAnswer;
      }
    },
    [getExpectedAnswerCount]
  );
}

const exerciseParts: ExercisePart[] = [
  {
    id: "part1_old",
    type: "fill-in-the-blank",
    title: "Part 1", // Use a suitable title for the button
    questions: [
      {
        id: "1",
        question: "わたし （＿＿） がくせいです。",
        question_kana: "わたし （＿＿） がくせい です。",
        answer: ["は"],
        answer_kana: ["は"],
      },
      {
        id: "2",
        question: "これは でんしゃ （＿＿） きっぷです。",
        question_kana: "これ は でんしゃ （＿＿） きっぷ です。",
        answer: ["の"],
        answer_kana: ["の"],
      },
    ],
  },
  {
    id: "part2",
    type: "fill-in-the-blank",
    title: "Part 2",
    images: [],
    examples: [
      {
        id: "ex1",
        question:
          "A：あした 暇ですか。\nB：あしたは 会社へ 行かなければ なりません。\n→ Bさんは あしたは （会社へ 行かなければ ならない）と 言いました。",
        question_kana:
          "A：あした ひまですか。\nB：あしたは かいしゃへ いかなければ なりません。\n→ Bさんは あしたは （かいしゃへ いかなければ ならない）と いいました。",
        question_en:
          "A: Are you free tomorrow?\nB: Tomorrow I must go to the company.\n→ B said that he must go to the company tomorrow.",
        answer: ["会社へ 行かなければ ならない"],
        answer_kana: ["かいしゃへ いかなければ ならない"],
      },
    ],
    questions: [
      {
        id: "1",
        question:
          "A：桜の 季節ですね。どこか お花見に 行きませんか。\nB：ええ、日曜日 家族と 吉野山へ 行きます。\n→ Bさんは （＿＿）と 言いました。",
        question_kana:
          "A：さくらの きせつですね。どこか おはなみに いきませんか。\nB：ええ、にちようび かぞくと よしのやまへ いきます。\n→ Bさんは （＿＿）と いいました。",
        question_en:
          "A: It's cherry blossom season, isn't it? Won't you go somewhere for cherry blossom viewing?\nB: Yes, on Sunday I will go to Mt. Yoshino with my family.\n→ B said that he will go to Mt. Yoshino with his family on Sunday.",
        answer: ["日曜日 家族と 吉野山へ 行く"],
        answer_kana: ["にちようび かぞくと よしのやまへ いく"],
      },
      {
        id: "2",
        question:
          "A：この 本、おもしろいですよ。\nB：そうですか。じゃ、貸して ください。\n→ Aさんは この 本は （＿＿）と 言いました。",
        question_kana:
          "A：この ほん、おもしろいですよ。\nB：そうですか。じゃ、かして ください。\n→ Aさんは この ほんは （＿＿）と いいました。",
        question_en:
          "A: This book is interesting, you know.\nB: Is that so? Then, please lend it to me.\n→ A said that this book is interesting.",
        answer: ["おもしろい"],
        answer_kana: ["おもしろい"],
      },
    ],
  },
  {
    id: "part_multi_input",
    type: "fill-in-the-blank",
    title: "Part 3: Multi-Input", // Example title
    questions: [
      {
        id: "1", // Example with one input
        question: "Aさんは （＿＿）と 言いました。",
        question_kana: "Aさんは （＿＿）と いいました。",
        answer: ["おもしろい"],
        answer_kana: ["おもしろい"],
      },
      {
        id: "2", // Example with two inputs
        question:
          "太郎ちゃんは　うちの　仕事を　手伝いますか。\n... ええ、（＿＿）り、（＿＿）り　しますよ。",
        question_kana:
          "たろうちゃんは　うちの　しごとを　てつだいますか。\n... ええ、（＿＿）り、（＿＿）り　しますよ。",
        question_en:
          "Does Taro help with the housework?\n... Yes, he does things like cleaning and going shopping.",
        answer: ["掃除した", "買い物に 行った"],
        answer_kana: ["そうじした", "かいものに いった"],
      },
      {
        id: "3", // Example with two inputs
        question:
          "趣味は　何ですか。\n... 絵を（＿＿）り、音楽を（＿＿）り　する　ことです。",
        question_kana:
          "しゅみは　なんですか。\n... えを（＿＿）り、おんがくを（＿＿）り　する　ことです。",
        question_en:
          "What is your hobby?\n... It's doing things like drawing pictures and listening to music.",
        answer: ["かいた", "聞いた"],
        answer_kana: ["かいた", "きいた"],
      },
    ],
  },
  // Add other parts...
];
