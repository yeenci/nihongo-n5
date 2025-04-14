export type FlashcardType = {
  id: number;
  front: string;
  back: string;
};

export const flashcards: FlashcardType[] = [
  { id: 1, front: "わたし", back: "I" },
  { id: 2, front: "あなた", back: "You" },
  { id: 3, front: "せんせい", back: "Teacher" },
  { id: 4, front: "きょうし	", back: "Professor" },
  { id: 5, front: "がくせい", back: "Student" },
  { id: 6, front: "かいしゃいん", back: "Company Staff" },
  { id: 7, front: "ぎんこういん", back: "Banker" },
  { id: 8, front: "いしゃ", back: "Doctor" },
  { id: 9, front: "けんきゅうしゃ", back: "Researcher" },
  { id: 10, front: "びょういん	", back: "Hospital" },
];

export type Vocab = {
  // id: string;
  vocabulary: string;
  chinese_char: string;
  yin_han: string;
  meaning: string;
  group: "word" | "phrase";
};