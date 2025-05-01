/* eslint-disable @typescript-eslint/no-explicit-any */

// --- Interfaces (keep as before) ---
export interface Question {
  id: string;
  uniqueId?: string;
  question: string;
  question_kana?: string;
  question_en?: string;
  answer?: string[];
  answer_kana?: string[];
  passage?: string;
  passage_kana?: string;
  image?: string;
  options?: string[];
  options_kana?: string[];
  sentence?: string;
  // correctAnswer?: string;
  words?: string[];
}

export interface ExercisePart {
  id: string;
  type: string;
  title: string;
  questions: Question[];
  examples?: Question[];
  images?: string[];
}
