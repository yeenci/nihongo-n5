
// 6. Word box



// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { useState } from "react";

// export default function WordBoxFill({ question, onSubmit }: any) {
//   const [input, setInput] = useState("");
//   const [submitted, setSubmitted] = useState(false);
//   const isCorrect = input.trim() === question.correctAnswer;

//   return (
//     <div className="p-4 border rounded bg-muted">
//       <p className="mb-2">Fill in the blank: {question.sentence}</p>
//       <div className="mb-2 flex flex-wrap gap-2">
//         {question.options.map((opt: string, i: number) => (
//           <Button
//             key={i}
//             variant="outline"
//             onClick={() => {
//               setInput(opt);
//             }}
//             className="bg-blue-100 px-2 py-1 rounded hover:bg-blue-200"
//           >
//             {opt}
//           </Button>
//         ))}
//       </div>
//       <Input
//         type="text"
//         value={input}
//         placeholder="Enter Your Answer"
//         onChange={(e) => setInput(e.target.value)}
//       />

//       <Button
//         variant="default"
//         onClick={() => {
//           setSubmitted(true);
//           onSubmit(isCorrect);
//         }}
//       >
//         Submit
//       </Button>
//       {submitted && !isCorrect && (
//         <p className="text-red-500 mt-2">
//           Correct answer: {question.correctAnswer}
//         </p>
//       )}
//       {submitted && isCorrect && (
//         <p className="text-green-500 mt-2">Correct!</p>
//       )}
//     </div>
//   );
// }
