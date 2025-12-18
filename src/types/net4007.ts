export interface ExamQuestion {
  id: string;
  course_id: string;
  title: string;
  prompt: string;
  question_order: number;
  created_at: string;
}

export interface AnswerVersion {
  id: string;
  question_id: string;
  content: string;
  upvotes: number;
  created_at: string;
}

export interface AnswerVote {
  id: string;
  answer_id: string;
  session_id: string;
  created_at: string;
}
