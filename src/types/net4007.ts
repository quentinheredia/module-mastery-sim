// net4007.ts

export type ExamQuestion = {
  id: string;
  title: string;
  prompt: string;
  question_order: number;
  course_id: string;
  created_at: string;
};

export type AnswerVersion = {
  id: string;
  question_id: string;
  content: string;
  upvotes: number;
  created_at: string;
};
