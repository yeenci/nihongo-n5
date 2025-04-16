export type Question = {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
};


export const questions: Question[] = [
    {
      id: 1,
      text: "What is the capital of France?",
      options: ["Berlin", "London", "Paris", "Rome"],
      correctIndex: 2,
    },
    {
      id: 2,
      text: "Which planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Jupiter", "Venus"],
      correctIndex: 1,
    },
    {
      id: 3,
      text: 'Who wrote "To be, or not to be"?',
      options: [
        "Charles Dickens",
        "William Shakespeare",
        "J.K. Rowling",
        "Hemingway",
      ],
      correctIndex: 1,
    },
  ];