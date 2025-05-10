import { ExercisePart, Question, regex } from "@/app/constants/exercise";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

interface ExerciseProps {
  partId: string | null;
  userAnswers: { [key: string]: string | string[] };
  results: {
    [partId: string]: {
      [questionId: string]: (boolean | null) | (boolean | null)[];
    };
  };
  partStatus: { [partId: string]: boolean };
  showKana: boolean;
  activePart: ExercisePart | undefined;
  isPartSubmitted: boolean;
  setPartId: Dispatch<SetStateAction<string | null>>;
  toggleKana: () => void;
  handleChange: (
    pardId: string,
    questionId: string,
    value: string,
    idx?: number
  ) => void;
  handleSubmit: (partId: string) => void;
  handleReset: (partId: string) => void;
  getNumOfAnswers: (question: Question) => number;
}

export function useExerciseLogic(
  data: ExercisePart[] | undefined
): ExerciseProps {
  /* Variables */
  const [partId, setPartId] = useState<string | null>(null);

  // Answers vs. Results
  const [userAnswers, setUserAnswers] = useState<{
    [key: string]: string | string[];
  }>({});
  const [results, setResults] = useState<{
    [partId: string]: {
      [questionId: string]: (boolean | null) | (boolean | null)[];
    };
  }>({});

  // Status of the submitted part
  const [partStatus, setPartStatus] = useState<{
    [partId: string]: boolean;
  }>({});
  const [showKana, setShowKana] = useState<boolean>(false);

  /* useEffect */
  // Set the active part as the first part when data is loaded
  useEffect(() => {
    if (data && data.length > 0 && partId === null) {
      setPartId(data[0].id);
    }
  }, [data, partId]);

  /* Function */
  // Get the number of requested answers for a question
  const getNumOfAnswers = useCallback((question: Question): number => {
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

    return question.num_of_answer ? 1 : 1;
  }, []);

  // Checks answers based on both kanji (answer) and katakana/hiragana (answer_kana)
  const checkAnswers = useCallback(
    (
      userAnswer: string | string[] | undefined,
      question: Question,
      isKanaMode: boolean
    ): (boolean | null) | (boolean | null)[] => {
      const numOfAnswers = getNumOfAnswers(question);

      if (numOfAnswers > 1) {
        const userAnswersArray = Array.isArray(userAnswer) ? userAnswer : [];
        const resultsArray: (boolean | null)[] = [];

        for (let i = 0; i < numOfAnswers; i++) {
          const userAnswerTrimmed = (userAnswersArray[i] ?? "")
            .trim()
            .replaceAll(regex, "");
          const correctKanji = (question.answer?.[i] ?? null)
            ?.trim()
            .replaceAll(regex, "");
          const correctKana = (question.answer_kana?.[i] ?? null)
            ?.trim()
            .replaceAll(regex, "");

          let areCorrectAnswers = false;

          // Check non-empty input
          if (userAnswerTrimmed !== "") {
            areCorrectAnswers =
              (correctKana !== null && userAnswerTrimmed === correctKana) ||
              (correctKanji !== null && userAnswerTrimmed === correctKanji);
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
    [getNumOfAnswers]
  );

  // Handles input changes for single/multiple answers
  const handleChange = useCallback(
    (partId: string, questionId: string, value: string, idx?: number) => {
      if (!data) return;

      const uniqueId = `${partId}-${questionId}`;
      const part = data.find((p) => p.id === partId);
      const question = part?.questions.find((q) => q.id === questionId);
      if (!question) return;

      const numOfAnswers = getNumOfAnswers(question);

      setUserAnswers((prev) => {
        const newAnswers = { ...prev };
        const currentAnswer = prev[uniqueId];

        if (numOfAnswers > 1) {
          let currentArray: string[] = Array.isArray(currentAnswer)
            ? [...currentAnswer]
            : [];

          while (currentArray.length < numOfAnswers) {
            currentArray.push("");
          }

          if (currentArray.length > numOfAnswers) {
            currentArray = currentArray.slice(0, numOfAnswers);
          }

          // Update the specific index
          if (idx !== undefined && idx < numOfAnswers) {
            currentArray[idx] = value;
          }

          newAnswers[uniqueId] = currentArray;
        } else {
          newAnswers[uniqueId] = value;
        }

        return newAnswers;
      });

      // Reset results for the question if the part was already submitted
      if (partStatus[partId]) {
        setResults((prev) => {
          const prevResults = { ...(prev[partId] || {}) };
          delete prevResults[questionId];
          return { ...prev, [partId]: prevResults };
        });
      }
    },
    [data, getNumOfAnswers, partStatus]
  );

  const handleSubmit = (partId: string) => {
    if (!data) return;
    const part = data.find((p) => p.id === partId);
    if (!part) return;

    const newResults: {
      [questionId: string]: (boolean | null) | (boolean | null)[];
    } = {};

    part.questions.forEach((question) => {
      const uniqueId = `${partId}-${question.id}`;
      const userAnswer = userAnswers[uniqueId];
      newResults[question.id] = checkAnswers(userAnswer, question, showKana);
    });

    setResults((prev) => ({ ...prev, [partId]: newResults }));
    setPartStatus((prev) => ({ ...prev, [partId]: true }));
  };

  const handleReset = (partId: string) => {
    if (!data) return;
    const part = data.find((p) => p.id === partId);
    if (!part) return;

    // Clear user answers for this part
    setUserAnswers((prev) => {
      const prevAnswers = { ...prev };
      part.questions.forEach((q) => {
        const uniqueId = `${part.id}-${q.id}`;
        delete prevAnswers[uniqueId];
      });
      return prevAnswers;
    });

    // Clear results for this part
    setResults((prev) => {
      const prevAnswers = { ...prev };
      delete prevAnswers[partId];
      return prevAnswers;
    });

    // Reset submission status for this part
    setPartStatus((prev) => ({
      ...prev,
      [partId]: false,
    }));
  };

  const toggleKana = () => {
    const newKanaMode = !showKana;
    setShowKana(newKanaMode);

    // Recalculates results for submitted parts based on the new display mode
    const updatedResults: typeof results = {};
    const submittedPartIds = Object.keys(partStatus).filter(
      (id) => partStatus[id]
    );

    if (!data) return;
    data.forEach((part) => {
      if (submittedPartIds.includes(part.id)) {
        const newResults: (typeof results)[string] = {};

        part.questions.forEach((question) => {
          const uniqueId = `${part.id}-${question.id}`;
          const userAnswer = userAnswers[uniqueId];
          newResults[question.id] = checkAnswers(
            userAnswer,
            question,
            newKanaMode
          );
          updatedResults[part.id] = newResults;
        });
      } else {
        // Keep existing results (likely empty/null) for non-submitted parts
        updatedResults[part.id] = results[part.id] || {};
      }
    });
  };

  const activePart = useMemo(
    () => data?.find((part) => part.id === partId),
    [data, partId]
  );
  const isPartSubmitted = useMemo(
    () => (partId ? partStatus[partId] ?? false : false),
    [partId, partStatus]
  );

  return {
    partId,
    userAnswers,
    results,
    partStatus,
    showKana,
    setPartId,
    toggleKana,
    handleChange,
    handleSubmit,
    handleReset,
    activePart,
    isPartSubmitted,
    getNumOfAnswers
  };
}
