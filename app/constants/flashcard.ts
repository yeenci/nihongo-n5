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

export type Vocabulary = {
  id: string;
  vocabulary: string;
  chinese_char: string;
  yin_han: string;
  meaning: string;
  group: "word" | "phrase";
};

export const vocabulary: Vocabulary[] = [
  {
    id: "1",
    vocabulary: "わたし",
    chinese_char: "",
    yin_han: "",
    meaning: "tôi",
    group: "word",
  },
  {
    id: "2",
    vocabulary: "あなた",
    chinese_char: "",
    yin_han: "",
    meaning: "anh/chị, ông/bà, bạn (ngôi thứ II số ít)",
    group: "word",
  },
  {
    id: "3",
    vocabulary: "あのひと",
    chinese_char: "あの人",
    yin_han: "NHÂN",
    meaning: "người kia, người đó, anh kia, chị kia",
    group: "word",
  },
  {
    id: "4",
    vocabulary: "あのかた",
    chinese_char: "あの方",
    yin_han: "",
    meaning: "(あのかた: là cách nói lịch sự của あのひと)",
    group: "word",
  },
  {
    id: "5",
    vocabulary: "〜さん",
    chinese_char: "",
    yin_han: "",
    meaning: "anh, chị, ông, bà (hậu tố thể hiện lịch sự)",
    group: "word",
  },
  {
    id: "6",
    vocabulary: "〜ちゃん",
    chinese_char: "",
    yin_han: "",
    meaning: "(hậu tố thêm vào sau tên của trẻ em thay cho ～さん)",
    group: "word",
  },
  {
    id: "7",
    vocabulary: "〜じん",
    chinese_char: "〜人",
    yin_han: "NHÂN",
    meaning: "(hậu tố mang nghĩa “người ~”, ví dụ アメリカじん: người Mỹ)",
    group: "word",
  },
  {
    id: "8",
    vocabulary: "せんせい",
    chinese_char: "先生",
    yin_han: "TIÊN SINH",
    meaning:
      "thầy/cô (không dùng khi giới thiệu về nghề giáo viên của chính mình)",
    group: "word",
  },
  {
    id: "9",
    vocabulary: "いいえ",
    chinese_char: "",
    yin_han: "",
    meaning: "không",
    group: "word",
  },
  {
    id: "10",
    vocabulary: "はじめまして",
    chinese_char: "初めまして",
    yin_han: "",
    meaning: "Rất hân hạnh được gặp anh/chị. (Câu chào lần đầu khi giới thiệu)",
    group: "phrase",
  },
  {
    id: "11",
    vocabulary: "〜からきました",
    chinese_char: "〜から来ました",
    yin_han: "",
    meaning: "Tôi đến từ ~.",
    group: "phrase",
  },
  {
    id: "12",
    vocabulary: "よろしくおねがいします",
    chinese_char: "[どうぞ] よろしく [お願いします]",
    yin_han: "",
    meaning: "Rất vui được làm quen với anh/chị. (Rất mong được giúp đỡ)",
    group: "phrase",
  },
  {
    id: "13",
    vocabulary: "しつれいですが",
    chinese_char: "失礼ですが",
    yin_han: "",
    meaning:
      "Xin lỗi... (dùng để mở đầu câu hỏi thông tin cá nhân như tên, địa chỉ)",
    group: "phrase",
  },
  {
    id: "14",
    vocabulary: "おなまえは？",
    chinese_char: "お名前は？",
    yin_han: "",
    meaning: "Tên anh/chị là gì?",
    group: "phrase",
  },
  {
    id: "15",
    vocabulary: "こちらは〜さんです",
    chinese_char: "",
    yin_han: "",
    meaning: "Đây là anh/chị/ông/bà ~.",
    group: "phrase",
  },
];