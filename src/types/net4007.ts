// net4007.ts

export type ExamSubsection = {
  id: string; // e.g. "q1a"
  label: string; // "(a)", "(b)", "(c)"
  title: string; // Short title
  prompt: string; // Markdown + LaTeX supported
};

export type ExamQuestion = {
  id: string; // e.g. "q1"
  title: string; // Main question title
  prompt?: string; // Optional intro/context
  subsections: ExamSubsection[];
};

export type AnswerVersion = {
  id: string;
  question_id: string; // MUST MATCH subsection.id
  content: string;
  upvotes: number;
  created_at: string;
};
