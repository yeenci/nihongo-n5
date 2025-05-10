export interface Question {
  id: string;
  // uniqueId?: string;
  question: string[];
  question_kana?: string[];
  question_en?: string[];
  answer?: string[];
  answer_kana?: string[];
  paragraph?: string;
  paragraph_kana?: string;
  paragraph_en?: string;
  images?: string[];
  options?: string[];
  options_kana?: string[];
  sentence?: string[];
  num_of_answer?: string[];
  // words?: string[];
}

export interface Example {
  id: string;
  question: string[];
  question_kana?: string[];
  question_en?: string[];
  answer?: string[];
  answer_kana?: string[];
}

export interface Paragraph {
  paragraph: string;
  paragraph_kana: string;
  paragraph_en: string;
  type: string;
  options?: string[];
}

export interface Option {
  options?: string[];
  options_kana?: string[];
}

export interface ExercisePart {
  id: string;
  partId: string;
  type: string;
  title: string;
  images?: string[];
  paragraph?: Paragraph;
  examples?: Example[];
  questions: Question[];
  options?: Option[];
}

export const regex = /\s|\u3000/g;
