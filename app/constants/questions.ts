export type Question = {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
};


export const questions: Question[] = [
  {
    id: 1,
    text: "「わたし」は英語で何ですか？",
    options: ["You", "He", "I", "She"],
    correctIndex: 2,
  },
  {
    id: 2,
    text: "「ねこ」はどれですか？",
    options: ["Dog", "Bird", "Cat", "Fish"],
    correctIndex: 2,
  },
  {
    id: 3,
    text: "「水」はどれですか？",
    options: ["Juice", "Tea", "Milk", "Water"],
    correctIndex: 3,
  },
  {
    id: 4,
    text: "「きのう」の意味は？",
    options: ["Tomorrow", "Today", "Yesterday", "Now"],
    correctIndex: 2,
  },
  {
    id: 5,
    text: "「たべます」の意味は？",
    options: ["To eat", "To go", "To drink", "To sleep"],
    correctIndex: 0,
  },
  {
    id: 6,
    text: "「これは なん ですか？」の正しい答えは？（りんごを指して）",
    options: ["それはバナナです。", "これはりんごです。", "それはねこです。", "あれはみずです。"],
    correctIndex: 1,
  },
  {
    id: 7,
    text: "「行きます」の反対の意味は？",
    options: ["食べます", "きます", "帰ります", "見ます"],
    correctIndex: 2,
  },
  {
    id: 8,
    text: "「おはようございます」はいつ使いますか？",
    options: ["朝", "昼", "夜", "寝る前"],
    correctIndex: 0,
  },
  {
    id: 9,
    text: "「本」は何ですか？",
    options: ["Pencil", "Book", "Paper", "Bag"],
    correctIndex: 1,
  },
  {
    id: 10,
    text: "「一、二、三、四、五」は何ですか？",
    options: ["Animals", "Colors", "Numbers", "Verbs"],
    correctIndex: 2,
  },
];
