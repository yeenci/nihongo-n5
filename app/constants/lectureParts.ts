export const lectureParts: Record<string, string> = {
  "vocabulary": "Vocabulary",
  "exercises": "Exercises",
  "reading_practices": "Reading Practices",
  "grammar": "Grammar",
  "listening_practices": "Listening Practices",
  "examination": "Examination",
  "references": "References",
};

export function getLecturePart(id: string): string {
  return lectureParts[id] || "Unknown Part";
}
