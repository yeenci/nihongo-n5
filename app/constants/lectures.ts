export const lectures: Record<string, string> = Object.fromEntries(
  Array.from({ length: 25 }, (_, i) => {
    const id = `Lecture${i + 1}`;
    const name = `Lecture ${i + 1}`;
    return [id, name];
  })
);

export function getLectureName(id: string): string {
  return lectures[id] || "Unknown Lecture";
}
