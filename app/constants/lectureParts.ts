import { Book, BookOpenText, LucideIcon, NotebookPen, School } from 'lucide-react';
// export const lectureParts: Record<string, string> = {
//   "vocabulary": "Vocabulary",
//   "exercises": "Exercises",
//   // "reading_practices": "Reading Practices",
//   "grammar": "Grammar",
//   // "listening_practices": "Listening Practices",
//   "examination": "Examination",
//   // "references": "References",
// };
export const lectureParts: Record<string, {label: string, icon: LucideIcon}> = {
  "vocabulary": {label: "Vocabulary", icon: Book},
  "grammar": {label: "Grammar", icon: BookOpenText},
  "exercises": {label: "Exercises", icon: NotebookPen},
  "examination": {label: "Examination", icon: School}
}

export function getLecturePart(id: string): string {
  return lectureParts[id]?.label || "Unknown Part";
}
