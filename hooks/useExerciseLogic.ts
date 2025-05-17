/* eslint-disable @typescript-eslint/no-unused-vars */
// hooks/useExerciseLogic.ts
import { ExercisePart, Question, regex } from "@/app/constants/exercise";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

interface ExerciseLogicProps {
  partId: string | null;
  userAnswers: { [key: string]: string | string[] };
  results: {
    [partId: string]: {
      [questionId: string]: (boolean | null) | (boolean | null)[];
    };
  };
  showKana: boolean;
  activePart: ExercisePart | undefined;
  isPartSubmitted: boolean;
  setPartId: Dispatch<SetStateAction<string | null>>;
  toggleKana: () => void;
  handleChange: (
    partId: string,
    questionId: string,
    value: string,
    idx?: number
  ) => void;
  handleSubmit: (partId: string) => void;
  handleReset: (partId: string) => void;
  getNumOfAnswers: (question: Question) => number;
}

export function useExerciseLogic(
  exerciseData: ExercisePart[] | undefined
): ExerciseLogicProps {
  const [partId, setPartId] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<{
    [key: string]: string | string[];
  }>({});
  const [results, setResults] = useState<{
    [partId: string]: {
      [questionId: string]: (boolean | null) | (boolean | null)[];
    };
  }>({});
  const [partSubmissionStatus, setPartSubmissionStatus] = useState<{
    [partId: string]: boolean;
  }>({});
  const [showKana, setShowKana] = useState<boolean>(false);

  useEffect(() => {
    if (exerciseData && exerciseData.length > 0 && partId === null) {
      setPartId(exerciseData[0].id);
    }
  }, [exerciseData, partId]);

  const getNumOfAnswers = useCallback((question: Question): number => {
    if (
      question.num_of_answer &&
      question.num_of_answer.length > 0 &&
      question.num_of_answer[0]
    ) {
      const num = parseInt(question.num_of_answer[0], 10);
      if (!isNaN(num) && num > 0) return num;
    }
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
    return 1;
  }, []);

  const checkAnswers = useCallback(
    (
      userAnswer: string | string[] | undefined,
      question: Question,
      isKanaMode: boolean
    ): (boolean | null) | (boolean | null)[] => {
      const numOfExpectedAnswers = getNumOfAnswers(question);

      if (numOfExpectedAnswers > 1) {
        const userAnswersArray = Array.isArray(userAnswer) ? userAnswer : [];
        const resultsArray: (boolean | null)[] = [];

        for (let i = 0; i < numOfExpectedAnswers; i++) {
          const userAnswerTrimmed = (userAnswersArray[i] ?? "")
            .trim()
            .replaceAll(regex, "");
          const correctKanji = (question.answer?.[i] ?? null)
            ?.trim()
            .replaceAll(regex, "");
          const correctKana = (question.answer_kana?.[i] ?? null)
            ?.trim()
            .replaceAll(regex, "");

          let isCorrect = false;
          if (userAnswerTrimmed !== "") {
            isCorrect =
              (correctKana !== null && userAnswerTrimmed === correctKana) ||
              (correctKanji !== null && userAnswerTrimmed === correctKanji);
          }

          if (
            correctKanji === null &&
            correctKana === null &&
            question.answer?.[i] === undefined &&
            question.answer_kana?.[i] === undefined
          ) {
            resultsArray.push(null);
          } else {
            resultsArray.push(isCorrect);
          }
        }
        return resultsArray;
      } else {
        const userInputTrimmed = (
          typeof userAnswer === "string"
            ? userAnswer
            : (Array.isArray(userAnswer) ? userAnswer[0] : "") ?? ""
        )
          .trim()
          .replaceAll(regex, "");
        const correctKanji = (question.answer?.[0] ?? null)
          ?.trim()
          .replaceAll(regex, "");
        const correctKana = (question.answer_kana?.[0] ?? null)
          ?.trim()
          .replaceAll(regex, "");

        let isCorrect = false;
        if (userInputTrimmed !== "") {
          isCorrect =
            (correctKanji !== null && userInputTrimmed === correctKanji) ||
            (correctKana !== null && userInputTrimmed === correctKana);
        }

        if (
          correctKanji === null &&
          correctKana === null &&
          question.answer?.[0] === undefined &&
          question.answer_kana?.[0] === undefined
        ) {
          return null;
        } else {
          return isCorrect;
        }
      }
    },
    [getNumOfAnswers]
  );

  const handleChange = useCallback(
    (
      currentPartId: string,
      questionId: string,
      value: string,
      idx?: number
    ) => {
      if (!exerciseData) return;
      const uniqueQuestionKey = `${currentPartId}-${questionId}`;
      const part = exerciseData.find((p) => p.id === currentPartId);
      const question = part?.questions.find((q) => q.id === questionId);
      if (!question) return;

      const numOfExpectedAnswers = getNumOfAnswers(question);

      setUserAnswers((prev) => {
        const newAnswers = { ...prev };
        const currentAnswerForQuestion = prev[uniqueQuestionKey];

        if (numOfExpectedAnswers > 1) {
          let answerArray: string[] = Array.isArray(currentAnswerForQuestion)
            ? [...currentAnswerForQuestion]
            : Array(numOfExpectedAnswers).fill("");

          if (answerArray.length !== numOfExpectedAnswers) {
            answerArray = Array(numOfExpectedAnswers)
              .fill("")
              .map((_, i) => answerArray[i] || "");
          }

          if (idx !== undefined && idx >= 0 && idx < numOfExpectedAnswers) {
            answerArray[idx] = value;
          }
          newAnswers[uniqueQuestionKey] = answerArray;
        } else {
          newAnswers[uniqueQuestionKey] = value;
        }
        return newAnswers;
      });

      if (partSubmissionStatus[currentPartId]) {
        setResults((prevResults) => {
          const updatedPartResults = { ...(prevResults[currentPartId] || {}) };
          delete updatedPartResults[questionId];
          return { ...prevResults, [currentPartId]: updatedPartResults };
        });
      }
    },
    [exerciseData, getNumOfAnswers, partSubmissionStatus]
  );

  const handleSubmit = useCallback(
    (currentPartId: string) => {
      if (!exerciseData) return;
      const part = exerciseData.find((p) => p.id === currentPartId);
      if (!part) return;

      const newPartResults: {
        [questionId: string]: (boolean | null) | (boolean | null)[];
      } = {};
      part.questions.forEach((question) => {
        const uniqueQuestionKey = `${currentPartId}-${question.id}`;
        const userAnswer = userAnswers[uniqueQuestionKey];
        newPartResults[question.id] = checkAnswers(
          userAnswer,
          question,
          showKana
        ); // Pass current showKana state
      });

      setResults((prev) => ({ ...prev, [currentPartId]: newPartResults }));
      setPartSubmissionStatus((prev) => ({ ...prev, [currentPartId]: true }));
    },
    [exerciseData, userAnswers, checkAnswers, showKana]
  );

  const handleReset = useCallback(
    (currentPartId: string) => {
      if (!exerciseData) return;
      const part = exerciseData.find((p) => p.id === currentPartId);
      if (!part) return;

      setUserAnswers((prev) => {
        const updatedAnswers = { ...prev };
        part.questions.forEach(
          (q) => delete updatedAnswers[`${currentPartId}-${q.id}`]
        );
        return updatedAnswers;
      });
      setResults((prev) => {
        const updatedResults = { ...prev };
        delete updatedResults[currentPartId];
        return updatedResults;
      });
      setPartSubmissionStatus((prev) => ({ ...prev, [currentPartId]: false }));
    },
    [exerciseData]
  );

  const toggleKana = useCallback(() => {
    const newKanaMode = !showKana;
    setShowKana(newKanaMode);

    if (!exerciseData) return;
    const updatedResultsBatch: typeof results = {};
    Object.keys(partSubmissionStatus).forEach((submittedPartId) => {
      if (partSubmissionStatus[submittedPartId]) {
        const part = exerciseData.find((p) => p.id === submittedPartId);
        if (part) {
          const currentPartResults: (typeof results)[string] = {};
          part.questions.forEach((question) => {
            const uniqueQuestionKey = `${submittedPartId}-${question.id}`;
            currentPartResults[question.id] = checkAnswers(
              userAnswers[uniqueQuestionKey],
              question,
              newKanaMode
            );
          });
          updatedResultsBatch[submittedPartId] = currentPartResults;
        }
      }
    });
    if (Object.keys(updatedResultsBatch).length > 0) {
      setResults((prev) => ({ ...prev, ...updatedResultsBatch }));
    }
  }, [showKana, exerciseData, userAnswers, checkAnswers, partSubmissionStatus]);

  const activePart = useMemo(
    () => exerciseData?.find((part) => part.id === partId),
    [exerciseData, partId]
  );
  const isPartSubmitted = useMemo(
    () => (partId ? partSubmissionStatus[partId] ?? false : false),
    [partId, partSubmissionStatus]
  );

  return {
    partId,
    userAnswers,
    results,
    showKana,
    setPartId,
    toggleKana,
    handleChange,
    handleSubmit,
    handleReset,
    activePart,
    isPartSubmitted,
    getNumOfAnswers,
  };
}
