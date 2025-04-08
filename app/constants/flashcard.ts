export type FlashcardType = {
  id: number;
  front: string;
  back: string;
};

export const flashcards: FlashcardType[] = [
  { id: 1, front: "犬", back: "Dog" },
  { id: 2, front: "猫", back: "Cat" },
  { id: 3, front: "魚", back: "Fish" },
];
