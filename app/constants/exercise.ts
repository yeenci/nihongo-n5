// --- Interfaces (keep as before) ---
export interface Question {
  id: string;
  // uniqueId?: string;
  question: string[] | string;
  question_kana?: string[] | string;
  question_en?: string[] | string;
  answer?: string[] | string;
  answer_kana?: string[] | string;
  paragraph?: string[] | string;
  paragraph_kana?: string[] | string;
  images?: string[] | string;
  options?: string[] | string;
  options_kana?: string[] | string;
  sentence?: string[] | string;
  num_of_answer?: string[] | string;
  // words?: string[] | string;
}

export interface Example {
  id: string;
  question: string[] | string;
  question_kana?: string[] | string;
  question_en?: string[] | string;
  answer?: string[] | string;
  answer_kana?: string[] | string;
}

export interface Paragraph {
  paragraph: string;
  paragraph_kana: string;
  paragraph_en: string;
  type: string;
  options?: string[];
}

export interface Option {
  options?: string[] | string;
  options_kana?: string[] | string;
}

export interface ExercisePart {
  id: string;
  partId: string;
  type: string;
  title: string;
  images?: string[] | string;
  paragraph?: Paragraph;
  examples?: Example[];
  questions: Question[];
  options?: Option[];
}

export const regex = /\s|\u3000/g;
