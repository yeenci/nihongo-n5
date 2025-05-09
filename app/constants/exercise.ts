// --- Interfaces (keep as before) ---
export interface Question {
  id: string;
  // uniqueId?: string;
  question: string[] | string;
  question_kana?: string[] | string;
  question_en?: string[] | string;
  answer?: string[] | string;
  answer_kana?: string[] | string;
  passage?: string[] | string;
  passage_kana?: string[] | string;
  image?: string[] | string;
  options?: string[] | string;
  options_kana?: string[] | string;
  sentence?: string[] | string;
  // correctAnswer?: string[] | string;
  // words?: string[] | string;
}


export interface ExercisePart {
  id: string;
  partId: string;
  type: string;
  title: string;
  questions: Question[];
  examples?: Question[];
  images?: string[] | string;
  options?: string[] | string;
  options_kana?: string[] | string;
}