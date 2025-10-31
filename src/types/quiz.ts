export interface Question {
  module: string;
  question: string;
  options: string[];
  correct_answers: string[];
  question_type: "multiple_choice" | "single_choice" | "true_false";
  points: number;
  image?: string;
}

export interface UserAnswer {
  questionId: number;
  selectedAnswers: string[];
  isCorrect: boolean;
}

export interface QuizAttempt {
  id: string;
  mode: "practice" | "exam";
  date: Date;
  score: number;
  totalQuestions: number;
  answers: UserAnswer[];
  questions: Question[];
  timeSpent?: number;
  moduleBreakdown: ModulePerformance[];
}

export interface ModulePerformance {
  module: string;
  correct: number;
  total: number;
  percentage: number;
}

export interface QuizState {
  currentQuestionIndex: number;
  questions: Question[];
  userAnswers: UserAnswer[];
  mode: "practice" | "exam";
  isStarted: boolean;
  isCompleted: boolean;
  timeRemaining: number;
  selectedModule?: string;
  questionsPerPage: 1 | 5 | 10;
}
