/* eslint-disable @typescript-eslint/no-unused-vars */
// 3. Rearrange sentence

import { Question } from "@/app/constants/exercise";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useMemo, useState } from "react";

interface RearrangeProps {
  question: Question;
  partId: string;
  questionId: string;
  value: string | string[] | undefined;
  onChange: (
    partId: string,
    questionId: string,
    value: string,
    blankIndex?: number
  ) => void;
  isPartSubmitted: boolean;
  result: (boolean | null) | (boolean | null)[] | undefined;
  showKana: boolean;
  getNumOfAnswers: (question: Question) => number;
}

interface WordToken {
  text: string;
  id: number;
}

export default function Rearrange({
  question,
  partId,
  questionId,
  value,
  onChange,
  isPartSubmitted,
  result,
  showKana,
  getNumOfAnswers,
}: RearrangeProps) {
  const [showEnglishMeaning, setShowEnglishMeaning] = useState(false);

  const [masterWordList, setMasterWordList] = useState<WordToken[]>([]);
  const [bankTokens, setBankTokens] = useState<WordToken[]>([]);
  const [sentenceTokens, setSentenceTokens] = useState<WordToken[]>([]);

  const currentAnswerString = useMemo(() => {
    if (typeof value === "string") return value;
    if (Array.isArray(value) && typeof value[0] === "string") return value[0];
    return "";
  }, [value]);

  const isOverallCorrect = useMemo(
    () => isPartSubmitted && result === true,
    [isPartSubmitted, result]
  );

  const isAnyIncorrect = useMemo(
    () => isPartSubmitted && result === false,
    [isPartSubmitted, result]
  );

  const isResetOrPending = useMemo(
    () =>
      isPartSubmitted &&
      result === null &&
      !isOverallCorrect &&
      !isAnyIncorrect,
    [isPartSubmitted, result, isOverallCorrect, isAnyIncorrect]
  );

  useEffect(() => {
    if (isResetOrPending) {
      setShowEnglishMeaning(true);
    } else if (!isPartSubmitted) {
      setShowEnglishMeaning(false);
    }
  }, [isResetOrPending, isPartSubmitted]);

  useEffect(() => {
    const wordsSource =
      (showKana ? question.question_kana : question.question) || [];
    const newMasterList = wordsSource.map((text, index) => ({
      text,
      id: index,
    }));
    setMasterWordList(newMasterList);
  }, [question, showKana]);

  useEffect(() => {
    if (!masterWordList) {
      setSentenceTokens([]);
      setBankTokens([]);
      return;
    }

    const newSentenceAttempt: WordToken[] = [];
    let currentBankContents = [...masterWordList];

    if (currentAnswerString && masterWordList.length > 0) {
      let tempRemainingStrToParse = currentAnswerString;
      const tempBankForParsing = [...masterWordList];

      while (
        tempRemainingStrToParse.length > 0 &&
        tempBankForParsing.length > 0
      ) {
        let foundMatchThisIteration = false;
        for (let i = 0; i < tempBankForParsing.length; i++) {
          const candidateToken = tempBankForParsing[i];
          if (tempRemainingStrToParse.startsWith(candidateToken.text)) {
            newSentenceAttempt.push(candidateToken);
            tempBankForParsing.splice(i, 1);
            tempRemainingStrToParse = tempRemainingStrToParse.substring(
              candidateToken.text.length
            );
            foundMatchThisIteration = true;
            break;
          }
        }
        if (!foundMatchThisIteration) {
          break;
        }
      }
      currentBankContents = tempBankForParsing;
    }

    setSentenceTokens(newSentenceAttempt);
    setBankTokens(currentBankContents);
  }, [masterWordList, currentAnswerString]);

  const handleSelectFromBank = useCallback(
    (tokenToSelect: WordToken) => {
      if (isOverallCorrect) return;

      const newSentence = [...sentenceTokens, tokenToSelect];
      const newBank = bankTokens.filter((t) => t.id !== tokenToSelect.id);

      setSentenceTokens(newSentence);
      setBankTokens(newBank);

      onChange(partId, questionId, newSentence.map((t) => t.text).join(""), 0);
    },
    [sentenceTokens, bankTokens, onChange, partId, questionId, isOverallCorrect]
  );

  const handleRemoveFromSentence = useCallback(
    (_tokenToRemove: WordToken, indexToRemove: number) => {
      if (isOverallCorrect) return;

      const tokenToReturnToBank = sentenceTokens[indexToRemove];
      const newSentence = sentenceTokens.filter(
        (_, index) => index !== indexToRemove
      );

      const newBankUnsorted = [...bankTokens, tokenToReturnToBank];
      const newBankSorted = newBankUnsorted.sort((a, b) => a.id - b.id);

      setSentenceTokens(newSentence);
      setBankTokens(newBankSorted);

      onChange(partId, questionId, newSentence.map((t) => t.text).join(""), 0);
    },
    [sentenceTokens, bankTokens, onChange, partId, questionId, isOverallCorrect]
  );

  const handleReset = useCallback(() => {
    if (isOverallCorrect && isPartSubmitted) return;

    setSentenceTokens([]);
    setBankTokens([...masterWordList]);

    onChange(partId, questionId, "", 0);
  }, [
    masterWordList,
    onChange,
    partId,
    questionId,
    isOverallCorrect,
    isPartSubmitted,
  ]);

  const displayCorrectAnswers = useCallback(() => {
    const answerKey = showKana
      ? question.answer_kana?.[0]
      : question.answer?.[0];

    if (answerKey && typeof answerKey === "string" && answerKey.trim() !== "") {
      return "　[　" + answerKey + "　]　";
    }
    return " (No answer provided)";
  }, [showKana, question]);

  const questionEnglish = useMemo(() => {
    return question.question_en?.[0] || null;
  }, [question]);

  const toggleShowEnglish = () => {
    setShowEnglishMeaning((prev) => !prev);
  };

  const interactionDisabled = isOverallCorrect;

  return (
    <div className="p-4 border rounded-md transition-colors duration-300 bg-card shadow">
      <div className="mb-3">
        <div className="mb-4 p-3 border border-dashed border-primary/50 rounded-md min-h-[4.5rem] bg-background/30">
          <p className="text-sm text-muted-foreground mb-2">Your sentence:</p>
          {sentenceTokens.length === 0 && !interactionDisabled && (
            <p className="text-sm text-muted-foreground/70 italic">
              Click words from the bank below to build your sentence here.
            </p>
          )}
          <div className="flex flex-wrap gap-2 items-center">
            {sentenceTokens.map((token, index) => (
              <Button
                key={`${token.id}-${index}`}
                variant="secondary"
                size="sm"
                onClick={() => handleRemoveFromSentence(token, index)}
                disabled={interactionDisabled}
                className={`transition-all ${
                  interactionDisabled
                    ? "cursor-not-allowed opacity-70"
                    : "hover:bg-destructive/10 hover:border-destructive/50 hover:text-destructive dark:hover:bg-destructive/20"
                }`}
                title="Click to remove from sentence"
              >
                {token.text}
              </Button>
            ))}
          </div>
        </div>
        <div className="mb-2 p-3 border rounded-md ">
          <div className="flex justify-between items-center mb-2">
            {bankTokens.length === 0 &&
            sentenceTokens.length > 0 &&
            !interactionDisabled ? (
              <p className="text-sm text-muted-foreground">All words used.</p>
            ) : (
              <p className="text-sm text-muted-foreground">Available words:</p>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              disabled={
                (isOverallCorrect && isPartSubmitted) ||
                masterWordList.length === 0
              }
              className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground"
              title="Reset your sentence"
            >
              Reset
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {bankTokens.map((token) => (
              <Button
                key={token.id}
                variant="outline"
                size="sm"
                onClick={() => handleSelectFromBank(token)}
                disabled={interactionDisabled}
                className={
                  interactionDisabled ? "cursor-not-allowed opacity-70" : ""
                }
                title="Click to add to sentence"
              >
                {token.text}
              </Button>
            ))}
          </div>
          {bankTokens.length === 0 &&
            sentenceTokens.length === 0 &&
            masterWordList.length > 0 &&
            !interactionDisabled && (
              <p className="text-sm text-muted-foreground/70 mt-2 italic">
                No words available. This might be an issue with the question
                setup.
              </p>
            )}
        </div>
      </div>

      {isPartSubmitted && (
        <div className="mt-2 text-sm min-h-[1.25rem]">
          {isOverallCorrect && (
            <p className="text-green-600 dark:text-green-400 font-semibold">
              Correct!
            </p>
          )}
          {isAnyIncorrect && (
            <p className="text-red-600 dark:text-red-400 font-semibold">
              Incorrect. Correct answer(s):
              <span className="font-mono pl-1">{displayCorrectAnswers()}</span>
            </p>
          )}
          {isResetOrPending && (
            <p className="text-orange-600 dark:text-orange-400 font-semibold">
              Answer changed. Please reset to submit the part again.
            </p>
          )}
          {!isOverallCorrect &&
            !isAnyIncorrect &&
            !isResetOrPending &&
            !currentAnswerString && (
              <p className="text-muted-foreground">Construct your sentence.</p>
            )}
          {!isOverallCorrect &&
            !isAnyIncorrect &&
            !isResetOrPending &&
            currentAnswerString && (
              <p className="text-orange-600 dark:text-orange-400 font-semibold">
                Answer changed. Please reset to submit the part again.
              </p>
            )}
          {questionEnglish && (
            <div className="mt-2">
              <Button
                variant="link"
                size="sm"
                onClick={toggleShowEnglish}
                className="text-xs h-7 px-1 underline"
              >
                {showEnglishMeaning ? "Hide Meaning" : "Show Meaning"}
              </Button>
              {showEnglishMeaning && (
                <p
                  className="text-muted-foreground mt-1.5 px-1 rounded-md"
                  style={{ whiteSpace: "pre-line" }}
                >
                  {questionEnglish}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
