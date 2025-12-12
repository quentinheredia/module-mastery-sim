export interface MatchingPairs {
  [key: string]: string;
}

export interface Question {
  module: string;
  question: string;
  options: string[];
  correct_answers: string[] | MatchingPairs;
  question_type: "multiple_choice" | "single_choice" | "true_false" | "multiple_answer" | "matching";
  points: number;
  image?: string;
  pairs?: MatchingPairs;
}

export interface UserAnswer {
  questionId: number;
  selectedAnswers: string[];
  matchingAnswers?: MatchingPairs;
  isCorrect: boolean;
}

export interface QuizAttempt {
  id: string;
  mode: "practice" | "exam";
  courseId: string;
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

export interface Course {
  id: string;
  name: string;
  description: string;
  modules: string[];
}
