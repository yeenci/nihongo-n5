/* eslint-disable @typescript-eslint/no-explicit-any */

import ChooseInParentheses from "./choose-in-parentheses";
import FillInTheBlank from "./fill-in-the-blank";
import FinishSentence from "./finish-sentence";
import Rearrange from "./rearrange";
import TrueFalseParagraph from "./true-false";
import WordBoxFill from "./word-box";

export default function RenderQuestionByType({
  type,
  question,
  onSubmit,
}: any) {
  switch (type) {
    case "fill-in-the-blank":
      return <FillInTheBlank question={question} onSubmit={onSubmit} />;
    case "choose-in-parentheses":
      return <ChooseInParentheses question={question} onSubmit={onSubmit} />;
    case "rearrange":
      return <Rearrange question={question} onSubmit={onSubmit} />;
    case "finish-sentence":
      return <FinishSentence question={question} onSubmit={onSubmit} />;
    case "true-false":
      return <TrueFalseParagraph question={question} onSubmit={onSubmit} />;
    case "word-box":
      return <WordBoxFill question={question} onSubmit={onSubmit} />;
    default:
      return <WordBoxFill question={question} onSubmit={onSubmit} />;
  }
}
