export const lectureParts: Record<string, string> = {
  vocabulary: "Vocabulary",
  exercises: "Exercises",
  "reading-practices": "Reading Practices",
  grammar: "Grammar",
  "listening-practices": "Listening Practices",
  "": "",
  references: "References",
};

export function getLecturePart(id: string): string {
  return lectureParts[id] || "Unknown Part";
}
