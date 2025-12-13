export interface MatchingPairs {
  [key: string]: string;
}

export interface MultiStepSubpart {
  id: string;
  text: string;
  answer: string;
  explanation: string;
}

export interface Question {
  id?: string;
  module: string;
  question: string;
  options: string[];
  correct_answers: string[] | MatchingPairs;
  question_type: "multiple_choice" | "single_choice" | "true_false" | "multiple_answer" | "matching" | "multi_step";
  points: number;
  image?: string;
  image2?: string;
  pairs?: MatchingPairs;
  subparts?: MultiStepSubpart[];
  explanation?: string;
}

export interface UserAnswer {
  questionId: number;
  selectedAnswers: string[];
  matchingAnswers?: MatchingPairs;
  multiStepAnswers?: { [subpartId: string]: string };
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

export type CourseColor = "blue" | "violet" | "emerald" | "amber" | "rose";

export interface Course {
  id: string;
  name: string;
  description: string;
  color: CourseColor;
  modules: string[];
}
