import { Question } from "@/app/constants/exercise";

interface FillInTheBlankProps {
  questionData: Question;
  partId: string;
  questionId: string;
  value: string[] | string | undefined;
  onChange: (
    partId: string,
    questionId: string,
    value: string,
    blankIndex?: number
  ) => void;

}

export default function FillInTheBlank({
  questionData,
  partId,
  questionId,
  value,
  onChange
}: FillInTheBlankProps) {}
