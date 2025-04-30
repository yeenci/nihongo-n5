/* eslint-disable @typescript-eslint/no-explicit-any */

import ChooseInParentheses from "./choose-in-parentheses";
import FillInTheBlank from "./fill-in-the-blank";
import FinishSentence from "./finish-sentence";
import Rearrange from "./rearrange";
import ReadParagraph from "./read-and-answer";
import WordBoxFill from "./word-box";

export default function RenderQuestionByType({
  type,
  question,
  onSubmit,
}: any) {
  switch (type) {
    case "fill-in-the-blank":
      return <FillInTheBlank question={question} onSubmit={onSubmit} />;
    // case "choose-in-parentheses":
    //   return <ChooseInParentheses question={question} onSubmit={onSubmit} />;
    // case "rearrange":
    //   return <Rearrange question={question} onSubmit={onSubmit} />;
    // case "finish-sentence":
    //   return <FinishSentence question={question} onSubmit={onSubmit} />;
    // case "read-and-answer":
    //   return <ReadParagraph question={question} onSubmit={onSubmit} />;
    // case "word-box":
    //   return <WordBoxFill question={question} onSubmit={onSubmit} />;
    default:
      return <FillInTheBlank question={question} onSubmit={onSubmit} />;
  }
}
