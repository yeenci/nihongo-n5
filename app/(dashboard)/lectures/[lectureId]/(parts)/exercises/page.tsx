/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import RenderQuestionByType from "@/app/components/exercises/render-question";
import Spinner from "@/app/components/spinner";
import { ExercisePart, Question } from "@/app/constants/exercise";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";

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

  // Handles input changes for single/multiple answers
  const handleChange = (
    partId: string,
    questionId: string,
    value: string,
    blankIndex?: number
  ) => {
    const uniqueId = `${partId}-${questionId}`;
    const part = data.find((p) => p.id === partId);
    const question = part?.questions.find((q) => q.id === questionId);
    if (!question) return;

    const expectedCount = getExpectedAnswerCount(question);

    setUsersAnswers((prev) => {
      const newAnswers = { ...prev };
      const currentAnswer = prev[uniqueId];

      if (expectedCount > 1) {
        let currentArray: string[] = [];

        if (Array.isArray(currentAnswer)) {
          currentArray = [...currentAnswer];
        }

        while (currentAnswer.length < expectedCount) {
          currentArray.push("");
        }

        if (currentArray.length > expectedCount) {
          currentArray = currentArray.slice(0, expectedCount);
        }

        // Update the specific index
        if (blankIndex !== undefined && blankIndex < expectedCount) {
          currentArray[blankIndex] = value;
        }

        newAnswers[uniqueId] = currentArray;
      } else {
        newAnswers[uniqueId] = value;
      }

      return newAnswers;
    });

    // Reset results for the question if the part was already submitted
    if (partSubmittedStatus[partId]) {
      setResults((prev) => {
        const partResults = { ...(prev[partId] || {}) };

        // Reset by removing the result for this question entirely
        delete partResults[questionId];
        return { ...prev, [partId]: partResults };
      });
    }
  };

  // Submit answers for the currently active part
  const handlePartSubmit = (partId: string) => {
    const part = data.find((p) => p.id === partId);
    if (!part) return;

    const newPartResults: {
      [questionId: string]: (boolean | null) | (boolean | null)[];
    } = {};
    part.questions.forEach((question) => {
      const uniqueId = `${part.id}-${question.id}`;
      const userAnswer = userAnswers[uniqueId];
      newPartResults[question.id] = checkAnswer(userAnswer, question, showKana);
    });

    setResults((prev) => ({ ...prev, [partId]: newPartResults }));
    setPartSubmittedStatus((prev) => ({ ...prev, [partId]: true }));
  };

  // Toggles Kana/Kanji display mode and recalculates results for submitted parts
  const toggleKana = () => {
    const newKanaMode = !showKana;
    setShowKana(newKanaMode);

    // Recalculates results for submitted parts based on the new display mode
    const updatedResults: typeof results = {};
    const submittedPartIds = Object.keys(partSubmittedStatus).filter(
      (id) => partSubmittedStatus[id]
    );

    data.forEach((part) => {
      if (submittedPartIds.includes(part.id)) {
        const newPartResults: (typeof results)[string] = {};

        part.questions.forEach((question) => {
          const uniqueId = `${part.id}-${question.id}`;
          const userAnswer = userAnswers[uniqueId];
          newPartResults[question.id] = checkAnswer(
            userAnswer,
            question,
            newKanaMode
          );
          updatedResults[part.id] = newPartResults;
        });
      } else {
        // Keep existing results (likely empty/null) for non-submitted parts
        updatedResults[part.id] = results[part.id] || {};
      }
    });
  };

  const handlePartReset = (partId: string) => {
    const part = data.find((p) => p.id === partId);
    if (!part) return;

    // Clear user answers for this part
    setUsersAnswers((prev) => {
      const updatedAnswers = { ...prev };
      part.questions.forEach((q) => {
        const uniqueId = `${part.id}-${q.id}`;
        delete updatedAnswers[uniqueId];
      });
      return updatedAnswers;
    });

    // Clear results for this part
    setResults((prev) => {
      const updateResults = { ...prev };
      delete updateResults[partId];
      return updateResults;
    });

    // Reset submission status for this part
    setPartSubmittedStatus((prev) => ({
      ...prev,
      [partId]: false,
    }));
  };

  const activePart = data.find((part) => part.id === activePartId);
  const isPartSubmitted = activePartId
    ? partSubmittedStatus[activePartId] ?? false
    : false;

  return (
    <div className="flex flex-row h-full justify-center w-full">
      <div className="w-full lg:w-4/5 xl:w-3/5 2xl:w-1/2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold my-4 text-primary">Exercises</h1>
          {!loading && data && (
            <Button onClick={toggleKana} variant="outline">
              Toggle {showKana ? "Kanji" : "Kana"}
            </Button>
          )}
        </div>

        {loading ? (
          <Spinner />
        ) : Array.isArray(data) && data.length > 0 ? (
          <div>
            {/* --- Part Selection Buttons --- */}
            <div className="flex flex-wrap justify-center gap-2 mb-2 pb-4">
              {data.map((part) => (
                <Button
                  key={part.id}
                  variant={part.id === activePartId ? "default" : "outline"}
                  onClick={() => setActivePartId(part.id)}
                  className="rounded-full px-4 py-1 h-auto text-sm sm:text-base"
                  size="sm"
                >
                  {part.partId}
                </Button>
              ))}
            </div>

            {/* --- Active Part Content Area --- */}
            <div className="mt-4">
              {activePart && (
                <div
                  key={activePart.id}
                  className="space-y-6 bg-card p-4 sm:p-6 rounded-lg shadow"
                >
                  <h2 className="text-xl font-semibold mb-4 text-card-foreground">
                    {activePart.title}
                  </h2>

                  {/* --- Example (if any) --- */}
                  {activePart.examples && activePart.examples.length > 0 && (
                    <div className="py-3 mb-4 rounded text-muted-foreground">
                      <h4 className="font-semibold mb-2">Example(s)</h4>
                      {activePart.examples.map((ex, index) => (
                        <pre
                          key={`ex-${activePart.id}-${index}`}
                          className="whitespace-pre-wrap text-sm font-sans"
                        >
                          {renderExamples(
                            showKana && ex.question_kana
                              ? ex.question_kana
                              : ex.question
                          )}
                        </pre>
                      ))}
                    </div>
                  )}

                  {/* --- Questions --- */}
                  {activePart.questions.map((question) => {
                    const uniqueId = `${activePart.id}-${question.id}`;
                    const questionValue = userAnswers[uniqueId];
                    const questionResult =
                      results[activePart.id]?.[question.id];

                    return (
                      <RenderQuestionByType
                        key={uniqueId}
                        type={activePart.type}
                        questionData={{ ...question, uniqueId }}
                        partId={activePart.id}
                        questionId={question.id}
                        value={questionValue}
                        result={questionResult}
                        onChange={handleChange}
                        isPartSubmitted={isPartSubmitted}
                        showKana={showKana}
                        getExpectedAnswerCount={(q) =>
                          getExpectedAnswerCount(q)
                        }
                      />
                    );
                  })}
                  <div className="mt-6 flex gap-3 justify-end border-t pt-6">
                    {/* --- Reset Button --- */}
                    {isPartSubmitted && (
                      <Button
                        onClick={() => handlePartReset(activePart.id)}
                        variant="outline"
                        size="lg"
                      >
                        Reset Part
                      </Button>
                    )}

                    {/* --- Button for Submit --- */}
                    <Button
                      onClick={() => handlePartSubmit(activePart.id)}
                      disabled={isPartSubmitted}
                      size="lg"
                    >
                      {isPartSubmitted
                        ? "Part Submitted"
                        : `Submit ${activePart.title}`}
                    </Button>
                  </div>
                </div>
              )}

              {/* {!activePart && activePartId !== null && (
                <div className="text-center text-muted-foreground">
                  Select a part to begin.
                </div>
              )}
              {!activePart && activePartId === null && data.length > 0 && (
                <div className="text-center text-muted-foreground">Loading first part...</div>
              )} */}
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-full">
            No exercise is empty/invalid
          </div>
        )}
      </div>
    </div>
  );
}

const renderExamples = (text: string | undefined | null): React.ReactNode[] => {
  if (!text) return [];

  const parts: React.ReactNode[] = [];
  const regex = /（　(.*?)　）/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(
        <span key={`text-${lastIndex}`}>
          {text.substring(lastIndex, match.index)}
        </span>
      );
    }
    parts.push(
      <span
        key={`underline-${match.index}`}
        className="underline font-medium text-primary"
      >
        {"　"}
        <span className="underline">{match[1]}</span>
        {"　"}
      </span>
    );
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(
      <span key={`text-${lastIndex}`}>{text.substring(lastIndex)}</span>
    );
  }

  return parts;
};

const exerciseParts: ExercisePart[] = [
  {
    id: "part1",
    partId: "Part 1",
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
    partId: "Part 2",
    type: "fill-in-the-blank",
    title: "Part 2",
    images: [],
    examples: [
      {
        id: "ex1",
        question:
          "A：あした 暇ですか。\nB：あしたは 会社へ 行かなければ なりません。\n→ Bさんは あしたは （　会社へ 行かなければ ならない　）と 言いました。",
        question_kana:
          "A：あした ひまですか。\nB：あしたは かいしゃへ いかなければ なりません。\n→ Bさんは あしたは （　かいしゃへ いかなければ ならない　）と いいました。",
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
    id: "part3",
    partId: "Part 3",
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
