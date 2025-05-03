/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { renderExamples } from "@/app/components/exercises/helper";
import RenderQuestionByType from "@/app/components/exercises/render-question";
import Spinner from "@/app/components/spinner";
import { ExercisePart, Question } from "@/app/constants/exercise";
import { Button } from "@/components/ui/button";
import { useExerciseLogic } from "@/hooks/useExerciseLogic";
import { useLecturePartData } from "@/hooks/useLecturePartData";

export default function ExercisePage() {
  const { data, loading } = useLecturePartData();
  // const loading = false;

  const {
    activePartId,
    userAnswers,
    results,
    showKana,
    activePart,
    isPartSubmitted,
    setActivePartId,
    toggleKana,
    handleChange,
    handleSubmit,
    handleReset,
    getExpectedAnswerCount,
  } = useExerciseLogic(data);

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
              {data.map((part, index) => (
                <Button
                  key={part.id}
                  variant={part.id === activePartId ? "default" : "outline"}
                  onClick={() => setActivePartId(part.id)}
                  className="rounded-full px-4 py-1 h-auto text-sm sm:text-base"
                  size="sm"
                >
                  Part {index+1}
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
                    <div className="p-4 border mb-4 rounded text-muted-foreground">
                      <h4 className="font-semibold mb-2">Example(s)</h4>
                      {activePart.examples.map((ex, index) => (
                        <pre
                          key={`ex-${activePart.id}-${index}`}
                          className="whitespace-pre-wrap text-sm font-sans"
                        >
                          {renderExamples(
                            showKana && ex.question_kana
                              ? "れい:" + ex.question_kana
                              : "例:" + ex.question
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
                        onClick={() => handleReset(activePart.id)}
                        variant="outline"
                        size="lg"
                      >
                        Reset Answers
                      </Button>
                    )}

                    {/* --- Button for Submit --- */}
                    <Button
                      onClick={() => handleSubmit(activePart.id)}
                      disabled={isPartSubmitted}
                      size="lg"
                    >
                      {isPartSubmitted
                        ? "Part Submitted"
                        : `Submit Answers`}
                    </Button>
                  </div>
                </div>
              )}
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
