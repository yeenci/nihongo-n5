/* eslint-disable @typescript-eslint/no-unused-vars */
import { ExercisePart, Question } from "@/app/constants/exercise";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

interface exerciseProps {
  activePartId: string | null;
  userAnswers: { [key: string]: string | string[] };
  results: {
    [partId: string]: {
      [questionId: string]: (boolean | null) | (boolean | null)[];
    };
  };
  partSubmittedStatus: { [partId: string]: boolean };
  showKana: boolean;
  activePart: ExercisePart | undefined;
  isPartSubmitted: boolean;
  setActivePartId: Dispatch<SetStateAction<string | null>>;
  toggleKana: () => void;
  handleChange: (
    partId: string,
    questionId: string,
    value: string,
    blankIndex?: number
  ) => void;
  handleSubmit: (partId: string) => void;
  handleReset: (partId: string) => void;
  getExpectedAnswerCount: (question: Question) => number;
}

export function useExerciseLogic(
  data: ExercisePart[] | undefined
): exerciseProps {
  //   const loading = false;
  //   const data = initialData;

  const [activePartId, setActivePartId] = useState<string | null>(null);
  const [userAnswers, setUsersAnswers] = useState<{
    [key: string]: string | string[];
  }>({});
  const [results, setResults] = useState<{
    [partId: string]: {
      [questionId: string]: (boolean | null) | (boolean | null)[];
    };
  }>({});
  const [partSubmittedStatus, setPartSubmittedStatus] = useState<{
    [partId: string]: boolean;
  }>({});
  const [showKana, setShowKana] = useState<boolean>(false);

  // Set the first part as active initially when data is loaded
  useEffect(() => {
    if (data && data.length > 0 && activePartId === null) {
      setActivePartId(data[0].id);
    }

    if (!data && activePartId !== null) {
      setActivePartId(null);
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
  // const handleChange = (
  //   partId: string,
  //   questionId: string,
  //   value: string,
  //   blankIndex?: number
  // ) => {
  //   if (!data) return;
  //   const uniqueId = `${partId}-${questionId}`;
  //   const part = data.find((p) => p.id === partId);
  //   const question = part?.questions.find((q) => q.id === questionId);
  //   if (!question) return;

  //   const expectedCount = getExpectedAnswerCount(question);

  //   setUsersAnswers((prev) => {
  //     const newAnswers = { ...prev };
  //     const currentAnswer = prev[uniqueId];

  //     if (expectedCount > 1) {
  //       let currentArray: string[] = [];

  //       if (Array.isArray(currentAnswer)) {
  //         currentArray = [...currentAnswer];
  //       }

  //       while (currentAnswer.length < expectedCount) {
  //         currentArray.push("");
  //       }

  //       if (currentArray.length > expectedCount) {
  //         currentArray = currentArray.slice(0, expectedCount);
  //       }

  //       // Update the specific index
  //       if (blankIndex !== undefined && blankIndex < expectedCount) {
  //         currentArray[blankIndex] = value;
  //       }

  //       newAnswers[uniqueId] = currentArray;
  //     } else {
  //       newAnswers[uniqueId] = value;
  //     }

  //     return newAnswers;
  //   });

  //   // Reset results for the question if the part was already submitted
  //   if (partSubmittedStatus[partId]) {
  //     setResults((prev) => {
  //       const partResults = { ...(prev[partId] || {}) };

  //       // Reset by removing the result for this question entirely
  //       delete partResults[questionId];
  //       return { ...prev, [partId]: partResults };
  //     });
  //   }
  // };
  const handleChange = useCallback((partId: string, questionId: string, value: string, blankIndex?: number) => {
    if (!data) return;
    const uniqueId = `${partId}-${questionId}`;
    const part = data.find(p => p.id === partId);
    const question = part?.questions.find(q => q.id === questionId);
    if (!question) return;
    const expectedCount = getExpectedAnswerCount(question);

    setUsersAnswers((prev) => {
        const newAnswers = { ...prev };
        const currentAnswer = prev[uniqueId]; // Get previous value (might be undefined, string, or string[])

        if (expectedCount > 1) {
            // Initialize currentArray based on previous state, ensuring it's an array
            let currentArray: string[] = Array.isArray(currentAnswer) ? [...currentAnswer] : [];

            // --- FIX APPLIED HERE ---
            // Ensure array has the correct length *using currentArray.length*
            while (currentArray.length < expectedCount) {
                currentArray.push(''); // Add empty strings until correct length
            }
            // Optionally truncate if it somehow became too long (less likely now)
            if (currentArray.length > expectedCount) {
                currentArray = currentArray.slice(0, expectedCount);
            }
            // --- End of Fix ---

            // Update the specific index
            if (blankIndex !== undefined && blankIndex < expectedCount) {
                currentArray[blankIndex] = value;
            }
            newAnswers[uniqueId] = currentArray;
        } else {
            // Single input case (no change needed here)
            newAnswers[uniqueId] = value;
        }
        return newAnswers;
    });

    // Reset results if part was submitted (logic remains the same)
     if (partSubmittedStatus[partId]) {
         setResults(prev => {
             const partResults = { ...(prev[partId] || {}) };
             delete partResults[questionId]; // Simple reset for the whole question
             return { ...prev, [partId]: partResults };
         });
     }
}, [data, getExpectedAnswerCount, partSubmittedStatus]);

  const handleSubmit = (partId: string) => {
    if (!data) return;
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

  const handleReset = (partId: string) => {
    if (!data) return;
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

  const toggleKana = () => {
    const newKanaMode = !showKana;
    setShowKana(newKanaMode);

    // Recalculates results for submitted parts based on the new display mode
    const updatedResults: typeof results = {};
    const submittedPartIds = Object.keys(partSubmittedStatus).filter(
      (id) => partSubmittedStatus[id]
    );

    if (!data) return;
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

  const activePart = data ? data.find((part) => part.id === activePartId) : undefined;
  const isPartSubmitted = activePartId
    ? partSubmittedStatus[activePartId] ?? false
    : false;

  return {
    activePartId,
    userAnswers,
    results,
    partSubmittedStatus,
    showKana,
    activePart,
    isPartSubmitted,
    setActivePartId,
    toggleKana,
    handleChange,
    handleSubmit,
    handleReset,
    getExpectedAnswerCount,
  };
}
